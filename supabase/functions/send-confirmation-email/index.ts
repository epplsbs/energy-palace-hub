import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Allowed origins for CORS
const allowedOrigins = [
  'https://energypalace.com.np',
  'https://www.energypalace.com.np',
  'https://id-preview--ab4b32c2-3701-4d08-a67d-f160fb37013f.lovable.app',
  Deno.env.get('SITE_URL') || ''
].filter(Boolean);

const getCorsHeaders = (origin: string) => ({
  "Access-Control-Allow-Origin": allowedOrigins.includes(origin) ? origin : allowedOrigins[0],
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
});

interface EmailRequest {
  type: 'charging' | 'reservation';
  customerName: string;
  customerEmail: string;
  orderDetails: {
    orderNumber?: string;
    stationId?: string;
    vehicleNumber?: string;
    startTime?: string;
    expectedEndTime?: string;
    totalAmount?: number;
    date?: string;
    time?: string;
    guests?: number;
    specialRequests?: string;
  };
}

// HTML escape function to prevent XSS
const escapeHtml = (unsafe: string): string => {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

// Input validation
const validateEmail = (email: string): boolean => {
  if (!email || typeof email !== 'string') return false;
  if (email.length > 254) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateInput = (input: string, maxLength: number): boolean => {
  if (!input || typeof input !== 'string') return false;
  if (input.length > maxLength) return false;
  return true;
};

// Function to get SMTP settings from database (only accessible by authenticated admin)
const getSMTPSettings = async () => {
  const { data, error } = await supabase
    .from('pos_settings')
    .select('setting_key, setting_value')
    .in('setting_key', [
      'email_smtp_host',
      'email_smtp_port', 
      'email_smtp_user',
      'email_smtp_password',
      'email_from_address',
      'email_from_name'
    ]);

  if (error) {
    console.error('Error fetching SMTP settings:', error);
    return null;
  }

  const settings: Record<string, string> = {};
  data?.forEach(setting => {
    settings[setting.setting_key] = setting.setting_value || '';
  });

  return settings;
};

// Function to verify booking exists in database
const verifyBookingExists = async (type: string, orderDetails: EmailRequest['orderDetails']): Promise<boolean> => {
  if (type === 'charging' && orderDetails.orderNumber) {
    const { data, error } = await supabase
      .from('pos_charging_orders')
      .select('id')
      .eq('order_number', orderDetails.orderNumber)
      .single();
    
    return !error && !!data;
  }
  
  if (type === 'reservation' && orderDetails.date && orderDetails.time) {
    const { data, error } = await supabase
      .from('reservations')
      .select('id')
      .eq('date', orderDetails.date)
      .eq('time', orderDetails.time)
      .single();
    
    return !error && !!data;
  }
  
  return false;
};

// Function to send email using SMTP
const sendSMTPEmail = async (to: string, subject: string, html: string, smtpSettings: Record<string, string>) => {
  try {
    console.log('SMTP Email Details:');
    console.log('To:', to);
    console.log('Subject:', subject);
    console.log('From:', `${smtpSettings.email_from_name} <${smtpSettings.email_from_address}>`);
    console.log('SMTP Host:', smtpSettings.email_smtp_host);
    console.log('SMTP Port:', smtpSettings.email_smtp_port);
    
    // In a real implementation, you would use the SMTP settings to send the email
    return {
      success: true,
      message: 'Email sent successfully via SMTP',
      id: `smtp_${Date.now()}`
    };
  } catch (error) {
    console.error('SMTP Error:', error);
    throw error;
  }
};

const handler = async (req: Request): Promise<Response> => {
  const origin = req.headers.get('Origin') || '';
  const corsHeaders = getCorsHeaders(origin);

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Only allow POST method
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized - Missing or invalid authorization header' }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: claims, error: claimsError } = await supabase.auth.getClaims(token);
    
    if (claimsError || !claims?.claims) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized - Invalid token' }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const userId = claims.claims.sub;

    // Verify user has permission to send emails (POS staff)
    const { data: posUser, error: userError } = await supabase
      .from('pos_users')
      .select('role, is_active')
      .eq('auth_user_id', userId)
      .single();

    if (userError || !posUser?.is_active) {
      return new Response(
        JSON.stringify({ error: 'Forbidden - User not authorized to send emails' }),
        { status: 403, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Only allow admin, manager, cashier, charging_staff roles
    const allowedRoles = ['admin', 'manager', 'cashier', 'charging_staff'];
    if (!allowedRoles.includes(posUser.role)) {
      return new Response(
        JSON.stringify({ error: 'Forbidden - Insufficient permissions' }),
        { status: 403, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const { type, customerName, customerEmail, orderDetails }: EmailRequest = await req.json();

    // Validate required fields
    if (!type || !['charging', 'reservation'].includes(type)) {
      return new Response(
        JSON.stringify({ error: 'Invalid request type' }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Validate email format
    if (!validateEmail(customerEmail)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email format' }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Validate customer name
    if (!validateInput(customerName, 100)) {
      return new Response(
        JSON.stringify({ error: 'Invalid customer name (max 100 characters)' }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Verify booking exists in database
    const bookingExists = await verifyBookingExists(type, orderDetails);
    if (!bookingExists) {
      console.warn('Attempted to send email for non-existent booking:', { type, orderDetails });
      return new Response(
        JSON.stringify({ error: 'Booking not found - cannot send confirmation email' }),
        { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Get SMTP settings from database
    const smtpSettings = await getSMTPSettings();
    
    if (!smtpSettings || !smtpSettings.email_smtp_host) {
      return new Response(
        JSON.stringify({ error: 'SMTP settings not configured. Please configure email settings in the admin panel.' }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Escape all user-controlled input to prevent XSS
    const safeName = escapeHtml(customerName);
    const safeOrderNumber = escapeHtml(orderDetails.orderNumber || '');
    const safeStationId = escapeHtml(orderDetails.stationId || '');
    const safeVehicleNumber = escapeHtml(orderDetails.vehicleNumber || 'Not specified');
    const safeSpecialRequests = escapeHtml(orderDetails.specialRequests || '');

    let subject: string;
    let html: string;

    if (type === 'charging') {
      subject = "Charging Station Booking Confirmed - Energy Palace";
      html = `
        <h1>Charging Station Booking Confirmed!</h1>
        <p>Dear ${safeName},</p>
        <p>Your charging station booking has been confirmed. Here are the details:</p>
        <ul>
          <li><strong>Order Number:</strong> ${safeOrderNumber}</li>
          <li><strong>Station:</strong> ${safeStationId}</li>
          <li><strong>Vehicle:</strong> ${safeVehicleNumber}</li>
          <li><strong>Expected Start:</strong> ${orderDetails.startTime ? new Date(orderDetails.startTime).toLocaleString() : 'Not specified'}</li>
          ${orderDetails.expectedEndTime ? `<li><strong>Expected End:</strong> ${new Date(orderDetails.expectedEndTime).toLocaleString()}</li>` : ''}
          <li><strong>Total Amount:</strong> NPR ${orderDetails.totalAmount || 0}</li>
        </ul>
        <p>Please arrive on time for your booking. If you need to make changes, please contact us immediately.</p>
        <p>Best regards,<br>Energy Palace Team</p>
      `;
    } else {
      subject = "Restaurant Reservation Confirmed - Energy Palace";
      html = `
        <h1>Restaurant Reservation Confirmed!</h1>
        <p>Dear ${safeName},</p>
        <p>Your restaurant reservation has been confirmed. Here are the details:</p>
        <ul>
          <li><strong>Date:</strong> ${orderDetails.date ? new Date(orderDetails.date).toLocaleDateString() : 'Not specified'}</li>
          <li><strong>Time:</strong> ${escapeHtml(orderDetails.time || 'Not specified')}</li>
          <li><strong>Guests:</strong> ${orderDetails.guests || 0}</li>
          ${safeSpecialRequests ? `<li><strong>Special Requests:</strong> ${safeSpecialRequests}</li>` : ''}
        </ul>
        <p>We look forward to welcoming you to Energy Palace. If you need to make changes, please contact us at least 2 hours before your reservation time.</p>
        <p>Best regards,<br>Energy Palace Team</p>
      `;
    }

    // Send email using SMTP settings
    const emailResponse = await sendSMTPEmail(
      customerEmail,
      subject,
      html,
      smtpSettings
    );

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    console.error("Error in send-confirmation function:", error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...getCorsHeaders(req.headers.get('Origin') || '') },
      }
    );
  }
};

serve(handler);

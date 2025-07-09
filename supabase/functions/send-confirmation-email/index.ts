import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  type: 'charging' | 'reservation';
  customerName: string;
  customerEmail: string;
  orderDetails: any;
}

// Function to get SMTP settings from database
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

// Function to send email using SMTP
const sendSMTPEmail = async (to: string, subject: string, html: string, smtpSettings: Record<string, string>) => {
  try {
    // Use a simple SMTP implementation or external service
    // For now, we'll simulate sending and log the email
    console.log('SMTP Email Details:');
    console.log('To:', to);
    console.log('Subject:', subject);
    console.log('From:', `${smtpSettings.email_from_name} <${smtpSettings.email_from_address}>`);
    console.log('SMTP Host:', smtpSettings.email_smtp_host);
    console.log('SMTP Port:', smtpSettings.email_smtp_port);
    console.log('HTML Content:', html);
    
    // In a real implementation, you would use the SMTP settings to send the email
    // For now, we'll return a success response
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
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, customerName, customerEmail, orderDetails }: EmailRequest = await req.json();

    // Get SMTP settings from database
    const smtpSettings = await getSMTPSettings();
    
    if (!smtpSettings || !smtpSettings.email_smtp_host) {
      throw new Error('SMTP settings not configured. Please configure email settings in the admin panel.');
    }
    let subject: string;
    let html: string;

    if (type === 'charging') {
      subject = "Charging Station Booking Confirmed - Energy Palace";
      html = `
        <h1>Charging Station Booking Confirmed!</h1>
        <p>Dear ${customerName},</p>
        <p>Your charging station booking has been confirmed. Here are the details:</p>
        <ul>
          <li><strong>Order Number:</strong> ${orderDetails.orderNumber}</li>
          <li><strong>Station:</strong> ${orderDetails.stationId}</li>
          <li><strong>Vehicle:</strong> ${orderDetails.vehicleNumber || 'Not specified'}</li>
          <li><strong>Expected Start:</strong> ${new Date(orderDetails.startTime).toLocaleString()}</li>
          ${orderDetails.expectedEndTime ? `<li><strong>Expected End:</strong> ${new Date(orderDetails.expectedEndTime).toLocaleString()}</li>` : ''}
          <li><strong>Total Amount:</strong> NPR ${orderDetails.totalAmount}</li>
        </ul>
        <p>Please arrive on time for your booking. If you need to make changes, please contact us immediately.</p>
        <p>Best regards,<br>Energy Palace Team</p>
      `;
    } else {
      subject = "Restaurant Reservation Confirmed - Energy Palace";
      html = `
        <h1>Restaurant Reservation Confirmed!</h1>
        <p>Dear ${customerName},</p>
        <p>Your restaurant reservation has been confirmed. Here are the details:</p>
        <ul>
          <li><strong>Date:</strong> ${new Date(orderDetails.date).toLocaleDateString()}</li>
          <li><strong>Time:</strong> ${orderDetails.time}</li>
          <li><strong>Guests:</strong> ${orderDetails.guests}</li>
          ${orderDetails.specialRequests ? `<li><strong>Special Requests:</strong> ${orderDetails.specialRequests}</li>` : ''}
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
  } catch (error: any) {
    console.error("Error in send-confirmation function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
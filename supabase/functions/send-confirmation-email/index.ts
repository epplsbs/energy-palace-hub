import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

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

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, customerName, customerEmail, orderDetails }: EmailRequest = await req.json();

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

    const emailResponse = await resend.emails.send({
      from: "Energy Palace <onboarding@resend.dev>",
      to: [customerEmail],
      subject: subject,
      html: html,
    });

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
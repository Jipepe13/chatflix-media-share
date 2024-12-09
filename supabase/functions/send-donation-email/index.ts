import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const ADMIN_EMAIL = Deno.env.get("ADMIN_EMAIL");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  donorEmail: string;
  amount: number;
  currency: string;
  transactionHash: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Received request to send-donation-email function");
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { donorEmail, amount, currency, transactionHash }: EmailRequest = await req.json();
    console.log("Processing donation email for:", donorEmail, amount, currency);

    // Send email to donor
    const donorEmailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "ChatFlix <donations@chatflix.com>",
        to: [donorEmail],
        subject: "Merci pour votre don !",
        html: `
          <h1>Merci beaucoup pour votre don !</h1>
          <p>Nous avons bien reçu votre don de ${amount} ${currency}.</p>
          <p>Transaction hash: ${transactionHash}</p>
          <p>Votre soutien est très précieux pour nous !</p>
        `,
      }),
    });

    // Send email to admin
    if (ADMIN_EMAIL) {
      const adminEmailRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: "ChatFlix <donations@chatflix.com>",
          to: [ADMIN_EMAIL],
          subject: "Nouveau don reçu !",
          html: `
            <h1>Nouveau don reçu !</h1>
            <p>Un don de ${amount} ${currency} a été reçu.</p>
            <p>Email du donateur: ${donorEmail}</p>
            <p>Transaction hash: ${transactionHash}</p>
          `,
        }),
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in send-donation-email function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
};

serve(handler);
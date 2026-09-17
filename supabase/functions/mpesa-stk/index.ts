import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const { phone, amount, booking_id } = await req.json();
    let formattedPhone = String(phone ?? "").replace(/\s/g, "").replace(/^\+/, "");
    if (formattedPhone.startsWith("0")) formattedPhone = `254${formattedPhone.slice(1)}`;
    const numericAmount = Math.round(Number(amount));

    if (!/^254[17]\d{8}$/.test(formattedPhone)) throw new Error("Invalid M-Pesa phone number");
    if (!Number.isFinite(numericAmount) || numericAmount < 1) throw new Error("Invalid payment amount");

    const key = Deno.env.get("MPESA_CONSUMER_KEY");
    const secret = Deno.env.get("MPESA_CONSUMER_SECRET");
    const shortcode = Deno.env.get("MPESA_SHORTCODE");
    const passkey = Deno.env.get("MPESA_PASSKEY");

    if (!key || !secret || !shortcode || !passkey) throw new Error("Missing Mpesa secrets");

    const auth = btoa(`${key}:${secret}`);
    const tokenRes = await fetch("https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials", {
      headers: { Authorization: `Basic ${auth}` },
    });
    const tokenText = await tokenRes.text();
    if (!tokenRes.ok) throw new Error(`Token failed: ${tokenText}`);
    const { access_token } = JSON.parse(tokenText);
    if (!access_token) throw new Error(`Token failed: ${tokenText}`);

    const timestamp = new Date().toISOString().replace(/[^0-9]/g, "").slice(0, 14);
    const password = btoa(`${shortcode}${passkey}${timestamp}`);

    const stkRes = await fetch("https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest", {
      method: "POST",
      headers: { Authorization: `Bearer ${access_token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        BusinessShortCode: shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: numericAmount,
        PartyA: formattedPhone,
        PartyB: shortcode,
        PhoneNumber: formattedPhone,
        CallBackURL: "https://jznleilaqdwamqqvgjai.supabase.co/functions/v1/mpesa-callback",
        AccountReference: `AnneCounselor-${booking_id || Date.now()}`,
        TransactionDesc: "Therapy Session"
      }),
    });
    const stkText = await stkRes.text();
    const stkData = JSON.parse(stkText);
    const success = stkRes.ok && stkData.ResponseCode === "0";
    return new Response(JSON.stringify({ ...stkData, success }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: stkRes.status,
    });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Payment request failed", success: false }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
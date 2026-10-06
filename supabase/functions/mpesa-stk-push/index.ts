import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed", success: false }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const authorization = req.headers.get("Authorization");
    if (!authorization) {
      return new Response(JSON.stringify({ error: "Authentication required", success: false }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const paybill = Deno.env.get("MPESA_PAYBILL");
    const account = Deno.env.get("MPESA_ACCOUNT");
    const key = Deno.env.get("MPESA_CONSUMER_KEY");
    const secret = Deno.env.get("MPESA_CONSUMER_SECRET");
    const passkey = Deno.env.get("MPESA_PASSKEY");

    if (!supabaseUrl || !supabaseAnonKey || !serviceRoleKey) {
      throw new Error("Missing Supabase configuration");
    }
    if (paybill !== "400200" || account !== "1209968") {
      throw new Error("MPESA_PAYBILL and MPESA_ACCOUNT must be configured for this business");
    }
    if (!key || !secret || !passkey) throw new Error("Missing Mpesa secrets");

    const authClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authorization } },
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data: { user }, error: authError } = await authClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Invalid authentication", success: false }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { phone, amount } = await req.json();
    let formattedPhone = String(phone ?? "").replace(/\s/g, "").replace(/^\+/, "");
    if (formattedPhone.startsWith("0")) formattedPhone = `254${formattedPhone.slice(1)}`;
    const numericAmount = Math.round(Number(amount));

    if (!/^254[17]\d{8}$/.test(formattedPhone)) throw new Error("Invalid M-Pesa phone number");
    if (!Number.isFinite(numericAmount) || numericAmount < 1) throw new Error("Invalid payment amount");

    const auth = btoa(`${key}:${secret}`);
    const tokenRes = await fetch("https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials", {
      headers: { Authorization: `Basic ${auth}` },
    });
    const tokenText = await tokenRes.text();
    if (!tokenRes.ok) throw new Error(`Token failed: ${tokenText}`);
    const { access_token } = JSON.parse(tokenText);
    if (!access_token) throw new Error(`Token failed: ${tokenText}`);

    const timestamp = new Date().toISOString().replace(/[^0-9]/g, "").slice(0, 14);
    const password = btoa(`${paybill}${passkey}${timestamp}`);

    const stkRes = await fetch("https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest", {
      method: "POST",
      headers: { Authorization: `Bearer ${access_token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        BusinessShortCode: paybill,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: numericAmount,
        PartyA: formattedPhone,
        PartyB: paybill,
        PhoneNumber: formattedPhone,
        CallBackURL: "https://jznleilaqdwamqqvgjai.supabase.co/functions/v1/mpesa-callback",
        AccountReference: account,
        TransactionDesc: "JOB",
      }),
    });
    const stkText = await stkRes.text();
    const stkData = JSON.parse(stkText);
    const success = stkRes.ok && stkData.ResponseCode === "0";

    if (!success) {
      return new Response(JSON.stringify({ ...stkData, success: false }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: stkRes.ok ? 502 : stkRes.status,
      });
    }

    if (!stkData.CheckoutRequestID) throw new Error("Safaricom response did not include a CheckoutRequestID");

    const serviceClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { error: paymentError } = await serviceClient.from("payments").insert({
      user_id: user.id,
      provider: "mpesa",
      amount: numericAmount,
      currency: "KES",
      status: "pending",
      reference: account,
      provider_reference: stkData.CheckoutRequestID,
      payer_contact: formattedPhone,
      raw_response: {
        businessShortCode: paybill,
        accountReference: account,
        checkoutRequestId: stkData.CheckoutRequestID,
        merchantRequestId: stkData.MerchantRequestID ?? null,
      },
    });
    if (paymentError) throw paymentError;

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
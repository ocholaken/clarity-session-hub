import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function formatPhone(phone: string | number): string {
  let formattedPhone = String(phone).trim().replace(/[\s\-+]/g, "");
  if (formattedPhone.startsWith("0")) formattedPhone = `254${formattedPhone.slice(1)}`;
  else if (formattedPhone.startsWith("7") || formattedPhone.startsWith("1")) {
    formattedPhone = `254${formattedPhone}`;
  }

  if (!/^254(7\d{8}|1\d{8})$/.test(formattedPhone)) {
    throw new Error(`Invalid phone ${phone}. Use 07... or 01...`);
  }
  return formattedPhone;
}

function parseResponseBody(body: string): Record<string, unknown> {
  try {
    const parsed: unknown = JSON.parse(body);
    if (parsed && typeof parsed === "object") return parsed as Record<string, unknown>;
  } catch {
    // The caller includes the raw body in the resulting error.
  }
  return {};
}

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
    const shortcode = Deno.env.get("MPESA_SHORTCODE") || Deno.env.get("MPESA_PAYBILL");
    const account = Deno.env.get("MPESA_ACCOUNT");
    const consumerKey = Deno.env.get("MPESA_CONSUMER_KEY");
    const consumerSecret = Deno.env.get("MPESA_CONSUMER_SECRET");
    const passkey = Deno.env.get("MPESA_PASSKEY");
    const environment = (Deno.env.get("MPESA_ENV") || "sandbox").toLowerCase();

    if (!supabaseUrl || !supabaseAnonKey || !serviceRoleKey) {
      throw new Error("Missing Supabase configuration");
    }
    if (!shortcode || !account) {
      throw new Error("Missing MPESA_SHORTCODE (or MPESA_PAYBILL) or MPESA_ACCOUNT");
    }
    if (!consumerKey || !consumerSecret || !passkey) throw new Error("Missing M-Pesa secrets");
    if (environment !== "sandbox" && environment !== "production") {
      throw new Error("MPESA_ENV must be either sandbox or production");
    }

    const authClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authorization } },
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const {
      data: { user },
      error: authError,
    } = await authClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Invalid authentication", success: false }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const requestBody: unknown = await req.json();
    if (!requestBody || typeof requestBody !== "object") throw new Error("Invalid request body");
    const body = requestBody as {
      phone?: string | number;
      amount?: number | string;
      accountReference?: string;
      account_ref?: string;
      transactionDesc?: string;
    };
    const formattedPhone = formatPhone(body.phone ?? "");
    const numericAmount = Math.round(Number(body.amount));
    if (!Number.isFinite(numericAmount) || numericAmount < 1) {
      throw new Error("Invalid payment amount");
    }

    const requestedAccountReference = body.accountReference ?? body.account_ref ?? "Order";
    const requestedTransactionDesc = body.transactionDesc ?? "Payment";
    if (typeof requestedAccountReference !== "string" || typeof requestedTransactionDesc !== "string") {
      throw new Error("Account reference and transaction description must be text");
    }
    const accountReference = requestedAccountReference.trim();
    const transactionDesc = requestedTransactionDesc.trim();
    if (!accountReference || accountReference.length > 12) {
      throw new Error("Account reference must be between 1 and 12 characters");
    }
    if (!transactionDesc) throw new Error("Transaction description cannot be empty");

    const darajaHost =
      environment === "production" ? "https://api.safaricom.co.ke" : "https://sandbox.safaricom.co.ke";
    const auth = btoa(`${consumerKey}:${consumerSecret}`);
    const tokenRes = await fetch(`${darajaHost}/oauth/v1/generate?grant_type=client_credentials`, {
      headers: { Authorization: `Basic ${auth}` },
    });
    const tokenText = await tokenRes.text();
    const tokenData = parseResponseBody(tokenText);
    if (!tokenRes.ok) {
      throw new Error(`M-Pesa authentication failed (${tokenRes.status}): ${tokenText}`);
    }
    const accessToken = tokenData.access_token;
    if (typeof accessToken !== "string" || !accessToken) {
      throw new Error(`M-Pesa authentication response did not include an access token: ${tokenText}`);
    }

    const timestamp = new Date().toISOString().replace(/[^0-9]/g, "").slice(0, 14);
    const password = btoa(`${shortcode}${passkey}${timestamp}`);
    const stkRes = await fetch(`${darajaHost}/mpesa/stkpush/v1/processrequest`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
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
        AccountReference: accountReference,
        TransactionDesc: transactionDesc,
      }),
    });
    const stkText = await stkRes.text();
    const stkData = parseResponseBody(stkText);
    console.log("STK Result:", { status: stkRes.status, body: stkData });
    const success = stkRes.ok && stkData.ResponseCode === "0";

    if (!success) {
      const errorMessage =
        typeof stkData.errorMessage === "string"
          ? stkData.errorMessage
          : typeof stkData.ResponseDescription === "string"
            ? stkData.ResponseDescription
            : stkText || "M-Pesa STK request failed";
      return new Response(JSON.stringify({ ...stkData, error: errorMessage, success: false }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: stkRes.ok ? 502 : stkRes.status,
      });
    }

    const checkoutRequestId = stkData.CheckoutRequestID;
    if (typeof checkoutRequestId !== "string" || !checkoutRequestId) {
      throw new Error("Safaricom response did not include a CheckoutRequestID");
    }

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
      provider_reference: checkoutRequestId,
      payer_contact: formattedPhone,
      raw_response: {
        businessShortCode: shortcode,
        accountReference,
        checkoutRequestId,
        merchantRequestId:
          typeof stkData.MerchantRequestID === "string" ? stkData.MerchantRequestID : null,
      },
    });
    if (paymentError) throw paymentError;

    return new Response(JSON.stringify({ ...stkData, success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: stkRes.status,
    });
  } catch (error) {
    console.error("M-Pesa STK request failed:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Payment request failed",
        success: false,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      },
    );
  }
});

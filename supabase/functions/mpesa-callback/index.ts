import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const callback = await request.json();
    const paybill = Deno.env.get("MPESA_PAYBILL");
    const account = Deno.env.get("MPESA_ACCOUNT");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (paybill !== "400200" || account !== "1209968") {
      throw new Error("MPESA_PAYBILL and MPESA_ACCOUNT must be configured for this business");
    }
    if (!supabaseUrl || !serviceRoleKey) throw new Error("Missing Supabase configuration");

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const stkCallback = callback?.Body?.stkCallback;

    if (stkCallback) {
      const checkoutRequestId = stkCallback.CheckoutRequestID;
      if (typeof checkoutRequestId !== "string" || !checkoutRequestId) {
        return callbackResponse("CheckoutRequestID is required", 400);
      }

      const { data: payment, error: lookupError } = await supabase
        .from("payments")
        .select("id, amount, reference, raw_response")
        .eq("provider", "mpesa")
        .eq("provider_reference", checkoutRequestId)
        .maybeSingle();
      if (lookupError) throw lookupError;
      if (!payment) return callbackResponse("Unknown CheckoutRequestID", 400);

      const storedMetadata = payment.raw_response as {
        businessShortCode?: string;
        accountReference?: string;
      } | null;
      if (
        payment.reference !== account ||
        storedMetadata?.businessShortCode !== paybill ||
        storedMetadata.accountReference !== account
      ) {
        return callbackResponse("Stored payment details do not match", 400);
      }

      const succeeded = Number(stkCallback.ResultCode) === 0;
      if (succeeded) {
        const amountItem = stkCallback.CallbackMetadata?.Item?.find(
          (item: { Name?: string }) => item.Name === "Amount",
        );
        if (amountItem?.Value == null || Number(amountItem.Value) !== Number(payment.amount)) {
          return callbackResponse("Payment amount does not match", 400);
        }
      }

      const { error: updateError } = await supabase
        .from("payments")
        .update({ status: succeeded ? "successful" : "failed" })
        .eq("id", payment.id);
      if (updateError) throw updateError;
    } else {
      const c2bCallback = callback?.Body?.C2BPaymentConfirmation ?? callback;
      const callbackPaybill = String(c2bCallback?.BusinessShortCode ?? "");
      const callbackAccount = String(c2bCallback?.BillRefNumber ?? c2bCallback?.Account ?? "");
      if (callbackPaybill !== paybill || callbackAccount !== account) {
        return callbackResponse("C2B business number or account does not match", 400);
      }
    }

    return new Response(JSON.stringify({ ResultCode: 0, ResultDesc: "Accepted" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Invalid M-Pesa callback", error);
    return new Response(JSON.stringify({ ResultCode: 1, ResultDesc: "Invalid callback" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function callbackResponse(message: string, status: number) {
  return new Response(JSON.stringify({ ResultCode: 1, ResultDesc: message }), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
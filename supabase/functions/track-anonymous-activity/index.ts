import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const {
      visitor_id,
      session_id,
      action_type = "page_view",
      page_url = "/",
      counselor_id = null,
      scroll_depth = null,
      referrer = null,
      timestamp = new Date().toISOString(),
      metadata = {},
      device,
      browser,
      os,
    } = body ?? {};

    if (!visitor_id) {
      return new Response(JSON.stringify({ error: "Missing visitor_id" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(JSON.stringify({ error: "Supabase configuration missing" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const forwardedIp = req.headers.get("x-forwarded-for") || req.headers.get("cf-connecting-ip") || "unknown";
    const country = req.headers.get("cf-ipcountry") || "Unknown";
    const city = req.headers.get("cf-ipcity") || "Unknown";

    const createdAt = new Date(timestamp).toISOString();

    const { data: visitor, error: visitorLookupError } = await supabase
      .from("anonymous_visitors")
      .select("id, total_sessions, pages_viewed")
      .eq("visitor_id", visitor_id)
      .maybeSingle();

    if (visitorLookupError && visitorLookupError.code !== "PGRST116") {
      throw visitorLookupError;
    }

    if (visitor) {
      const { error: updateVisitorError } = await supabase
        .from("anonymous_visitors")
        .update({
          last_seen: createdAt,
          last_page: page_url || "/",
          device: device || "Unknown",
          browser: browser || "Unknown",
          os: os || "Unknown",
          ip_address: forwardedIp,
          country,
          city,
          pages_viewed: (visitor.pages_viewed ?? 0) + (action_type === "page_view" ? 1 : 0),
        })
        .eq("visitor_id", visitor_id);
      if (updateVisitorError) throw updateVisitorError;
    } else {
      const { error: insertVisitorError } = await supabase.from("anonymous_visitors").insert({
        visitor_id,
        first_seen: createdAt,
        last_seen: createdAt,
        last_page: page_url || "/",
        device: device || "Unknown",
        browser: browser || "Unknown",
        os: os || "Unknown",
        ip_address: forwardedIp,
        country,
        city,
        total_sessions: 1,
        pages_viewed: 1,
      });

      if (insertVisitorError) {
        throw insertVisitorError;
      }
    }

    const { error: interactionError } = await supabase.from("interactions").insert({
      visitor_id,
      session_id: session_id || crypto.randomUUID(),
      page_url: page_url || "/",
      action_type,
      metadata: {
        ...metadata,
        referrer,
        browser,
        os,
        device,
      },
      created_at: createdAt,
    });

    if (interactionError) {
      throw interactionError;
    }

    if (["page_view", "counselor_view", "scroll_depth"].includes(action_type)) {
      const { error: pageViewError } = await supabase.from("page_views").insert({
        page: (page_url || "/").split("?")[0],
        session_id: session_id || crypto.randomUUID(),
      });
      if (pageViewError) throw pageViewError;
    }

    return new Response(JSON.stringify({ ok: true, visitor_id, action_type }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("track-anonymous-activity error", error);
    return new Response(JSON.stringify({ ok: false, error: error.message || "Unexpected failure" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

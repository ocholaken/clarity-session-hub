import { GoogleGenerativeAI } from "npm:@google/generative-ai";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const systemPrompt = "You are Clarity AI, a compassionate mental health support assistant for Clarity Sessions Hub. Provide coping strategies, breathing exercises, CBT techniques, grounding exercises. Keep responses short (2-4 sentences), warm, supportive, non-clinical. You are NOT a doctor. Always encourage professional help for serious issues. Never diagnose. Use emojis sparingly. Always remember user's name if they share it. Use it warmly.";

type ChatMessage = { role: "user" | "assistant"; content: string };

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { message, history } = await request.json();
    if (typeof message !== "string" || !message.trim()) {
      return new Response(JSON.stringify({ error: "A message is required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const chatHistory: ChatMessage[] = Array.isArray(history) && history.length > 0
      ? history.filter((item): item is ChatMessage =>
        (item?.role === "user" || item?.role === "assistant") && typeof item?.content === "string",
      )
      : [{ role: "user", content: message.trim() }];
    const apiKey = Deno.env.get("GEMINI_API_KEY");
    console.log("KEY EXISTS:", !!apiKey);
    if (!apiKey) throw new Error("GEMINI_API_KEY is not configured");
    const model = new GoogleGenerativeAI(apiKey).getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: systemPrompt,
    });
    const result = await model.generateContent({
      contents: chatHistory.map(({ role, content }) => ({
        role: role === "user" ? "user" : "model",
        parts: [{ text: content }],
      })),
    });
    const reply = result.response.text().trim();
    if (!reply) throw new Error("Gemini returned no reply");
    return new Response(JSON.stringify({ reply }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (error) {
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unable to generate a reply" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
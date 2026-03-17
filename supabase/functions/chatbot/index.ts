import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const { messages } = await req.json();

    const systemPrompt = `You are the friendly AI assistant for HookOnLoop, a handmade crochet brand from Pakistan. You help customers with:
- Product questions (crochet flowers, keychains, bouquets, amigurumi toys, accessories)
- Order status and tracking
- Custom order guidance (colors, yarn types, sizes)
- Crochet care tips (washing, storing, maintaining)
- Gift recommendations
- Shipping info (3-7 days processing, Rs. 500 advance, COD available)
- Return/refund policies

Be cute, friendly, and helpful. Use emojis sparingly. Keep answers concise but informative.
If you don't know something specific about an order, suggest they email hello@hookonloop.com or check their order tracker.
Never make up order numbers or tracking info.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages.slice(-10),
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ reply: "I'm getting too many questions right now! Please try again in a moment. 🧶" }), {
          status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ reply: "I'm taking a short break. Please email hello@hookonloop.com for help! 💕" }), {
          status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const result = await response.json();
    const reply = result.choices?.[0]?.message?.content || "I'm not sure how to help with that. Try asking about our products, orders, or custom designs! 🧶";

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("chatbot error:", e);
    return new Response(JSON.stringify({ reply: "Something went wrong. Please try again or email hello@hookonloop.com 💕" }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

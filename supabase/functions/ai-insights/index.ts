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

    const { type, data } = await req.json();

    let systemPrompt = "";
    let userPrompt = "";

    if (type === "business-insights") {
      systemPrompt = `You are an AI business analyst for Crochet World, a handmade crochet e-commerce store. Analyze the provided store data and return actionable insights. Be specific with product names and numbers. Use a friendly but professional tone. Format with markdown headers and bullet points.`;
      userPrompt = `Analyze this store data and provide:
1. **Top Selling Products** (ranked list)
2. **Trending Colors** (based on selections)
3. **Most Popular Category**
4. **AI Product Suggestions** (3 new product ideas based on trends)
5. **Sales Forecast** (predicted best sellers next month)
6. **Inventory Alerts** (any items that may need restocking)
7. **Price Optimization** (suggestions for price adjustments)
8. **Customer Segments** (identify key buyer groups)

Store data: ${JSON.stringify(data)}`;
    } else if (type === "marketing") {
      systemPrompt = `You are a creative marketing copywriter for Crochet World, a kawaii handmade crochet brand. Generate cute, engaging marketing content.`;
      userPrompt = `Generate the following marketing content for these products: ${JSON.stringify(data)}
1. **Product Captions** (2-3 for each product, Instagram-ready)
2. **Email Subject Lines** (5 creative ones)
3. **Product Descriptions** (compelling, emotional)
Format with markdown.`;
    } else if (type === "quiz-recommendation") {
      systemPrompt = `You are a fun crochet product recommender for HookOnLoop. Based on quiz answers, suggest the best crochet products from the store catalog.`;
      userPrompt = `Based on these quiz answers, recommend 3-5 products with reasons:
Quiz answers: ${JSON.stringify(data)}
Available products will come from the store catalog.`;
    }

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
          { role: "user", content: userPrompt },
        ],
        stream: false,
      }),
    });

    if (!response.ok) {
      const status = response.status;
      if (status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", status, t);
      throw new Error(`AI gateway error: ${status}`);
    }

    const result = await response.json();
    const content = result.choices?.[0]?.message?.content || "No insights generated.";

    return new Response(JSON.stringify({ insights: content }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("ai-insights error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

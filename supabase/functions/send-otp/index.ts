import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { phone_number } = await req.json();
    if (!phone_number || typeof phone_number !== "string" || phone_number.length < 10) {
      return new Response(JSON.stringify({ error: "Valid phone number required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Rate limit: max 3 OTPs per phone in last 5 minutes
    const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    const { count } = await supabase
      .from("otp_codes")
      .select("*", { count: "exact", head: true })
      .eq("phone_number", phone_number)
      .gte("created_at", fiveMinAgo);

    if ((count ?? 0) >= 3) {
      return new Response(JSON.stringify({ error: "Too many OTP requests. Try again in a few minutes." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Generate 6-digit OTP
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    const expires_at = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    const { error: insertError } = await supabase.from("otp_codes").insert({
      phone_number,
      otp_code: otp,
      expires_at,
    });

    if (insertError) throw insertError;

    // TEST MODE: return OTP in response (replace with SMS API in production)
    console.log(`OTP for ${phone_number}: ${otp}`);

    return new Response(
      JSON.stringify({ success: true, message: "OTP sent successfully", test_otp: otp }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});

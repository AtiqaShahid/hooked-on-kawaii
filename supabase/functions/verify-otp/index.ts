import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { phone_number, otp_code, name } = await req.json();

    if (!phone_number || !otp_code) {
      return new Response(JSON.stringify({ error: "Phone number and OTP required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Find valid OTP
    const now = new Date().toISOString();
    const { data: otpRecord, error: otpError } = await supabase
      .from("otp_codes")
      .select("*")
      .eq("phone_number", phone_number)
      .eq("otp_code", otp_code)
      .eq("verified", false)
      .gte("expires_at", now)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (otpError) throw otpError;

    if (!otpRecord) {
      return new Response(JSON.stringify({ error: "Invalid or expired OTP" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Mark OTP as verified
    await supabase.from("otp_codes").update({ verified: true }).eq("id", otpRecord.id);

    // Create or find Supabase Auth user with phone as email
    const fakeEmail = `${phone_number.replace(/[^0-9]/g, "")}@phone.hookonloop.com`;
    const tempPassword = `otp_${phone_number}_${Date.now()}`;

    // Try to sign in first (existing user)
    const { data: signInData, error: signInError } = await supabase.auth.admin.listUsers();
    const existingUser = signInData?.users?.find(
      (u: any) => u.email === fakeEmail || u.phone === phone_number
    );

    let userId: string;
    let session: any;

    if (existingUser) {
      userId = existingUser.id;
      // Generate a magic link token for the existing user
      const { data: tokenData, error: tokenError } = await supabase.auth.admin.generateLink({
        type: "magiclink",
        email: fakeEmail,
      });
      if (tokenError) throw tokenError;

      // Sign in with the token properties  
      const { data: sessionData, error: sessError } = await supabase.auth.admin.updateUserById(userId, {
        email: fakeEmail,
        email_confirm: true,
      });
      if (sessError) throw sessError;

      // Update name if provided
      if (name) {
        await supabase.from("profiles").update({ display_name: name }).eq("user_id", userId);
        await supabase.auth.admin.updateUserById(userId, { user_metadata: { full_name: name } });
      }
    } else {
      // Create new user
      const displayName = name || `User ${phone_number.slice(-4)}`;
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: fakeEmail,
        password: tempPassword,
        email_confirm: true,
        phone: phone_number,
        phone_confirm: true,
        user_metadata: { full_name: displayName, phone_number },
      });
      if (createError) throw createError;
      userId = newUser.user.id;

      // Ensure profile exists
      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("id")
        .eq("user_id", userId)
        .maybeSingle();

      if (!existingProfile) {
        await supabase.from("profiles").insert({
          user_id: userId,
          display_name: displayName,
        });
      }
    }

    // Generate session tokens for the user
    const { data: signIn, error: signError } = await supabase.auth.admin.generateLink({
      type: "magiclink",
      email: fakeEmail,
    });

    if (signError) throw signError;

    return new Response(
      JSON.stringify({
        success: true,
        user_id: userId,
        email: fakeEmail,
        token_hash: signIn.properties?.hashed_token,
        verification_url: signIn.properties?.verification_url,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    console.error("verify-otp error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});

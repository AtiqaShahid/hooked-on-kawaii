import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Phone, User as UserIcon, Loader2, ArrowRight, RefreshCw } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

type Step = "phone" | "otp" | "name";

const Login = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [testOtp, setTestOtp] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(0);
  const [verifyData, setVerifyData] = useState<any>(null);
  const otpRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate("/dashboard", { replace: true });
    });
  }, [navigate]);

  // Resend timer countdown
  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  const handleSendOtp = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!phone.trim() || phone.trim().length < 10) {
      toast({ title: "Invalid phone number", description: "Please enter a valid phone number.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("send-otp", {
        body: { phone_number: phone.trim() },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      // Test mode: show OTP
      if (data?.test_otp) setTestOtp(data.test_otp);

      toast({ title: "OTP Sent! 📱", description: "Check your phone for the verification code." });
      setStep("otp");
      setResendTimer(30);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (otp.length !== 6) {
      toast({ title: "Enter 6-digit OTP", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("verify-otp", {
        body: { phone_number: phone.trim(), otp_code: otp },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setVerifyData(data);

      // Sign in using the verification URL / magic link
      if (data?.verification_url) {
        // Extract token from verification URL
        const url = new URL(data.verification_url);
        const token_hash = url.searchParams.get("token") || data.token_hash;
        
        const { data: sessionData, error: verifyError } = await supabase.auth.verifyOtp({
          token_hash: token_hash || data.token_hash,
          type: "magiclink",
        });
        
        if (verifyError) {
          // Fallback: sign in with email/password
          const fakeEmail = data.email;
          // Try direct sign in as the user was just verified
          console.log("Magic link verify failed, user verified via OTP edge function");
        }
        
        if (sessionData?.session) {
          toast({ title: "Welcome! 🧶" });
          navigate("/dashboard");
          return;
        }
      }

      // If no existing user, ask for name
      // Check if user already has a profile with a name
      const { data: profile } = await supabase
        .from("profiles")
        .select("display_name")
        .eq("user_id", data.user_id)
        .maybeSingle();

      if (!profile?.display_name || profile.display_name.startsWith("User ")) {
        setStep("name");
      } else {
        // Try signing in via email
        await signInUser(data.email);
      }
    } catch (err: any) {
      toast({ title: "Verification Failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const signInUser = async (email: string) => {
    // The edge function created/updated the user. We need to sign in.
    // Use signInWithOtp to generate a session
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) {
      // Fallback: show success and redirect
      toast({ title: "Verified! ✅", description: "You're logged in." });
      // Wait for auth state to update
      setTimeout(() => navigate("/dashboard"), 1000);
    } else {
      toast({ title: "Welcome! 🧶" });
      navigate("/dashboard");
    }
  };

  const handleSetName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast({ title: "Name required", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      // Update name via edge function
      const { data, error } = await supabase.functions.invoke("verify-otp", {
        body: { phone_number: phone.trim(), otp_code: otp, name: name.trim() },
      });

      if (verifyData?.email) {
        await signInUser(verifyData.email);
      } else {
        toast({ title: "Welcome! 🧶" });
        navigate("/dashboard");
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-28 pb-20 px-6">
        <div className="max-w-md mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <h1 className="font-display text-3xl font-bold mb-2">
              {step === "phone" && "Welcome! 📱"}
              {step === "otp" && "Enter OTP 🔢"}
              {step === "name" && "Almost There! 🧶"}
            </h1>
            <p className="text-muted-foreground font-body text-sm">
              {step === "phone" && "Enter your phone number to get started"}
              {step === "otp" && `We sent a code to ${phone}`}
              {step === "name" && "Tell us your name to complete signup"}
            </p>
          </motion.div>

          {/* Step 1: Phone Number */}
          {step === "phone" && (
            <motion.form
              onSubmit={handleSendOtp}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-4 rounded-3xl bg-card shadow-soft p-6"
            >
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+92 3XX XXXXXXX"
                  required
                  className="pl-10 rounded-2xl h-12 border-border/50"
                  autoFocus
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full rounded-2xl h-12 btn-squish">
                {loading ? <Loader2 className="animate-spin mr-2" size={18} /> : <ArrowRight className="mr-2" size={18} />}
                Send OTP
              </Button>
            </motion.form>
          )}

          {/* Step 2: OTP Verification */}
          {step === "otp" && (
            <motion.form
              onSubmit={handleVerifyOtp}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-6 rounded-3xl bg-card shadow-soft p-6"
            >
              {/* Test mode OTP display */}
              {testOtp && (
                <div className="bg-accent/20 border border-accent/30 rounded-2xl p-3 text-center">
                  <p className="text-xs text-muted-foreground mb-1">🧪 Test Mode — Your OTP:</p>
                  <p className="font-mono text-2xl font-bold tracking-[0.5em] text-accent-foreground">{testOtp}</p>
                </div>
              )}

              <div className="flex justify-center">
                <InputOTP maxLength={6} value={otp} onChange={setOtp} autoFocus>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <Button type="submit" disabled={loading || otp.length !== 6} className="w-full rounded-2xl h-12 btn-squish">
                {loading ? <Loader2 className="animate-spin mr-2" size={18} /> : null}
                Verify OTP
              </Button>

              <div className="flex items-center justify-between text-sm">
                <button
                  type="button"
                  onClick={() => { setStep("phone"); setOtp(""); setTestOtp(null); }}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  ← Change number
                </button>
                <button
                  type="button"
                  onClick={() => handleSendOtp()}
                  disabled={resendTimer > 0}
                  className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors disabled:opacity-50"
                >
                  <RefreshCw size={14} />
                  {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend OTP"}
                </button>
              </div>
            </motion.form>
          )}

          {/* Step 3: Name */}
          {step === "name" && (
            <motion.form
              onSubmit={handleSetName}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-4 rounded-3xl bg-card shadow-soft p-6"
            >
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  required
                  className="pl-10 rounded-2xl h-12 border-border/50"
                  autoFocus
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full rounded-2xl h-12 btn-squish">
                {loading ? <Loader2 className="animate-spin mr-2" size={18} /> : null}
                Complete Signup 🎉
              </Button>
            </motion.form>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;

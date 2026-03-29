import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, Loader2, Mail, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { AUTH_REDIRECTS } from "@/lib/authRedirects";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isRecovery, setIsRecovery] = useState(false);
  const [checking, setChecking] = useState(true);
  const [resendEmail, setResendEmail] = useState("");
  const [resending, setResending] = useState(false);

  useEffect(() => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.replace("#", ""));
    const hasRecoveryToken = params.get("type") === "recovery" || Boolean(params.get("access_token"));

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        setIsRecovery(true);
        setChecking(false);
      } else if (event === "SIGNED_IN" && session && hasRecoveryToken) {
        setIsRecovery(true);
        setChecking(false);
      }
    });

    const checkRecoveryState = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session && hasRecoveryToken) {
        setIsRecovery(true);
      }
      setTimeout(() => setChecking(false), 1500);
    };

    checkRecoveryState();

    return () => subscription.unsubscribe();
  }, []);

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resendEmail.trim()) {
      toast({ title: "Enter your email", variant: "destructive" });
      return;
    }

    setResending(true);
    const { error } = await supabase.auth.resetPasswordForEmail(resendEmail.trim(), {
      redirectTo: AUTH_REDIRECTS.resetPassword,
    });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Reset link sent! 📧", description: "Check your email for a new reset link." });
    }

    setResending(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      toast({ title: "Password too short", description: "Minimum 6 characters required.", variant: "destructive" });
      return;
    }

    if (password !== confirmPassword) {
      toast({ title: "Passwords don't match", description: "Please make sure both passwords are identical.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast({ title: "Password updated! 🎉", description: "You can now log in with your new password." });
      await supabase.auth.signOut();
      navigate("/login", { replace: true });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  if (!isRecovery) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-28 pb-20 px-6">
          <div className="max-w-md mx-auto text-center">
            <h1 className="font-display text-2xl font-bold mb-4">Reset Link Expired 🔗</h1>
            <p className="text-muted-foreground mb-6">This link is invalid or has expired. Request a new one below.</p>

            <form onSubmit={handleResend} className="space-y-4 rounded-3xl bg-card shadow-soft p-6">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  type="email"
                  value={resendEmail}
                  onChange={(e) => setResendEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="pl-10 rounded-2xl h-12 border-border/50"
                />
              </div>
              <Button type="submit" disabled={resending} className="w-full rounded-2xl h-12 btn-squish">
                {resending ? <Loader2 className="animate-spin mr-2" size={18} /> : <RefreshCw className="mr-2" size={18} />}
                Resend Reset Link
              </Button>
              <button type="button" onClick={() => navigate("/login")} className="block w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors">
                Back to Login
              </button>
            </form>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-28 pb-20 px-6">
        <div className="max-w-md mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <h1 className="font-display text-3xl font-bold mb-2">Set New Password 🔐</h1>
            <p className="text-muted-foreground font-body text-sm">Enter your new password below</p>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4 rounded-3xl bg-card shadow-soft p-6"
          >
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="New password"
                required
                minLength={6}
                className="pl-10 pr-10 rounded-2xl h-12 border-border/50"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
                minLength={6}
                className="pl-10 rounded-2xl h-12 border-border/50"
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full rounded-2xl h-12 btn-squish">
              {loading ? <Loader2 className="animate-spin mr-2" size={18} /> : null}
              Update Password
            </Button>
          </motion.form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ResetPassword;

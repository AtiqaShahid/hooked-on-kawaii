import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Eye, EyeOff, Mail, Lock, User as UserIcon } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgot, setIsForgot] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate("/dashboard", { replace: true });
    });
  }, [navigate]);

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/login`,
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Check your email! 📧", description: "Password reset link sent." });
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: { data: { full_name: name }, emailRedirectTo: window.location.origin },
      });
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Check your email! 📧", description: "Please verify your email to complete signup." });
      }
    } else {
      const { data: signInData, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (error) {
        if (error.message?.toLowerCase().includes("email not confirmed")) {
          toast({ title: "Email not verified ✉️", description: "Please check your inbox and verify your email before logging in.", variant: "destructive" });
        } else {
          toast({ title: "Error", description: error.message, variant: "destructive" });
        }
      } else {
        toast({ title: "Welcome back! 💕" });
        navigate("/dashboard");
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-28 pb-20 px-6">
        <div className="max-w-md mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <h1 className="font-display text-3xl font-bold mb-2">
              {isForgot ? "Reset Password 🔑" : isSignUp ? "Join the Loop! 🧶" : "Welcome Back! 💕"}
            </h1>
            <p className="text-muted-foreground font-body text-sm">
              {isForgot ? "Enter your email to receive a reset link" : isSignUp ? "Create an account to save wishlist, post, and vote" : "Sign in to your account"}
            </p>
          </motion.div>

          <motion.form
            onSubmit={isForgot ? handleForgot : handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4 rounded-3xl bg-card shadow-soft p-6"
          >
            {isSignUp && !isForgot && (
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <Input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" required className="pl-10 rounded-2xl h-12 border-border/50" />
              </div>
            )}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required className="pl-10 rounded-2xl h-12 border-border/50" />
            </div>
            {!isForgot && (
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  minLength={6}
                  className="pl-10 pr-10 rounded-2xl h-12 border-border/50"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            )}
            <Button type="submit" disabled={loading} className="w-full rounded-2xl h-12 btn-squish">
              {loading ? "Please wait..." : isForgot ? "Send Reset Link" : isSignUp ? "Create Account" : "Sign In"}
            </Button>

            {!isForgot && !isSignUp && (
              <button type="button" onClick={() => setIsForgot(true)} className="block w-full text-center text-xs text-muted-foreground hover:text-foreground transition-colors">
                Forgot password?
              </button>
            )}

            <p className="text-center text-sm text-muted-foreground">
              {isForgot ? (
                <button type="button" onClick={() => setIsForgot(false)} className="text-primary font-medium hover:underline">
                  Back to login
                </button>
              ) : (
                <>
                  {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                  <button type="button" onClick={() => setIsSignUp(!isSignUp)} className="text-primary font-medium hover:underline">
                    {isSignUp ? "Sign In" : "Sign Up"}
                  </button>
                </>
              )}
            </p>
          </motion.form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;

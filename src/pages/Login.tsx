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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name }, emailRedirectTo: window.location.origin },
      });
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Check your email! 📧", description: "Please verify your email to complete signup." });
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
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
            <h1 className="font-display text-3xl font-bold mb-2">{isSignUp ? "Join the Loop! 🧶" : "Welcome Back! 💕"}</h1>
            <p className="text-muted-foreground font-body text-sm">
              {isSignUp ? "Create an account to save wishlist, post, and vote" : "Sign in to your account"}
            </p>
          </motion.div>

          <motion.form onSubmit={handleSubmit} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-4 rounded-3xl bg-card shadow-soft p-6">
            {isSignUp && (
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" required className="w-full p-3 rounded-2xl bg-background border border-border/50 text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/50" />
            )}
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required className="w-full p-3 rounded-2xl bg-background border border-border/50 text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/50" />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required minLength={6} className="w-full p-3 rounded-2xl bg-background border border-border/50 text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/50" />
            <Button type="submit" disabled={loading} className="w-full rounded-2xl btn-squish">
              {loading ? "Please wait..." : isSignUp ? "Create Account" : "Sign In"}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
              <button type="button" onClick={() => setIsSignUp(!isSignUp)} className="text-primary font-medium hover:underline">
                {isSignUp ? "Sign In" : "Sign Up"}
              </button>
            </p>
          </motion.form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;

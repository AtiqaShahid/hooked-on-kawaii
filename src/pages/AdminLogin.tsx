import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Mail, Eye, EyeOff, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { AUTH_REDIRECTS } from "@/lib/authRedirects";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isReset, setIsReset] = useState(false);
  const [checking, setChecking] = useState(true);

  // Check if already logged in as admin
  useEffect(() => {
    const checkExisting = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: roles } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id);
        if (roles?.some((r: any) => r.role === "admin")) {
          navigate("/admin/dashboard", { replace: true });
          return;
        }
      }
      setChecking(false);
    };
    checkExisting();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    if (password.length < 8) {
      toast({ title: "Password too short", description: "Minimum 8 characters required.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (error) throw error;

      const { data: roles, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.user.id);

      if (roleError) throw roleError;

      const isAdmin = roles?.some((r: any) => r.role === "admin");
      if (!isAdmin) {
        await supabase.auth.signOut();
        throw new Error("Access denied. Admin privileges required.");
      }

      toast({ title: "Welcome back! 🎉", description: "Logged in to admin dashboard." });
      navigate("/admin/dashboard", { replace: true });
    } catch (e: any) {
      toast({ title: "Login Failed", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: AUTH_REDIRECTS.resetPassword,
      });
      if (error) throw error;
      toast({ title: "Check your email", description: "Password reset link sent." });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="glass-panel rounded-3xl p-8 shadow-float">
          <div className="text-center mb-8">
            <img src="/logo.png" alt="Crochet World" width={48} height={48} className="w-12 h-12 mx-auto mb-3" />
            <h1 className="font-display text-2xl font-bold">Crochet World Admin</h1>
            <p className="text-muted-foreground text-sm mt-1">
              {isReset ? "Reset your password" : "Sign in to manage your store"}
            </p>
          </div>

          <form onSubmit={isReset ? handleReset : handleLogin} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                type="email"
                placeholder="admin@crochetworld.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 rounded-2xl h-12 border-border/50"
                required
              />
            </div>

            {!isReset && (
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 rounded-2xl h-12 border-border/50"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            )}

            <Button type="submit" disabled={loading} className="w-full rounded-2xl h-12 btn-squish">
              {loading ? <Loader2 className="animate-spin mr-2" size={18} /> : null}
              {isReset ? "Send Reset Link" : "Sign In"}
            </Button>
          </form>

          <button
            onClick={() => setIsReset(!isReset)}
            className="w-full text-center text-sm text-muted-foreground hover:text-foreground mt-4 transition-colors"
          >
            {isReset ? "Back to login" : "Forgot password?"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;

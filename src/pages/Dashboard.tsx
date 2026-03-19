import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { User, Heart, ShoppingBag, MessageSquare, ThumbsUp, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ votes: 0, posts: 0, orders: 0, wishlistCount: 0 });

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }
      setUser(session.user);

      const uid = session.user.id;

      // Fetch profile, stats in parallel
      const [profileRes, votesRes, postsRes, ordersRes, wishlistRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("user_id", uid).maybeSingle(),
        supabase.from("design_votes").select("id", { count: "exact", head: true }).eq("user_id", uid),
        supabase.from("community_posts").select("id", { count: "exact", head: true }).eq("user_id", uid),
        supabase.from("orders").select("id", { count: "exact", head: true }).eq("user_id", uid),
        supabase.from("wishlists").select("id", { count: "exact", head: true }).eq("user_id", uid),
      ]);

      setProfile(profileRes.data);
      setStats({
        votes: votesRes.count || 0,
        posts: postsRes.count || 0,
        orders: ordersRes.count || 0,
        wishlistCount: wishlistRes.count || 0,
      });
      setLoading(false);
    };
    load();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({ title: "Logged out", description: "See you soon! 💕" });
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-28 pb-20 flex items-center justify-center">
          <div className="animate-spin text-primary text-4xl">🧶</div>
        </div>
      </div>
    );
  }

  const statCards = [
    { icon: ThumbsUp, label: "Votes Made", value: stats.votes, color: "bg-lavender" },
    { icon: MessageSquare, label: "Community Posts", value: stats.posts, color: "bg-mint" },
    { icon: ShoppingBag, label: "Orders", value: stats.orders, color: "bg-peach" },
    { icon: Heart, label: "Wishlist Items", value: stats.wishlistCount, color: "bg-pink" },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-28 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/30 flex items-center justify-center">
                <User size={28} className="text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-display text-2xl font-bold">{profile?.display_name || "Crochet Lover"}</h1>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="rounded-2xl text-muted-foreground hover:text-destructive">
              <LogOut size={16} className="mr-1" /> Logout
            </Button>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {statCards.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="rounded-3xl bg-card shadow-soft p-5 text-center"
              >
                <div className={`w-10 h-10 rounded-2xl ${stat.color} flex items-center justify-center mx-auto mb-3`}>
                  <stat.icon size={18} />
                </div>
                <p className="font-display text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="rounded-3xl bg-card shadow-soft p-6">
            <h2 className="font-display text-lg font-semibold mb-4">⚡ Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "My Orders", path: "/orders", emoji: "📦" },
                { label: "Wishlist", path: "/shop", emoji: "💕" },
                { label: "Community", path: "/community", emoji: "💬" },
                { label: "Vote Designs", path: "/design-voting", emoji: "🗳️" },
              ].map(action => (
                <Button
                  key={action.path}
                  variant="outline"
                  className="rounded-2xl h-auto py-4 flex flex-col gap-1"
                  onClick={() => navigate(action.path)}
                >
                  <span className="text-2xl">{action.emoji}</span>
                  <span className="text-xs">{action.label}</span>
                </Button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;

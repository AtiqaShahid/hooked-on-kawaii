import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, MessageSquare, Users, Gift, Copy, Check } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useStoreSetting } from "@/hooks/useStoreSettings";
import { toast } from "@/hooks/use-toast";

const defaultTiers = [
  { name: "Yarn Starter", min: 0, max: 99, emoji: "🧶", perks: ["5% off next order"] },
  { name: "Stitch Lover", min: 100, max: 299, emoji: "💕", perks: ["10% off", "Free keychain"] },
  { name: "Crochet VIP", min: 300, max: 599, emoji: "✨", perks: ["15% off", "Free mystery item", "Early access to drops"] },
  { name: "Hook Master", min: 600, max: 999999, emoji: "👑", perks: ["20% off", "Free surprise box", "Early access", "Exclusive designs"] },
];

const Loyalty = () => {
  const [totalPoints, setTotalPoints] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [referralCopied, setReferralCopied] = useState(false);
  const [birthdayClaimed, setBirthdayClaimed] = useState(false);
  const { data: savedTiers } = useStoreSetting("loyalty_tiers");
  const navigate = useNavigate();

  const tiers = (savedTiers && Array.isArray(savedTiers) && savedTiers.length > 0)
    ? (savedTiers as typeof defaultTiers)
    : defaultTiers;

  useEffect(() => {
    const loadPoints = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }
      setIsLoggedIn(true);
      setUserId(user.id);
      const { data } = await supabase.from("loyalty_points").select("*").eq("user_id", user.id);
      if (data) {
        setTotalPoints(data.reduce((sum, r) => sum + r.points, 0));
        // Check if birthday bonus already claimed today
        const today = new Date().toISOString().split("T")[0];
        setBirthdayClaimed(data.some(r => r.reason === "birthday_bonus" && r.created_at.startsWith(today)));
      }
      setLoading(false);
    };
    loadPoints();

    const channel = supabase
      .channel("loyalty-updates")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "loyalty_points" }, (payload) => {
        supabase.auth.getUser().then(({ data: { user } }) => {
          if (user && (payload.new as any).user_id === user.id) {
            setTotalPoints(prev => prev + (payload.new as any).points);
          }
        });
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const handleReferral = async () => {
    if (!userId) { toast({ title: "Please log in", variant: "destructive" }); return; }
    const url = window.location.origin;
    await navigator.clipboard.writeText(url);
    setReferralCopied(true);
    
    // Check if already earned referral points today
    const today = new Date().toISOString().split("T")[0];
    const { data: existing } = await supabase.from("loyalty_points")
      .select("id").eq("user_id", userId).eq("reason", "referral").gte("created_at", today);
    
    if (!existing?.length) {
      await supabase.from("loyalty_points").insert({ user_id: userId, points: 25, reason: "referral" });
      toast({ title: "Referral link copied & +25 points added! 🎉" });
    } else {
      toast({ title: "Link copied!", description: "Referral points already earned today." });
    }
    setTimeout(() => setReferralCopied(false), 3000);
  };

  const handleBirthday = async () => {
    if (!userId) { toast({ title: "Please log in", variant: "destructive" }); return; }
    
    const { data: profile } = await supabase.from("profiles").select("birthday").eq("user_id", userId).maybeSingle();
    const today = new Date();
    const todayStr = `${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    
    if (!profile?.birthday) {
      toast({ title: "Set your birthday", description: "Go to Profile settings to add your birthday 🎂" });
      return;
    }
    
    const bday = new Date(profile.birthday);
    const bdayStr = `${String(bday.getMonth() + 1).padStart(2, "0")}-${String(bday.getDate()).padStart(2, "0")}`;
    
    if (todayStr !== bdayStr) {
      toast({ title: "🎂 Available on your birthday!", description: "Come back on your special day for +50 bonus points." });
      return;
    }
    
    if (birthdayClaimed) {
      toast({ title: "Already claimed!", description: "You've already got your birthday bonus today 🎉" });
      return;
    }

    await supabase.from("loyalty_points").insert({ user_id: userId, points: 50, reason: "birthday_bonus" });
    setBirthdayClaimed(true);
    toast({ title: "Happy Birthday! 🎂🎉", description: "+50 bonus points added!" });
  };

  const earnWays = [
    { action: "Make a purchase", points: "+1 per Rs. 100", icon: ShoppingBag, onClick: () => navigate("/shop") },
    { action: "Write a review", points: "+10 points", icon: MessageSquare, onClick: () => navigate("/shop") },
    { action: "Refer a friend", points: "+25 points", icon: Users, onClick: handleReferral },
    { action: "Birthday bonus", points: "+50 points", icon: Gift, onClick: handleBirthday },
  ];

  const currentTier = tiers.find(t => totalPoints >= t.min && totalPoints <= t.max) || tiers[0];
  const nextTier = tiers[tiers.indexOf(currentTier) + 1];
  const progressPct = nextTier
    ? Math.min(100, ((totalPoints - currentTier.min) / (nextTier.min - currentTier.min)) * 100)
    : 100;

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-28 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-3">⭐ Loyalty Rewards</h1>
            <p className="text-muted-foreground font-body max-w-lg mx-auto">Earn points with every purchase, review, and referral. Unlock exclusive perks!</p>
          </motion.div>

          <Card className="rounded-3xl border-border/50 mb-8">
            <CardContent className="p-8 text-center">
              <motion.span className="text-5xl block mb-3" animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                {currentTier.emoji}
              </motion.span>
              <h2 className="font-display text-2xl font-bold mb-1">{currentTier.name}</h2>
              {isLoggedIn ? (
                <>
                  <p className="text-3xl font-display font-bold text-primary mb-4">{totalPoints} points</p>
                  {nextTier && (
                    <>
                      <div className="w-full max-w-xs mx-auto h-3 rounded-full bg-muted overflow-hidden mb-2">
                        <motion.div className="h-full rounded-full bg-primary" initial={{ width: 0 }} animate={{ width: `${progressPct}%` }} transition={{ duration: 1, ease: "easeOut" }} />
                      </div>
                      <p className="text-sm text-muted-foreground">{nextTier.min - totalPoints} points to {nextTier.name} {nextTier.emoji}</p>
                    </>
                  )}
                  {!nextTier && <p className="text-sm text-muted-foreground">You've reached the highest tier! 🎉</p>}
                </>
              ) : (
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground mb-3">Login to track your loyalty points!</p>
                  <Link to="/login" className="inline-flex px-6 py-2.5 rounded-3xl bg-primary text-primary-foreground text-sm font-semibold btn-squish">Login</Link>
                </div>
              )}
            </CardContent>
          </Card>

          <h3 className="font-display text-xl font-bold mb-4 text-center">How to Earn Points</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {earnWays.map((w, i) => (
              <motion.div key={w.action} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Card
                  className="rounded-3xl border-border/50 card-hover text-center cursor-pointer"
                  onClick={w.onClick}
                >
                  <CardContent className="p-5">
                    <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-3">
                      {w.action === "Refer a friend" && referralCopied ? <Check size={22} className="text-green-600" /> : <w.icon size={22} />}
                    </div>
                    <p className="font-display font-semibold text-sm mb-1">{w.action}</p>
                    <p className="text-xs text-muted-foreground">{w.points}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <h3 className="font-display text-xl font-bold mb-4 text-center">Reward Tiers</h3>
          <div className="grid md:grid-cols-4 gap-4">
            {tiers.map((tier, i) => (
              <motion.div key={tier.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Card className={`rounded-3xl border-border/50 text-center ${currentTier.name === tier.name ? "ring-2 ring-primary" : ""}`}>
                  <CardContent className="p-5">
                    <span className="text-3xl block mb-2">{tier.emoji}</span>
                    <h4 className="font-display font-bold text-sm mb-1">{tier.name}</h4>
                    <p className="text-xs text-muted-foreground mb-3">{tier.min}+ pts</p>
                    <ul className="space-y-1">
                      {tier.perks.map(p => <li key={p} className="text-xs text-foreground/70">✓ {p}</li>)}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Loyalty;

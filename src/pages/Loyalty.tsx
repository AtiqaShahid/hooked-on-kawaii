import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, Gift, Award, ShoppingBag, MessageSquare, Users } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

const tiers = [
  { name: "Yarn Starter", min: 0, max: 99, emoji: "🧶", perks: ["5% off next order"] },
  { name: "Stitch Lover", min: 100, max: 299, emoji: "💕", perks: ["10% off", "Free keychain"] },
  { name: "Crochet VIP", min: 300, max: 599, emoji: "✨", perks: ["15% off", "Free mystery item", "Early access to drops"] },
  { name: "Hook Master", min: 600, max: Infinity, emoji: "👑", perks: ["20% off", "Free surprise box", "Early access", "Exclusive designs"] },
];

const earnWays = [
  { action: "Make a purchase", points: "1 point per Rs. 100", icon: ShoppingBag },
  { action: "Write a review", points: "+10 points", icon: MessageSquare },
  { action: "Refer a friend", points: "+25 points", icon: Users },
  { action: "Birthday bonus", points: "+50 points", icon: Gift },
];

const Loyalty = () => {
  const [totalPoints, setTotalPoints] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setIsLoggedIn(true);
      const { data } = await supabase.from("loyalty_points").select("points").eq("user_id", user.id);
      if (data) setTotalPoints(data.reduce((s, r) => s + r.points, 0));
    };
    fetch();
  }, []);

  const currentTier = tiers.find(t => totalPoints >= t.min && totalPoints <= t.max) || tiers[0];
  const nextTier = tiers[tiers.indexOf(currentTier) + 1];

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-28 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-3">⭐ Loyalty Rewards</h1>
            <p className="text-muted-foreground font-body max-w-lg mx-auto">Earn points with every purchase, review, and referral. Unlock exclusive perks!</p>
          </motion.div>

          {/* Current status */}
          <Card className="rounded-3xl border-border/50 mb-8">
            <CardContent className="p-8 text-center">
              <motion.span className="text-5xl block mb-3" animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                {currentTier.emoji}
              </motion.span>
              <h2 className="font-display text-2xl font-bold mb-1">{currentTier.name}</h2>
              <p className="text-3xl font-display font-bold text-primary mb-4">{totalPoints} points</p>
              {nextTier && (
                <>
                  <div className="w-full max-w-xs mx-auto h-3 rounded-full bg-muted overflow-hidden mb-2">
                    <motion.div className="h-full rounded-full bg-primary" initial={{ width: 0 }} animate={{ width: `${((totalPoints - currentTier.min) / (nextTier.min - currentTier.min)) * 100}%` }} />
                  </div>
                  <p className="text-sm text-muted-foreground">{nextTier.min - totalPoints} points to {nextTier.name} {nextTier.emoji}</p>
                </>
              )}
              {!isLoggedIn && <p className="mt-4 text-sm text-muted-foreground">Log in to track your loyalty points!</p>}
            </CardContent>
          </Card>

          {/* How to earn */}
          <h3 className="font-display text-xl font-bold mb-4 text-center">How to Earn Points</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {earnWays.map((w, i) => (
              <motion.div key={w.action} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Card className="rounded-3xl border-border/50 card-hover text-center">
                  <CardContent className="p-5">
                    <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-3">
                      <w.icon size={22} />
                    </div>
                    <p className="font-display font-semibold text-sm mb-1">{w.action}</p>
                    <p className="text-xs text-muted-foreground">{w.points}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Tiers */}
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
                      {tier.perks.map(p => (
                        <li key={p} className="text-xs text-foreground/70">✓ {p}</li>
                      ))}
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

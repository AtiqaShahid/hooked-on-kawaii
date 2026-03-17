import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

type Collection = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  is_limited: boolean | null;
  available_count: number | null;
  total_count: number | null;
  ends_at: string | null;
};

const CountdownTimer = ({ endsAt }: { endsAt: string }) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const update = () => {
      const diff = new Date(endsAt).getTime() - Date.now();
      if (diff <= 0) { setTimeLeft("Ended"); return; }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      setTimeLeft(`${d}d ${h}h ${m}m`);
    };
    update();
    const t = setInterval(update, 60000);
    return () => clearInterval(t);
  }, [endsAt]);

  return (
    <span className="flex items-center gap-1.5 text-sm font-medium text-foreground">
      <Clock size={14} /> {timeLeft} left
    </span>
  );
};

const Collections = () => {
  const [collections, setCollections] = useState<Collection[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("collections").select("*").order("created_at", { ascending: false });
      if (data) setCollections(data);
    };
    fetch();
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-28 pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-3">💎 Curated Collections</h1>
            <p className="text-muted-foreground font-body max-w-lg mx-auto">Hand-picked themed collections of our finest crochet pieces</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {collections.map((col, i) => (
              <motion.div key={col.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Card className="rounded-3xl border-border/50 card-hover overflow-hidden">
                  <div className="aspect-video bg-gradient-hero flex items-center justify-center">
                    <span className="text-6xl">
                      {col.is_limited ? "🌙" : col.name.includes("Animal") ? "🧸" : col.name.includes("Wedding") ? "💒" : "🌸"}
                    </span>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-display text-xl font-bold">{col.name}</h3>
                      {col.is_limited && <Badge className="rounded-full bg-destructive/10 text-destructive">Limited</Badge>}
                    </div>
                    {col.description && <p className="text-muted-foreground text-sm mb-3">{col.description}</p>}
                    <div className="flex items-center justify-between">
                      {col.is_limited && col.available_count !== null && col.total_count !== null && (
                        <div>
                          <div className="w-32 h-2 rounded-full bg-muted overflow-hidden mb-1">
                            <div className="h-full rounded-full bg-primary" style={{ width: `${(col.available_count / col.total_count) * 100}%` }} />
                          </div>
                          <p className="text-xs text-muted-foreground">{col.available_count} of {col.total_count} left</p>
                        </div>
                      )}
                      {col.ends_at && <CountdownTimer endsAt={col.ends_at} />}
                    </div>
                    <Link to={`/shop`} className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium hover:text-primary transition-colors">
                      <Sparkles size={14} /> Shop Collection →
                    </Link>
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

export default Collections;

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BookOpen, Download, Star } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

type Resource = {
  id: string;
  title: string;
  content: string;
  category: string;
  difficulty: string;
  image_url: string | null;
  download_url: string | null;
};

const difficultyColors: Record<string, string> = {
  beginner: "bg-accent/30 text-accent-foreground",
  intermediate: "bg-secondary/50 text-secondary-foreground",
  advanced: "bg-primary/50 text-primary-foreground",
};

const categoryEmojis: Record<string, string> = {
  tutorial: "📖",
  pattern: "🧶",
  tip: "💡",
};

const Learning = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("learning_resources").select("*").order("created_at", { ascending: false });
      if (data) setResources(data);
    };
    fetch();
  }, []);

  const filtered = filter === "all" ? resources : resources.filter(r => r.category === filter);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-28 pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-3">📚 Learn Crochet</h1>
            <p className="text-muted-foreground font-body max-w-lg mx-auto">Tutorials, patterns, and tips to level up your crochet skills</p>
          </motion.div>

          <div className="flex gap-2 justify-center mb-8 flex-wrap">
            {["all", "tutorial", "pattern", "tip"].map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-5 py-2.5 rounded-3xl text-sm font-semibold font-body transition-all btn-squish ${
                  filter === cat ? "bg-primary text-primary-foreground shadow-glow" : "bg-card text-foreground/60 shadow-soft"
                }`}
              >
                {cat === "all" ? "All ✨" : `${categoryEmojis[cat] || ""} ${cat.charAt(0).toUpperCase() + cat.slice(1)}s`}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {filtered.map((r, i) => (
              <motion.div key={r.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card className="rounded-3xl border-border/50 card-hover h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-3xl">{categoryEmojis[r.category] || "📄"}</span>
                      <Badge className={`rounded-full ${difficultyColors[r.difficulty] || ""}`}>{r.difficulty}</Badge>
                    </div>
                    <h3 className="font-display text-lg font-bold mb-2">{r.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">{r.content}</p>
                    {r.download_url && (
                      <a href={r.download_url} className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground hover:text-primary transition-colors">
                        <Download size={14} /> Download Pattern
                      </a>
                    )}
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

export default Learning;

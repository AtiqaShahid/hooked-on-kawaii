import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, Heart } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";

type Story = {
  id: string;
  title: string;
  slug: string;
  content: string;
  image_url: string | null;
  time_to_make: string | null;
  created_at: string;
};

const CraftStories = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from("craft_stories").select("*").order("created_at", { ascending: false });
      if (data) setStories(data);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-28 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-3">✨ Story Behind the Stitch</h1>
            <p className="text-muted-foreground font-body max-w-lg mx-auto">Every piece has a story. Discover the inspiration, process, and love behind our handmade creations.</p>
          </motion.div>

          <div className="space-y-8">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="rounded-3xl border border-border/50 overflow-hidden">
                  <Skeleton className="aspect-video w-full" />
                  <div className="p-8 space-y-3">
                    <Skeleton className="h-6 w-2/3" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                    <Skeleton className="h-4 w-1/3" />
                  </div>
                </div>
              ))
            ) : stories.length === 0 ? (
              <div className="text-center py-20">
                <span className="text-5xl block mb-4">📖</span>
                <p className="font-display text-lg font-semibold mb-2">No stories yet</p>
                <p className="text-muted-foreground text-sm">Check back soon for behind-the-stitch stories!</p>
              </div>
            ) : (
              stories.map((story, i) => (
                <motion.div key={story.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                  <Card className="rounded-3xl border-border/50 overflow-hidden card-hover">
                    {story.image_url && (
                      <div className="aspect-video bg-muted">
                        <img src={story.image_url} alt={story.title} className="w-full h-full object-cover" loading="lazy" />
                      </div>
                    )}
                    <CardContent className="p-8">
                      <h2 className="font-display text-2xl font-bold mb-3">{story.title}</h2>
                      <p className="text-foreground/70 font-body leading-relaxed mb-4">{story.content}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {story.time_to_make && (
                          <span className="flex items-center gap-1.5"><Clock size={14} /> {story.time_to_make} to make</span>
                        )}
                        <span className="flex items-center gap-1.5"><Heart size={14} /> Made with love</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CraftStories;

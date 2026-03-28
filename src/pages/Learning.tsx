import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BookOpen, Download, ExternalLink, Play, Image as ImageIcon, X } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";

type Resource = {
  id: string;
  title: string;
  content: string;
  category: string;
  difficulty: string;
  image_url: string | null;
  download_url: string | null;
  type: string | null;
  external_url: string | null;
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

const getYouTubeId = (url: string): string | null => {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
};

const Learning = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [filter, setFilter] = useState("all");
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);

  useEffect(() => {
    const fetchResources = async () => {
      const { data } = await supabase.from("learning_resources").select("*").order("created_at", { ascending: false });
      if (data) setResources(data as Resource[]);
    };
    fetchResources();
  }, []);

  const filtered = filter === "all" ? resources : resources.filter(r => r.category === filter);

  const handleCardClick = (r: Resource) => {
    const type = r.type || "link";
    if (type === "link" && r.external_url) {
      const ytId = getYouTubeId(r.external_url);
      if (ytId) {
        setSelectedResource(r);
      } else {
        window.open(r.external_url, "_blank");
      }
    } else if (type === "video" || type === "image") {
      setSelectedResource(r);
    } else if (r.download_url) {
      window.open(r.download_url, "_blank");
    }
  };

  const getThumbnail = (r: Resource): string | null => {
    if (r.image_url) return r.image_url;
    if (r.type === "link" && r.external_url) {
      const ytId = getYouTubeId(r.external_url);
      if (ytId) return `https://img.youtube.com/vi/${ytId}/mqdefault.jpg`;
    }
    return null;
  };

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
            {filtered.map((r, i) => {
              const thumb = getThumbnail(r);
              const type = r.type || "link";
              return (
                <motion.div key={r.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Card
                    className="rounded-3xl border-border/50 card-hover h-full cursor-pointer group overflow-hidden"
                    onClick={() => handleCardClick(r)}
                  >
                    {thumb && (
                      <div className="relative w-full aspect-video overflow-hidden bg-muted">
                        <img src={thumb} alt={r.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        {(type === "video" || (type === "link" && r.external_url && getYouTubeId(r.external_url))) && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                            <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center shadow-lg">
                              <Play size={24} className="text-primary-foreground ml-1" />
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{categoryEmojis[r.category] || "📄"}</span>
                          {type === "video" && <Play size={14} className="text-primary" />}
                          {type === "image" && <ImageIcon size={14} className="text-accent-foreground" />}
                          {type === "link" && <ExternalLink size={14} className="text-muted-foreground" />}
                        </div>
                        <Badge className={`rounded-full ${difficultyColors[r.difficulty] || ""}`}>{r.difficulty}</Badge>
                      </div>
                      <h3 className="font-display text-lg font-bold mb-2">{r.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">{r.content}</p>
                      <div className="mt-3 flex items-center gap-2 text-sm font-medium text-primary">
                        {type === "link" && <><ExternalLink size={14} /> View Tutorial</>}
                        {type === "video" && <><Play size={14} /> Watch Video</>}
                        {type === "image" && <><ImageIcon size={14} /> View Image</>}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              <BookOpen size={48} className="mx-auto mb-4 opacity-40" />
              <p className="font-display text-lg">No resources found</p>
            </div>
          )}
        </div>
      </div>

      {/* Media Modal */}
      <Dialog open={!!selectedResource} onOpenChange={() => setSelectedResource(null)}>
        <DialogContent className="max-w-3xl rounded-2xl p-0 overflow-hidden">
          {selectedResource && (() => {
            const type = selectedResource.type || "link";
            const ytId = selectedResource.external_url ? getYouTubeId(selectedResource.external_url) : null;

            if (type === "link" && ytId) {
              return (
                <div className="w-full aspect-video">
                  <iframe
                    src={`https://www.youtube.com/embed/${ytId}?autoplay=1`}
                    className="w-full h-full"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                    title={selectedResource.title}
                  />
                </div>
              );
            }
            if (type === "video" && selectedResource.download_url) {
              return (
                <div className="w-full aspect-video bg-black">
                  <video src={selectedResource.download_url} controls autoPlay className="w-full h-full" />
                </div>
              );
            }
            if (type === "image" && selectedResource.download_url) {
              return (
                <div className="p-4">
                  <img src={selectedResource.download_url} alt={selectedResource.title} className="w-full rounded-xl" />
                </div>
              );
            }
            return null;
          })()}
          {selectedResource && (
            <div className="p-5">
              <h2 className="font-display text-xl font-bold">{selectedResource.title}</h2>
              <p className="text-muted-foreground text-sm mt-2">{selectedResource.content}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Learning;

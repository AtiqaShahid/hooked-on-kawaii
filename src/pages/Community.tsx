import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, MessageCircle, Plus, Send } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

type Post = {
  id: string;
  title: string;
  content: string | null;
  image_url: string | null;
  likes_count: number;
  created_at: string;
};

const Community = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await supabase
        .from("community_posts")
        .select("*")
        .order("created_at", { ascending: false });
      if (data) setPosts(data);
    };
    fetchPosts();
  }, []);

  const submitPost = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({ title: "Please log in", description: "You need to be logged in to post.", variant: "destructive" });
      return;
    }
    const { error } = await supabase.from("community_posts").insert({
      user_id: user.id,
      title,
      content,
      is_approved: false,
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Posted! 🎉", description: "Your post will appear after approval." });
      setTitle("");
      setContent("");
      setShowForm(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-28 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-3">🧶 Crochet Community</h1>
            <p className="text-muted-foreground font-body max-w-md mx-auto">Share your creations, get inspired, and connect with fellow crochet lovers</p>
          </motion.div>

          <div className="flex justify-center mb-8">
            <Button onClick={() => setShowForm(!showForm)} className="rounded-2xl btn-squish">
              <Plus size={18} /> Share Your Creation
            </Button>
          </div>

          {showForm && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
              <Card className="rounded-3xl border-border/50 mb-8">
                <CardContent className="p-6 space-y-4">
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Title your creation..."
                    className="w-full p-3 rounded-2xl bg-muted/30 border border-border/50 text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Tell us about your crochet creation..."
                    rows={4}
                    className="w-full p-3 rounded-2xl bg-muted/30 border border-border/50 text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  />
                  <Button onClick={submitPost} disabled={!title} className="rounded-2xl btn-squish">
                    <Send size={16} /> Submit
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {posts.length === 0 ? (
            <div className="text-center py-20">
              <span className="text-5xl block mb-4">💬</span>
              <p className="font-display text-lg font-semibold mb-2">No posts yet</p>
              <p className="text-muted-foreground text-sm">Be the first to share your creation!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post, i) => (
                <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Card className="rounded-3xl border-border/50 card-hover">
                    <CardContent className="p-6">
                      <h3 className="font-display font-semibold text-lg mb-2">{post.title}</h3>
                      {post.content && <p className="text-muted-foreground text-sm mb-3">{post.content}</p>}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><Heart size={14} /> {post.likes_count}</span>
                        <span>{new Date(post.created_at).toLocaleDateString()}</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Community;

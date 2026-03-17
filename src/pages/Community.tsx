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
  comments_count?: number;
  author_name?: string;
  author_avatar?: string;
  created_at: string;
  is_mock?: boolean;
};

const MOCK_POSTS: Post[] = [
  {
    id: "mock-1",
    title: "Sarah M.",
    content: "Just finished my first sunflower bouquet from HookOnLoop inspiration! So proud of how it turned out 🧶",
    image_url: "/products/sunflower-bouquet.jpg",
    likes_count: 48,
    comments_count: 12,
    author_name: "Sarah M.",
    author_avatar: "🧶",
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    is_mock: true,
  },
  {
    id: "mock-2",
    title: "Amina K.",
    content: "My mini daisy pot collection is growing! These little cuties brighten up my whole desk 🌼💛",
    image_url: "/products/mini-daisy-pot.webp",
    likes_count: 35,
    comments_count: 8,
    author_name: "Amina K.",
    author_avatar: "💕",
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    is_mock: true,
  },
  {
    id: "mock-3",
    title: "Fatima H.",
    content: "Ordered the rose gajra for my sister's mehndi and everyone kept asking where it's from! Absolute showstopper 🌹✨",
    image_url: "/products/rose-gajra.webp",
    likes_count: 72,
    comments_count: 19,
    author_name: "Fatima H.",
    author_avatar: "🌸",
    created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    is_mock: true,
  },
  {
    id: "mock-4",
    title: "Noor A.",
    content: "The teddy bear stuffie is the softest thing ever! My daughter won't let go of it 🧸💗",
    image_url: "/products/teddy-bear.webp",
    likes_count: 56,
    comments_count: 14,
    author_name: "Noor A.",
    author_avatar: "🎀",
    created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    is_mock: true,
  },
  {
    id: "mock-5",
    title: "Hira Z.",
    content: "Made a custom tulip pot as a housewarming gift using ideas from HookOnLoop. The colors came out perfect! 🌷",
    image_url: "/products/tulip-pot.webp",
    likes_count: 41,
    comments_count: 6,
    author_name: "Hira Z.",
    author_avatar: "🪻",
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    is_mock: true,
  },
  {
    id: "mock-6",
    title: "Maryam S.",
    content: "This honey bee keychain is TOO adorable 🐝 Attached it to my bag and getting so many compliments!",
    image_url: "/products/honey-bee.webp",
    likes_count: 63,
    comments_count: 11,
    author_name: "Maryam S.",
    author_avatar: "🐝",
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    is_mock: true,
  },
];

const timeAgo = (date: string) => {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  return `${Math.floor(seconds / 86400)} days ago`;
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
      
      const dbPosts: Post[] = (data || []).map((p: any) => ({
        ...p,
        author_name: p.title,
        author_avatar: "🧶",
        comments_count: 0,
      }));

      // Show mock data if no real posts exist
      if (dbPosts.length === 0) {
        setPosts(MOCK_POSTS);
      } else {
        setPosts(dbPosts);
      }
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
        <div className="max-w-2xl mx-auto">
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
                    placeholder="Your name..."
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

          <div className="space-y-6">
            {posts.map((post, i) => (
              <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card className="rounded-3xl border-border/50 overflow-hidden card-hover">
                  <CardContent className="p-0">
                    {/* Author header */}
                    <div className="flex items-center gap-3 px-5 pt-5 pb-3">
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-lg shrink-0">
                        {post.author_avatar || "🧶"}
                      </div>
                      <div>
                        <p className="font-display font-semibold text-sm">{post.author_name || post.title}</p>
                        <p className="text-xs text-muted-foreground">{timeAgo(post.created_at)}</p>
                      </div>
                    </div>

                    {/* Content */}
                    {post.content && (
                      <p className="text-sm font-body text-foreground/90 px-5 pb-3 leading-relaxed">{post.content}</p>
                    )}

                    {/* Image */}
                    {post.image_url && (
                      <div className="w-full">
                        <img
                          src={post.image_url}
                          alt={post.title}
                          className="w-full max-h-[420px] object-cover"
                          loading="lazy"
                        />
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-6 px-5 py-4 text-sm text-muted-foreground">
                      <button className="flex items-center gap-1.5 hover:text-red-400 transition-colors">
                        <Heart size={18} /> {post.likes_count}
                      </button>
                      <button className="flex items-center gap-1.5 hover:text-primary transition-colors">
                        <MessageCircle size={18} /> {post.comments_count || 0}
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            {posts.length === 0 && (
              <div className="text-center py-20">
                <span className="text-5xl block mb-4">💬</span>
                <p className="font-display text-lg font-semibold mb-2">No posts yet</p>
                <p className="text-muted-foreground text-sm">Be the first to share your creation!</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Community;

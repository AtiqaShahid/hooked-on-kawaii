import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, Plus, Send, ChevronDown, ChevronUp } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

type Comment = {
  id: string;
  content: string;
  created_at: string;
  author_name?: string;
  author_avatar?: string;
  is_mock?: boolean;
};

type Post = {
  id: string;
  title: string;
  content: string | null;
  image_url: string | null;
  likes_count: number;
  comments: Comment[];
  author_name?: string;
  author_avatar?: string;
  created_at: string;
  is_mock?: boolean;
  user_id?: string;
};

const MOCK_COMMENTS: Record<string, Comment[]> = {
  "mock-1": [
    { id: "mc1", content: "This is gorgeous! The petals look so real 😍", created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), author_name: "Hira Z.", author_avatar: "🪻", is_mock: true },
    { id: "mc2", content: "How long did it take you? I want to try!", created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(), author_name: "Noor A.", author_avatar: "🎀", is_mock: true },
  ],
  "mock-2": [
    { id: "mc3", content: "The cutest desk accessory ever! 🌼", created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), author_name: "Maryam S.", author_avatar: "🐝", is_mock: true },
  ],
  "mock-3": [
    { id: "mc4", content: "Ordering one for my cousin's wedding now!!", created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), author_name: "Sarah M.", author_avatar: "🧶", is_mock: true },
    { id: "mc5", content: "The colors are stunning mashallah 💕", created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), author_name: "Iqra L.", author_avatar: "🌺", is_mock: true },
    { id: "mc6", content: "Can this be done in white and gold?", created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), author_name: "Amina K.", author_avatar: "💕", is_mock: true },
  ],
  "mock-4": [
    { id: "mc7", content: "My kids would love this! So soft looking 🧸", created_at: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(), author_name: "Fatima H.", author_avatar: "🌸", is_mock: true },
  ],
};

const MOCK_POSTS: Post[] = [
  {
    id: "mock-1", title: "Sarah M.",
    content: "Just finished my first sunflower bouquet from Crochet World inspiration! So proud of how it turned out 🧶",
    image_url: "/products/sunflower-bouquet.jpg", likes_count: 48, comments: MOCK_COMMENTS["mock-1"],
    author_name: "Sarah M.", author_avatar: "🧶",
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), is_mock: true,
  },
  {
    id: "mock-2", title: "Amina K.",
    content: "My mini daisy pot collection is growing! These little cuties brighten up my whole desk 🌼💛",
    image_url: "/products/mini-daisy-pot.webp", likes_count: 35, comments: MOCK_COMMENTS["mock-2"],
    author_name: "Amina K.", author_avatar: "💕",
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), is_mock: true,
  },
  {
    id: "mock-3", title: "Fatima H.",
    content: "Ordered the rose gajra for my sister's mehndi and everyone kept asking where it's from! Absolute showstopper 🌹✨",
    image_url: "/products/rose-gajra.webp", likes_count: 72, comments: MOCK_COMMENTS["mock-3"],
    author_name: "Fatima H.", author_avatar: "🌸",
    created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), is_mock: true,
  },
  {
    id: "mock-4", title: "Noor A.",
    content: "The teddy bear stuffie is the softest thing ever! My daughter won't let go of it 🧸💗",
    image_url: "/products/teddy-bear.webp", likes_count: 56, comments: MOCK_COMMENTS["mock-4"],
    author_name: "Noor A.", author_avatar: "🎀",
    created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), is_mock: true,
  },
  {
    id: "mock-5", title: "Hira Z.",
    content: "Made a custom tulip pot as a housewarming gift using ideas from Crochet World. The colors came out perfect! 🌷",
    image_url: "/products/tulip-pot.webp", likes_count: 41, comments: [],
    author_name: "Hira Z.", author_avatar: "🪻",
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), is_mock: true,
  },
  {
    id: "mock-6", title: "Maryam S.",
    content: "This honey bee keychain is TOO adorable 🐝 Attached it to my bag and getting so many compliments!",
    image_url: "/products/honey-bee.webp", likes_count: 63, comments: [],
    author_name: "Maryam S.", author_avatar: "🐝",
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), is_mock: true,
  },
];

const timeAgo = (date: string) => {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  return `${Math.floor(seconds / 86400)} days ago`;
};

const PostCard = ({ post: initialPost, index }: { post: Post; index: number }) => {
  const [post, setPost] = useState(initialPost);
  const [liked, setLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleLike = async () => {
    if (post.is_mock) {
      setLiked(!liked);
      setPost(p => ({ ...p, likes_count: liked ? p.likes_count - 1 : p.likes_count + 1 }));
      return;
    }
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({ title: "Please log in", description: "You need to be logged in to like.", variant: "destructive" });
      return;
    }
    const newCount = liked ? post.likes_count - 1 : post.likes_count + 1;
    setLiked(!liked);
    setPost(p => ({ ...p, likes_count: newCount }));
    await supabase.from("community_posts").update({ likes_count: newCount }).eq("id", post.id);
  };

  const handleComment = async () => {
    if (!commentText.trim()) return;

    if (post.is_mock) {
      const newComment: Comment = {
        id: `local-${Date.now()}`,
        content: commentText,
        created_at: new Date().toISOString(),
        author_name: "You",
        author_avatar: "😊",
        is_mock: true,
      };
      setPost(p => ({ ...p, comments: [...p.comments, newComment] }));
      setCommentText("");
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({ title: "Please log in", description: "You need to be logged in to comment.", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    const { data, error } = await supabase.from("community_comments").insert({
      post_id: post.id,
      user_id: user.id,
      content: commentText,
    }).select("*").single();

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else if (data) {
      const newComment: Comment = {
        id: data.id,
        content: data.content,
        created_at: data.created_at,
        author_name: "You",
        author_avatar: "😊",
      };
      setPost(p => ({ ...p, comments: [...p.comments, newComment] }));
      setCommentText("");
    }
    setSubmitting(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
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
              <img src={post.image_url} alt={post.title} className="w-full max-h-[420px] object-cover" loading="lazy" />
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-6 px-5 py-3 text-sm text-muted-foreground">
            <button onClick={handleLike} className={`flex items-center gap-1.5 transition-colors ${liked ? "text-red-500" : "hover:text-red-400"}`}>
              <Heart size={18} fill={liked ? "currentColor" : "none"} /> {post.likes_count}
            </button>
            <button onClick={() => setShowComments(!showComments)} className="flex items-center gap-1.5 hover:text-primary transition-colors">
              <MessageCircle size={18} /> {post.comments.length}
              {post.comments.length > 0 && (showComments ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
            </button>
          </div>

          {/* Comments section */}
          <AnimatePresence>
            {showComments && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <div className="border-t border-border/30 px-5 py-3 space-y-3">
                  {/* Existing comments */}
                  {post.comments.map((c) => (
                    <div key={c.id} className="flex gap-2.5">
                      <div className="h-7 w-7 rounded-full bg-muted/60 flex items-center justify-center text-xs shrink-0">
                        {c.author_avatar || "🧶"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="bg-muted/30 rounded-2xl px-3 py-2">
                          <p className="font-display font-semibold text-xs">{c.author_name || "User"}</p>
                          <p className="text-xs text-foreground/80 mt-0.5">{c.content}</p>
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-1 ml-3">{timeAgo(c.created_at)}</p>
                      </div>
                    </div>
                  ))}

                  {/* Comment input */}
                  <div className="flex gap-2 pt-1">
                    <div className="h-7 w-7 rounded-full bg-muted/60 flex items-center justify-center text-xs shrink-0">😊</div>
                    <div className="flex-1 flex gap-2">
                      <input
                        type="text"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleComment()}
                        placeholder="Write a comment..."
                        className="flex-1 px-3 py-1.5 rounded-2xl bg-muted/30 border border-border/40 text-xs font-body focus:outline-none focus:ring-2 focus:ring-primary/40"
                      />
                      <Button size="sm" onClick={handleComment} disabled={!commentText.trim() || submitting} className="rounded-xl h-7 px-2.5">
                        <Send size={12} />
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
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

      if (!data?.length) {
        setPosts(MOCK_POSTS);
        return;
      }

      // Fetch comments for real posts
      const postIds = data.map((p: any) => p.id);
      const { data: comments } = await supabase
        .from("community_comments")
        .select("*, profile:profiles(display_name)")
        .in("post_id", postIds)
        .order("created_at", { ascending: true });

      const commentsByPost: Record<string, Comment[]> = {};
      (comments || []).forEach((c: any) => {
        if (!commentsByPost[c.post_id]) commentsByPost[c.post_id] = [];
        commentsByPost[c.post_id].push({
          id: c.id,
          content: c.content,
          created_at: c.created_at,
          author_name: c.profile?.display_name || "User",
          author_avatar: "🧶",
        });
      });

      const dbPosts: Post[] = data.map((p: any) => ({
        ...p,
        author_name: p.title,
        author_avatar: "🧶",
        comments: commentsByPost[p.id] || [],
      }));

      setPosts(dbPosts);
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
      user_id: user.id, title, content, is_approved: false,
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Posted! 🎉", description: "Your post will appear after approval." });
      setTitle(""); setContent(""); setShowForm(false);
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
                  <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Your name..."
                    className="w-full p-3 rounded-2xl bg-muted/30 border border-border/50 text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Tell us about your crochet creation..." rows={4}
                    className="w-full p-3 rounded-2xl bg-muted/30 border border-border/50 text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
                  <Button onClick={submitPost} disabled={!title} className="rounded-2xl btn-squish">
                    <Send size={16} /> Submit
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          <div className="space-y-6">
            {posts.map((post, i) => (
              <PostCard key={post.id} post={post} index={i} />
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

import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { User, Heart, ShoppingBag, MessageSquare, ThumbsUp, LogOut, Package, Star, Award, Palette, Settings, Edit2, Camera, BookOpen, Plus, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "overview";
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ display_name: "", avatar_url: "" });
  const queryClient = useQueryClient();

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate("/login"); return; }
      setUser(session.user);
      const { data: p } = await supabase.from("profiles").select("*").eq("user_id", session.user.id).maybeSingle();
      setProfile(p);
      setProfileForm({ display_name: p?.display_name || "", avatar_url: p?.avatar_url || "" });
      setLoading(false);
    };
    load();
  }, [navigate]);

  const uid = user?.id;

  // Orders
  const { data: orders = [] } = useQuery({
    queryKey: ["my-orders", uid],
    queryFn: async () => {
      if (!uid) return [];
      const { data } = await supabase.from("orders").select("*, order_items(*, products(name, image_url))").eq("user_id", uid).order("created_at", { ascending: false });
      return data || [];
    },
    enabled: !!uid,
  });

  // Wishlist
  const { data: wishlistItems = [] } = useQuery({
    queryKey: ["my-wishlist-db", uid],
    queryFn: async () => {
      if (!uid) return [];
      const { data } = await supabase.from("wishlists").select("*, products(name, image_url, price, slug)").eq("user_id", uid);
      return data || [];
    },
    enabled: !!uid,
  });

  // Community posts
  const { data: myPosts = [] } = useQuery({
    queryKey: ["my-posts", uid],
    queryFn: async () => {
      if (!uid) return [];
      const { data } = await supabase.from("community_posts").select("*").eq("user_id", uid).order("created_at", { ascending: false });
      return data || [];
    },
    enabled: !!uid,
  });

  // Design votes
  const { data: myVotes = [] } = useQuery({
    queryKey: ["my-votes", uid],
    queryFn: async () => {
      if (!uid) return [];
      const { data } = await supabase.from("design_votes").select("*, design_requests(title, image_url, status, votes_count)").eq("user_id", uid);
      return data || [];
    },
    enabled: !!uid,
  });

  // Reviews
  const { data: myReviews = [] } = useQuery({
    queryKey: ["my-reviews", uid],
    queryFn: async () => {
      if (!uid) return [];
      const { data } = await supabase.from("reviews").select("*, products(name, image_url)").eq("user_id", uid).order("created_at", { ascending: false });
      return data || [];
    },
    enabled: !!uid,
  });

  // Loyalty points
  const { data: loyaltyData = [] } = useQuery({
    queryKey: ["my-loyalty", uid],
    queryFn: async () => {
      if (!uid) return [];
      const { data } = await supabase.from("loyalty_points").select("*").eq("user_id", uid).order("created_at", { ascending: false });
      return data || [];
    },
    enabled: !!uid,
  });

  // Custom orders
  const { data: customOrders = [] } = useQuery({
    queryKey: ["my-custom-orders", uid],
    queryFn: async () => {
      if (!uid) return [];
      const { data } = await supabase.from("custom_crochet_orders").select("*").eq("user_id", uid).order("created_at", { ascending: false });
      return data || [];
    },
    enabled: !!uid,
  });

  // Craft stories
  const { data: myStories = [] } = useQuery({
    queryKey: ["my-stories", uid],
    queryFn: async () => {
      if (!uid) return [];
      const { data } = await supabase.from("craft_stories").select("*").eq("user_id", uid).order("created_at", { ascending: false });
      return data || [];
    },
    enabled: !!uid,
  });

  const [storyForm, setStoryForm] = useState({ title: "", content: "", image_url: "" });
  const [showStoryForm, setShowStoryForm] = useState(false);

  const totalPoints = loyaltyData.reduce((sum: number, p: any) => sum + (p.points || 0), 0);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({ title: "Logged out", description: "See you soon! 💕" });
    navigate("/");
  };

  const handleProfileSave = async () => {
    if (!uid) return;
    const { error } = await supabase.from("profiles").update({
      display_name: profileForm.display_name,
      avatar_url: profileForm.avatar_url,
    }).eq("user_id", uid);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setProfile({ ...profile, ...profileForm });
      setEditingProfile(false);
      toast({ title: "Profile updated! ✨" });
    }
  };

  const handleDeletePost = async (postId: string) => {
    const { error } = await supabase.from("community_posts").delete().eq("id", postId);
    if (!error) {
      queryClient.invalidateQueries({ queryKey: ["my-posts"] });
      toast({ title: "Post deleted 🗑️" });
    }
  };

  const handleRemoveWishlist = async (id: string) => {
    const { error } = await supabase.from("wishlists").delete().eq("id", id);
    if (!error) {
      queryClient.invalidateQueries({ queryKey: ["my-wishlist-db"] });
      toast({ title: "Removed from wishlist" });
    }
  };

  const setTab = (tab: string) => setSearchParams({ tab });

  if (loading) {
    return (
      <div className="min-h-screen"><Navbar />
        <div className="pt-28 pb-20 flex items-center justify-center">
          <div className="animate-spin text-4xl">🧶</div>
        </div>
      </div>
    );
  }

  const statusColor = (s: string) => {
    const map: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800", confirmed: "bg-blue-100 text-blue-800",
      processing: "bg-purple-100 text-purple-800", shipped: "bg-indigo-100 text-indigo-800",
      delivered: "bg-green-100 text-green-800", cancelled: "bg-red-100 text-red-800",
    };
    return map[s] || "bg-muted text-muted-foreground";
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-28 pb-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/30 flex items-center justify-center overflow-hidden">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <User size={28} className="text-primary-foreground" />
                )}
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

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setTab}>
            <TabsList className="w-full flex-wrap h-auto gap-1 bg-card/50 rounded-2xl p-2 mb-6">
              {[
                { value: "overview", icon: User, label: "Overview" },
                { value: "orders", icon: Package, label: "Orders" },
                { value: "wishlist", icon: Heart, label: "Wishlist" },
                { value: "rewards", icon: Award, label: "Rewards" },
                { value: "community", icon: MessageSquare, label: "Community" },
                { value: "stories", icon: BookOpen, label: "Stories" },
                { value: "designs", icon: Palette, label: "Designs" },
                { value: "reviews", icon: Star, label: "Reviews" },
                { value: "profile", icon: Settings, label: "Profile" },
              ].map(t => (
                <TabsTrigger key={t.value} value={t.value} className="rounded-xl text-xs sm:text-sm gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <t.icon size={14} /> {t.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Overview */}
            <TabsContent value="overview">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  { label: "Orders", value: orders.length, color: "bg-peach", icon: Package },
                  { label: "Wishlist", value: wishlistItems.length, color: "bg-pink", icon: Heart },
                  { label: "Points", value: totalPoints, color: "bg-lavender", icon: Award },
                  { label: "Posts", value: myPosts.length, color: "bg-mint", icon: MessageSquare },
                ].map((s, i) => (
                  <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                    className="rounded-3xl bg-card shadow-soft p-5 text-center cursor-pointer hover:shadow-float transition-shadow"
                    onClick={() => setTab(s.label.toLowerCase())}
                  >
                    <div className={`w-10 h-10 rounded-2xl ${s.color} flex items-center justify-center mx-auto mb-3`}>
                      <s.icon size={18} />
                    </div>
                    <p className="font-display text-2xl font-bold">{s.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
                  </motion.div>
                ))}
              </div>

              <div className="rounded-3xl bg-card shadow-soft p-6">
                <h2 className="font-display text-lg font-semibold mb-4">⚡ Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: "Browse Shop", path: "/shop", emoji: "🛍️" },
                    { label: "Community", path: "/community", emoji: "💬" },
                    { label: "Vote Designs", path: "/design-voting", emoji: "🗳️" },
                    { label: "Custom Order", path: "/custom-builder", emoji: "✂️" },
                  ].map(a => (
                    <Button key={a.path} variant="outline" className="rounded-2xl h-auto py-4 flex flex-col gap-1" onClick={() => navigate(a.path)}>
                      <span className="text-2xl">{a.emoji}</span>
                      <span className="text-xs">{a.label}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Orders */}
            <TabsContent value="orders">
              <div className="space-y-4">
                <h2 className="font-display text-xl font-bold">My Orders</h2>
                {orders.length === 0 ? (
                  <div className="rounded-3xl bg-card shadow-soft p-10 text-center">
                    <Package size={40} className="mx-auto text-muted-foreground/40 mb-3" />
                    <p className="text-muted-foreground">No orders yet</p>
                    <Button className="mt-4 rounded-2xl" onClick={() => navigate("/shop")}>Start Shopping 🛍️</Button>
                  </div>
                ) : orders.map((order: any) => (
                  <div key={order.id} className="rounded-3xl bg-card shadow-soft p-5">
                    <div className="flex flex-col sm:flex-row justify-between gap-3 mb-3">
                      <div>
                        <p className="font-medium text-sm">Order #{order.id.slice(0, 8)}</p>
                        <p className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor(order.status)}`}>
                          {order.status}
                        </span>
                        <span className="font-display font-bold">PKR {order.total}</span>
                      </div>
                    </div>
                    {order.tracking_stage && (
                      <div className="mt-3">
                        <div className="flex gap-2 overflow-x-auto pb-2">
                          {["received", "in_progress", "quality_check", "packed", "shipped", "delivered"].map((stage, idx) => {
                            const stages = ["received", "in_progress", "quality_check", "packed", "shipped", "delivered"];
                            const currentIdx = stages.indexOf(order.tracking_stage || "received");
                            const isComplete = idx <= currentIdx;
                            return (
                              <div key={stage} className={`flex-1 min-w-[60px] text-center`}>
                                <div className={`w-6 h-6 rounded-full mx-auto mb-1 flex items-center justify-center text-xs ${isComplete ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                                  {isComplete ? "✓" : idx + 1}
                                </div>
                                <p className="text-[10px] text-muted-foreground capitalize">{stage.replace("_", " ")}</p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    {order.order_items?.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {order.order_items.map((item: any) => (
                          <div key={item.id} className="flex items-center gap-3 text-sm">
                            {item.products?.image_url && (
                              <img src={item.products.image_url} alt="" className="w-10 h-10 rounded-xl object-cover" />
                            )}
                            <span className="flex-1">{item.products?.name || "Product"}</span>
                            <span className="text-muted-foreground">x{item.quantity}</span>
                            <span className="font-medium">PKR {item.price}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Wishlist */}
            <TabsContent value="wishlist">
              <div className="space-y-4">
                <h2 className="font-display text-xl font-bold">My Wishlist</h2>
                {wishlistItems.length === 0 ? (
                  <div className="rounded-3xl bg-card shadow-soft p-10 text-center">
                    <Heart size={40} className="mx-auto text-muted-foreground/40 mb-3" />
                    <p className="text-muted-foreground">Your wishlist is empty</p>
                    <Button className="mt-4 rounded-2xl" onClick={() => navigate("/shop")}>Explore Products 💕</Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {wishlistItems.map((item: any) => (
                      <div key={item.id} className="rounded-3xl bg-card shadow-soft overflow-hidden">
                        <ProductImage src={item.products?.image_url} alt={item.products?.name || ""} className="w-full h-40" imgClassName="w-full h-40 object-cover" />
                        <div className="p-4">
                          <h3 className="font-medium text-sm mb-1">{item.products?.name}</h3>
                          <p className="text-primary font-display font-bold">PKR {item.products?.price}</p>
                          <div className="flex gap-2 mt-3">
                            <Button size="sm" className="flex-1 rounded-2xl text-xs" onClick={() => navigate(`/product/${item.products?.slug}`)}>View</Button>
                            <Button size="sm" variant="outline" className="rounded-2xl text-xs" onClick={() => handleRemoveWishlist(item.id)}>Remove</Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Rewards */}
            <TabsContent value="rewards">
              <div className="space-y-4">
                <h2 className="font-display text-xl font-bold">My Rewards</h2>
                <div className="rounded-3xl bg-card shadow-soft p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-lavender flex items-center justify-center">
                      <Award size={28} />
                    </div>
                    <div>
                      <p className="font-display text-3xl font-bold">{totalPoints}</p>
                      <p className="text-sm text-muted-foreground">Total Loyalty Points</p>
                    </div>
                  </div>
                  {loyaltyData.length === 0 ? (
                    <p className="text-muted-foreground text-sm">Start earning points by making purchases and engaging with the community! 🌟</p>
                  ) : (
                    <div className="space-y-2">
                      <h3 className="font-semibold text-sm mb-2">Points History</h3>
                      {loyaltyData.map((entry: any) => (
                        <div key={entry.id} className="flex justify-between items-center py-2 border-b border-border/30 last:border-0">
                          <div>
                            <p className="text-sm font-medium">{entry.reason}</p>
                            <p className="text-xs text-muted-foreground">{new Date(entry.created_at).toLocaleDateString()}</p>
                          </div>
                          <span className={`font-display font-bold ${entry.points >= 0 ? "text-green-600" : "text-red-500"}`}>
                            {entry.points >= 0 ? "+" : ""}{entry.points}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Community */}
            <TabsContent value="community">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="font-display text-xl font-bold">My Community Posts</h2>
                  <Button className="rounded-2xl" onClick={() => navigate("/community")}>New Post 💬</Button>
                </div>
                {myPosts.length === 0 ? (
                  <div className="rounded-3xl bg-card shadow-soft p-10 text-center">
                    <MessageSquare size={40} className="mx-auto text-muted-foreground/40 mb-3" />
                    <p className="text-muted-foreground">No community posts yet</p>
                    <Button className="mt-4 rounded-2xl" onClick={() => navigate("/community")}>Join the Community 💕</Button>
                  </div>
                ) : myPosts.map((post: any) => (
                  <div key={post.id} className="rounded-3xl bg-card shadow-soft p-5">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-medium">{post.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{post.content}</p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                          <span>{new Date(post.created_at).toLocaleDateString()}</span>
                          <span>❤️ {post.likes_count || 0}</span>
                        </div>
                      </div>
                      {post.image_url && <img src={post.image_url} alt="" className="w-16 h-16 rounded-xl object-cover ml-4" />}
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="outline" className="rounded-2xl text-xs text-destructive hover:text-destructive" onClick={() => handleDeletePost(post.id)}>
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Craft Stories */}
            <TabsContent value="stories">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="font-display text-xl font-bold">My Craft Stories</h2>
                  <Button className="rounded-2xl" onClick={() => setShowStoryForm(!showStoryForm)}>
                    <Plus size={16} className="mr-1" /> Add Craft Story
                  </Button>
                </div>

                {showStoryForm && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-3xl bg-card shadow-soft p-6 space-y-4">
                    <input
                      type="text"
                      value={storyForm.title}
                      onChange={e => setStoryForm({ ...storyForm, title: e.target.value })}
                      placeholder="Story title..."
                      className="w-full p-3 rounded-2xl bg-muted/30 border border-border/50 text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                    <textarea
                      value={storyForm.content}
                      onChange={e => setStoryForm({ ...storyForm, content: e.target.value })}
                      placeholder="Tell the story behind your creation..."
                      rows={4}
                      className="w-full p-3 rounded-2xl bg-muted/30 border border-border/50 text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                    />
                    <input
                      type="text"
                      value={storyForm.image_url}
                      onChange={e => setStoryForm({ ...storyForm, image_url: e.target.value })}
                      placeholder="Image URL (optional)"
                      className="w-full p-3 rounded-2xl bg-muted/30 border border-border/50 text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                    <Button
                      className="rounded-2xl"
                      disabled={!storyForm.title || !storyForm.content}
                      onClick={async () => {
                        if (!uid) return;
                        const slug = storyForm.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
                        const { error } = await supabase.from("craft_stories").insert({
                          title: storyForm.title,
                          content: storyForm.content,
                          slug: slug + "-" + Date.now(),
                          image_url: storyForm.image_url || null,
                          user_id: uid,
                          is_published: true,
                        });
                        if (error) {
                          toast({ title: "Error", description: error.message, variant: "destructive" });
                        } else {
                          toast({ title: "Story published! ✨" });
                          setStoryForm({ title: "", content: "", image_url: "" });
                          setShowStoryForm(false);
                          queryClient.invalidateQueries({ queryKey: ["my-stories"] });
                        }
                      }}
                    >
                      <Send size={16} className="mr-1" /> Publish Story
                    </Button>
                  </motion.div>
                )}

                {myStories.length === 0 && !showStoryForm ? (
                  <div className="rounded-3xl bg-card shadow-soft p-10 text-center">
                    <BookOpen size={40} className="mx-auto text-muted-foreground/40 mb-3" />
                    <p className="text-muted-foreground">No craft stories yet</p>
                    <p className="text-xs text-muted-foreground mt-1">Share the story behind your crochet creations!</p>
                  </div>
                ) : myStories.map((story: any) => (
                  <div key={story.id} className="rounded-3xl bg-card shadow-soft overflow-hidden">
                    {story.image_url && (
                      <img src={story.image_url} alt="" className="w-full h-48 object-cover" />
                    )}
                    <div className="p-5">
                      <h3 className="font-display font-semibold mb-1">{story.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-3">{story.content}</p>
                      <p className="text-xs text-muted-foreground mt-2">{new Date(story.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>


            <TabsContent value="designs">
              <div className="space-y-6">
                <h2 className="font-display text-xl font-bold">My Design Activity</h2>

                {/* Votes */}
                <div>
                  <h3 className="font-semibold mb-3">Designs I Voted For ({myVotes.length})</h3>
                  {myVotes.length === 0 ? (
                    <div className="rounded-3xl bg-card shadow-soft p-8 text-center">
                      <ThumbsUp size={32} className="mx-auto text-muted-foreground/40 mb-2" />
                      <p className="text-muted-foreground text-sm">No votes yet</p>
                      <Button className="mt-3 rounded-2xl" size="sm" onClick={() => navigate("/design-voting")}>Vote on Designs 🗳️</Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {myVotes.map((vote: any) => (
                        <div key={vote.id} className="rounded-3xl bg-card shadow-soft p-4 flex items-center gap-4">
                          {vote.design_requests?.image_url && (
                            <img src={vote.design_requests.image_url} alt="" className="w-14 h-14 rounded-xl object-cover" />
                          )}
                          <div className="flex-1">
                            <p className="font-medium text-sm">{vote.design_requests?.title}</p>
                            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                              <span>🗳️ {vote.design_requests?.votes_count || 0} votes</span>
                              <span className="capitalize">{vote.design_requests?.status}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Custom Orders */}
                <div>
                  <h3 className="font-semibold mb-3">My Custom Orders ({customOrders.length})</h3>
                  {customOrders.length === 0 ? (
                    <div className="rounded-3xl bg-card shadow-soft p-8 text-center">
                      <Palette size={32} className="mx-auto text-muted-foreground/40 mb-2" />
                      <p className="text-muted-foreground text-sm">No custom orders yet</p>
                      <Button className="mt-3 rounded-2xl" size="sm" onClick={() => navigate("/custom-builder")}>Build Custom Item ✂️</Button>
                    </div>
                  ) : customOrders.map((co: any) => (
                    <div key={co.id} className="rounded-3xl bg-card shadow-soft p-4 mb-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-sm">Custom Order #{co.id.slice(0, 8)}</p>
                          <p className="text-xs text-muted-foreground">{co.yarn_type} · {co.size} · {new Date(co.created_at).toLocaleDateString()}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor(co.status || "pending")}`}>
                          {co.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Reviews */}
            <TabsContent value="reviews">
              <div className="space-y-4">
                <h2 className="font-display text-xl font-bold">My Reviews</h2>
                {myReviews.length === 0 ? (
                  <div className="rounded-3xl bg-card shadow-soft p-10 text-center">
                    <Star size={40} className="mx-auto text-muted-foreground/40 mb-3" />
                    <p className="text-muted-foreground">No reviews written yet</p>
                    <p className="text-xs text-muted-foreground mt-1">Share your thoughts after purchasing a product!</p>
                  </div>
                ) : myReviews.map((review: any) => (
                  <div key={review.id} className="rounded-3xl bg-card shadow-soft p-5 flex gap-4">
                    {review.products?.image_url && (
                      <img src={review.products.image_url} alt="" className="w-16 h-16 rounded-xl object-cover" />
                    )}
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">{review.products?.name}</h3>
                      <div className="flex items-center gap-1 mt-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} size={12} className={i < review.rating ? "fill-peach text-peach" : "text-muted-foreground/30"} />
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{review.review_text}</p>
                      <p className="text-xs text-muted-foreground mt-2">{new Date(review.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Profile */}
            <TabsContent value="profile">
              <div className="rounded-3xl bg-card shadow-soft p-6 max-w-lg">
                <h2 className="font-display text-xl font-bold mb-6">Edit Profile</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Display Name</label>
                    <Input
                      value={profileForm.display_name}
                      onChange={e => setProfileForm({ ...profileForm, display_name: e.target.value })}
                      className="rounded-2xl"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Avatar URL</label>
                    <Input
                      value={profileForm.avatar_url}
                      onChange={e => setProfileForm({ ...profileForm, avatar_url: e.target.value })}
                      className="rounded-2xl"
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Email</label>
                    <Input value={user?.email || ""} disabled className="rounded-2xl bg-muted" />
                  </div>
                  <Button className="rounded-2xl w-full" onClick={handleProfileSave}>Save Changes ✨</Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ThumbsUp, Plus, Send, TrendingUp, Loader2 } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

type DesignRequest = {
  id: string;
  title: string;
  description: string | null;
  votes_count: number;
  status: string;
  created_at: string;
};

const statusColors: Record<string, string> = {
  open: "bg-accent/30 text-accent-foreground",
  planned: "bg-secondary/50 text-secondary-foreground",
  completed: "bg-primary/50 text-primary-foreground",
};

const DesignVoting = () => {
  const [requests, setRequests] = useState<DesignRequest[]>([]);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [votedIds, setVotedIds] = useState<Set<string>>(new Set());
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [votingInProgress, setVotingInProgress] = useState(false);
  const [submittingRequest, setSubmittingRequest] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from("design_requests").select("*").order("votes_count", { ascending: false });
      if (data) setRequests(data);

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
        const { data: votes } = await supabase.from("design_votes").select("request_id").eq("user_id", user.id);
        if (votes) setVotedIds(new Set(votes.map(v => v.request_id)));
      }
    };
    load().finally(() => setRequestsLoading(false));
  }, []);

  const vote = async (id: string) => {
    if (votingInProgress) return;
    setVotingInProgress(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({ title: "Please log in", description: "You need an account to vote.", variant: "destructive" });
        return;
      }

    // Toggle: if already voted, remove vote
    if (votedIds.has(id)) {
      const { error } = await supabase.from("design_votes").delete().eq("request_id", id).eq("user_id", user.id);
      if (error) {
        toast({ title: "Something went wrong", description: "Please try again.", variant: "destructive" });
        return;
      }
      setVotedIds(prev => { const n = new Set(prev); n.delete(id); return n; });
      setRequests(prev => prev.map(r => r.id === id ? { ...r, votes_count: Math.max(0, r.votes_count - 1) } : r));
      // Update votes_count in DB
      const current = requests.find(r => r.id === id);
      if (current) {
        await supabase.from("design_requests").update({ votes_count: Math.max(0, current.votes_count - 1) }).eq("id", id);
      }
      toast({ title: "Vote removed" });
      return;
    }

    // Insert vote
    const { error } = await supabase.from("design_votes").insert({ request_id: id, user_id: user.id });
    if (error) {
      if (error.code === "23505") {
        setVotedIds(prev => new Set(prev).add(id));
        toast({ title: "Already voted!" });
      } else toast({ title: "Something went wrong", description: "Please try again.", variant: "destructive" });
      return;
    }
    setVotedIds(prev => new Set(prev).add(id));
    setRequests(prev => prev.map(r => r.id === id ? { ...r, votes_count: r.votes_count + 1 } : r));
    // Update votes_count in DB
    const current = requests.find(r => r.id === id);
    if (current) {
      await supabase.from("design_requests").update({ votes_count: current.votes_count + 1 }).eq("id", id);
    }
    toast({ title: "Voted! 🎉" });
    } finally {
      setVotingInProgress(false);
    }
  };

  const submitRequest = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({ title: "Please log in", variant: "destructive" });
      return;
    }
    const { data: newReq, error } = await supabase.from("design_requests").insert({ user_id: user.id, title, description: description || null }).select("*").single();
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Submitted! 🎨", description: "Your design idea has been submitted." });
      if (newReq) setRequests(prev => [{ ...newReq, votes_count: newReq.votes_count || 0, status: newReq.status || "open" }, ...prev]);
      setTitle("");
      setDescription("");
      setShowForm(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-28 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-3">🗳️ Vote on Designs</h1>
            <p className="text-muted-foreground font-body max-w-lg mx-auto">Submit your dream crochet ideas and vote for the designs you want to see next!</p>
          </motion.div>

          <div className="flex justify-center mb-8">
            <Button onClick={() => setShowForm(!showForm)} className="rounded-2xl btn-squish">
              <Plus size={18} /> Submit Design Idea
            </Button>
          </div>

          {showForm && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
              <Card className="rounded-3xl border-border/50 mb-8">
                <CardContent className="p-6 space-y-4">
                  <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Your design idea..." className="w-full p-3 rounded-2xl bg-muted/30 border border-border/50 text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe your idea..." rows={3} className="w-full p-3 rounded-2xl bg-muted/30 border border-border/50 text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
                  <Button onClick={submitRequest} disabled={!title} className="rounded-2xl btn-squish"><Send size={16} /> Submit</Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          <div className="space-y-4">
            {requests.map((r, i) => {
              const hasVoted = votedIds.has(r.id);
              return (
                <motion.div key={r.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Card className="rounded-3xl border-border/50">
                    <CardContent className="p-5 flex items-center gap-4">
                      <button
                        onClick={() => vote(r.id)}
                        className={`flex flex-col items-center gap-1 p-3 rounded-2xl transition-all btn-squish min-w-[60px] ${
                          hasVoted
                            ? "bg-primary/30 text-primary"
                            : "bg-muted/30 hover:bg-primary/20"
                        }`}
                      >
                        <ThumbsUp size={20} fill={hasVoted ? "currentColor" : "none"} />
                        <span className="text-sm font-bold">{r.votes_count}</span>
                      </button>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-display font-semibold">{r.title}</h3>
                          <Badge className={`rounded-full text-xs ${statusColors[r.status] || ""}`}>{r.status}</Badge>
                        </div>
                        {r.description && <p className="text-muted-foreground text-sm">{r.description}</p>}
                      </div>
                      {r.status === "planned" && <TrendingUp size={18} className="text-accent-foreground" />}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DesignVoting;

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Trash2, TrendingUp } from "lucide-react";

const AdminDesignVotes = () => {
  const queryClient = useQueryClient();

  const { data: requests = [] } = useQuery({
    queryKey: ["admin-design-requests"],
    queryFn: async () => {
      const { data } = await supabase.from("design_requests").select("*").order("votes_count", { ascending: false });
      return data || [];
    },
  });

  const { data: votes = [] } = useQuery({
    queryKey: ["admin-design-votes"],
    queryFn: async () => {
      const { data } = await supabase.from("design_votes").select("*");
      return data || [];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("design_requests").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-design-requests"] });
      toast({ title: "Design request deleted" });
    },
  });

  const totalVotes = votes.length;
  const topDesign = requests[0];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">🗳️ Design Votes & Requests</h1>
        <p className="text-sm text-muted-foreground">{requests.length} designs · {totalVotes} total votes</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <Card className="rounded-2xl border-border/30">
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground">Total Votes</p>
            <p className="text-2xl font-display font-bold text-primary">{totalVotes}</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-border/30">
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground">Design Requests</p>
            <p className="text-2xl font-display font-bold">{requests.length}</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-border/30 col-span-2 md:col-span-1">
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground">Most Voted</p>
            <p className="text-sm font-display font-bold mt-1">{topDesign?.title || "—"}</p>
            {topDesign && <p className="text-xs text-primary mt-1">{topDesign.votes_count} votes</p>}
          </CardContent>
        </Card>
      </div>

      {/* Requests list */}
      <div className="space-y-3">
        {requests.map((r: any, i: number) => (
          <Card key={r.id} className="rounded-2xl border-border/30">
            <CardContent className="p-4">
              <div className="flex justify-between items-start gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center text-sm font-bold shrink-0">
                    #{i + 1}
                  </div>
                  <div>
                    <h3 className="font-display font-bold">{r.title}</h3>
                    {r.description && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{r.description}</p>}
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><TrendingUp size={12} /> {r.votes_count || 0} votes</span>
                      <span className="px-2 py-0.5 bg-secondary/30 rounded-full capitalize">{r.status}</span>
                      <span>{new Date(r.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => { if (confirm("Delete?")) deleteMutation.mutate(r.id); }} className="rounded-lg text-destructive shrink-0">
                  <Trash2 size={14} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {requests.length === 0 && (
          <Card className="rounded-2xl"><CardContent className="py-12 text-center text-muted-foreground">No design requests yet</CardContent></Card>
        )}
      </div>
    </div>
  );
};

export default AdminDesignVotes;

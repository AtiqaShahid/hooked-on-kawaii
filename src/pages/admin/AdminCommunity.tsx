import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { CheckCircle, Trash2 } from "lucide-react";

const AdminCommunity = () => {
  const queryClient = useQueryClient();
  const { data: posts = [] } = useQuery({
    queryKey: ["admin-community"],
    queryFn: async () => {
      const { data } = await supabase.from("community_posts").select("*").order("created_at", { ascending: false });
      return data || [];
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, is_approved }: { id: string; is_approved: boolean }) => {
      const { error } = await supabase.from("community_posts").update({ is_approved }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-community"] });
      toast({ title: "Updated" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("community_posts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-community"] });
      toast({ title: "Deleted" });
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Community Posts</h1>
        <p className="text-sm text-muted-foreground">{posts.filter((p: any) => !p.is_approved).length} pending approval</p>
      </div>

      <div className="space-y-3">
        {posts.map((post: any) => (
          <Card key={post.id} className={`rounded-2xl border-border/30 ${!post.is_approved ? "border-l-4 border-l-[hsl(var(--peach))]" : ""}`}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start gap-3">
                <div>
                  <h3 className="font-medium">{post.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{post.content}</p>
                  <p className="text-xs text-muted-foreground mt-1">❤️ {post.likes_count || 0} likes • {new Date(post.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button size="sm" variant={post.is_approved ? "secondary" : "default"} className="rounded-xl text-xs"
                    onClick={() => updateMutation.mutate({ id: post.id, is_approved: !post.is_approved })}>
                    <CheckCircle size={12} className="mr-1" />{post.is_approved ? "Hide" : "Approve"}
                  </Button>
                  <Button size="sm" variant="ghost" className="rounded-xl text-destructive"
                    onClick={() => { if (confirm("Delete post?")) deleteMutation.mutate(post.id); }}>
                    <Trash2 size={12} />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {posts.length === 0 && (
          <Card className="rounded-2xl"><CardContent className="py-12 text-center text-muted-foreground">No community posts yet</CardContent></Card>
        )}
      </div>
    </div>
  );
};

export default AdminCommunity;

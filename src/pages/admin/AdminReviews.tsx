import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, Star } from "lucide-react";

const AdminReviews = () => {
  const queryClient = useQueryClient();
  const { data: reviews = [] } = useQuery({
    queryKey: ["admin-reviews-all"],
    queryFn: async () => {
      const { data } = await supabase.from("reviews").select("*, product:products(name)").order("created_at", { ascending: false });
      return data || [];
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { error } = await supabase.from("reviews").update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-reviews-all"] });
      toast({ title: "Review updated" });
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Reviews</h1>
        <p className="text-sm text-muted-foreground">{reviews.length} total reviews • {reviews.filter((r: any) => !r.is_approved).length} pending approval</p>
      </div>

      <div className="space-y-3">
        {reviews.map((r: any) => (
          <Card key={r.id} className={`rounded-2xl border-border/30 ${!r.is_approved ? "border-l-4 border-l-[hsl(var(--peach))]" : ""}`}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="font-medium text-sm">{r.product?.name || "Unknown product"}</p>
                  <div className="flex gap-0.5 my-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={14} className={i < r.rating ? "fill-primary text-primary" : "text-border"} />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">{r.review_text || "No text"}</p>
                  <p className="text-xs text-muted-foreground mt-1">{new Date(r.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={r.is_approved ? "secondary" : "default"}
                    size="sm"
                    className="rounded-xl"
                    onClick={() => updateMutation.mutate({ id: r.id, updates: { is_approved: !r.is_approved } })}
                  >
                    {r.is_approved ? <XCircle size={14} className="mr-1" /> : <CheckCircle size={14} className="mr-1" />}
                    {r.is_approved ? "Hide" : "Approve"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-xl"
                    onClick={() => updateMutation.mutate({ id: r.id, updates: { is_featured: !r.is_featured } })}
                  >
                    {r.is_featured ? "★ Featured" : "☆ Feature"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {reviews.length === 0 && (
          <Card className="rounded-2xl"><CardContent className="py-12 text-center text-muted-foreground">No reviews yet</CardContent></Card>
        )}
      </div>
    </div>
  );
};

export default AdminReviews;

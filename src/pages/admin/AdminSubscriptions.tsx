import { Card, CardContent } from "@/components/ui/card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

const AdminSubscriptions = () => {
  const queryClient = useQueryClient();
  const { data: subs = [] } = useQuery({
    queryKey: ["admin-subs"],
    queryFn: async () => {
      const { data } = await supabase.from("subscriptions").select("*").order("created_at", { ascending: false });
      return data || [];
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("subscriptions").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-subs"] });
      toast({ title: "Subscription updated" });
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Subscriptions</h1>
        <p className="text-sm text-muted-foreground">{subs.filter((s: any) => s.status === "active").length} active subscriptions</p>
      </div>

      <div className="space-y-3">
        {subs.map((s: any) => (
          <Card key={s.id} className="rounded-2xl border-border/30">
            <CardContent className="p-4 flex justify-between items-center flex-wrap gap-3">
              <div>
                <p className="font-mono text-xs text-muted-foreground">#{s.id.slice(0, 8)}</p>
                <p className="text-sm"><strong>Plan:</strong> {s.plan}</p>
                <p className="text-sm"><strong>Next Delivery:</strong> {s.next_delivery_date || "TBD"}</p>
              </div>
              <Select value={s.status} onValueChange={(v) => updateMutation.mutate({ id: s.id, status: v })}>
                <SelectTrigger className="w-32 rounded-xl text-xs h-8"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        ))}
        {subs.length === 0 && (
          <Card className="rounded-2xl"><CardContent className="py-12 text-center text-muted-foreground">No subscriptions yet</CardContent></Card>
        )}
      </div>
    </div>
  );
};

export default AdminSubscriptions;

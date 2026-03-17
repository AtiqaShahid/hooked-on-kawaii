import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const AdminCustomOrders = () => {
  const queryClient = useQueryClient();
  const { data: orders = [] } = useQuery({
    queryKey: ["admin-custom-orders"],
    queryFn: async () => {
      const { data } = await supabase.from("custom_crochet_orders").select("*").order("created_at", { ascending: false });
      return data || [];
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("custom_crochet_orders").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-custom-orders"] });
      toast({ title: "Order updated" });
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Custom Crochet Orders</h1>
        <p className="text-sm text-muted-foreground">{orders.length} custom orders</p>
      </div>

      <div className="space-y-3">
        {orders.map((o: any) => (
          <Card key={o.id} className="rounded-2xl border-border/30">
            <CardContent className="p-4">
              <div className="flex justify-between items-start flex-wrap gap-3">
                <div>
                  <p className="font-mono text-xs text-muted-foreground">#{o.id.slice(0, 8)}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {o.colors?.map((c: string, i: number) => (
                      <span key={i} className="px-2 py-0.5 rounded-full bg-primary/10 text-xs">{c}</span>
                    ))}
                  </div>
                  <p className="text-sm mt-1"><strong>Yarn:</strong> {o.yarn_type || "Not specified"}</p>
                  <p className="text-sm"><strong>Size:</strong> {o.size || "Not specified"}</p>
                  <p className="text-sm"><strong>Attachment:</strong> {o.attachment || "None"}</p>
                  {o.price && <p className="font-bold mt-1">₨{o.price.toLocaleString()}</p>}
                </div>
                <Select value={o.status || "pending"} onValueChange={(v) => updateMutation.mutate({ id: o.id, status: v })}>
                  <SelectTrigger className="w-36 rounded-xl text-xs h-8"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="in_production">In Production</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        ))}
        {orders.length === 0 && (
          <Card className="rounded-2xl"><CardContent className="py-12 text-center text-muted-foreground">No custom orders yet</CardContent></Card>
        )}
      </div>
    </div>
  );
};

export default AdminCustomOrders;

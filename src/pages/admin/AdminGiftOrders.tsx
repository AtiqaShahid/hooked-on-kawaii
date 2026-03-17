import { Card, CardContent } from "@/components/ui/card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

const AdminGiftOrders = () => {
  const queryClient = useQueryClient();
  const { data: orders = [] } = useQuery({
    queryKey: ["admin-gift-orders"],
    queryFn: async () => {
      const { data } = await supabase.from("gift_builder_orders").select("*").order("created_at", { ascending: false });
      return data || [];
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("gift_builder_orders").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-gift-orders"] });
      toast({ title: "Order updated" });
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Gift Builder Orders</h1>
        <p className="text-sm text-muted-foreground">{orders.length} gift orders</p>
      </div>

      <div className="space-y-3">
        {orders.map((o: any) => (
          <Card key={o.id} className="rounded-2xl border-border/30">
            <CardContent className="p-4">
              <div className="flex justify-between items-start flex-wrap gap-3">
                <div>
                  <p className="font-mono text-xs text-muted-foreground">#{o.id.slice(0, 8)}</p>
                  <p className="text-sm mt-1"><strong>Item:</strong> {o.item || "N/A"}</p>
                  <p className="text-sm"><strong>Color Theme:</strong> {o.color_theme || "N/A"}</p>
                  <p className="text-sm"><strong>Packaging:</strong> {o.packaging || "Standard"}</p>
                  {o.message && <p className="text-sm italic mt-1">💌 "{o.message}"</p>}
                  {o.price && <p className="font-bold mt-1">₨{o.price.toLocaleString()}</p>}
                </div>
                <Select value={o.status || "pending"} onValueChange={(v) => updateMutation.mutate({ id: o.id, status: v })}>
                  <SelectTrigger className="w-32 rounded-xl text-xs h-8"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        ))}
        {orders.length === 0 && (
          <Card className="rounded-2xl"><CardContent className="py-12 text-center text-muted-foreground">No gift orders yet</CardContent></Card>
        )}
      </div>
    </div>
  );
};

export default AdminGiftOrders;

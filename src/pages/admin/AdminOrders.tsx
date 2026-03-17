import { useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const stages = ["received", "crocheting", "quality_check", "packed", "shipped", "delivered"];
const stageLabels: Record<string, string> = {
  received: "📦 Received", crocheting: "🧶 Crocheting", quality_check: "✅ Quality Check",
  packed: "📮 Packed", shipped: "🚚 Shipped", delivered: "🎉 Delivered",
};

const AdminOrders = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: orders = [] } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
      return data || [];
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { error } = await supabase.from("orders").update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      toast({ title: "Order updated" });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const filtered = orders.filter((o: any) => {
    const matchSearch = o.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Orders</h1>
        <p className="text-sm text-muted-foreground">{orders.length} total orders</p>
      </div>

      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search by order ID..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 rounded-xl" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40 rounded-xl"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {filtered.map((order: any) => (
          <motion.div key={order.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card className="rounded-2xl border-border/30">
              <CardContent className="p-4">
                <div className="flex items-start justify-between flex-wrap gap-3">
                  <div>
                    <p className="font-mono text-xs text-muted-foreground">#{order.id.slice(0, 8)}</p>
                    <p className="font-display font-bold text-lg">₨{order.total?.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Select
                      value={order.status}
                      onValueChange={(v) => updateMutation.mutate({ id: order.id, updates: { status: v } })}
                    >
                      <SelectTrigger className="w-32 rounded-xl text-xs h-8"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select
                      value={order.tracking_stage || "received"}
                      onValueChange={(v) => updateMutation.mutate({ id: order.id, updates: { tracking_stage: v } })}
                    >
                      <SelectTrigger className="w-44 rounded-xl text-xs h-8"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {stages.map(s => (
                          <SelectItem key={s} value={s}>{stageLabels[s]}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-4 flex gap-1">
                  {stages.map((s, i) => {
                    const currentIndex = stages.indexOf(order.tracking_stage || "received");
                    return (
                      <div key={s} className={`h-1.5 flex-1 rounded-full transition-colors ${i <= currentIndex ? "bg-primary" : "bg-border/50"}`} />
                    );
                  })}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{stageLabels[order.tracking_stage || "received"]}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <Card className="rounded-2xl border-border/30">
            <CardContent className="py-12 text-center text-muted-foreground">No orders found</CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;

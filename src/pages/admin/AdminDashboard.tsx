import { motion } from "framer-motion";
import { Package, ShoppingCart, Users, DollarSign, TrendingUp, Star, CreditCard, Palette } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = ["hsl(350,100%,91%)", "hsl(240,67%,94%)", "hsl(140,68%,83%)", "hsl(25,100%,90%)", "hsl(210,80%,90%)"];

const AdminDashboard = () => {
  const { data: products = [] } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const { data } = await supabase.from("products").select("*, category:categories(name)");
      return data || [];
    },
  });

  const { data: orders = [] } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
      return data || [];
    },
  });

  const { data: reviews = [] } = useQuery({
    queryKey: ["admin-reviews"],
    queryFn: async () => {
      const { data } = await supabase.from("reviews").select("*");
      return data || [];
    },
  });

  const { data: customOrders = [] } = useQuery({
    queryKey: ["admin-custom-orders"],
    queryFn: async () => {
      const { data } = await supabase.from("custom_crochet_orders").select("*");
      return data || [];
    },
  });

  const { data: subscriptions = [] } = useQuery({
    queryKey: ["admin-subscriptions"],
    queryFn: async () => {
      const { data } = await supabase.from("subscriptions").select("*");
      return data || [];
    },
  });

  const totalRevenue = orders.reduce((s: number, o: any) => s + (o.total || 0), 0);
  const pendingOrders = orders.filter((o: any) => o.status === "pending").length;

  const stats = [
    { label: "Total Products", value: products.length, icon: Package, color: "bg-primary/20" },
    { label: "Total Orders", value: orders.length, icon: ShoppingCart, color: "bg-secondary/50" },
    { label: "Revenue", value: `₨${totalRevenue.toLocaleString()}`, icon: DollarSign, color: "bg-accent/30" },
    { label: "Pending Orders", value: pendingOrders, icon: TrendingUp, color: "bg-[hsl(var(--peach))]/30" },
    { label: "Reviews", value: reviews.length, icon: Star, color: "bg-primary/30" },
    { label: "Custom Orders", value: customOrders.length, icon: Palette, color: "bg-secondary/30" },
    { label: "Subscriptions", value: subscriptions.length, icon: CreditCard, color: "bg-accent/20" },
    { label: "Low Stock", value: products.filter((p: any) => (p.stock_quantity || 0) < 10).length, icon: Package, color: "bg-destructive/20" },
  ];

  // Category distribution for pie chart
  const categoryMap: Record<string, number> = {};
  products.forEach((p: any) => {
    const cat = p.category?.name || "Uncategorized";
    categoryMap[cat] = (categoryMap[cat] || 0) + 1;
  });
  const pieData = Object.entries(categoryMap).map(([name, value]) => ({ name, value }));

  // Mock sales over time (from orders)
  const salesData = orders.slice(0, 7).map((o: any, i: number) => ({
    name: new Date(o.created_at).toLocaleDateString("en", { month: "short", day: "numeric" }),
    sales: o.total || 0,
  })).reverse();

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-2xl font-bold">Dashboard Overview</h1>
        <p className="text-muted-foreground text-sm">Welcome back to your crochet empire 🧶</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="rounded-2xl border-border/30 hover:shadow-soft transition-shadow">
              <CardContent className="p-4">
                <div className={`w-9 h-9 rounded-xl ${s.color} flex items-center justify-center mb-2`}>
                  <s.icon size={18} />
                </div>
                <p className="text-xl font-display font-bold">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="rounded-2xl border-border/30">
          <CardHeader><CardTitle className="font-display text-base">Sales Overview</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={salesData.length ? salesData : [{ name: "No data", sales: 0 }]}>
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Bar dataKey="sales" fill="hsl(350,100%,91%)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/30">
          <CardHeader><CardTitle className="font-display text-base">Product Categories</CardTitle></CardHeader>
          <CardContent className="flex items-center justify-center">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={11}>
                    {pieData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-muted-foreground text-sm">No products yet</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card className="rounded-2xl border-border/30">
        <CardHeader><CardTitle className="font-display text-base">Recent Orders</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/30">
                  <th className="text-left py-2 px-2 text-muted-foreground font-medium">Order ID</th>
                  <th className="text-left py-2 px-2 text-muted-foreground font-medium">Status</th>
                  <th className="text-left py-2 px-2 text-muted-foreground font-medium">Total</th>
                  <th className="text-left py-2 px-2 text-muted-foreground font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map((o: any) => (
                  <tr key={o.id} className="border-b border-border/20 hover:bg-muted/20">
                    <td className="py-2.5 px-2 font-mono text-xs">{o.id.slice(0, 8)}...</td>
                    <td className="py-2.5 px-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        o.status === "pending" ? "bg-[hsl(var(--peach))]/30" :
                        o.status === "shipped" ? "bg-secondary/50" :
                        o.status === "delivered" ? "bg-accent/30" : "bg-muted"
                      }`}>{o.status}</span>
                    </td>
                    <td className="py-2.5 px-2 font-medium">₨{o.total?.toLocaleString()}</td>
                    <td className="py-2.5 px-2 text-muted-foreground">{new Date(o.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr><td colSpan={4} className="py-8 text-center text-muted-foreground">No orders yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;

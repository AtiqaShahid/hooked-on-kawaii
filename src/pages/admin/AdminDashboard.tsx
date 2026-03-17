import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Package, ShoppingCart, Users, DollarSign, TrendingUp, Star, CreditCard, Palette, AlertTriangle, ArrowUpRight, ArrowDownRight, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
  AreaChart, Area, LineChart, Line, FunnelChart, Funnel, LabelList,
} from "recharts";

const COLORS = ["hsl(350,80%,75%)", "hsl(240,67%,80%)", "hsl(140,58%,70%)", "hsl(25,90%,75%)", "hsl(210,70%,75%)", "hsl(280,60%,75%)"];
const PKR = (v: number) => `Rs. ${v.toLocaleString()}`;

type DateRange = "7d" | "30d" | "90d" | "all";

const getDateThreshold = (range: DateRange) => {
  if (range === "all") return new Date(0);
  const d = new Date();
  if (range === "7d") d.setDate(d.getDate() - 7);
  if (range === "30d") d.setDate(d.getDate() - 30);
  if (range === "90d") d.setDate(d.getDate() - 90);
  return d;
};

const AdminDashboard = () => {
  const [range, setRange] = useState<DateRange>("30d");

  const { data: products = [], isLoading: lp } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const { data } = await supabase.from("products").select("*, category:categories(name)");
      return data || [];
    },
  });

  const { data: allOrders = [], isLoading: lo } = useQuery({
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

  const { data: profiles = [] } = useQuery({
    queryKey: ["admin-profiles"],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("*");
      return data || [];
    },
  });

  const { data: analytics = [] } = useQuery({
    queryKey: ["admin-analytics"],
    queryFn: async () => {
      const { data } = await supabase.from("product_analytics").select("*").order("created_at", { ascending: false }).limit(1000);
      return data || [];
    },
  });


  // ── MOCK DATA (shown until real data arrives) ──
  const hasRealOrders = allOrders.length > 0;
  const hasRealProfiles = profiles.length > 0;

  const MOCK_ORDERS = [
    { id: "mock-001", status: "delivered", total: 4500, created_at: new Date(Date.now() - 1 * 86400000).toISOString() },
    { id: "mock-002", status: "shipped", total: 2800, created_at: new Date(Date.now() - 2 * 86400000).toISOString() },
    { id: "mock-003", status: "pending", total: 6200, created_at: new Date(Date.now() - 3 * 86400000).toISOString() },
    { id: "mock-004", status: "delivered", total: 3100, created_at: new Date(Date.now() - 4 * 86400000).toISOString() },
    { id: "mock-005", status: "delivered", total: 1900, created_at: new Date(Date.now() - 5 * 86400000).toISOString() },
    { id: "mock-006", status: "shipped", total: 5400, created_at: new Date(Date.now() - 6 * 86400000).toISOString() },
    { id: "mock-007", status: "pending", total: 7800, created_at: new Date(Date.now() - 7 * 86400000).toISOString() },
    { id: "mock-008", status: "delivered", total: 2200, created_at: new Date(Date.now() - 8 * 86400000).toISOString() },
    { id: "mock-009", status: "cancelled", total: 1500, created_at: new Date(Date.now() - 10 * 86400000).toISOString() },
    { id: "mock-010", status: "delivered", total: 9200, created_at: new Date(Date.now() - 12 * 86400000).toISOString() },
    { id: "mock-011", status: "shipped", total: 3700, created_at: new Date(Date.now() - 14 * 86400000).toISOString() },
    { id: "mock-012", status: "delivered", total: 4100, created_at: new Date(Date.now() - 16 * 86400000).toISOString() },
    { id: "mock-013", status: "delivered", total: 5600, created_at: new Date(Date.now() - 18 * 86400000).toISOString() },
    { id: "mock-014", status: "pending", total: 2900, created_at: new Date(Date.now() - 20 * 86400000).toISOString() },
    { id: "mock-015", status: "delivered", total: 8300, created_at: new Date(Date.now() - 22 * 86400000).toISOString() },
  ];

  const MOCK_PROFILES = [
    { id: "p1", created_at: new Date(Date.now() - 90 * 86400000).toISOString() },
    { id: "p2", created_at: new Date(Date.now() - 75 * 86400000).toISOString() },
    { id: "p3", created_at: new Date(Date.now() - 60 * 86400000).toISOString() },
    { id: "p4", created_at: new Date(Date.now() - 55 * 86400000).toISOString() },
    { id: "p5", created_at: new Date(Date.now() - 45 * 86400000).toISOString() },
    { id: "p6", created_at: new Date(Date.now() - 40 * 86400000).toISOString() },
    { id: "p7", created_at: new Date(Date.now() - 30 * 86400000).toISOString() },
    { id: "p8", created_at: new Date(Date.now() - 25 * 86400000).toISOString() },
    { id: "p9", created_at: new Date(Date.now() - 20 * 86400000).toISOString() },
    { id: "p10", created_at: new Date(Date.now() - 15 * 86400000).toISOString() },
    { id: "p11", created_at: new Date(Date.now() - 10 * 86400000).toISOString() },
    { id: "p12", created_at: new Date(Date.now() - 5 * 86400000).toISOString() },
    { id: "p13", created_at: new Date(Date.now() - 2 * 86400000).toISOString() },
  ];

  const effectiveOrders = hasRealOrders ? allOrders : MOCK_ORDERS;
  const effectiveProfiles = hasRealProfiles ? profiles : MOCK_PROFILES;
  const usingMock = !hasRealOrders;

  // Filter by date range
  const threshold = getDateThreshold(range);
  const orders = useMemo(() => effectiveOrders.filter((o: any) => new Date(o.created_at) >= threshold), [effectiveOrders, threshold]);

  // Previous period for comparison
  const prevThreshold = useMemo(() => {
    if (range === "all") return new Date(0);
    const days = range === "7d" ? 7 : range === "30d" ? 30 : 90;
    const d = new Date(threshold);
    d.setDate(d.getDate() - days);
    return d;
  }, [range, threshold]);
  const prevOrders = useMemo(() => effectiveOrders.filter((o: any) => {
    const d = new Date(o.created_at);
    return d >= prevThreshold && d < threshold;
  }), [effectiveOrders, prevThreshold, threshold]);

  const totalRevenue = orders.reduce((s: number, o: any) => s + (o.total || 0), 0);
  const prevRevenue = prevOrders.reduce((s: number, o: any) => s + (o.total || 0), 0);
  const pendingOrders = orders.filter((o: any) => o.status === "pending").length;
  const completedOrders = orders.filter((o: any) => o.status === "delivered").length;
  const cancelledOrders = orders.filter((o: any) => o.status === "cancelled").length;
  const avgOrderValue = orders.length ? totalRevenue / orders.length : 0;
  const prevAvg = prevOrders.length ? prevRevenue / prevOrders.length : 0;
  const lowStockProducts = products.filter((p: any) => (p.stock_quantity || 0) < 10);

  const pctChange = (curr: number, prev: number) => {
    if (prev === 0) return curr > 0 ? 100 : 0;
    return Math.round(((curr - prev) / prev) * 100);
  };

  const isLoading = lp || lo;

  // KPI Cards
  const kpis = [
    { label: "Total Revenue", value: PKR(totalRevenue), change: pctChange(totalRevenue, prevRevenue), icon: DollarSign, color: "bg-accent/30" },
    { label: "Total Orders", value: orders.length, change: pctChange(orders.length, prevOrders.length), icon: ShoppingCart, color: "bg-secondary/50" },
    { label: "Customers", value: effectiveProfiles.length, change: usingMock ? 18 : 0, icon: Users, color: "bg-primary/20" },
    { label: "Total Products", value: products.length, change: 0, icon: Package, color: "bg-accent/20" },
    { label: "Avg Order Value", value: PKR(Math.round(avgOrderValue)), change: pctChange(avgOrderValue, prevAvg), icon: TrendingUp, color: "bg-secondary/30" },
    { label: "Pending Orders", value: pendingOrders, change: 0, icon: CreditCard, color: "bg-primary/30" },
  ];

  // Sales over time (group by date)
  const salesByDate = useMemo(() => {
    const map: Record<string, { sales: number; count: number }> = {};
    orders.forEach((o: any) => {
      const date = new Date(o.created_at).toLocaleDateString("en", { month: "short", day: "numeric" });
      if (!map[date]) map[date] = { sales: 0, count: 0 };
      map[date].sales += o.total || 0;
      map[date].count += 1;
    });
    return Object.entries(map).map(([name, v]) => ({ name, ...v }));
  }, [orders]);

  // Revenue trend cumulative
  const revenueTrend = useMemo(() => {
    let cum = 0;
    return orders
      .slice().sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
      .map((o: any) => {
        cum += o.total || 0;
        return { name: new Date(o.created_at).toLocaleDateString("en", { month: "short", day: "numeric" }), revenue: cum };
      });
  }, [orders]);

  // Category distribution
  const pieData = useMemo(() => {
    const map: Record<string, number> = {};
    products.forEach((p: any) => {
      const cat = p.category?.name || "Uncategorized";
      map[cat] = (map[cat] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [products]);

  // Orders by status
  const statusData = useMemo(() => {
    const map: Record<string, number> = {};
    orders.forEach((o: any) => { map[o.status] = (map[o.status] || 0) + 1; });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [orders]);

  // Sales by traffic source
  const trafficSources = useMemo(() => {
    if (usingMock) {
      return [
        { name: "Direct", value: 40 }, { name: "Instagram", value: 30 },
        { name: "Facebook", value: 15 }, { name: "Google", value: 10 }, { name: "Referral", value: 5 },
      ];
    }
    const sources: Record<string, number> = { Direct: 0, Instagram: 0, Facebook: 0, Google: 0, Referral: 0 };
    analytics.forEach((a: any) => {
      const src = (a.metadata as any)?.source;
      if (src && sources[src] !== undefined) sources[src]++;
      else sources.Direct++;
    });
    const total = Object.values(sources).reduce((s, v) => s + v, 0);
    if (total === 0) return [{ name: "Direct", value: 100 }];
    return Object.entries(sources).filter(([, v]) => v > 0).map(([name, value]) => ({ name, value }));
  }, [analytics, usingMock]);

  // Top products by revenue
  const topProducts = useMemo(() => {
    return products
      .slice()
      .sort((a: any, b: any) => (b.popularity_score || 0) - (a.popularity_score || 0))
      .slice(0, 8)
      .map((p: any) => ({ name: p.name.length > 18 ? p.name.slice(0, 18) + "…" : p.name, revenue: p.price * (p.popularity_score || 1) }));
  }, [products]);

  // Sales funnel
  const funnelData = useMemo(() => {
    if (usingMock) {
      return [
        { name: "Product Views", value: 1240, fill: COLORS[0] },
        { name: "Add to Cart", value: 380, fill: COLORS[1] },
        { name: "Checkout", value: 145, fill: COLORS[2] },
        { name: "Purchase", value: orders.length, fill: COLORS[3] },
      ];
    }
    const views = analytics.filter((a: any) => a.event_type === "view").length || 0;
    const addToCart = analytics.filter((a: any) => a.event_type === "add_to_cart").length || 0;
    const checkout = analytics.filter((a: any) => a.event_type === "checkout").length || 0;
    const purchase = orders.length;
    return [
      { name: "Product Views", value: Math.max(views, addToCart + 10), fill: COLORS[0] },
      { name: "Add to Cart", value: Math.max(addToCart, checkout + 5), fill: COLORS[1] },
      { name: "Checkout", value: Math.max(checkout, purchase + 2), fill: COLORS[2] },
      { name: "Purchase", value: Math.max(purchase, 0), fill: COLORS[3] },
    ];
  }, [analytics, orders, usingMock]);

  // Customer cohort
  const cohortData = useMemo(() => {
    const months: Record<string, number> = {};
    effectiveProfiles.forEach((p: any) => {
      const m = new Date(p.created_at).toLocaleDateString("en", { year: "numeric", month: "short" });
      months[m] = (months[m] || 0) + 1;
    });
    return Object.entries(months).slice(-6).map(([name, customers]) => ({ name, customers }));
  }, [effectiveProfiles]);

  // Profit estimation (assume 60% margin)
  const grossProfit = Math.round(totalRevenue * 0.6);
  const netProfit = Math.round(totalRevenue * 0.45);
  const profitMargin = totalRevenue > 0 ? Math.round((netProfit / totalRevenue) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header with filter */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-2xl font-bold">Dashboard Overview</h1>
          <p className="text-muted-foreground text-sm">Your crochet empire analytics 🧶</p>
        </motion.div>
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-muted-foreground" />
          <Select value={range} onValueChange={(v) => setRange(v as DateRange)}>
            <SelectTrigger className="w-36 rounded-xl h-9 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {kpis.map((k, i) => (
          <motion.div key={k.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
            <Card className="rounded-2xl border-border/30 hover:shadow-soft transition-shadow">
              <CardContent className="p-3">
                <div className={`w-8 h-8 rounded-xl ${k.color} flex items-center justify-center mb-1.5`}>
                  <k.icon size={16} />
                </div>
                <p className="text-lg font-display font-bold leading-tight">{isLoading ? "…" : k.value}</p>
                <p className="text-[10px] text-muted-foreground">{k.label}</p>
                {k.change !== 0 && (
                  <div className={`flex items-center gap-0.5 mt-1 text-[10px] font-medium ${k.change > 0 ? "text-green-600" : "text-destructive"}`}>
                    {k.change > 0 ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                    {Math.abs(k.change)}% vs prev
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Low Stock */}
      {lowStockProducts.length > 0 && (
        <Card className="rounded-2xl border-destructive/30 bg-destructive/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle size={16} className="text-destructive" />
              <span className="font-display font-bold text-sm">Low Stock Alert</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {lowStockProducts.map((p: any) => (
                <span key={p.id} className="px-2 py-1 bg-destructive/10 rounded-lg text-xs">{p.name} ({p.stock_quantity} left)</span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mock Data Banner */}
      {usingMock && (
        <Card className="rounded-2xl border-primary/30 bg-primary/5">
          <CardContent className="p-3 flex items-center gap-2 text-sm">
            <Palette size={16} className="text-primary" />
            <span className="text-muted-foreground">📊 Showing <strong>sample data</strong> for preview. Real data will appear once orders start coming in.</span>
          </CardContent>
        </Card>
      )}

      {/* Profit Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Gross Revenue", value: PKR(totalRevenue) },
          { label: "Gross Profit (est)", value: PKR(grossProfit) },
          { label: "Net Profit (est)", value: PKR(netProfit) },
          { label: "Profit Margin", value: `${profitMargin}%` },
        ].map((m) => (
          <Card key={m.label} className="rounded-2xl border-border/30">
            <CardContent className="p-3">
              <p className="text-xs text-muted-foreground">{m.label}</p>
              <p className="text-lg font-display font-bold">{m.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row 1: Sales + Revenue */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="rounded-2xl border-border/30">
          <CardHeader><CardTitle className="font-display text-base">Sales Over Time</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={salesByDate.length ? salesByDate : [{ name: "No data", sales: 0 }]}>
                <XAxis dataKey="name" fontSize={11} />
                <YAxis fontSize={11} tickFormatter={(v) => `₨${v}`} />
                <Tooltip formatter={(v: number) => [PKR(v), "Sales"]} />
                <Bar dataKey="sales" fill="hsl(350,80%,75%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/30">
          <CardHeader><CardTitle className="font-display text-base">Revenue Growth</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={revenueTrend.length ? revenueTrend : [{ name: "No data", revenue: 0 }]}>
                <XAxis dataKey="name" fontSize={11} />
                <YAxis fontSize={11} tickFormatter={(v) => `₨${v}`} />
                <Tooltip formatter={(v: number) => [PKR(v), "Cumulative"]} />
                <Area type="monotone" dataKey="revenue" stroke="hsl(240,67%,70%)" fill="hsl(240,67%,90%)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2: Categories + Traffic Sources */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="rounded-2xl border-border/30">
          <CardHeader><CardTitle className="font-display text-base">Product Categories</CardTitle></CardHeader>
          <CardContent className="flex items-center justify-center">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={85} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={10}>
                    {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : <p className="text-muted-foreground text-sm py-12">No products yet</p>}
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/30">
          <CardHeader><CardTitle className="font-display text-base">Traffic Sources</CardTitle></CardHeader>
          <CardContent className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={trafficSources} cx="50%" cy="50%" innerRadius={50} outerRadius={85} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={10}>
                  {trafficSources.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 3: Order Status + Sales Funnel */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="rounded-2xl border-border/30">
          <CardHeader><CardTitle className="font-display text-base">Orders by Status</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              {[
                { label: "Total", value: orders.length, cls: "bg-primary/20" },
                { label: "Completed", value: completedOrders, cls: "bg-accent/20" },
                { label: "Pending", value: pendingOrders, cls: "bg-secondary/30" },
                { label: "Cancelled", value: cancelledOrders, cls: "bg-destructive/10" },
              ].map((s) => (
                <div key={s.label} className={`${s.cls} rounded-xl p-2 text-center`}>
                  <p className="font-display font-bold text-lg">{s.value}</p>
                  <p className="text-[10px] text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={statusData} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({ name, value }) => `${name} (${value})`} labelLine={false} fontSize={10}>
                    {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : <p className="text-muted-foreground text-sm py-8 text-center">No orders yet</p>}
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/30">
          <CardHeader><CardTitle className="font-display text-base">Sales Funnel</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {funnelData.map((stage, i) => {
                const maxVal = funnelData[0].value || 1;
                const width = Math.max((stage.value / maxVal) * 100, 15);
                const rate = i === 0 ? 100 : funnelData[i - 1].value > 0 ? Math.round((stage.value / funnelData[i - 1].value) * 100) : 0;
                return (
                  <div key={stage.name}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium">{stage.name}</span>
                      <span className="text-muted-foreground">{stage.value} ({rate}%)</span>
                    </div>
                    <div className="h-7 rounded-lg overflow-hidden bg-muted/30">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${width}%` }}
                        transition={{ delay: i * 0.15, duration: 0.5 }}
                        className="h-full rounded-lg flex items-center justify-center text-[10px] font-bold text-foreground/80"
                        style={{ backgroundColor: stage.fill }}
                      >
                        {stage.value}
                      </motion.div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 4: Top Products + Customer Growth */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="rounded-2xl border-border/30">
          <CardHeader><CardTitle className="font-display text-base">Top Products</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={topProducts.length ? topProducts : [{ name: "No data", revenue: 0 }]} layout="vertical">
                <XAxis type="number" fontSize={11} tickFormatter={(v) => `₨${v}`} />
                <YAxis dataKey="name" type="category" fontSize={10} width={110} />
                <Tooltip formatter={(v: number) => [PKR(v), "Est. Revenue"]} />
                <Bar dataKey="revenue" fill="hsl(140,58%,70%)" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/30">
          <CardHeader><CardTitle className="font-display text-base">Customer Growth</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={cohortData.length ? cohortData : [{ name: "No data", customers: 0 }]}>
                <XAxis dataKey="name" fontSize={11} />
                <YAxis fontSize={11} />
                <Tooltip />
                <Line type="monotone" dataKey="customers" stroke="hsl(350,80%,75%)" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
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
                {allOrders.slice(0, 5).map((o: any) => (
                  <tr key={o.id} className="border-b border-border/20 hover:bg-muted/20">
                    <td className="py-2.5 px-2 font-mono text-xs">{o.id.slice(0, 8)}…</td>
                    <td className="py-2.5 px-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        o.status === "pending" ? "bg-[hsl(var(--peach))]/30" :
                        o.status === "shipped" ? "bg-secondary/50" :
                        o.status === "delivered" ? "bg-accent/30" : "bg-muted"
                      }`}>{o.status}</span>
                    </td>
                    <td className="py-2.5 px-2 font-medium">Rs. {o.total?.toLocaleString()}</td>
                    <td className="py-2.5 px-2 text-muted-foreground">{new Date(o.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
                {allOrders.length === 0 && (
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

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell } from "recharts";
import { Filter, Eye, ShoppingCart, MousePointerClick, TrendingUp } from "lucide-react";

const COLORS = ["hsl(350,80%,75%)", "hsl(240,67%,80%)", "hsl(140,58%,70%)", "hsl(25,90%,75%)", "hsl(210,70%,75%)"];
const PKR = (v: number) => `PKR ${v.toLocaleString()}`;

type DateRange = "7d" | "30d" | "90d" | "all";

const AdminAnalytics = () => {
  const [range, setRange] = useState<DateRange>("30d");

  const { data: analytics = [] } = useQuery({
    queryKey: ["admin-analytics-full"],
    queryFn: async () => {
      const { data } = await supabase.from("product_analytics").select("*, product:products(name, price)").order("created_at", { ascending: false }).limit(1000);
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

  const { data: profiles = [] } = useQuery({
    queryKey: ["admin-profiles"],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("*");
      return data || [];
    },
  });

  // Filter by range
  const threshold = useMemo(() => {
    if (range === "all") return new Date(0);
    const d = new Date();
    if (range === "7d") d.setDate(d.getDate() - 7);
    if (range === "30d") d.setDate(d.getDate() - 30);
    if (range === "90d") d.setDate(d.getDate() - 90);
    return d;
  }, [range]);

  const filteredAnalytics = useMemo(() => analytics.filter((a: any) => new Date(a.created_at) >= threshold), [analytics, threshold]);
  const filteredOrders = useMemo(() => orders.filter((o: any) => new Date(o.created_at) >= threshold), [orders, threshold]);

  // Event breakdown
  const eventData = useMemo(() => {
    const map: Record<string, number> = {};
    filteredAnalytics.forEach((a: any) => { map[a.event_type] = (map[a.event_type] || 0) + 1; });
    return Object.entries(map).map(([name, count]) => ({ name, count }));
  }, [filteredAnalytics]);

  // Top viewed products
  const topViewed = useMemo(() => {
    const map: Record<string, number> = {};
    filteredAnalytics.filter((a: any) => a.event_type === "view").forEach((a: any) => {
      const name = (a.product as any)?.name || "Unknown";
      map[name] = (map[name] || 0) + 1;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([name, views]) => ({ name: name.length > 20 ? name.slice(0, 20) + "…" : name, views }));
  }, [filteredAnalytics]);

  // Revenue by day
  const revenueByDay = useMemo(() => {
    const map: Record<string, number> = {};
    filteredOrders.forEach((o: any) => {
      const d = new Date(o.created_at).toLocaleDateString("en", { month: "short", day: "numeric" });
      map[d] = (map[d] || 0) + (o.total || 0);
    });
    return Object.entries(map).map(([name, revenue]) => ({ name, revenue }));
  }, [filteredOrders]);

  // Customer growth by month
  const customerGrowth = useMemo(() => {
    const map: Record<string, number> = {};
    profiles.forEach((p: any) => {
      const m = new Date(p.created_at).toLocaleDateString("en", { year: "2-digit", month: "short" });
      map[m] = (map[m] || 0) + 1;
    });
    return Object.entries(map).slice(-8).map(([name, count]) => ({ name, count }));
  }, [profiles]);

  // Best selling (by add_to_cart events)
  const bestSelling = useMemo(() => {
    const map: Record<string, { count: number; revenue: number }> = {};
    filteredAnalytics.filter((a: any) => a.event_type === "add_to_cart").forEach((a: any) => {
      const name = (a.product as any)?.name || "Unknown";
      const price = (a.product as any)?.price || 0;
      if (!map[name]) map[name] = { count: 0, revenue: 0 };
      map[name].count++;
      map[name].revenue += price;
    });
    return Object.entries(map).sort((a, b) => b[1].count - a[1].count).slice(0, 6).map(([name, v]) => ({
      name: name.length > 18 ? name.slice(0, 18) + "…" : name, ...v,
    }));
  }, [filteredAnalytics]);

  const totalRevenue = filteredOrders.reduce((s: number, o: any) => s + (o.total || 0), 0);
  const views = filteredAnalytics.filter((a: any) => a.event_type === "view").length;
  const addToCarts = filteredAnalytics.filter((a: any) => a.event_type === "add_to_cart").length;
  const conversionRate = views > 0 ? ((filteredOrders.length / views) * 100).toFixed(1) : "0";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold">Analytics</h1>
          <p className="text-sm text-muted-foreground">{filteredAnalytics.length} events tracked</p>
        </div>
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

      {/* Quick stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Revenue", value: PKR(totalRevenue), icon: TrendingUp, color: "bg-accent/30" },
          { label: "Product Views", value: views, icon: Eye, color: "bg-primary/20" },
          { label: "Add to Cart", value: addToCarts, icon: ShoppingCart, color: "bg-secondary/30" },
          { label: "Conversion Rate", value: `${conversionRate}%`, icon: MousePointerClick, color: "bg-accent/20" },
        ].map((s) => (
          <Card key={s.label} className="rounded-2xl border-border/30">
            <CardContent className="p-3">
              <div className={`w-8 h-8 rounded-xl ${s.color} flex items-center justify-center mb-1`}>
                <s.icon size={16} />
              </div>
              <p className="text-lg font-display font-bold">{s.value}</p>
              <p className="text-[10px] text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue + Events */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="rounded-2xl border-border/30">
          <CardHeader><CardTitle className="font-display text-base">Revenue Over Time</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={revenueByDay.length ? revenueByDay : [{ name: "No data", revenue: 0 }]}>
                <XAxis dataKey="name" fontSize={11} />
                <YAxis fontSize={11} tickFormatter={(v) => `₨${v}`} />
                <Tooltip formatter={(v: number) => [PKR(v), "Revenue"]} />
                <Area type="monotone" dataKey="revenue" stroke="hsl(350,80%,75%)" fill="hsl(350,80%,90%)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/30">
          <CardHeader><CardTitle className="font-display text-base">Event Breakdown</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={eventData.length ? eventData : [{ name: "No data", count: 0 }]}>
                <XAxis dataKey="name" fontSize={11} />
                <YAxis fontSize={11} />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(240,67%,80%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top viewed + Best selling */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="rounded-2xl border-border/30">
          <CardHeader><CardTitle className="font-display text-base">Most Viewed Products</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={topViewed.length ? topViewed : [{ name: "No data", views: 0 }]} layout="vertical">
                <XAxis type="number" fontSize={11} />
                <YAxis dataKey="name" type="category" fontSize={10} width={120} />
                <Tooltip />
                <Bar dataKey="views" fill="hsl(140,58%,70%)" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/30">
          <CardHeader><CardTitle className="font-display text-base">Best Selling (Add to Cart)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={bestSelling.length ? bestSelling : [{ name: "No data", count: 0 }]}>
                <XAxis dataKey="name" fontSize={10} />
                <YAxis fontSize={11} />
                <Tooltip formatter={(v: number, name: string) => [name === "revenue" ? PKR(v) : v, name]} />
                <Bar dataKey="count" fill="hsl(25,90%,75%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Customer Growth */}
      <Card className="rounded-2xl border-border/30">
        <CardHeader><CardTitle className="font-display text-base">Customer Growth</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={customerGrowth.length ? customerGrowth : [{ name: "No data", count: 0 }]}>
              <XAxis dataKey="name" fontSize={11} />
              <YAxis fontSize={11} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="hsl(280,60%,75%)" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAnalytics;

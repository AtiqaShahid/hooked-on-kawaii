import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, RefreshCw, MessageSquare, TrendingUp, AlertTriangle, BarChart3, PieChart as PieChartIcon, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from "recharts";

const CHART_COLORS = [
  "hsl(340, 65%, 70%)", "hsl(270, 50%, 70%)", "hsl(200, 60%, 65%)",
  "hsl(30, 70%, 65%)", "hsl(150, 50%, 60%)", "hsl(0, 60%, 70%)",
  "hsl(50, 70%, 60%)", "hsl(180, 50%, 60%)",
];

const AdminAIInsights = () => {
  const [insights, setInsights] = useState("");
  const [marketing, setMarketing] = useState("");
  const [loading, setLoading] = useState(false);
  const [marketingLoading, setMarketingLoading] = useState(false);

  const { data: products = [] } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const { data } = await supabase.from("products").select("*, category:categories(name)");
      return data || [];
    },
  });

  // Chart data computations
  const categoryData = useMemo(() => {
    const map: Record<string, { count: number; revenue: number }> = {};
    products.forEach((p: any) => {
      const cat = p.category?.name || "Uncategorized";
      if (!map[cat]) map[cat] = { count: 0, revenue: 0 };
      map[cat].count++;
      map[cat].revenue += p.price;
    });
    return Object.entries(map).map(([name, v]) => ({ name, products: v.count, revenue: v.revenue }));
  }, [products]);

  const topRated = useMemo(() =>
    [...products]
      .filter((p: any) => p.rating)
      .sort((a: any, b: any) => (b.rating * (b.review_count || 1)) - (a.rating * (a.review_count || 1)))
      .slice(0, 8)
      .map((p: any) => ({ name: p.name.length > 15 ? p.name.slice(0, 15) + "…" : p.name, rating: p.rating, reviews: p.review_count || 0 })),
    [products]
  );

  const priceDistribution = useMemo(() => {
    const ranges = [
      { range: "₹0-500", min: 0, max: 500, count: 0 },
      { range: "₹500-1K", min: 500, max: 1000, count: 0 },
      { range: "₹1K-2K", min: 1000, max: 2000, count: 0 },
      { range: "₹2K-3K", min: 2000, max: 3000, count: 0 },
      { range: "₹3K-5K", min: 3000, max: 5000, count: 0 },
      { range: "₹5K+", min: 5000, max: Infinity, count: 0 },
    ];
    products.forEach((p: any) => {
      const r = ranges.find(r => p.price >= r.min && p.price < r.max);
      if (r) r.count++;
    });
    return ranges.filter(r => r.count > 0).map(({ range, count }) => ({ range, count }));
  }, [products]);

  const stockHealth = useMemo(() => {
    let outOfStock = 0, low = 0, healthy = 0, high = 0;
    products.forEach((p: any) => {
      const s = p.stock_quantity ?? 0;
      if (s === 0) outOfStock++;
      else if (s < 10) low++;
      else if (s < 50) healthy++;
      else high++;
    });
    return [
      { name: "Out of Stock", value: outOfStock },
      { name: "Low (<10)", value: low },
      { name: "Healthy (10-50)", value: healthy },
      { name: "High (50+)", value: high },
    ].filter(d => d.value > 0);
  }, [products]);

  const avgPrice = products.length ? Math.round(products.reduce((s: number, p: any) => s + p.price, 0) / products.length) : 0;
  const avgRating = products.length ? (products.reduce((s: number, p: any) => s + (p.rating || 0), 0) / products.filter((p: any) => p.rating).length).toFixed(1) : "0";
  const totalReviews = products.reduce((s: number, p: any) => s + (p.review_count || 0), 0);
  const lowStockProducts = products.filter((p: any) => (p.stock_quantity || 0) < 10);

  const generateInsights = async () => {
    setLoading(true);
    try {
      const storeData = {
        products: products.map((p: any) => ({
          name: p.name, price: p.price, rating: p.rating, review_count: p.review_count,
          category: p.category?.name, colors: p.colors, badges: p.badges, stock_quantity: p.stock_quantity,
        })),
        totalProducts: products.length,
      };
      const { data, error } = await supabase.functions.invoke("ai-insights", {
        body: { type: "business-insights", data: storeData },
      });
      if (error) throw error;
      setInsights(data.insights);
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const generateMarketing = async () => {
    setMarketingLoading(true);
    try {
      const productData = products.slice(0, 5).map((p: any) => ({ name: p.name, price: p.price, description: p.description }));
      const { data, error } = await supabase.functions.invoke("ai-insights", {
        body: { type: "marketing", data: productData },
      });
      if (error) throw error;
      setMarketing(data.insights);
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setMarketingLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">AI Insights & Tools</h1>
        <p className="text-sm text-muted-foreground">AI-powered business intelligence with visual analytics</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Products", value: products.length, icon: BarChart3, color: "text-primary" },
          { label: "Avg. Price", value: `Rs. ${avgPrice.toLocaleString()}`, icon: TrendingUp, color: "text-emerald-500" },
          { label: "Avg. Rating", value: `${avgRating} ★`, icon: Star, color: "text-amber-500" },
          { label: "Total Reviews", value: totalReviews.toLocaleString(), icon: MessageSquare, color: "text-blue-500" },
        ].map((s) => (
          <Card key={s.label} className="rounded-2xl border-border/30">
            <CardContent className="p-4 flex items-center gap-3">
              <s.icon size={22} className={s.color} />
              <div>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="font-display font-bold text-lg">{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Visual Charts Row */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <Card className="rounded-2xl border-border/30">
          <CardHeader><CardTitle className="font-display text-base flex items-center gap-2"><PieChartIcon size={18} /> Products by Category</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={categoryData} dataKey="products" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={11}>
                  {categoryData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Price Distribution */}
        <Card className="rounded-2xl border-border/30">
          <CardHeader><CardTitle className="font-display text-base flex items-center gap-2"><BarChart3 size={18} /> Price Distribution</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={priceDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="range" fontSize={11} tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <YAxis fontSize={11} tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }} />
                <Bar dataKey="count" fill="hsl(340, 65%, 70%)" radius={[8, 8, 0, 0]} name="Products" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Rated Products */}
        <Card className="rounded-2xl border-border/30">
          <CardHeader><CardTitle className="font-display text-base flex items-center gap-2"><Star size={18} /> Top Rated Products</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={topRated} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" domain={[0, 5]} fontSize={11} tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <YAxis dataKey="name" type="category" width={110} fontSize={10} tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }} />
                <Bar dataKey="rating" fill="hsl(40, 80%, 60%)" radius={[0, 8, 8, 0]} name="Rating" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Stock Health */}
        <Card className="rounded-2xl border-border/30">
          <CardHeader><CardTitle className="font-display text-base flex items-center gap-2"><AlertTriangle size={18} /> Stock Health</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={stockHealth} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={4} label>
                  {stockHealth.map((_, i) => (
                    <Cell key={i} fill={["hsl(0, 60%, 60%)", "hsl(40, 80%, 60%)", "hsl(150, 50%, 55%)", "hsl(200, 60%, 60%)"][i]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alerts */}
      {lowStockProducts.length > 0 && (
        <Card className="rounded-2xl border-destructive/30 bg-destructive/5">
          <CardHeader><CardTitle className="font-display text-base flex items-center gap-2"><AlertTriangle size={18} className="text-destructive" /> Low Stock Alerts</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {lowStockProducts.map((p: any) => (
                <div key={p.id} className="flex justify-between items-center text-sm">
                  <span>{p.name}</span>
                  <span className="px-2 py-0.5 rounded-full bg-destructive/20 text-destructive text-xs font-medium">{p.stock_quantity} left</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Generated Content */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="rounded-2xl border-border/30">
          <CardHeader><CardTitle className="font-display text-base flex items-center gap-2"><TrendingUp size={18} /> AI Business Insights</CardTitle></CardHeader>
          <CardContent>
            <Button onClick={generateInsights} disabled={loading} className="rounded-xl mb-4 btn-squish">
              {loading ? <><RefreshCw size={16} className="animate-spin mr-1" /> Analyzing...</> : <><Sparkles size={16} className="mr-1" /> Generate Insights</>}
            </Button>
            {insights && (
              <div className="prose prose-sm max-w-none text-foreground/80 bg-muted/30 rounded-xl p-4 max-h-96 overflow-y-auto">
                <ReactMarkdown>{insights}</ReactMarkdown>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/30">
          <CardHeader><CardTitle className="font-display text-base flex items-center gap-2"><MessageSquare size={18} /> AI Marketing</CardTitle></CardHeader>
          <CardContent>
            <Button onClick={generateMarketing} disabled={marketingLoading} className="rounded-xl mb-4 btn-squish">
              {marketingLoading ? <><RefreshCw size={16} className="animate-spin mr-1" /> Writing...</> : <><Sparkles size={16} className="mr-1" /> Generate Content</>}
            </Button>
            {marketing && (
              <div className="prose prose-sm max-w-none text-foreground/80 bg-muted/30 rounded-xl p-4 max-h-96 overflow-y-auto">
                <ReactMarkdown>{marketing}</ReactMarkdown>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminAIInsights;

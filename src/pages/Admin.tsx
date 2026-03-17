import { useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Users, Package, Sparkles, RefreshCw, AlertTriangle, DollarSign, MessageSquare } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useProducts } from "@/hooks/useSupabaseData";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";

const Admin = () => {
  const { data: products = [] } = useProducts();
  const [insights, setInsights] = useState<string>("");
  const [marketingContent, setMarketingContent] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [marketingLoading, setMarketingLoading] = useState(false);

  const generateInsights = async () => {
    setLoading(true);
    try {
      const storeData = {
        products: products.map(p => ({
          name: p.name,
          price: p.price,
          rating: p.rating,
          review_count: p.review_count,
          category: p.category?.name,
          colors: p.colors,
          badges: p.badges,
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
      const productData = products.slice(0, 5).map(p => ({ name: p.name, price: p.price, description: p.description }));
      const { data, error } = await supabase.functions.invoke("ai-insights", {
        body: { type: "marketing", data: productData },
      });
      if (error) throw error;
      setMarketingContent(data.insights);
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setMarketingLoading(false);
    }
  };

  const stats = [
    { label: "Total Products", value: products.length, icon: Package, color: "bg-primary/20 text-primary-foreground" },
    { label: "Avg Rating", value: products.length ? (products.reduce((s, p) => s + (p.rating || 0), 0) / products.length).toFixed(1) : "0", icon: TrendingUp, color: "bg-secondary/50 text-secondary-foreground" },
    { label: "Total Reviews", value: products.reduce((s, p) => s + (p.review_count || 0), 0), icon: Users, color: "bg-accent/30 text-accent-foreground" },
    { label: "Featured", value: products.filter(p => p.is_featured).length, icon: Sparkles, color: "bg-primary/30 text-primary-foreground" },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-28 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">📊 Admin Dashboard</h1>
            <p className="text-muted-foreground font-body">AI-powered business insights for HookOnLoop</p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {stats.map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Card className="rounded-3xl border-border/50">
                  <CardContent className="p-5">
                    <div className={`w-10 h-10 rounded-2xl ${s.color} flex items-center justify-center mb-3`}>
                      <s.icon size={20} />
                    </div>
                    <p className="text-2xl font-display font-bold">{s.value}</p>
                    <p className="text-sm text-muted-foreground">{s.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* AI Insights Section */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="rounded-3xl border-border/50">
              <CardHeader>
                <CardTitle className="font-display flex items-center gap-2">
                  <BarChart3 size={20} /> AI Business Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button onClick={generateInsights} disabled={loading} className="rounded-2xl mb-4 btn-squish">
                  {loading ? <><RefreshCw size={16} className="animate-spin" /> Analyzing...</> : <><Sparkles size={16} /> Generate AI Insights</>}
                </Button>
                {insights && (
                  <div className="prose prose-sm max-w-none text-foreground/80 bg-muted/30 rounded-2xl p-4 max-h-96 overflow-y-auto">
                    <ReactMarkdown>{insights}</ReactMarkdown>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-border/50">
              <CardHeader>
                <CardTitle className="font-display flex items-center gap-2">
                  <MessageSquare size={20} /> AI Marketing Assistant
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button onClick={generateMarketing} disabled={marketingLoading} className="rounded-2xl mb-4 btn-squish">
                  {marketingLoading ? <><RefreshCw size={16} className="animate-spin" /> Writing...</> : <><Sparkles size={16} /> Generate Marketing Content</>}
                </Button>
                {marketingContent && (
                  <div className="prose prose-sm max-w-none text-foreground/80 bg-muted/30 rounded-2xl p-4 max-h-96 overflow-y-auto">
                    <ReactMarkdown>{marketingContent}</ReactMarkdown>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Product Performance Table */}
          <Card className="rounded-3xl border-border/50">
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2">
                <TrendingUp size={20} /> Product Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground">Product</th>
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground">Category</th>
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground">Price</th>
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground">Rating</th>
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground">Reviews</th>
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(p => (
                      <tr key={p.id} className="border-b border-border/30 hover:bg-muted/20">
                        <td className="py-3 px-2 font-medium">{p.name}</td>
                        <td className="py-3 px-2 text-muted-foreground">{p.category?.emoji} {p.category?.name}</td>
                        <td className="py-3 px-2">${p.price}</td>
                        <td className="py-3 px-2">⭐ {p.rating}</td>
                        <td className="py-3 px-2">{p.review_count}</td>
                        <td className="py-3 px-2">
                          {p.is_featured && <span className="px-2 py-1 rounded-full bg-accent/30 text-xs font-medium">Featured</span>}
                          {!p.is_featured && <span className="px-2 py-1 rounded-full bg-muted text-xs font-medium">Active</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Admin;

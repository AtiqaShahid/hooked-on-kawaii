import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, RefreshCw, MessageSquare, TrendingUp, AlertTriangle, DollarSign } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";

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

  const lowStockProducts = products.filter((p: any) => (p.stock_quantity || 0) < 10);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">AI Insights & Tools</h1>
        <p className="text-sm text-muted-foreground">AI-powered business intelligence</p>
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

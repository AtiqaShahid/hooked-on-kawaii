import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

const AdminAnalytics = () => {
  const { data: analytics = [] } = useQuery({
    queryKey: ["admin-analytics"],
    queryFn: async () => {
      const { data } = await supabase.from("product_analytics").select("*, product:products(name)").order("created_at", { ascending: false }).limit(500);
      return data || [];
    },
  });

  // Event type breakdown
  const eventCounts: Record<string, number> = {};
  analytics.forEach((a: any) => {
    eventCounts[a.event_type] = (eventCounts[a.event_type] || 0) + 1;
  });
  const eventData = Object.entries(eventCounts).map(([name, count]) => ({ name, count }));

  // Top viewed products
  const productViews: Record<string, number> = {};
  analytics.filter((a: any) => a.event_type === "view").forEach((a: any) => {
    const name = a.product?.name || "Unknown";
    productViews[name] = (productViews[name] || 0) + 1;
  });
  const topProducts = Object.entries(productViews).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([name, views]) => ({ name, views }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Analytics</h1>
        <p className="text-sm text-muted-foreground">{analytics.length} tracked events</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="rounded-2xl border-border/30">
          <CardHeader><CardTitle className="font-display text-base">Event Breakdown</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={eventData.length ? eventData : [{ name: "No data", count: 0 }]}>
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(350,100%,91%)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/30">
          <CardHeader><CardTitle className="font-display text-base">Top Viewed Products</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={topProducts.length ? topProducts : [{ name: "No data", views: 0 }]} layout="vertical">
                <XAxis type="number" fontSize={12} />
                <YAxis dataKey="name" type="category" fontSize={11} width={120} />
                <Tooltip />
                <Bar dataKey="views" fill="hsl(240,67%,94%)" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminAnalytics;

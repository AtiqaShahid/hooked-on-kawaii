import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const AdminCustomers = () => {
  const { data: profiles = [] } = useQuery({
    queryKey: ["admin-profiles"],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
      return data || [];
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Customers</h1>
        <p className="text-sm text-muted-foreground">{profiles.length} registered customers</p>
      </div>

      <Card className="rounded-2xl border-border/30">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/30">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Customer</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Loyalty Points</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Joined</th>
                </tr>
              </thead>
              <tbody>
                {profiles.map((p: any) => (
                  <tr key={p.id} className="border-b border-border/20 hover:bg-muted/20">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold">
                          {(p.display_name || "?")[0].toUpperCase()}
                        </div>
                        <span className="font-medium">{p.display_name || "Anonymous"}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4"><span className="px-2 py-0.5 rounded-full bg-accent/20 text-xs">{p.loyalty_points || 0} pts</span></td>
                    <td className="py-3 px-4 text-muted-foreground">{new Date(p.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
                {profiles.length === 0 && (
                  <tr><td colSpan={3} className="py-12 text-center text-muted-foreground">No customers yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCustomers;

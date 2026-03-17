import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const AdminCollections = () => {
  const { data: collections = [] } = useQuery({
    queryKey: ["admin-collections"],
    queryFn: async () => {
      const { data } = await supabase.from("collections").select("*").order("created_at", { ascending: false });
      return data || [];
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Collections</h1>
        <p className="text-sm text-muted-foreground">{collections.length} collections</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {collections.map((c: any) => (
          <Card key={c.id} className="rounded-2xl border-border/30">
            <CardContent className="p-4">
              <h3 className="font-display font-bold">{c.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{c.description}</p>
              <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
                {c.is_limited && <span className="px-2 py-0.5 bg-destructive/20 rounded-full">Limited</span>}
                <span>{c.is_active ? "✅ Active" : "⏸ Inactive"}</span>
                {c.available_count != null && <span>{c.available_count}/{c.total_count} available</span>}
              </div>
              {c.ends_at && (
                <p className="text-xs text-muted-foreground mt-1">Ends: {new Date(c.ends_at).toLocaleDateString()}</p>
              )}
            </CardContent>
          </Card>
        ))}
        {collections.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground">No collections yet</div>
        )}
      </div>
    </div>
  );
};

export default AdminCollections;

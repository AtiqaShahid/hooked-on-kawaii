import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const AdminStories = () => {
  const { data: stories = [] } = useQuery({
    queryKey: ["admin-stories"],
    queryFn: async () => {
      const { data } = await supabase.from("craft_stories").select("*").order("created_at", { ascending: false });
      return data || [];
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Craft Stories</h1>
        <p className="text-sm text-muted-foreground">{stories.length} stories</p>
      </div>

      <div className="space-y-3">
        {stories.map((s: any) => (
          <Card key={s.id} className="rounded-2xl border-border/30">
            <CardContent className="p-4">
              <h3 className="font-display font-bold">{s.title}</h3>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{s.content}</p>
              <div className="flex gap-2 mt-2 text-xs text-muted-foreground">
                {s.time_to_make && <span>⏱ {s.time_to_make}</span>}
                <span>{s.is_published ? "✅ Published" : "📝 Draft"}</span>
              </div>
            </CardContent>
          </Card>
        ))}
        {stories.length === 0 && (
          <Card className="rounded-2xl"><CardContent className="py-12 text-center text-muted-foreground">No stories yet</CardContent></Card>
        )}
      </div>
    </div>
  );
};

export default AdminStories;

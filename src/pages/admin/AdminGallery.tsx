import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { CheckCircle, Trash2 } from "lucide-react";

const AdminGallery = () => {
  const queryClient = useQueryClient();
  const { data: images = [] } = useQuery({
    queryKey: ["admin-gallery"],
    queryFn: async () => {
      const { data } = await supabase.from("gallery_images").select("*").order("created_at", { ascending: false });
      return data || [];
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, is_approved }: { id: string; is_approved: boolean }) => {
      const { error } = await supabase.from("gallery_images").update({ is_approved }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-gallery"] });
      toast({ title: "Updated" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("gallery_images").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-gallery"] });
      toast({ title: "Deleted" });
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Gallery</h1>
        <p className="text-sm text-muted-foreground">{images.filter((i: any) => !i.is_approved).length} pending approval</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((img: any) => (
          <Card key={img.id} className={`rounded-2xl border-border/30 overflow-hidden ${!img.is_approved ? "ring-2 ring-[hsl(var(--peach))]" : ""}`}>
            <div className="aspect-square bg-muted">
              <img src={img.image_url} alt={img.caption || ""} className="w-full h-full object-cover" />
            </div>
            <CardContent className="p-3">
              <p className="text-xs text-muted-foreground truncate">{img.caption || "No caption"}</p>
              <div className="flex gap-1 mt-2">
                <Button size="sm" variant={img.is_approved ? "secondary" : "default"} className="rounded-lg flex-1 text-xs"
                  onClick={() => updateMutation.mutate({ id: img.id, is_approved: !img.is_approved })}>
                  <CheckCircle size={12} className="mr-1" />{img.is_approved ? "Hide" : "Approve"}
                </Button>
                <Button size="sm" variant="ghost" className="rounded-lg text-destructive"
                  onClick={() => { if (confirm("Delete?")) deleteMutation.mutate(img.id); }}>
                  <Trash2 size={12} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {images.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground">No gallery images yet</div>
        )}
      </div>
    </div>
  );
};

export default AdminGallery;

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";

const emptyForm = { title: "", slug: "", content: "", image_url: "", time_to_make: "", is_published: true };

const AdminStories = () => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [form, setForm] = useState(emptyForm);

  const { data: stories = [] } = useQuery({
    queryKey: ["admin-stories"],
    queryFn: async () => {
      const { data } = await supabase.from("craft_stories").select("*").order("created_at", { ascending: false });
      return data || [];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (f: typeof form) => {
      const payload: any = {
        title: f.title,
        slug: f.slug || f.title.toLowerCase().replace(/\s+/g, "-"),
        content: f.content,
        image_url: f.image_url || null,
        time_to_make: f.time_to_make || null,
        is_published: f.is_published,
      };
      if (editItem) {
        const { error } = await supabase.from("craft_stories").update(payload).eq("id", editItem.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("craft_stories").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-stories"] });
      queryClient.invalidateQueries({ queryKey: ["craft-stories"] });
      setShowForm(false);
      setEditItem(null);
      setForm(emptyForm);
      toast({ title: editItem ? "Story updated" : "Story created" });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("craft_stories").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-stories"] });
      queryClient.invalidateQueries({ queryKey: ["craft-stories"] });
      toast({ title: "Story deleted" });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const openEdit = (s: any) => {
    setEditItem(s);
    setForm({
      title: s.title, slug: s.slug, content: s.content, image_url: s.image_url || "",
      time_to_make: s.time_to_make || "", is_published: s.is_published ?? true,
    });
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold">Craft Stories</h1>
          <p className="text-sm text-muted-foreground">{stories.length} stories</p>
        </div>
        <Button onClick={() => { setForm(emptyForm); setEditItem(null); setShowForm(true); }} className="rounded-xl btn-squish">
          <Plus size={16} className="mr-1" /> Add Story
        </Button>
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl">
          <DialogHeader><DialogTitle className="font-display">{editItem ? "Edit Story" : "Add Story"}</DialogTitle></DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(form); }} className="space-y-3">
            <Input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="rounded-xl" required />
            <Input placeholder="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="rounded-xl" />
            <textarea placeholder="Content / Story" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className="w-full rounded-xl border border-border/50 p-3 text-sm min-h-[120px] bg-background" required />
            <Input placeholder="Image URL" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="rounded-xl" />
            <Input placeholder="Time to make (e.g. 3 hours)" value={form.time_to_make} onChange={(e) => setForm({ ...form, time_to_make: e.target.value })} className="rounded-xl" />
            <label className="flex items-center gap-2 text-sm"><Switch checked={form.is_published} onCheckedChange={(v) => setForm({ ...form, is_published: v })} /> Published</label>
            <Button type="submit" disabled={saveMutation.isPending} className="w-full rounded-xl">
              {saveMutation.isPending && <Loader2 className="animate-spin mr-2" size={16} />}
              {editItem ? "Update" : "Create"} Story
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <div className="space-y-3">
        {stories.map((s: any) => (
          <Card key={s.id} className="rounded-2xl border-border/30">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-display font-bold">{s.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{s.content}</p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button variant="ghost" size="sm" onClick={() => openEdit(s)} className="rounded-lg"><Pencil size={14} /></Button>
                  <Button variant="ghost" size="sm" onClick={() => { if (confirm("Delete this story?")) deleteMutation.mutate(s.id); }} className="rounded-lg text-destructive"><Trash2 size={14} /></Button>
                </div>
              </div>
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

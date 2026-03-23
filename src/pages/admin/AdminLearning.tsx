import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Loader2, Download } from "lucide-react";

const emptyForm = { title: "", slug: "", content: "", category: "tutorial", difficulty: "beginner", image_url: "", download_url: "", is_published: true };

const AdminLearning = () => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [form, setForm] = useState(emptyForm);

  const { data: resources = [] } = useQuery({
    queryKey: ["admin-learning"],
    queryFn: async () => {
      const { data } = await supabase.from("learning_resources").select("*").order("created_at", { ascending: false });
      return data || [];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (f: typeof form) => {
      const payload: any = {
        title: f.title,
        slug: f.slug || f.title.toLowerCase().replace(/\s+/g, "-"),
        content: f.content,
        category: f.category,
        difficulty: f.difficulty,
        image_url: f.image_url || null,
        download_url: f.download_url || null,
        is_published: f.is_published,
      };
      if (editItem) {
        const { error } = await supabase.from("learning_resources").update(payload).eq("id", editItem.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("learning_resources").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-learning"] });
      queryClient.invalidateQueries({ queryKey: ["learning-resources"] });
      setShowForm(false);
      setEditItem(null);
      setForm(emptyForm);
      toast({ title: editItem ? "Resource updated" : "Resource created" });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("learning_resources").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-learning"] });
      toast({ title: "Resource deleted" });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const openEdit = (r: any) => {
    setEditItem(r);
    setForm({
      title: r.title, slug: r.slug, content: r.content, category: r.category,
      difficulty: r.difficulty || "beginner", image_url: r.image_url || "",
      download_url: r.download_url || "", is_published: r.is_published ?? true,
    });
    setShowForm(true);
  };

  const catEmoji: Record<string, string> = { tutorial: "📖", pattern: "🧶", tip: "💡" };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold">Learn Crochet</h1>
          <p className="text-sm text-muted-foreground">{resources.length} learning resources</p>
        </div>
        <Button onClick={() => { setForm(emptyForm); setEditItem(null); setShowForm(true); }} className="rounded-xl btn-squish">
          <Plus size={16} className="mr-1" /> Add Resource
        </Button>
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl">
          <DialogHeader><DialogTitle className="font-display">{editItem ? "Edit Resource" : "Add Resource"}</DialogTitle></DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(form); }} className="space-y-3">
            <Input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="rounded-xl" required />
            <Input placeholder="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="rounded-xl" />
            <div className="grid grid-cols-2 gap-3">
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger className="rounded-xl"><SelectValue placeholder="Category" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="tutorial">📖 Tutorial</SelectItem>
                  <SelectItem value="pattern">🧶 Pattern</SelectItem>
                  <SelectItem value="tip">💡 Tip</SelectItem>
                </SelectContent>
              </Select>
              <Select value={form.difficulty} onValueChange={(v) => setForm({ ...form, difficulty: v })}>
                <SelectTrigger className="rounded-xl"><SelectValue placeholder="Difficulty" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <textarea placeholder="Content (supports markdown or plain text)" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className="w-full rounded-xl border border-border/50 p-3 text-sm min-h-[120px] bg-background" required />
            <Input placeholder="Image URL" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="rounded-xl" />
            <Input placeholder="Download URL (pattern PDF, etc)" value={form.download_url} onChange={(e) => setForm({ ...form, download_url: e.target.value })} className="rounded-xl" />
            <label className="flex items-center gap-2 text-sm"><Switch checked={form.is_published} onCheckedChange={(v) => setForm({ ...form, is_published: v })} /> Published</label>
            <Button type="submit" disabled={saveMutation.isPending} className="w-full rounded-xl">
              {saveMutation.isPending && <Loader2 className="animate-spin mr-2" size={16} />}
              {editItem ? "Update" : "Create"} Resource
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <div className="space-y-3">
        {resources.map((r: any) => (
          <Card key={r.id} className="rounded-2xl border-border/30">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <span>{catEmoji[r.category] || "📄"}</span>
                    <h3 className="font-display font-bold">{r.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{r.content}</p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button variant="ghost" size="sm" onClick={() => openEdit(r)} className="rounded-lg"><Pencil size={14} /></Button>
                  <Button variant="ghost" size="sm" onClick={() => { if (confirm("Delete?")) deleteMutation.mutate(r.id); }} className="rounded-lg text-destructive"><Trash2 size={14} /></Button>
                </div>
              </div>
              <div className="flex gap-2 mt-2 text-xs text-muted-foreground">
                <span className="px-2 py-0.5 bg-secondary/30 rounded-full capitalize">{r.difficulty}</span>
                <span className="px-2 py-0.5 bg-primary/20 rounded-full capitalize">{r.category}</span>
                <span>{r.is_published ? "✅ Published" : "📝 Draft"}</span>
                {r.download_url && <span className="flex items-center gap-1"><Download size={10} /> Has download</span>}
              </div>
            </CardContent>
          </Card>
        ))}
        {resources.length === 0 && (
          <Card className="rounded-2xl"><CardContent className="py-12 text-center text-muted-foreground">No learning resources yet</CardContent></Card>
        )}
      </div>
    </div>
  );
};

export default AdminLearning;

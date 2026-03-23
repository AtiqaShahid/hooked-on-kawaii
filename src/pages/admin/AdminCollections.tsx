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

const emptyForm = { name: "", slug: "", description: "", image_url: "", is_active: true, is_limited: false, total_count: "", available_count: "", ends_at: "" };

const AdminCollections = () => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [form, setForm] = useState(emptyForm);

  const { data: collections = [] } = useQuery({
    queryKey: ["admin-collections"],
    queryFn: async () => {
      const { data } = await supabase.from("collections").select("*").order("created_at", { ascending: false });
      return data || [];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (f: typeof form) => {
      const payload: any = {
        name: f.name,
        slug: f.slug || f.name.toLowerCase().replace(/\s+/g, "-"),
        description: f.description || null,
        image_url: f.image_url || null,
        is_active: f.is_active,
        is_limited: f.is_limited,
        total_count: f.total_count ? parseInt(f.total_count) : null,
        available_count: f.available_count ? parseInt(f.available_count) : null,
        ends_at: f.ends_at || null,
      };
      if (editItem) {
        const { error } = await supabase.from("collections").update(payload).eq("id", editItem.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("collections").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-collections"] });
      queryClient.invalidateQueries({ queryKey: ["collections"] });
      setShowForm(false);
      setEditItem(null);
      setForm(emptyForm);
      toast({ title: editItem ? "Collection updated" : "Collection created" });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("collections").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-collections"] });
      queryClient.invalidateQueries({ queryKey: ["collections"] });
      toast({ title: "Collection deleted" });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const openEdit = (c: any) => {
    setEditItem(c);
    setForm({
      name: c.name, slug: c.slug, description: c.description || "", image_url: c.image_url || "",
      is_active: c.is_active ?? true, is_limited: c.is_limited ?? false,
      total_count: c.total_count ? String(c.total_count) : "", available_count: c.available_count ? String(c.available_count) : "",
      ends_at: c.ends_at ? c.ends_at.slice(0, 10) : "",
    });
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold">Collections</h1>
          <p className="text-sm text-muted-foreground">{collections.length} collections</p>
        </div>
        <Button onClick={() => { setForm(emptyForm); setEditItem(null); setShowForm(true); }} className="rounded-xl btn-squish">
          <Plus size={16} className="mr-1" /> Add Collection
        </Button>
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl">
          <DialogHeader><DialogTitle className="font-display">{editItem ? "Edit Collection" : "Add Collection"}</DialogTitle></DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(form); }} className="space-y-3">
            <Input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded-xl" required />
            <Input placeholder="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="rounded-xl" />
            <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full rounded-xl border border-border/50 p-3 text-sm min-h-[60px] bg-background" />
            <Input placeholder="Image URL" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="rounded-xl" />
            <div className="grid grid-cols-2 gap-3">
              <Input type="number" placeholder="Total count" value={form.total_count} onChange={(e) => setForm({ ...form, total_count: e.target.value })} className="rounded-xl" />
              <Input type="number" placeholder="Available count" value={form.available_count} onChange={(e) => setForm({ ...form, available_count: e.target.value })} className="rounded-xl" />
            </div>
            <Input type="date" placeholder="End date" value={form.ends_at} onChange={(e) => setForm({ ...form, ends_at: e.target.value })} className="rounded-xl" />
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-sm"><Switch checked={form.is_active} onCheckedChange={(v) => setForm({ ...form, is_active: v })} /> Active</label>
              <label className="flex items-center gap-2 text-sm"><Switch checked={form.is_limited} onCheckedChange={(v) => setForm({ ...form, is_limited: v })} /> Limited</label>
            </div>
            <Button type="submit" disabled={saveMutation.isPending} className="w-full rounded-xl">
              {saveMutation.isPending && <Loader2 className="animate-spin mr-2" size={16} />}
              {editItem ? "Update" : "Create"} Collection
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <div className="grid md:grid-cols-2 gap-4">
        {collections.map((c: any) => (
          <Card key={c.id} className="rounded-2xl border-border/30">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-display font-bold">{c.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{c.description}</p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button variant="ghost" size="sm" onClick={() => openEdit(c)} className="rounded-lg"><Pencil size={14} /></Button>
                  <Button variant="ghost" size="sm" onClick={() => { if (confirm("Delete this collection?")) deleteMutation.mutate(c.id); }} className="rounded-lg text-destructive"><Trash2 size={14} /></Button>
                </div>
              </div>
              <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
                {c.is_limited && <span className="px-2 py-0.5 bg-destructive/20 rounded-full">Limited</span>}
                <span>{c.is_active ? "✅ Active" : "⏸ Inactive"}</span>
                {c.available_count != null && <span>{c.available_count}/{c.total_count} available</span>}
              </div>
              {c.ends_at && <p className="text-xs text-muted-foreground mt-1">Ends: {new Date(c.ends_at).toLocaleDateString()}</p>}
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

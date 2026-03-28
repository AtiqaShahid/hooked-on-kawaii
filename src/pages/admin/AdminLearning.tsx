import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Loader2, Download, Upload, Video, Image as ImageIcon, Link, ExternalLink } from "lucide-react";

const emptyForm = {
  title: "", slug: "", content: "", category: "tutorial", difficulty: "beginner",
  image_url: "", download_url: "", is_published: true, type: "link" as string, external_url: "",
};

const AdminLearning = () => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [form, setForm] = useState(emptyForm);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const thumbRef = useRef<HTMLInputElement>(null);

  const { data: resources = [] } = useQuery({
    queryKey: ["admin-learning"],
    queryFn: async () => {
      const { data } = await supabase.from("learning_resources").select("*").order("created_at", { ascending: false });
      return data || [];
    },
  });

  const uploadFile = async (file: File, folder: string) => {
    const ext = file.name.split(".").pop();
    const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from("tutorials-media").upload(path, file);
    if (error) throw error;
    const { data: urlData } = supabase.storage.from("tutorials-media").getPublicUrl(path);
    return urlData.publicUrl;
  };

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    try {
      const url = await uploadFile(file, form.type === "video" ? "videos" : "images");
      setForm(prev => ({ ...prev, download_url: url }));
      toast({ title: "File uploaded successfully" });
    } catch (e: any) {
      toast({ title: "Upload failed", description: e.message, variant: "destructive" });
    }
    setUploading(false);
  };

  const handleThumbUpload = async (file: File) => {
    setUploading(true);
    try {
      const url = await uploadFile(file, "thumbnails");
      setForm(prev => ({ ...prev, image_url: url }));
      toast({ title: "Thumbnail uploaded" });
    } catch (e: any) {
      toast({ title: "Upload failed", description: e.message, variant: "destructive" });
    }
    setUploading(false);
  };

  const saveMutation = useMutation({
    mutationFn: async (f: typeof form) => {
      const payload: any = {
        title: f.title,
        slug: f.slug || f.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
        content: f.content,
        category: f.category,
        difficulty: f.difficulty,
        image_url: f.image_url || null,
        download_url: f.download_url || null,
        is_published: f.is_published,
        type: f.type,
        external_url: f.external_url || null,
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
      type: r.type || "link", external_url: r.external_url || "",
    });
    setShowForm(true);
  };

  const typeIcon = (type: string) => {
    if (type === "video") return <Video size={14} className="text-primary" />;
    if (type === "image") return <ImageIcon size={14} className="text-accent" />;
    return <Link size={14} className="text-secondary-foreground" />;
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
            <Input placeholder="Slug (auto-generated)" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="rounded-xl" />
            
            {/* Type selector */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Content Type</label>
              <div className="grid grid-cols-3 gap-2">
                {(["video", "image", "link"] as const).map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setForm({ ...form, type: t, download_url: "", external_url: "" })}
                    className={`flex items-center justify-center gap-1.5 p-2.5 rounded-xl border text-sm font-medium transition-all ${
                      form.type === t ? "border-primary bg-primary/10 text-primary" : "border-border/50 text-muted-foreground hover:border-primary/30"
                    }`}
                  >
                    {t === "video" && <Video size={16} />}
                    {t === "image" && <ImageIcon size={16} />}
                    {t === "link" && <Link size={16} />}
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
            </div>

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

            <textarea placeholder="Description" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className="w-full rounded-xl border border-border/50 p-3 text-sm min-h-[80px] bg-background" required />

            {/* Conditional upload / link section */}
            {form.type === "link" && (
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">External URL (YouTube, website, etc.)</label>
                <Input placeholder="https://youtube.com/watch?v=..." value={form.external_url} onChange={(e) => setForm({ ...form, external_url: e.target.value })} className="rounded-xl" />
              </div>
            )}

            {(form.type === "video" || form.type === "image") && (
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">
                  Upload {form.type === "video" ? "Video" : "Image"} File
                </label>
                <input
                  ref={fileRef}
                  type="file"
                  accept={form.type === "video" ? "video/*" : "image/*"}
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                />
                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={() => fileRef.current?.click()} disabled={uploading} className="rounded-xl flex-1">
                    {uploading ? <Loader2 className="animate-spin mr-2" size={14} /> : <Upload size={14} className="mr-2" />}
                    {form.download_url ? "Re-upload" : "Choose File"}
                  </Button>
                  {form.download_url && (
                    <span className="text-xs text-green-600 self-center">✅ Uploaded</span>
                  )}
                </div>
                <Input placeholder="Or paste file URL directly" value={form.download_url} onChange={(e) => setForm({ ...form, download_url: e.target.value })} className="rounded-xl text-xs" />
              </div>
            )}

            {/* Thumbnail */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Thumbnail Image</label>
              <input
                ref={thumbRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleThumbUpload(e.target.files[0])}
              />
              <div className="flex gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => thumbRef.current?.click()} disabled={uploading} className="rounded-xl">
                  <Upload size={12} className="mr-1" /> Upload Thumbnail
                </Button>
                {form.image_url && <img src={form.image_url} alt="" className="w-10 h-10 rounded-lg object-cover" />}
              </div>
              <Input placeholder="Or paste thumbnail URL" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="rounded-xl text-xs" />
            </div>

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
              <div className="flex justify-between items-start gap-3">
                <div className="flex gap-3 min-w-0">
                  {r.image_url && <img src={r.image_url} alt="" className="w-14 h-14 rounded-xl object-cover shrink-0" />}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span>{catEmoji[r.category] || "📄"}</span>
                      {typeIcon(r.type || "link")}
                      <h3 className="font-display font-bold truncate">{r.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{r.content}</p>
                    {r.external_url && (
                      <a href={r.external_url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary flex items-center gap-1 mt-1 hover:underline">
                        <ExternalLink size={10} /> {r.external_url.slice(0, 50)}...
                      </a>
                    )}
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button variant="ghost" size="sm" onClick={() => openEdit(r)} className="rounded-lg"><Pencil size={14} /></Button>
                  <Button variant="ghost" size="sm" onClick={() => { if (confirm("Delete?")) deleteMutation.mutate(r.id); }} className="rounded-lg text-destructive"><Trash2 size={14} /></Button>
                </div>
              </div>
              <div className="flex gap-2 mt-2 text-xs text-muted-foreground flex-wrap">
                <span className="px-2 py-0.5 bg-secondary/30 rounded-full capitalize">{r.difficulty}</span>
                <span className="px-2 py-0.5 bg-primary/20 rounded-full capitalize">{r.category}</span>
                <span className="px-2 py-0.5 bg-accent/20 rounded-full capitalize">{r.type || "link"}</span>
                <span>{r.is_published ? "✅ Published" : "📝 Draft"}</span>
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

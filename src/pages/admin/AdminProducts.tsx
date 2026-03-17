import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Search, Loader2, Percent } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const AdminProducts = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [editProduct, setEditProduct] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", slug: "", price: "", original_price: "", description: "", category_id: "", image_url: "", stock_quantity: "100", is_featured: false, badges: "" as string, colors: "" as string });

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const { data } = await supabase.from("products").select("*, category:categories(name, emoji)").order("created_at", { ascending: false });
      return data || [];
    },
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await supabase.from("categories").select("*").order("name");
      return data || [];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (product: any) => {
      const payload = {
        name: product.name,
        slug: product.slug || product.name.toLowerCase().replace(/\s+/g, "-"),
        price: parseFloat(product.price),
        original_price: product.original_price ? parseFloat(product.original_price) : null,
        description: product.description,
        category_id: product.category_id || null,
        image_url: product.image_url || null,
        stock_quantity: parseInt(product.stock_quantity) || 100,
        is_featured: product.is_featured,
        badges: product.badges ? product.badges.split(",").map((b: string) => b.trim()) : [],
        colors: product.colors ? product.colors.split(",").map((c: string) => c.trim()) : [],
      };

      if (editProduct) {
        const { error } = await supabase.from("products").update(payload).eq("id", editProduct.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("products").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      setShowForm(false);
      setEditProduct(null);
      resetForm();
      toast({ title: editProduct ? "Product updated" : "Product created" });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      toast({ title: "Product deleted" });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const toggleSaleMutation = useMutation({
    mutationFn: async ({ id, price, original_price, badges }: any) => {
      const isOnSale = badges?.includes("Sale");
      let newBadges: string[];
      let newOriginalPrice: number | null;
      if (isOnSale) {
        // Remove sale
        newBadges = (badges || []).filter((b: string) => b !== "Sale");
        newOriginalPrice = null;
      } else {
        // Put on sale — set original_price to current price, reduce price by 15%
        newBadges = [...(badges || []), "Sale"];
        newOriginalPrice = price;
      }
      const payload: any = { badges: newBadges, original_price: newOriginalPrice };
      if (!isOnSale) {
        payload.price = Math.round(price * 0.85);
      } else if (original_price) {
        payload.price = original_price;
      }
      const { error } = await supabase.from("products").update(payload).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      toast({ title: "Sale status updated" });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const resetForm = () => setForm({ name: "", slug: "", price: "", original_price: "", description: "", category_id: "", image_url: "", stock_quantity: "100", is_featured: false, badges: "", colors: "" });

  const openEdit = (p: any) => {
    setEditProduct(p);
    setForm({
      name: p.name, slug: p.slug, price: String(p.price), original_price: p.original_price ? String(p.original_price) : "",
      description: p.description || "", category_id: p.category_id || "", image_url: p.image_url || "",
      stock_quantity: String(p.stock_quantity || 100), is_featured: p.is_featured || false,
      badges: (p.badges || []).join(", "), colors: (p.colors || []).join(", "),
    });
    setShowForm(true);
  };

  const filtered = products.filter((p: any) => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold">Products</h1>
          <p className="text-sm text-muted-foreground">{products.length} products in your store</p>
        </div>
        <Button onClick={() => { resetForm(); setEditProduct(null); setShowForm(true); }} className="rounded-xl btn-squish">
          <Plus size={16} className="mr-1" /> Add Product
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 rounded-xl" />
      </div>

      {/* Product Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-display">{editProduct ? "Edit Product" : "Add Product"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(form); }} className="space-y-3">
            <Input placeholder="Product name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded-xl" required />
            <Input placeholder="Slug (auto-generated)" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="rounded-xl" />
            <div className="grid grid-cols-2 gap-3">
              <Input type="number" placeholder="Price (₨)" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="rounded-xl" required />
              <Input type="number" placeholder="Original price" value={form.original_price} onChange={(e) => setForm({ ...form, original_price: e.target.value })} className="rounded-xl" />
            </div>
            <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full rounded-xl border border-border/50 p-3 text-sm min-h-[80px] bg-background" />
            <Select value={form.category_id} onValueChange={(v) => setForm({ ...form, category_id: v })}>
              <SelectTrigger className="rounded-xl"><SelectValue placeholder="Category" /></SelectTrigger>
              <SelectContent>
                {categories.map((c: any) => (
                  <SelectItem key={c.id} value={c.id}>{c.emoji} {c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input placeholder="Image URL" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="rounded-xl" />
            <Input type="number" placeholder="Stock quantity" value={form.stock_quantity} onChange={(e) => setForm({ ...form, stock_quantity: e.target.value })} className="rounded-xl" />
            <Input placeholder="Badges (comma sep)" value={form.badges} onChange={(e) => setForm({ ...form, badges: e.target.value })} className="rounded-xl" />
            <Input placeholder="Colors (comma sep)" value={form.colors} onChange={(e) => setForm({ ...form, colors: e.target.value })} className="rounded-xl" />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} className="rounded" />
              Featured product
            </label>
            <Button type="submit" disabled={saveMutation.isPending} className="w-full rounded-xl">
              {saveMutation.isPending ? <Loader2 className="animate-spin mr-2" size={16} /> : null}
              {editProduct ? "Update Product" : "Create Product"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Products Table */}
      <Card className="rounded-2xl border-border/30">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/30">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Product</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground hidden md:table-cell">Category</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Price</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground hidden sm:table-cell">Stock</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p: any) => (
                  <tr key={p.id} className="border-b border-border/20 hover:bg-muted/20">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {p.image_url && <img src={p.image_url} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />}
                        <div>
                          <p className="font-medium">{p.name}</p>
                          {p.is_featured && <span className="text-xs text-primary">⭐ Featured</span>}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground hidden md:table-cell">{p.category?.emoji} {p.category?.name}</td>
                    <td className="py-3 px-4 font-medium">₨{p.price?.toLocaleString()}</td>
                    <td className="py-3 px-4 hidden sm:table-cell">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${(p.stock_quantity || 0) < 10 ? "bg-destructive/20 text-destructive" : "bg-accent/20"}`}>
                        {p.stock_quantity || 0}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => openEdit(p)} className="rounded-lg"><Pencil size={14} /></Button>
                        <Button variant="ghost" size="sm" onClick={() => { if (confirm("Delete this product?")) deleteMutation.mutate(p.id); }} className="rounded-lg text-destructive hover:text-destructive"><Trash2 size={14} /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={5} className="py-12 text-center text-muted-foreground">No products found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminProducts;

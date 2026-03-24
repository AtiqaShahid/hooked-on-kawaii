import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Save, Loader2 } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useStoreSetting, useUpdateSetting } from "@/hooks/useStoreSettings";
import { toast } from "@/hooks/use-toast";

type LoyaltyTier = {
  name: string;
  emoji: string;
  min: number;
  max: number;
  perks: string[];
};

const defaultTiers: LoyaltyTier[] = [
  { name: "Yarn Starter", emoji: "🧶", min: 0, max: 99, perks: ["5% off next order"] },
  { name: "Stitch Lover", emoji: "💕", min: 100, max: 299, perks: ["10% off", "Free keychain"] },
  { name: "Crochet VIP", emoji: "✨", min: 300, max: 599, perks: ["15% off", "Free mystery item", "Early access to drops"] },
  { name: "Hook Master", emoji: "👑", min: 600, max: 999999, perks: ["20% off", "Free surprise box", "Early access", "Exclusive designs"] },
];

const AdminLoyalty = () => {
  const queryClient = useQueryClient();
  const { data: savedTiers, isLoading: tiersLoading } = useStoreSetting("loyalty_tiers");
  const updateSetting = useUpdateSetting();

  const [tiers, setTiers] = useState<LoyaltyTier[]>(defaultTiers);
  const [editTier, setEditTier] = useState<LoyaltyTier | null>(null);
  const [editIndex, setEditIndex] = useState<number>(-1);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", emoji: "", min: "", max: "", perks: "" });

  useEffect(() => {
    if (savedTiers && Array.isArray(savedTiers) && savedTiers.length > 0) {
      setTiers(savedTiers as LoyaltyTier[]);
    }
  }, [savedTiers]);

  const { data: points = [] } = useQuery({
    queryKey: ["admin-loyalty-points"],
    queryFn: async () => {
      const { data } = await supabase.from("loyalty_points").select("*").order("created_at", { ascending: false });
      return data || [];
    },
  });

  const { data: profiles = [] } = useQuery({
    queryKey: ["admin-profiles"],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("*");
      return data || [];
    },
  });

  const userPoints: Record<string, { total: number; display_name: string }> = {};
  points.forEach((p: any) => {
    if (!userPoints[p.user_id]) userPoints[p.user_id] = { total: 0, display_name: "" };
    userPoints[p.user_id].total += p.points;
  });
  profiles.forEach((pr: any) => {
    if (userPoints[pr.user_id]) userPoints[pr.user_id].display_name = pr.display_name || "Unknown";
  });

  const userList = Object.entries(userPoints)
    .map(([uid, data]) => ({ uid, ...data, tier: tiers.find(t => data.total >= t.min && data.total <= t.max) || tiers[0] }))
    .sort((a, b) => b.total - a.total);

  const tierCounts = tiers.map(t => ({
    ...t,
    count: userList.filter(u => u.tier.name === t.name).length,
  }));

  const totalPointsIssued = points.reduce((s: number, p: any) => s + p.points, 0);

  const openEditTier = (tier: LoyaltyTier, index: number) => {
    setEditTier(tier);
    setEditIndex(index);
    setForm({ name: tier.name, emoji: tier.emoji, min: String(tier.min), max: tier.max >= 999999 ? "" : String(tier.max), perks: tier.perks.join(", ") });
    setShowForm(true);
  };

  const openAddTier = () => {
    setEditTier(null);
    setEditIndex(-1);
    setForm({ name: "", emoji: "⭐", min: "", max: "", perks: "" });
    setShowForm(true);
  };

  const saveTier = () => {
    const newTier: LoyaltyTier = {
      name: form.name,
      emoji: form.emoji,
      min: parseInt(form.min) || 0,
      max: form.max ? parseInt(form.max) : 999999,
      perks: form.perks ? form.perks.split(",").map(p => p.trim()).filter(Boolean) : [],
    };
    let updated: LoyaltyTier[];
    if (editIndex >= 0) {
      updated = [...tiers];
      updated[editIndex] = newTier;
    } else {
      updated = [...tiers, newTier];
    }
    updated.sort((a, b) => a.min - b.min);
    setTiers(updated);
    updateSetting.mutate({ key: "loyalty_tiers", value: updated });
    setShowForm(false);
  };

  const deleteTier = (index: number) => {
    const updated = tiers.filter((_, i) => i !== index);
    setTiers(updated);
    updateSetting.mutate({ key: "loyalty_tiers", value: updated });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold">⭐ Loyalty & Rewards</h1>
          <p className="text-sm text-muted-foreground">{userList.length} members · {totalPointsIssued} total points issued</p>
        </div>
        <Button onClick={openAddTier} className="rounded-xl btn-squish">
          <Plus size={16} className="mr-1" /> Add Tier
        </Button>
      </div>

      {/* Tier Edit Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-display">{editTier ? "Edit Tier" : "Add Tier"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-4 gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Emoji</label>
                <Input value={form.emoji} onChange={(e) => setForm({ ...form, emoji: e.target.value })} className="rounded-xl text-center text-xl" />
              </div>
              <div className="col-span-3">
                <label className="text-xs text-muted-foreground mb-1 block">Tier Name</label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded-xl" placeholder="e.g. Stitch Lover" required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Min Points</label>
                <Input type="number" value={form.min} onChange={(e) => setForm({ ...form, min: e.target.value })} className="rounded-xl" placeholder="0" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Max Points (empty = unlimited)</label>
                <Input type="number" value={form.max} onChange={(e) => setForm({ ...form, max: e.target.value })} className="rounded-xl" placeholder="∞" />
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Perks (comma-separated)</label>
              <Input value={form.perks} onChange={(e) => setForm({ ...form, perks: e.target.value })} className="rounded-xl" placeholder="10% off, Free keychain" />
            </div>
            <Button onClick={saveTier} disabled={!form.name || updateSetting.isPending} className="w-full rounded-xl">
              {updateSetting.isPending ? <Loader2 className="animate-spin mr-1" size={14} /> : <Save size={14} className="mr-1" />}
              {editTier ? "Update Tier" : "Add Tier"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Tier cards with edit/delete */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {tierCounts.map((t, i) => (
          <Card key={t.name} className="rounded-2xl border-border/30">
            <CardContent className="p-4 text-center relative">
              <div className="absolute top-2 right-2 flex gap-1">
                <Button variant="ghost" size="sm" onClick={() => openEditTier(t, i)} className="h-7 w-7 p-0 rounded-lg"><Pencil size={12} /></Button>
                <Button variant="ghost" size="sm" onClick={() => deleteTier(i)} className="h-7 w-7 p-0 rounded-lg text-destructive"><Trash2 size={12} /></Button>
              </div>
              <span className="text-2xl">{t.emoji}</span>
              <p className="font-display font-bold text-sm mt-1">{t.name}</p>
              <p className="text-2xl font-display font-bold text-primary">{t.count}</p>
              <p className="text-[10px] text-muted-foreground">{t.min}–{t.max >= 999999 ? "∞" : t.max} pts</p>
              {t.perks && t.perks.length > 0 && (
                <div className="mt-2 space-y-0.5">
                  {t.perks.map(p => <p key={p} className="text-[10px] text-foreground/60">✓ {p}</p>)}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Members table */}
      <Card className="rounded-2xl border-border/30">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/30">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Member</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Points</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Tier</th>
                </tr>
              </thead>
              <tbody>
                {userList.map(u => (
                  <tr key={u.uid} className="border-b border-border/20 hover:bg-muted/20">
                    <td className="py-3 px-4 font-medium">{u.display_name || u.uid.slice(0, 8)}</td>
                    <td className="py-3 px-4">{u.total}</td>
                    <td className="py-3 px-4"><span className="px-2 py-0.5 bg-primary/20 rounded-full text-xs">{u.tier.emoji} {u.tier.name}</span></td>
                  </tr>
                ))}
                {userList.length === 0 && (
                  <tr><td colSpan={3} className="py-12 text-center text-muted-foreground">No loyalty members yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Recent activity */}
      <Card className="rounded-2xl border-border/30">
        <CardContent className="p-4">
          <h3 className="font-display font-bold text-sm mb-3">Recent Activity</h3>
          <div className="space-y-2">
            {points.slice(0, 20).map((p: any) => (
              <div key={p.id} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{p.reason}</span>
                <div className="flex items-center gap-3">
                  <span className="font-medium text-primary">+{p.points}</span>
                  <span className="text-xs text-muted-foreground">{new Date(p.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
            {points.length === 0 && <p className="text-center text-muted-foreground text-sm">No activity yet</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLoyalty;

import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const tiers = [
  { name: "Yarn Starter", min: 0, max: 99, emoji: "🧶" },
  { name: "Stitch Lover", min: 100, max: 299, emoji: "💕" },
  { name: "Crochet VIP", min: 300, max: 599, emoji: "✨" },
  { name: "Hook Master", min: 600, max: Infinity, emoji: "👑" },
];

const AdminLoyalty = () => {
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

  // Aggregate points per user
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">⭐ Loyalty & Rewards</h1>
        <p className="text-sm text-muted-foreground">{userList.length} members · {totalPointsIssued} total points issued</p>
      </div>

      {/* Tier overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {tierCounts.map(t => (
          <Card key={t.name} className="rounded-2xl border-border/30">
            <CardContent className="p-4 text-center">
              <span className="text-2xl">{t.emoji}</span>
              <p className="font-display font-bold text-sm mt-1">{t.name}</p>
              <p className="text-2xl font-display font-bold text-primary">{t.count}</p>
              <p className="text-[10px] text-muted-foreground">{t.min}+ pts</p>
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

      {/* Recent point activity */}
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

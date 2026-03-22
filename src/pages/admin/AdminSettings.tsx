import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Plus, Trash2, Eye, EyeOff, Megaphone, Store, Truck, Mail, Percent, Image, Link, Type, CreditCard, Smartphone, Building2, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useStoreSettings, useUpdateSetting } from "@/hooks/useStoreSettings";

const AdminSettings = () => {
  const { data: settings, isLoading } = useStoreSettings();
  const updateSetting = useUpdateSetting();

  // Store Info
  const [storeInfo, setStoreInfo] = useState<any>({});
  // Shipping
  const [shipping, setShipping] = useState<any>({});
  // Announcements
  const [announcements, setAnnouncements] = useState<string[]>([]);
  const [newAnnouncement, setNewAnnouncement] = useState("");
  // Popup
  const [popup, setPopup] = useState<any>({});
  // Sale Banner
  const [saleBanner, setSaleBanner] = useState<any>({});
  // Payment Methods
  const [paymentMethods, setPaymentMethods] = useState<any>({});

  useEffect(() => {
    if (settings) {
      setStoreInfo(settings.store_info || {});
      setShipping(settings.shipping || {});
      setAnnouncements(settings.announcements || []);
      setPopup(settings.popup || {});
      setSaleBanner(settings.sale_banner || {});
    }
  }, [settings]);

  const saveSection = (key: string, value: any) => {
    updateSetting.mutate({ key, value });
  };

  if (isLoading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-primary" size={32} /></div>;
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-2xl font-bold">⚙️ Store Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your store configuration, announcements, and promotions</p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Store Information */}
        <Card className="rounded-2xl border-border/30">
          <CardHeader>
            <CardTitle className="font-display flex items-center gap-2 text-base"><Store size={18} /> Store Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Store Name</label>
              <Input value={storeInfo.name || ""} onChange={(e) => setStoreInfo({ ...storeInfo, name: e.target.value })} className="rounded-xl" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Currency</label>
                <Input value={storeInfo.currency || ""} onChange={(e) => setStoreInfo({ ...storeInfo, currency: e.target.value })} className="rounded-xl" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Country</label>
                <Input value={storeInfo.country || ""} onChange={(e) => setStoreInfo({ ...storeInfo, country: e.target.value })} className="rounded-xl" />
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Website</label>
              <Input value={storeInfo.website || ""} onChange={(e) => setStoreInfo({ ...storeInfo, website: e.target.value })} className="rounded-xl" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Instagram</label>
                <Input value={storeInfo.instagram || ""} onChange={(e) => setStoreInfo({ ...storeInfo, instagram: e.target.value })} className="rounded-xl" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">WhatsApp</label>
                <Input value={storeInfo.whatsapp || ""} onChange={(e) => setStoreInfo({ ...storeInfo, whatsapp: e.target.value })} className="rounded-xl" />
              </div>
            </div>
            <Button onClick={() => saveSection("store_info", storeInfo)} disabled={updateSetting.isPending} className="rounded-xl w-full">
              <Save size={14} className="mr-1" /> Save Store Info
            </Button>
          </CardContent>
        </Card>

        {/* Shipping Settings */}
        <Card className="rounded-2xl border-border/30">
          <CardHeader>
            <CardTitle className="font-display flex items-center gap-2 text-base"><Truck size={18} /> Shipping Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Delivery Time</label>
              <Input value={shipping.delivery_time || ""} onChange={(e) => setShipping({ ...shipping, delivery_time: e.target.value })} className="rounded-xl" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Advance Payment (₨)</label>
                <Input type="number" value={shipping.advance_payment || ""} onChange={(e) => setShipping({ ...shipping, advance_payment: parseInt(e.target.value) || 0 })} className="rounded-xl" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Free Shipping Above (₨)</label>
                <Input type="number" value={shipping.free_shipping_threshold || ""} onChange={(e) => setShipping({ ...shipping, free_shipping_threshold: parseInt(e.target.value) || 0 })} className="rounded-xl" />
              </div>
            </div>
            <Button onClick={() => saveSection("shipping", shipping)} disabled={updateSetting.isPending} className="rounded-xl w-full">
              <Save size={14} className="mr-1" /> Save Shipping
            </Button>
          </CardContent>
        </Card>

        {/* Announcement Marquee */}
        <Card className="rounded-2xl border-border/30">
          <CardHeader>
            <CardTitle className="font-display flex items-center gap-2 text-base"><Megaphone size={18} /> Announcements (Marquee)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs text-muted-foreground">These messages scroll at the top of your store.</p>
            <div className="space-y-2">
              {announcements.map((msg, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Input value={msg} onChange={(e) => { const u = [...announcements]; u[i] = e.target.value; setAnnouncements(u); }} className="rounded-xl flex-1 text-sm" />
                  <Button variant="ghost" size="sm" onClick={() => setAnnouncements(announcements.filter((_, j) => j !== i))} className="text-destructive shrink-0">
                    <Trash2 size={14} />
                  </Button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input placeholder="Add new announcement..." value={newAnnouncement} onChange={(e) => setNewAnnouncement(e.target.value)} className="rounded-xl flex-1" />
              <Button variant="outline" size="sm" onClick={() => { if (newAnnouncement.trim()) { setAnnouncements([...announcements, newAnnouncement.trim()]); setNewAnnouncement(""); } }} className="rounded-xl shrink-0">
                <Plus size={14} />
              </Button>
            </div>
            <Button onClick={() => saveSection("announcements", announcements)} disabled={updateSetting.isPending} className="rounded-xl w-full">
              <Save size={14} className="mr-1" /> Save Announcements
            </Button>
          </CardContent>
        </Card>

        {/* Popup Banner */}
        <Card className="rounded-2xl border-border/30">
          <CardHeader>
            <CardTitle className="font-display flex items-center gap-2 text-base"><Image size={18} /> Popup Banner</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Enable Popup</span>
              <Switch checked={popup.enabled || false} onCheckedChange={(v) => setPopup({ ...popup, enabled: v })} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Title</label>
              <Input value={popup.title || ""} onChange={(e) => setPopup({ ...popup, title: e.target.value })} className="rounded-xl" placeholder="🎉 Special Offer!" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Message</label>
              <textarea value={popup.message || ""} onChange={(e) => setPopup({ ...popup, message: e.target.value })} className="w-full rounded-xl border border-border/50 p-3 text-sm min-h-[60px] bg-background" placeholder="Get 20% off your first order..." />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Image URL (optional)</label>
              <Input value={popup.image_url || ""} onChange={(e) => setPopup({ ...popup, image_url: e.target.value })} className="rounded-xl" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Link URL (optional)</label>
              <Input value={popup.link || ""} onChange={(e) => setPopup({ ...popup, link: e.target.value })} className="rounded-xl" placeholder="/shop" />
            </div>
            <Button onClick={() => saveSection("popup", popup)} disabled={updateSetting.isPending} className="rounded-xl w-full">
              <Save size={14} className="mr-1" /> Save Popup
            </Button>
          </CardContent>
        </Card>

        {/* Sale Banner */}
        <Card className="rounded-2xl border-border/30 lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-display flex items-center gap-2 text-base"><Percent size={18} /> Sitewide Sale Banner</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Enable Sale Banner</span>
              <Switch checked={saleBanner.enabled || false} onCheckedChange={(v) => setSaleBanner({ ...saleBanner, enabled: v })} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Banner Text</label>
                <Input value={saleBanner.text || ""} onChange={(e) => setSaleBanner({ ...saleBanner, text: e.target.value })} className="rounded-xl" placeholder="🔥 SUMMER SALE — Up to 30% OFF!" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Discount %</label>
                <Input type="number" value={saleBanner.discount_percentage || ""} onChange={(e) => setSaleBanner({ ...saleBanner, discount_percentage: parseInt(e.target.value) || 0 })} className="rounded-xl" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">End Date</label>
                <Input type="date" value={saleBanner.end_date || ""} onChange={(e) => setSaleBanner({ ...saleBanner, end_date: e.target.value })} className="rounded-xl" />
              </div>
            </div>
            <Button onClick={() => saveSection("sale_banner", saleBanner)} disabled={updateSetting.isPending} className="rounded-xl w-full">
              <Save size={14} className="mr-1" /> Save Sale Banner
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminSettings;

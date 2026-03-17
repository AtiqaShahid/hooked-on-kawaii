import { Card, CardContent } from "@/components/ui/card";

const AdminSettings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground">Store configuration</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="rounded-2xl border-border/30">
          <CardContent className="p-6">
            <h3 className="font-display font-bold mb-3">🏪 Store Information</h3>
            <div className="space-y-2 text-sm">
              <p><strong>Store Name:</strong> HookOnLoop</p>
              <p><strong>Currency:</strong> PKR (₨)</p>
              <p><strong>Country:</strong> Pakistan</p>
              <p><strong>Website:</strong> hookonloop.com</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/30">
          <CardContent className="p-6">
            <h3 className="font-display font-bold mb-3">🚚 Shipping</h3>
            <div className="space-y-2 text-sm">
              <p><strong>Delivery Time:</strong> 2-4 days across Pakistan</p>
              <p><strong>Advance Payment:</strong> ₨500 required</p>
              <p><strong>Remaining:</strong> Cash on delivery</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/30">
          <CardContent className="p-6">
            <h3 className="font-display font-bold mb-3">🧸 Care Instructions</h3>
            <div className="space-y-2 text-sm">
              <p>• Wash gently with warm water</p>
              <p>• Air dry only</p>
              <p>• Keep away from sharp objects</p>
              <p>• Store in a cool, dry place</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/30">
          <CardContent className="p-6">
            <h3 className="font-display font-bold mb-3">📧 Contact</h3>
            <div className="space-y-2 text-sm">
              <p><strong>WhatsApp:</strong> Available on website</p>
              <p><strong>Instagram:</strong> @hookonloop</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminSettings;

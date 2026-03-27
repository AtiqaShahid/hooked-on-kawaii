import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Truck, CreditCard, Smartphone, Building2, Upload, Loader2, ImageIcon } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useStoreSetting } from "@/hooks/useStoreSettings";

type PaymentMethod = "cod" | "jazzcash" | "card" | "bank_transfer";

const PAYMENT_ICONS: Record<PaymentMethod, React.ReactNode> = {
  cod: <Truck size={20} />,
  jazzcash: <Smartphone size={20} />,
  card: <CreditCard size={20} />,
  bank_transfer: <Building2 size={20} />,
};

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const { data: paymentConfig, isLoading: loadingConfig } = useStoreSetting("payment_methods");

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | "">("");
  const [transactionId, setTransactionId] = useState("");
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [uploadingScreenshot, setUploadingScreenshot] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setScreenshotFile(file);
      setScreenshotPreview(URL.createObjectURL(file));
    }
  };

  if (items.length === 0 && !success) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-28 pb-20 px-6 text-center">
          <span className="text-5xl block mb-4">🛒</span>
          <p className="font-display text-xl font-bold mb-2">Your cart is empty</p>
          <Button onClick={() => navigate("/shop")} className="rounded-3xl mt-4">Go to Shop</Button>
        </div>
        <Footer />
      </div>
    );
  }

  const enabledMethods = paymentConfig
    ? (Object.entries(paymentConfig) as [PaymentMethod, any][]).filter(([, v]) => v.enabled)
    : [];

  const selectedConfig = paymentMethod ? paymentConfig?.[paymentMethod] : null;
  const codAdvance = paymentConfig?.cod?.advance_amount || 500;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !phone.trim() || !address.trim()) {
      toast({ title: "Please fill all fields", variant: "destructive" });
      return;
    }
    if (!paymentMethod) {
      toast({ title: "Please select a payment method", variant: "destructive" });
      return;
    }
    if (paymentMethod === "jazzcash" && !transactionId.trim()) {
      toast({ title: "Please enter your Transaction ID", variant: "destructive" });
      return;
    }
    if (paymentMethod === "cod" && !transactionId.trim()) {
      toast({ title: "Please enter advance payment Transaction ID", variant: "destructive" });
      return;
    }
    if (paymentMethod === "card" && selectedConfig?.coming_soon) {
      toast({ title: "Card payments coming soon!", description: "Please choose another method." });
      return;
    }

    setSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      const paymentStatus = paymentMethod === "cod"
        ? "cod_pending"
        : "pending";

      const { data: order, error: orderError } = await supabase.from("orders").insert({
        user_id: user?.id || null,
        total: totalPrice,
        status: paymentStatus,
        tracking_stage: "received",
        shipping_address: { name: customerName, phone, address } as any,
        notes: JSON.stringify({
          payment_method: paymentMethod,
          advance_required: paymentMethod === "cod",
          advance_amount: paymentMethod === "cod" ? codAdvance : 0,
        }),
      }).select().single();

      if (orderError) throw orderError;

      // Upload screenshot if provided
      if (screenshotFile) {
        setUploadingScreenshot(true);
        const fileExt = screenshotFile.name.split('.').pop();
        const filePath = `${order.id}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("payment-proofs")
          .upload(filePath, screenshotFile);
        if (!uploadError) {
          const { data: urlData } = supabase.storage.from("payment-proofs").getPublicUrl(filePath);
          await supabase.from("orders").update({ payment_screenshot: urlData.publicUrl }).eq("id", order.id);
        }
        setUploadingScreenshot(false);
      }

      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.type === "product" ? item.id : null,
        quantity: item.quantity,
        price: item.price,
        color: item.selectedColor || null,
        customizations: item.meta ? item.meta as any : null,
      }));
      await supabase.from("order_items").insert(orderItems);

      if (paymentMethod === "jazzcash" || paymentMethod === "cod") {
        await supabase.from("payment_submissions").insert({
          order_id: order.id,
          user_id: user?.id || null,
          customer_name: customerName,
          amount: paymentMethod === "cod" ? codAdvance : totalPrice,
          transaction_id: transactionId || null,
          payment_method: paymentMethod,
          status: "pending",
        });
      }

      await supabase.from("admin_notifications").insert({
        type: "payment",
        title: "New Order Received",
        message: `${customerName} placed an order for Rs. ${totalPrice.toLocaleString()} via ${selectedConfig?.label || paymentMethod}`,
        metadata: { order_id: order.id, amount: totalPrice, payment_method: paymentMethod } as any,
      });

      if (user) {
        const points = Math.floor(totalPrice / 100);
        if (points > 0) {
          await supabase.from("loyalty_points").insert({
            user_id: user.id, points, reason: "purchase", order_id: order.id,
          });
        }
      }

      clearCart();
      setSuccess(true);
      toast({ title: "Order placed successfully! 🎉" });
    } catch (err: any) {
      toast({ title: "Error placing order", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-28 pb-20 px-6">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-lg mx-auto text-center">
            <CheckCircle2 size={64} className="mx-auto text-green-500 mb-4" />
            <h1 className="font-display text-3xl font-bold mb-3">Order Placed! 🎉</h1>
            <p className="text-muted-foreground font-body mb-6">
              {paymentMethod === "cod"
                ? `Your order is confirmed! Please pay Rs. ${codAdvance} advance to finalize. We'll reach out with payment details.`
                : "We've received your payment details. Your order will be confirmed after verification."}
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => navigate("/orders")} className="rounded-3xl">Track Order</Button>
              <Button onClick={() => navigate("/shop")} variant="outline" className="rounded-3xl">Continue Shopping</Button>
            </div>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-28 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-display text-3xl md:text-4xl font-bold text-center mb-10">
            💳 Checkout
          </motion.h1>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Order Summary */}
            <Card className="rounded-3xl border-border/50">
              <CardContent className="p-6">
                <h2 className="font-display font-bold text-lg mb-4">Order Summary</h2>
                <div className="space-y-3 mb-4">
                  {items.map(item => (
                    <div key={item.id} className="flex justify-between items-center text-sm">
                      <span className="font-body">{item.name} × {item.quantity}</span>
                      <span className="font-semibold">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-border/50 pt-3">
                  <div className="flex justify-between font-display font-bold text-lg">
                    <span>Total</span>
                    <span>Rs. {totalPrice.toLocaleString()}</span>
                  </div>
                </div>

                {/* Payment Method Selection */}
                <div className="mt-6">
                  <h3 className="font-display font-semibold text-sm mb-3">Select Payment Method</h3>
                  {loadingConfig ? (
                    <div className="flex justify-center py-4"><Loader2 className="animate-spin text-primary" size={20} /></div>
                  ) : (
                    <RadioGroup value={paymentMethod} onValueChange={(v) => { setPaymentMethod(v as PaymentMethod); setTransactionId(""); }}>
                      <div className="space-y-2">
                        {enabledMethods.map(([key, config]) => (
                          <label
                            key={key}
                            className={`flex items-center gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${
                              paymentMethod === key
                                ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                                : "border-border/50 hover:border-primary/30"
                            } ${config.coming_soon ? "opacity-60" : ""}`}
                          >
                            <RadioGroupItem value={key} id={key} />
                            <span className="text-primary/70">{PAYMENT_ICONS[key]}</span>
                            <div className="flex-1">
                              <Label htmlFor={key} className="font-display font-semibold text-sm cursor-pointer">
                                {config.label} {config.coming_soon && <span className="text-xs text-muted-foreground ml-1">(Coming Soon)</span>}
                              </Label>
                              <p className="text-xs text-muted-foreground">{config.description}</p>
                            </div>
                          </label>
                        ))}
                      </div>
                    </RadioGroup>
                  )}
                </div>

                {/* COD Info */}
                {paymentMethod === "cod" && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-4 p-4 rounded-2xl bg-accent/50 border border-accent">
                    <p className="text-sm font-body">
                      <strong>Cash on Delivery selected.</strong> To confirm your order, a <strong>Rs. {codAdvance.toLocaleString()}</strong> advance payment is required. The remaining amount will be paid on delivery.
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">Our team will contact you with advance payment instructions after you place the order.</p>
                  </motion.div>
                )}

                {/* JazzCash Info */}
                {paymentMethod === "jazzcash" && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-4 p-4 rounded-2xl bg-accent/50 border border-accent">
                    <p className="text-sm font-body font-semibold mb-2">Send payment to:</p>
                    <div className="bg-card rounded-xl p-3 mb-2 space-y-1">
                      <p className="text-sm font-body">📱 JazzCash Number: <strong>03091447191</strong></p>
                      <p className="text-sm font-body">👤 Account Name: <strong>Atiqa Shahid</strong></p>
                    </div>
                    <p className="text-xs text-muted-foreground">After sending payment, enter your <strong>Transaction ID</strong> and optionally upload a screenshot below.</p>
                  </motion.div>
                )}
                {/* COD JazzCash advance info */}
                {paymentMethod === "cod" && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-2 p-3 rounded-2xl bg-card border border-border/50">
                    <p className="text-xs font-body text-muted-foreground">Send Rs. {codAdvance} advance to:</p>
                    <p className="text-xs font-body mt-1">📱 JazzCash: <strong>03091447191</strong> (Atiqa Shahid)</p>
                  </motion.div>
                )}
              </CardContent>
            </Card>

            {/* Payment Form */}
            <form onSubmit={handleSubmit}>
              <Card className="rounded-3xl border-border/50">
                <CardContent className="p-6 space-y-4">
                  <h2 className="font-display font-bold text-lg mb-2">Your Details</h2>
                  <input
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    placeholder="Full Name"
                    required
                    maxLength={100}
                    className="w-full p-3 rounded-2xl bg-card border border-border/50 text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <input
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="Phone Number"
                    required
                    maxLength={20}
                    className="w-full p-3 rounded-2xl bg-card border border-border/50 text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <textarea
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    placeholder="Shipping Address"
                    required
                    rows={3}
                    maxLength={500}
                    className="w-full p-3 rounded-2xl bg-card border border-border/50 text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  />

                  {/* JazzCash / COD Payment Proof */}
                  {(paymentMethod === "jazzcash" || paymentMethod === "cod") && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-t border-border/50 pt-4 space-y-3">
                      <h3 className="font-display font-semibold text-sm">Payment Verification</h3>
                      <input
                        value={transactionId}
                        onChange={e => setTransactionId(e.target.value)}
                        placeholder="Transaction ID"
                        required={paymentMethod === "jazzcash"}
                        maxLength={50}
                        className="w-full p-3 rounded-2xl bg-card border border-border/50 text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                      {/* Screenshot Upload */}
                      <div>
                        <input
                          type="file"
                          ref={fileInputRef}
                          accept="image/*"
                          onChange={handleScreenshotChange}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full p-3 rounded-2xl border border-dashed border-border text-sm font-body text-muted-foreground hover:border-primary/50 hover:bg-primary/5 transition-all flex items-center justify-center gap-2"
                        >
                          <Upload size={16} />
                          {screenshotFile ? screenshotFile.name : "Upload Payment Screenshot (Optional)"}
                        </button>
                        {screenshotPreview && (
                          <div className="mt-2 relative">
                            <img src={screenshotPreview} alt="Payment proof" className="w-full max-h-40 object-contain rounded-xl border border-border/50" />
                            <button
                              type="button"
                              onClick={() => { setScreenshotFile(null); setScreenshotPreview(null); }}
                              className="absolute top-1 right-1 w-6 h-6 bg-destructive text-destructive-foreground rounded-full text-xs flex items-center justify-center"
                            >
                              ✕
                            </button>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">Enter your transaction ID{paymentMethod === "cod" ? " for advance payment" : ""}.</p>
                    </motion.div>
                  )}

                  {/* Card coming soon */}
                  {paymentMethod === "card" && selectedConfig?.coming_soon && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-t border-border/50 pt-4">
                      <div className="p-4 rounded-2xl bg-muted/50 text-center">
                        <CreditCard size={32} className="mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm font-display font-semibold">Card Payments Coming Soon</p>
                        <p className="text-xs text-muted-foreground mt-1">We're working on integrating secure card payments. Please use another method for now.</p>
                      </div>
                    </motion.div>
                  )}

                  <Button
                    type="submit"
                    disabled={submitting || !paymentMethod || (paymentMethod === "card" && selectedConfig?.coming_soon)}
                    className="w-full rounded-3xl py-6 text-base font-display font-semibold btn-squish"
                  >
                    {submitting ? "Placing Order..." : `Place Order — Rs. ${totalPrice.toLocaleString()}`}
                  </Button>
                </CardContent>
              </Card>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;

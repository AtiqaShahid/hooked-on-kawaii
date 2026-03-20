import { useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, Upload, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !phone.trim() || !address.trim()) {
      toast({ title: "Please fill all fields", variant: "destructive" });
      return;
    }
    if (!transactionId.trim()) {
      toast({ title: "Please enter your JazzCash Transaction ID", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      // Create order
      const { data: order, error: orderError } = await supabase.from("orders").insert({
        user_id: user?.id || null,
        total: totalPrice,
        status: "pending",
        tracking_stage: "received",
        shipping_address: { name: customerName, phone, address } as any,
      }).select().single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.type === "product" ? item.id : null,
        quantity: item.quantity,
        price: item.price,
        color: item.selectedColor || null,
        customizations: item.meta ? item.meta as any : null,
      }));
      await supabase.from("order_items").insert(orderItems);

      // Submit payment
      await supabase.from("payment_submissions" as any).insert({
        order_id: order.id,
        user_id: user?.id || null,
        customer_name: customerName,
        amount: totalPrice,
        transaction_id: transactionId,
        payment_method: "jazzcash",
      });

      // Create admin notification
      await supabase.from("admin_notifications" as any).insert({
        type: "payment",
        title: "New Payment Received",
        message: `${customerName} paid Rs. ${totalPrice.toLocaleString()} via JazzCash (TID: ${transactionId})`,
        metadata: { order_id: order.id, amount: totalPrice, transaction_id: transactionId },
      });

      // Award loyalty points if logged in
      if (user) {
        const points = Math.floor(totalPrice / 100);
        if (points > 0) {
          await supabase.from("loyalty_points").insert({
            user_id: user.id,
            points,
            reason: "purchase",
            order_id: order.id,
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
              We've received your payment details. Your order will be confirmed after verification.
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

                {/* JazzCash Payment Info */}
                <div className="mt-6 p-4 rounded-2xl bg-[#e31e25]/5 border border-[#e31e25]/20">
                  <div className="flex items-center gap-2 mb-3">
                    <CreditCard size={18} className="text-[#e31e25]" />
                    <h3 className="font-display font-bold text-sm">Pay via JazzCash</h3>
                  </div>
                  <div className="space-y-1 text-sm font-body">
                    <p><span className="text-muted-foreground">Account Name:</span> <strong>Atiqa Shahid</strong></p>
                    <p><span className="text-muted-foreground">Number:</span> <strong>03091447191</strong></p>
                    <p><span className="text-muted-foreground">Amount:</span> <strong>Rs. {totalPrice.toLocaleString()}</strong></p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">
                    Send payment to the above account and enter the Transaction ID below.
                  </p>
                </div>
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

                  <div className="border-t border-border/50 pt-4">
                    <h3 className="font-display font-semibold text-sm mb-3">Payment Verification</h3>
                    <input
                      value={transactionId}
                      onChange={e => setTransactionId(e.target.value)}
                      placeholder="JazzCash Transaction ID"
                      required
                      maxLength={50}
                      className="w-full p-3 rounded-2xl bg-card border border-border/50 text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={submitting}
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

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Package, Scissors, CheckCircle2, Box, Truck, MapPin } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

const stages = [
  { key: "received", label: "Order Received", icon: Package, emoji: "📦" },
  { key: "crocheting", label: "Crocheting in Progress", icon: Scissors, emoji: "🧶" },
  { key: "quality_check", label: "Quality Check", icon: CheckCircle2, emoji: "✅" },
  { key: "packed", label: "Packed with Love", icon: Box, emoji: "🎀" },
  { key: "shipped", label: "Shipped", icon: Truck, emoji: "🚚" },
  { key: "delivered", label: "Delivered", icon: MapPin, emoji: "💕" },
];

type OrderItem = { id: string; product_id: string | null; quantity: number; price: number; color: string | null; product_name?: string };
type Order = { id: string; total: number; status: string; tracking_stage: string; created_at: string; is_mock?: boolean; items?: OrderItem[] };

const MOCK_ORDERS: Order[] = [
  { id: "demo-a1b2c3d4", total: 4500, status: "processing", tracking_stage: "crocheting", created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), is_mock: true, items: [{ id: "1", product_id: null, quantity: 2, price: 1500, color: null, product_name: "Crochet Sunflower Keychain" }, { id: "2", product_id: null, quantity: 1, price: 1500, color: null, product_name: "Mini Crochet Bunny" }] },
  { id: "demo-e5f6g7h8", total: 1500, status: "shipped", tracking_stage: "shipped", created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), is_mock: true, items: [{ id: "3", product_id: null, quantity: 1, price: 1500, color: null, product_name: "Rose Bouquet" }] },
];

const OrderTracker = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingMock, setUsingMock] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setOrders(MOCK_ORDERS);
        setUsingMock(true);
        setLoading(false);
        return;
      }

      const { data: ordersData } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (ordersData && ordersData.length > 0) {
        // Fetch order items with product names for each order
        const ordersWithItems = await Promise.all(
          ordersData.map(async (order) => {
            const { data: items } = await supabase
              .from("order_items")
              .select("id, product_id, quantity, price, color")
              .eq("order_id", order.id);

            const itemsWithNames = await Promise.all(
              (items || []).map(async (item) => {
                let product_name = "Unknown Product";
                if (item.product_id) {
                  const { data: product } = await supabase
                    .from("products")
                    .select("name")
                    .eq("id", item.product_id)
                    .single();
                  if (product) product_name = product.name;
                }
                return { ...item, product_name };
              })
            );

            return { ...order, items: itemsWithNames } as Order;
          })
        );
        setOrders(ordersWithItems);
      } else {
        setOrders(MOCK_ORDERS);
        setUsingMock(true);
      }
      setLoading(false);
    };
    fetchOrders();
  }, []);

  const getStageIndex = (stage: string) => stages.findIndex(s => s.key === stage);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-28 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-3">📦 Order Tracker</h1>
            <p className="text-muted-foreground font-body">Track your handmade crochet orders</p>
          </motion.div>

          {usingMock && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 text-center">
              <span className="inline-block px-4 py-2 rounded-full bg-muted text-xs font-medium text-muted-foreground">
                ✨ Sample orders shown — your real orders will appear here after you place one
              </span>
            </motion.div>
          )}

          {loading ? (
            <div className="flex justify-center py-20"><div className="yarn-spinner" /></div>
          ) : (
            <div className="space-y-6">
              {orders.map(order => {
                const currentIdx = getStageIndex(order.tracking_stage || "received");
                return (
                  <Card key={order.id} className="rounded-3xl border-border/50">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-center mb-6">
                        <div>
                          <p className="font-display font-semibold">Order #{order.id.slice(0, 8)}</p>
                          <p className="text-sm text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</p>
                          <p className="text-xs text-muted-foreground capitalize">Status: {order.status}</p>
                        </div>
                        <p className="font-display font-bold text-lg">Rs. {order.total.toLocaleString()}</p>
                      </div>

                      {/* Product list */}
                      {order.items && order.items.length > 0 && (
                        <div className="mb-4 p-3 rounded-2xl bg-muted/40">
                          <p className="text-xs font-semibold text-muted-foreground mb-2">Products:</p>
                          {order.items.map((item) => (
                            <div key={item.id} className="flex justify-between text-sm py-0.5">
                              <span className="font-body text-foreground">• {item.product_name} {item.color ? `(${item.color})` : ""}</span>
                              <span className="text-muted-foreground">x{item.quantity}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="relative">
                        {/* Progress bar */}
                        <div className="absolute top-5 left-5 right-5 h-0.5 bg-muted">
                          <motion.div
                            className="h-full bg-primary rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${(currentIdx / (stages.length - 1)) * 100}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                          />
                        </div>

                        <div className="flex justify-between relative">
                          {stages.map((stage, i) => {
                            const isComplete = i <= currentIdx;
                            const isCurrent = i === currentIdx;
                            return (
                              <div key={stage.key} className="flex flex-col items-center z-10">
                                <motion.div
                                  className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                                    isComplete ? "bg-primary" : "bg-muted"
                                  } ${isCurrent ? "ring-4 ring-primary/30" : ""}`}
                                  animate={isCurrent ? { scale: [1, 1.1, 1] } : {}}
                                  transition={{ duration: 2, repeat: Infinity }}
                                >
                                  {stage.emoji}
                                </motion.div>
                                <p className={`text-xs mt-2 text-center max-w-[60px] ${isComplete ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
                                  {stage.label}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OrderTracker;

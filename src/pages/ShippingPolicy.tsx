import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";

const ShippingPolicy = () => (
  <div className="min-h-screen">
    <Navbar />
    <div className="pt-28 pb-20 px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
        <h1 className="font-display text-4xl font-bold mb-8">📦 Shipping Policy</h1>
        <div className="prose prose-sm max-w-none space-y-6 text-foreground/80 font-body">
          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">Processing Time</h2>
            <p>Since all our products are handmade with love, orders take 3–7 business days to prepare before shipping. Custom orders may take longer depending on complexity.</p>
          </section>
          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">Delivery Time</h2>
            <p>Once shipped, delivery typically takes 2–5 business days within Pakistan. International orders may take 7–14 business days.</p>
          </section>
          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">Shipping Charges</h2>
            <p>We offer free shipping on orders above Rs. 3,000. For orders below this amount, a flat shipping fee of Rs. 200 applies.</p>
          </section>
          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">Order Tracking</h2>
            <p>Once your order is shipped, you will receive a tracking number via email or WhatsApp. You can also track your order from your account dashboard.</p>
          </section>
          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">Advance Payment</h2>
            <p>Pay Rs. 500 in advance to confirm your order. The remaining amount can be paid on delivery (COD).</p>
          </section>
        </div>
      </motion.div>
    </div>
    <Footer />
  </div>
);

export default ShippingPolicy;

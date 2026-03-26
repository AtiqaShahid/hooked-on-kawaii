import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";

const RefundPolicy = () => (
  <div className="min-h-screen">
    <Navbar />
    <div className="pt-28 pb-20 px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
        <h1 className="font-display text-4xl font-bold mb-8">💰 Refund Policy</h1>
        <div className="prose prose-sm max-w-none space-y-6 text-foreground/80 font-body">
          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">Eligibility</h2>
            <p>Refunds are available for items that arrive damaged or are significantly different from the product description. You must contact us within 48 hours of receiving your order.</p>
          </section>
          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">Non-Refundable Items</h2>
            <p>Custom-made and personalized crochet items cannot be refunded unless they arrive damaged or defective. Sale items and mystery boxes are also non-refundable.</p>
          </section>
          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">Process</h2>
            <p>To request a refund, contact us at hello@crochetworld.com with your order number and photos of the issue. Refunds are processed within 5–7 business days after approval.</p>
          </section>
        </div>
      </motion.div>
    </div>
    <Footer />
  </div>
);

export default RefundPolicy;

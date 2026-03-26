import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";

const ReturnPolicy = () => (
  <div className="min-h-screen">
    <Navbar />
    <div className="pt-28 pb-20 px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
        <h1 className="font-display text-4xl font-bold mb-8">🔄 Return Policy</h1>
        <div className="prose prose-sm max-w-none space-y-6 text-foreground/80 font-body">
          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">Return Window</h2>
            <p>We accept returns within 7 days of delivery for non-custom items in their original condition and packaging.</p>
          </section>
          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">How to Return</h2>
            <p>Contact us at hello@crochetworld.com with your order number. We will provide return shipping instructions. Items must be unused, unwashed, and in original packaging.</p>
          </section>
          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">Return Shipping</h2>
            <p>Return shipping costs are the buyer's responsibility unless the item arrived damaged or incorrect. Once we receive the returned item, we will process a refund or exchange within 5 business days.</p>
          </section>
        </div>
      </motion.div>
    </div>
    <Footer />
  </div>
);

export default ReturnPolicy;

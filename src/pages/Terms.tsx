import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";

const Terms = () => (
  <div className="min-h-screen">
    <Navbar />
    <div className="pt-28 pb-20 px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
        <h1 className="font-display text-4xl font-bold mb-8">📋 Terms & Conditions</h1>
        <div className="prose prose-sm max-w-none space-y-6 text-foreground/80 font-body">
          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">General</h2>
            <p>By using Crochet World's website and purchasing our products, you agree to these terms. All products are handmade and may have slight variations in color, size, and texture — this is the beauty of handmade items.</p>
          </section>
          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">Orders & Payment</h2>
            <p>An advance payment of Rs. 500 is required to confirm your order. The remaining balance is payable on delivery. Custom orders require full advance payment.</p>
          </section>
          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">Intellectual Property</h2>
            <p>All designs, images, and content on this website are the property of Crochet World and may not be reproduced without permission.</p>
          </section>
          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">Limitation of Liability</h2>
            <p>HookOnLoop is not responsible for delays caused by courier services. We are not liable for any indirect damages arising from the use of our products.</p>
          </section>
        </div>
      </motion.div>
    </div>
    <Footer />
  </div>
);

export default Terms;

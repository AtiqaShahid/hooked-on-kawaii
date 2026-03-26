import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";

const PrivacyPolicy = () => (
  <div className="min-h-screen">
    <Navbar />
    <div className="pt-28 pb-20 px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
        <h1 className="font-display text-4xl font-bold mb-8">🔒 Privacy Policy</h1>
        <div className="prose prose-sm max-w-none space-y-6 text-foreground/80 font-body">
          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">Information We Collect</h2>
            <p>We collect your name, email, shipping address, and order details when you make a purchase. We may also collect browsing data to improve your shopping experience.</p>
          </section>
          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">How We Use Your Information</h2>
            <p>Your data is used to process orders, provide customer support, send order updates, and improve our services. We never sell your personal information to third parties.</p>
          </section>
          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">Data Security</h2>
            <p>We use industry-standard security measures to protect your data. All payment information is encrypted and processed securely.</p>
          </section>
          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">Contact</h2>
            <p>For any privacy concerns, contact us at hello@crochetworld.com.</p>
          </section>
        </div>
      </motion.div>
    </div>
    <Footer />
  </div>
);

export default PrivacyPolicy;

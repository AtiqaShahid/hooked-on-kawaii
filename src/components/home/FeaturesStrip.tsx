import { motion } from "framer-motion";
import { Truck, Shield, Palette, Gift } from "lucide-react";

const features = [
  { icon: Truck, label: "Free Shipping", desc: "On orders PKR 4,000+" },
  { icon: Shield, label: "100% Handmade", desc: "Premium quality" },
  { icon: Palette, label: "Customizable", desc: "Your colors, your way" },
  { icon: Gift, label: "Gift Wrapping", desc: "Beautiful packaging" },
];

const FeaturesStrip = () => (
  <section className="py-12 px-6">
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {features.map((f, i) => (
          <motion.div
            key={f.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center gap-3 p-4 rounded-3xl bg-card/50"
          >
            <div className="w-12 h-12 rounded-2xl bg-primary/30 flex items-center justify-center shrink-0">
              <f.icon size={20} className="text-foreground/70" />
            </div>
            <div>
              <p className="font-display font-semibold text-sm">{f.label}</p>
              <p className="text-xs text-muted-foreground">{f.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesStrip;

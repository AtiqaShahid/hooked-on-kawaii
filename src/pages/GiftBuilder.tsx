import { useState } from "react";
import { motion } from "framer-motion";
import { Gift, Heart, Package, MessageSquare, ArrowRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const items = ["🌸 Crochet Rose", "🧸 Mini Bear", "🔑 Flower Keychain", "💐 Tulip Bouquet", "🎀 Scrunchie Set"];
const colorThemes = [
  { name: "Blush", colors: ["#FFD1DC", "#FFB6C1", "#FFF0F5"] },
  { name: "Lavender", colors: ["#E6E6FA", "#D8BFD8", "#DDA0DD"] },
  { name: "Spring", colors: ["#B2F2BB", "#FFD1DC", "#FFFACD"] },
  { name: "Ocean", colors: ["#AEC6FF", "#B2F2BB", "#E6E6FA"] },
];
const packagingStyles = ["🎁 Classic Box", "🎀 Ribbon Wrap", "🌿 Eco Kraft", "✨ Luxury Velvet"];

const GiftBuilder = () => {
  const [step, setStep] = useState(0);
  const [selectedItem, setSelectedItem] = useState("");
  const [selectedTheme, setSelectedTheme] = useState("");
  const [selectedPackaging, setSelectedPackaging] = useState("");
  const [message, setMessage] = useState("");

  const steps = ["Select Item", "Color Theme", "Packaging", "Message"];

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-28 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-3">🎁 Gift Builder</h1>
            <p className="text-muted-foreground font-body">Create a personalized crochet gift set</p>
          </motion.div>

          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-2 mb-12">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <button
                  onClick={() => setStep(i)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold font-display transition-all btn-squish ${
                    i <= step ? "bg-primary text-primary-foreground shadow-glow" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {i + 1}
                </button>
                {i < steps.length - 1 && <div className={`w-8 h-0.5 rounded-full ${i < step ? "bg-primary" : "bg-border"}`} />}
              </div>
            ))}
          </div>

          {/* Steps */}
          <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="min-h-[300px]">
            {step === 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {items.map((item) => (
                  <button
                    key={item}
                    onClick={() => { setSelectedItem(item); setStep(1); }}
                    className={`p-6 rounded-3xl text-left transition-all btn-squish ${
                      selectedItem === item ? "bg-primary/30 shadow-float ring-2 ring-primary" : "bg-card shadow-soft hover:shadow-float"
                    }`}
                  >
                    <span className="font-display text-lg font-semibold">{item}</span>
                  </button>
                ))}
              </div>
            )}
            {step === 1 && (
              <div className="grid grid-cols-2 gap-4">
                {colorThemes.map((t) => (
                  <button
                    key={t.name}
                    onClick={() => { setSelectedTheme(t.name); setStep(2); }}
                    className={`p-6 rounded-3xl transition-all btn-squish ${
                      selectedTheme === t.name ? "shadow-float ring-2 ring-primary" : "bg-card shadow-soft hover:shadow-float"
                    }`}
                  >
                    <div className="flex gap-2 mb-3">
                      {t.colors.map((c) => (
                        <div key={c} className="w-8 h-8 rounded-full shadow-sm" style={{ backgroundColor: c }} />
                      ))}
                    </div>
                    <span className="font-display font-semibold">{t.name}</span>
                  </button>
                ))}
              </div>
            )}
            {step === 2 && (
              <div className="grid grid-cols-2 gap-4">
                {packagingStyles.map((p) => (
                  <button
                    key={p}
                    onClick={() => { setSelectedPackaging(p); setStep(3); }}
                    className={`p-8 rounded-3xl text-center transition-all btn-squish ${
                      selectedPackaging === p ? "shadow-float ring-2 ring-primary" : "bg-card shadow-soft hover:shadow-float"
                    }`}
                  >
                    <span className="font-display text-lg font-semibold">{p}</span>
                  </button>
                ))}
              </div>
            )}
            {step === 3 && (
              <div className="max-w-md mx-auto">
                <div className="p-6 rounded-3xl bg-card shadow-soft mb-6">
                  <p className="font-display font-semibold mb-3 flex items-center gap-2"><MessageSquare size={18} /> Gift Message</p>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write a sweet message for the recipient..."
                    rows={4}
                    className="w-full rounded-2xl bg-muted/50 border-0 p-4 text-sm font-body placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  />
                </div>
                {/* Gift Preview */}
                <div className="p-8 rounded-3xl glass-panel shadow-float text-center mb-6">
                  <span className="text-5xl block mb-4">🎁</span>
                  <p className="font-display font-bold text-lg mb-1">Your Gift Set</p>
                  <p className="text-sm text-muted-foreground">{selectedItem} · {selectedTheme} · {selectedPackaging}</p>
                  {message && <p className="text-sm text-muted-foreground mt-2 italic">"{message}"</p>}
                </div>
                <button className="w-full py-4 rounded-3xl bg-primary text-primary-foreground font-display font-semibold shadow-glow btn-squish hover:shadow-float transition-all flex items-center justify-center gap-2">
                  <Gift size={18} /> Order Gift Set — PKR 4,500
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default GiftBuilder;

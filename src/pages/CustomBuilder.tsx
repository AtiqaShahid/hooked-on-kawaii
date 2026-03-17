import { useState } from "react";
import { motion } from "framer-motion";
import { Palette, Sparkles, RefreshCw, Save, Loader2 } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useCart } from "@/contexts/CartContext";
import { toast } from "@/hooks/use-toast";

const yarnTypes = ["Cotton", "Acrylic", "Wool Blend", "Bamboo"];
const sizes = ["Mini (3cm)", "Small (5cm)", "Medium (8cm)", "Large (12cm)"];
const attachments = ["None", "Keychain", "Pin", "Magnet", "Bag Charm"];
const colorOptions = [
  { name: "Blush Pink", hex: "#FFD1DC" },
  { name: "Lavender", hex: "#E6E6FA" },
  { name: "Mint", hex: "#B2F2BB" },
  { name: "Peach", hex: "#FFDAB9" },
  { name: "Baby Blue", hex: "#AEC6FF" },
  { name: "Sunshine", hex: "#FFE66D" },
  { name: "Coral", hex: "#FF9A8B" },
  { name: "Cream", hex: "#FFFDD0" },
];

const sizePrice: Record<string, number> = {
  "Mini (3cm)": 15,
  "Small (5cm)": 25,
  "Medium (8cm)": 35,
  "Large (12cm)": 50,
};

const attachmentPrice: Record<string, number> = {
  "None": 0, "Keychain": 3, "Pin": 2, "Magnet": 2, "Bag Charm": 4,
};

const CustomBuilder = () => {
  const [selectedColors, setSelectedColors] = useState<string[]>(["#FFD1DC"]);
  const [yarn, setYarn] = useState("Cotton");
  const [size, setSize] = useState("Small (5cm)");
  const [attachment, setAttachment] = useState("None");
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewGenerated, setPreviewGenerated] = useState(false);

  const totalPrice = (sizePrice[size] || 25) + (attachmentPrice[attachment] || 0);

  const toggleColor = (hex: string) => {
    setSelectedColors((prev) =>
      prev.includes(hex) ? prev.filter((c) => c !== hex) : [...prev, hex].slice(0, 3)
    );
    setPreviewGenerated(false);
  };

  const generatePreview = async () => {
    setIsGenerating(true);
    // Simulate AI generation — will be replaced with real AI call once Cloud is enabled
    await new Promise((r) => setTimeout(r, 2000));
    setIsGenerating(false);
    setPreviewGenerated(true);
    toast({ title: "Preview generated! ✨", description: "Your custom crochet design preview is ready." });
  };

  const handleOrder = () => {
    toast({
      title: "Custom order placed! 🎉",
      description: `Your ${size} ${yarn} crochet with ${attachment.toLowerCase()} attachment has been saved. We'll be in touch!`,
    });
  };

  const colorNames = selectedColors.map(
    (hex) => colorOptions.find((c) => c.hex === hex)?.name || hex
  );

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-28 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-3">🎨 Custom Crochet Builder</h1>
            <p className="text-muted-foreground font-body max-w-md mx-auto">Design your dream crochet piece — choose colors, size, and more!</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
            {/* Preview */}
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="sticky top-28">
              <div className="aspect-square rounded-3xl glass-panel shadow-float flex flex-col items-center justify-center p-8 relative overflow-hidden">
                <div className="absolute inset-0 stitch-bg opacity-20" />
                <div className="relative text-center">
                  {isGenerating ? (
                    <div className="flex flex-col items-center gap-4">
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
                        <Loader2 size={48} className="text-primary" />
                      </motion.div>
                      <p className="font-display font-semibold">Generating AI Preview...</p>
                      <p className="text-sm text-muted-foreground">Creating your custom design</p>
                    </div>
                  ) : previewGenerated ? (
                    <>
                      <div className="flex gap-2 justify-center mb-4">
                        {selectedColors.map((c) => (
                          <motion.div key={c} layout className="w-10 h-10 rounded-full shadow-soft border-2 border-card" style={{ backgroundColor: c }} />
                        ))}
                      </div>
                      <div className="w-40 h-40 mx-auto mb-4 rounded-3xl bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center relative overflow-hidden">
                        <span className="text-7xl">🧶</span>
                        <div className="absolute inset-0 bg-gradient-to-t from-card/20 to-transparent" />
                      </div>
                      <p className="font-display text-lg font-semibold mb-1">AI Generated Preview</p>
                      <p className="text-sm text-muted-foreground">{colorNames.join(" + ")} · {size} · {yarn}</p>
                      {attachment !== "None" && <p className="text-xs text-muted-foreground mt-1">+ {attachment}</p>}
                      <button
                        onClick={generatePreview}
                        className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-muted/80 text-sm font-medium btn-squish hover:bg-muted"
                      >
                        <RefreshCw size={14} /> Regenerate
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="flex gap-2 justify-center mb-6">
                        {selectedColors.map((c) => (
                          <motion.div key={c} layout className="w-10 h-10 rounded-full shadow-soft border-2 border-card" style={{ backgroundColor: c }} />
                        ))}
                      </div>
                      <span className="text-8xl block mb-4">🧶</span>
                      <p className="font-display text-lg font-semibold mb-1">Your Custom Piece</p>
                      <p className="text-sm text-muted-foreground">{size} · {yarn} · {attachment}</p>
                      <button
                        onClick={generatePreview}
                        className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-3xl bg-secondary text-secondary-foreground font-display font-semibold btn-squish shadow-glow hover:shadow-float transition-all text-sm"
                      >
                        <Sparkles size={16} /> Generate AI Preview
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Builder Form */}
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
              {/* Colors */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Palette size={18} className="text-muted-foreground" />
                  <h3 className="font-display font-semibold">Colors (up to 3)</h3>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {colorOptions.map((c) => (
                    <button
                      key={c.hex}
                      onClick={() => toggleColor(c.hex)}
                      className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-all btn-squish ${
                        selectedColors.includes(c.hex) ? "bg-card shadow-float ring-2 ring-primary" : "bg-card/50 shadow-soft hover:shadow-float"
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full shadow-sm" style={{ backgroundColor: c.hex }} />
                      <span className="text-xs font-medium">{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Yarn Type */}
              <div>
                <h3 className="font-display font-semibold mb-4">🧵 Yarn Type</h3>
                <div className="grid grid-cols-2 gap-3">
                  {yarnTypes.map((y) => (
                    <button
                      key={y}
                      onClick={() => { setYarn(y); setPreviewGenerated(false); }}
                      className={`px-4 py-3 rounded-2xl text-sm font-medium font-body transition-all btn-squish ${
                        yarn === y ? "bg-primary text-primary-foreground shadow-glow" : "bg-card shadow-soft"
                      }`}
                    >
                      {y}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size */}
              <div>
                <h3 className="font-display font-semibold mb-4">📏 Size</h3>
                <div className="grid grid-cols-2 gap-3">
                  {sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => { setSize(s); setPreviewGenerated(false); }}
                      className={`px-4 py-3 rounded-2xl text-sm font-medium font-body transition-all btn-squish ${
                        size === s ? "bg-primary text-primary-foreground shadow-glow" : "bg-card shadow-soft"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Attachment */}
              <div>
                <h3 className="font-display font-semibold mb-4">🔗 Attachment</h3>
                <div className="flex flex-wrap gap-2">
                  {attachments.map((a) => (
                    <button
                      key={a}
                      onClick={() => { setAttachment(a); setPreviewGenerated(false); }}
                      className={`px-4 py-2.5 rounded-3xl text-sm font-medium font-body transition-all btn-squish ${
                        attachment === a ? "bg-secondary text-secondary-foreground shadow-glow" : "bg-card shadow-soft"
                      }`}
                    >
                      {a} {attachmentPrice[a] > 0 ? `+Rs. ${attachmentPrice[a]}` : ""}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price & Order */}
              <div className="p-6 rounded-3xl bg-card shadow-float">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-display font-semibold">Estimated Price</span>
                  <span className="font-display text-2xl font-bold">Rs. {totalPrice.toLocaleString()}</span>
                </div>
                <button
                  onClick={handleOrder}
                  className="w-full py-4 rounded-3xl bg-primary text-primary-foreground font-display font-semibold shadow-glow btn-squish hover:shadow-float transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles size={18} /> Place Custom Order
                </button>
                <button className="w-full mt-3 py-3 rounded-3xl bg-muted text-foreground font-display font-medium btn-squish text-sm flex items-center justify-center gap-2">
                  <Save size={16} /> Save Design
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CustomBuilder;

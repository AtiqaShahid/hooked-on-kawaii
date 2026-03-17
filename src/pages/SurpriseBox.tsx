import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Gift, ShoppingBag, Sparkles } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";

type SurpriseBox = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
};

const boxEmojis = ["🎁", "✨", "🌟"];

const SurpriseBoxPage = () => {
  const [boxes, setBoxes] = useState<SurpriseBox[]>([]);
  const { addItem } = useCart();

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("surprise_boxes").select("*").order("price");
      if (data) setBoxes(data);
    };
    fetch();
  }, []);

  const handleAdd = (box: SurpriseBox) => {
    addItem({
      id: box.id,
      name: box.name,
      price: box.price,
      image: "",
      category: "surprise-box",
      badges: ["Mystery"],
      description: box.description || "",
      colors: [],
      rating: 5,
      reviews: 0,
    });
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-28 pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <motion.span className="text-6xl block mb-4" animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
              🎁
            </motion.span>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-3">Crochet Mystery Box</h1>
            <p className="text-muted-foreground font-body max-w-lg mx-auto">Surprise yourself with a box of handmade crochet goodies! You never know what you'll get — but it'll be adorable.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {boxes.map((box, i) => (
              <motion.div key={box.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }}>
                <Card className="rounded-3xl border-border/50 card-hover text-center overflow-hidden">
                  <div className="aspect-square bg-gradient-hero flex items-center justify-center">
                    <motion.span className="text-7xl" animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}>
                      {boxEmojis[i] || "🎁"}
                    </motion.span>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-display text-xl font-bold mb-2">{box.name}</h3>
                    <p className="text-muted-foreground text-sm mb-4">{box.description}</p>
                    <p className="text-3xl font-display font-bold mb-4">PKR {box.price.toLocaleString()}</p>
                    <Button onClick={() => handleAdd(box)} className="w-full rounded-2xl btn-squish">
                      <ShoppingBag size={16} /> Add to Cart
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SurpriseBoxPage;

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

type ProofItem = { product_name: string; city: string; name: string };

const PAKISTANI_NAMES = [
  "Ayesha", "Fatima", "Hira", "Zainab", "Amna", "Sana", "Mahnoor", "Iqra",
  "Maryam", "Noor", "Rabia", "Saima", "Sidra", "Anum", "Bushra", "Kiran",
  "Mehreen", "Nimra", "Urooj", "Areeba", "Laiba", "Rida", "Aliza", "Hania",
];

const pickName = (idx: number) => PAKISTANI_NAMES[idx % PAKISTANI_NAMES.length];

const SocialProofToast = () => {
  const [current, setCurrent] = useState<ProofItem | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const fetchProof = async () => {
      const { data } = await supabase
        .from("social_proof_log")
        .select("city, product:products(name)")
        .order("created_at", { ascending: false })
        .limit(10);

      if (!data?.length) return;

      const items = data.map((d: any, i: number) => ({
        product_name: d.product?.name || "a crochet item",
        city: d.city || "somewhere beautiful",
        name: pickName(i),
      }));

      let idx = 0;
      const showNext = () => {
        setCurrent(items[idx % items.length]);
        setShow(true);
        setTimeout(() => setShow(false), 4000);
        idx++;
      };

      const timer = setInterval(showNext, 15000);
      setTimeout(showNext, 5000);

      return () => clearInterval(timer);
    };

    fetchProof();
  }, []);

  return (
    <AnimatePresence>
      {show && current && (
        <motion.div
          initial={{ opacity: 0, x: -100, y: 20 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: -100 }}
          className="fixed bottom-6 left-6 z-50 max-w-xs"
        >
          <div className="glass-panel rounded-2xl px-4 py-3 shadow-float flex items-center gap-3">
            <span className="text-2xl">🛍️</span>
            <div>
              <p className="text-sm font-body">
                <span className="font-semibold">{current.name}</span> from <span className="font-semibold">{current.city}</span> just bought
              </p>
              <p className="text-sm font-display font-semibold text-foreground">{current.product_name}!</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SocialProofToast;

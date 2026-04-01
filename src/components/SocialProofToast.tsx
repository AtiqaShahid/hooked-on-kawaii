import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

type ProofItem = { product_name: string; city: string; name: string };

const NAMES = [
  "Ayesha", "Fatima", "Hira", "Zainab", "Amna", "Sana", "Mahnoor", "Iqra",
  "Maryam", "Noor", "Rabia", "Saima", "Sidra", "Anum", "Bushra", "Kiran",
  "Mehreen", "Nimra", "Urooj", "Areeba", "Laiba", "Rida", "Aliza", "Hania",
  "Ali", "Ahmed", "Hassan", "Usman", "Bilal", "Hamza", "Omar", "Saad",
];

const CITIES = [
  "Lahore", "Karachi", "Islamabad", "Rawalpindi", "Faisalabad",
  "Multan", "Peshawar", "Quetta", "Sialkot", "Hyderabad",
  "Gujranwala", "Bahawalpur", "Sargodha", "Abbottabad", "Mardan",
];

const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
const randDelay = () => 1000 + Math.random() * 9000; // 1–10s

const SocialProofToast = () => {
  const [current, setCurrent] = useState<ProofItem | null>(null);
  const [show, setShow] = useState(false);
  const productsRef = useRef<string[]>([]);
  const lastShownRef = useRef<string>("");
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const pickProduct = useCallback(() => {
    const products = productsRef.current;
    if (products.length === 0) return null;
    if (products.length === 1) return products[0];
    let chosen: string;
    do {
      chosen = pick(products);
    } while (chosen === lastShownRef.current);
    lastShownRef.current = chosen;
    return chosen;
  }, []);

  const showNext = useCallback(() => {
    const productName = pickProduct();
    if (!productName) return;
    setCurrent({ product_name: productName, name: pick(NAMES), city: pick(CITIES) });
    setShow(true);
    setTimeout(() => {
      setShow(false);
      timerRef.current = setTimeout(showNext, randDelay());
    }, 4000);
  }, [pickProduct]);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase
        .from("products")
        .select("name")
        .eq("is_active", true);
      if (!data?.length) return;
      productsRef.current = data.map((p) => p.name);
      timerRef.current = setTimeout(showNext, 3000 + Math.random() * 4000);
    };
    fetchProducts();
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [showNext]);

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

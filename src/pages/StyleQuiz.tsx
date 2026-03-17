import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useProducts } from "@/hooks/useSupabaseData";

const questions = [
  { id: "aesthetic", question: "What's your vibe?", options: ["Pastel & Soft 🌸", "Bold & Colorful 🌈", "Minimalist & Clean ✨", "Vintage & Cozy 🧸"] },
  { id: "occasion", question: "What's the occasion?", options: ["Gift for someone 🎁", "Treat myself 💕", "Home decoration 🏠", "Just browsing 👀"] },
  { id: "size", question: "What size do you prefer?", options: ["Mini / Keychain 🔑", "Medium / Desk size 🌻", "Large / Bouquet 💐", "Any size! 🎀"] },
  { id: "color", question: "Pick your color family!", options: ["Pink & Blush 💗", "Lavender & Purple 💜", "Yellow & Sunshine ☀️", "Mixed pastels 🌷"] },
];

const StyleQuiz = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const { data: products = [] } = useProducts();

  const handleAnswer = (option: string) => {
    const q = questions[step];
    const newAnswers = { ...answers, [q.id]: option };
    setAnswers(newAnswers);

    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setShowResults(true);
    }
  };

  const getRecommendations = () => {
    // Simple matching based on answers
    let recs = [...products];
    const colorAnswer = answers.color || "";
    const sizeAnswer = answers.size || "";

    if (colorAnswer.includes("Pink")) recs = recs.filter(p => p.colors?.some((c: string) => c.includes("FF") || c.includes("pink")));
    if (sizeAnswer.includes("Keychain")) recs = recs.filter(p => p.category?.slug === "keychains" || p.name.toLowerCase().includes("keychain"));

    return recs.length > 0 ? recs.slice(0, 4) : products.slice(0, 4);
  };

  const restart = () => {
    setStep(0);
    setAnswers({});
    setShowResults(false);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-28 pb-20 px-6">
        <div className="max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-3">🎀 Crochet Style Quiz</h1>
            <p className="text-muted-foreground font-body">Find your perfect crochet match!</p>
          </motion.div>

          {!showResults ? (
            <AnimatePresence mode="wait">
              <motion.div key={step} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
                <div className="text-center mb-2 text-sm text-muted-foreground">Question {step + 1} of {questions.length}</div>
                <div className="w-full h-2 rounded-full bg-muted mb-8">
                  <motion.div className="h-full rounded-full bg-primary" initial={{ width: 0 }} animate={{ width: `${((step + 1) / questions.length) * 100}%` }} />
                </div>

                <Card className="rounded-3xl border-border/50">
                  <CardContent className="p-8 text-center">
                    <h2 className="font-display text-2xl font-bold mb-6">{questions[step].question}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {questions[step].options.map(option => (
                        <button
                          key={option}
                          onClick={() => handleAnswer(option)}
                          className="p-4 rounded-2xl bg-muted/30 border border-border/50 text-sm font-body font-medium hover:bg-primary/20 hover:border-primary/50 transition-all btn-squish"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <Card className="rounded-3xl border-border/50">
                <CardContent className="p-8 text-center">
                  <motion.span className="text-5xl block mb-4" animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 1 }}>
                    ✨
                  </motion.span>
                  <h2 className="font-display text-2xl font-bold mb-2">Your Perfect Picks!</h2>
                  <p className="text-muted-foreground text-sm mb-6">Based on your style, we think you'll love these:</p>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {getRecommendations().map(p => (
                      <Link key={p.id} to={`/product/${p.id}`} className="block">
                        <div className="p-4 rounded-2xl bg-muted/20 hover:bg-primary/10 transition-all">
                          <span className="text-3xl block mb-2">{p.category?.emoji || "🧶"}</span>
                          <p className="font-display font-semibold text-sm">{p.name}</p>
                          <p className="text-primary font-bold">PKR {p.price.toLocaleString()}</p>
                        </div>
                      </Link>
                    ))}
                  </div>

                  <div className="flex gap-3 justify-center">
                    <Button onClick={restart} variant="outline" className="rounded-2xl btn-squish">
                      <RefreshCw size={16} /> Retake Quiz
                    </Button>
                    <Button asChild className="rounded-2xl btn-squish">
                      <Link to="/shop"><Sparkles size={16} /> Shop All</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default StyleQuiz;

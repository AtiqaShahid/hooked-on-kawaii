import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { supabase } from "@/integrations/supabase/client";

type Msg = { role: "user" | "assistant"; content: string };

const AIChatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Hi! 🧶 I'm your crochet assistant. Ask me anything about our products, orders, care tips, or custom designs!" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Msg = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("chatbot", {
        body: { messages: newMessages.map(m => ({ role: m.role, content: m.content })) },
      });
      if (error) throw error;
      setMessages(prev => [...prev, { role: "assistant", content: data?.reply || "Sorry, I couldn't process that. Please try again!" }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Oops! Something went wrong. Please try again. 💕" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Toggle button */}
      <motion.button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary shadow-glow flex items-center justify-center text-primary-foreground hover:shadow-float transition-all btn-squish"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-[340px] max-h-[480px] bg-card rounded-3xl shadow-float border border-border/50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="px-5 py-4 bg-primary/20 border-b border-border/30">
              <h3 className="font-display font-semibold text-sm flex items-center gap-2">🧶 Crochet Assistant</h3>
              <p className="text-xs text-muted-foreground">Ask me anything!</p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[250px] max-h-[320px]">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm font-body ${
                    m.role === "user" ? "bg-primary/40 text-foreground" : "bg-muted/50 text-foreground"
                  }`}>
                    {m.role === "assistant" ? (
                      <div className="prose prose-sm max-w-none [&>p]:m-0 [&>ul]:my-1 [&>ol]:my-1">
                        <ReactMarkdown>{m.content}</ReactMarkdown>
                      </div>
                    ) : m.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="px-4 py-3 rounded-2xl bg-muted/50">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 rounded-full bg-foreground/30 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 rounded-full bg-foreground/30 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 rounded-full bg-foreground/30 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-border/30">
              <form onSubmit={(e) => { e.preventDefault(); send(); }} className="flex gap-2">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Type your question..."
                  className="flex-1 px-3.5 py-2.5 rounded-2xl bg-muted/30 border border-border/30 text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <button type="submit" disabled={loading || !input.trim()} className="p-2.5 rounded-2xl bg-primary text-primary-foreground btn-squish disabled:opacity-50">
                  <Send size={16} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatbot;

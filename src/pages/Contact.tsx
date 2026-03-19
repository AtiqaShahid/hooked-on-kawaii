import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Send, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const WHATSAPP_NUMBER = "923001234567"; // Replace with actual number

const Contact = () => {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    const text = encodeURIComponent(`Hi! I'm ${name}.\n\n${message}`);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, "_blank");
    toast({ title: "Opening WhatsApp 💬", description: "Redirecting you to chat with us!" });
    setName(""); setMessage("");
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-28 pb-20 px-6">
        <div className="max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="font-display text-4xl font-bold mb-3">💌 Contact Us</h1>
            <p className="text-muted-foreground font-body">Chat with us directly on WhatsApp!</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-center mb-10">
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-3xl bg-[#25D366] text-white font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all btn-squish"
            >
              <MessageCircle size={24} />
              Chat on WhatsApp
            </a>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-center mb-8">
            <p className="text-sm text-muted-foreground">Or send a pre-filled message:</p>
          </motion.div>

          <motion.form onSubmit={handleSubmit} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="space-y-4">
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" required className="w-full p-3 rounded-2xl bg-card border border-border/50 text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/50" />
            <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Your message..." rows={5} required className="w-full p-3 rounded-2xl bg-card border border-border/50 text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
            <Button type="submit" className="rounded-2xl btn-squish w-full bg-[#25D366] hover:bg-[#20BD5A]">
              <Send size={16} /> Send via WhatsApp
            </Button>
          </motion.form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;

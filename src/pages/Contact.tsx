import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Send, Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Message sent! 💌", description: "We'll get back to you soon." });
    setName(""); setEmail(""); setMessage("");
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-28 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="font-display text-4xl font-bold mb-3">💌 Contact Us</h1>
            <p className="text-muted-foreground font-body">We'd love to hear from you!</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-10">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-primary/30 flex items-center justify-center shrink-0"><Mail size={18} /></div>
                <div>
                  <h3 className="font-display font-semibold mb-1">Email</h3>
                  <p className="text-sm text-muted-foreground">hello@hookonloop.com</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-primary/30 flex items-center justify-center shrink-0"><Phone size={18} /></div>
                <div>
                  <h3 className="font-display font-semibold mb-1">WhatsApp</h3>
                  <p className="text-sm text-muted-foreground">Message us on WhatsApp for quick replies</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-primary/30 flex items-center justify-center shrink-0"><MapPin size={18} /></div>
                <div>
                  <h3 className="font-display font-semibold mb-1">Location</h3>
                  <p className="text-sm text-muted-foreground">Pakistan</p>
                </div>
              </div>
            </motion.div>

            <motion.form onSubmit={handleSubmit} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" required className="w-full p-3 rounded-2xl bg-card border border-border/50 text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/50" />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Your email" required className="w-full p-3 rounded-2xl bg-card border border-border/50 text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/50" />
              <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Your message..." rows={5} required className="w-full p-3 rounded-2xl bg-card border border-border/50 text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
              <Button type="submit" className="rounded-2xl btn-squish w-full"><Send size={16} /> Send Message</Button>
            </motion.form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;

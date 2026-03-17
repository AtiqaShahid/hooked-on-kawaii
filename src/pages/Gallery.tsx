import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const galleryItems = [
  { emoji: "💐", title: "Rose Bouquet Centerpiece", tags: ["Home Decor", "Wedding"] },
  { emoji: "🧸", title: "Nursery Corner Setup", tags: ["Baby", "Amigurumi"] },
  { emoji: "🌸", title: "Spring Wreath", tags: ["Seasonal", "Home Decor"] },
  { emoji: "🎀", title: "Gift Table Display", tags: ["Gift", "Party"] },
  { emoji: "🔑", title: "Bag Charm Collection", tags: ["Accessories", "Daily"] },
  { emoji: "🌼", title: "Flower Garland Wall", tags: ["Home Decor", "DIY"] },
  { emoji: "🧶", title: "Cozy Reading Nook", tags: ["Home Decor", "Comfort"] },
  { emoji: "💝", title: "Valentine Gift Box", tags: ["Gift", "Seasonal"] },
  { emoji: "🌙", title: "Eid Decoration Set", tags: ["Seasonal", "Cultural"] },
];

const Gallery = () => (
  <div className="min-h-screen">
    <Navbar />
    <div className="pt-28 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-3">📸 Inspiration Gallery</h1>
          <p className="text-muted-foreground font-body max-w-md mx-auto">
            Creative ways to use and display crochet pieces
          </p>
        </motion.div>

        <div className="columns-2 md:columns-3 gap-4 space-y-4">
          {galleryItems.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="break-inside-avoid"
            >
              <div className="rounded-3xl bg-card shadow-soft overflow-hidden card-hover group">
                <div
                  className="flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20"
                  style={{ height: `${200 + (i % 3) * 80}px` }}
                >
                  <span className="text-6xl group-hover:scale-110 transition-transform duration-500">{item.emoji}</span>
                </div>
                <div className="p-4">
                  <h3 className="font-display font-semibold text-sm mb-2">{item.title}</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {item.tags.map((t) => (
                      <span key={t} className="px-2.5 py-1 rounded-2xl bg-muted text-xs font-medium text-muted-foreground">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
    <Footer />
  </div>
);

export default Gallery;

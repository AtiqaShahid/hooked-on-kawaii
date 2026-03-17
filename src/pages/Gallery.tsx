import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import aiRoseBouquet from "@/assets/gallery/ai-rose-bouquet.jpg";
import aiAmigurumiBear from "@/assets/gallery/ai-amigurumi-bear.jpg";
import aiSunflowerPot from "@/assets/gallery/ai-sunflower-pot.jpg";
import aiPenguin from "@/assets/gallery/ai-penguin.jpg";
import aiGajra from "@/assets/gallery/ai-gajra.jpg";
import aiKeychains from "@/assets/gallery/ai-keychains.jpg";
import aiTulipBouquet from "@/assets/gallery/ai-tulip-bouquet.jpg";
import aiBabyRattles from "@/assets/gallery/ai-baby-rattles.jpg";
import aiCrossbodyBag from "@/assets/gallery/ai-crossbody-bag.jpg";
import aiSucculents from "@/assets/gallery/ai-succulents.jpg";
import aiWeddingDecor from "@/assets/gallery/ai-wedding-decor.jpg";
import aiDinosaur from "@/assets/gallery/ai-dinosaur.jpg";

const galleryItems = [
  { image: aiRoseBouquet, title: "Rose Bouquet Centerpiece", tags: ["Home Decor", "Wedding"] },
  { image: aiAmigurumiBear, title: "Lavender Teddy Bear", tags: ["Baby", "Amigurumi"] },
  { image: aiSunflowerPot, title: "Sunflower Pot Arrangement", tags: ["Seasonal", "Home Decor"] },
  { image: aiKeychains, title: "Kawaii Keychain Collection", tags: ["Accessories", "Keychains"] },
  { image: aiGajra, title: "Bridal Gajra Hair Piece", tags: ["Festive", "Wedding"] },
  { image: aiPenguin, title: "Penguin Amigurumi", tags: ["Amigurumi", "Kids"] },
  { image: aiTulipBouquet, title: "Pastel Tulip Bouquet", tags: ["Bouquets", "Premium"] },
  { image: aiBabyRattles, title: "Baby Rattle Duo", tags: ["Baby", "Gift"] },
  { image: aiCrossbodyBag, title: "Rose Crossbody Bag", tags: ["Accessories", "Bags"] },
  { image: aiSucculents, title: "Mini Succulent Collection", tags: ["Home Decor", "Pots"] },
  { image: aiWeddingDecor, title: "Wedding Table Centerpiece", tags: ["Wedding", "Premium"] },
  { image: aiDinosaur, title: "Dino Stuffie", tags: ["Amigurumi", "Kids"] },
];

const Gallery = () => (
  <div className="min-h-screen">
    <Navbar />
    <div className="pt-28 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-3">📸 Inspiration Gallery</h1>
          <p className="text-muted-foreground font-body max-w-md mx-auto">
            Creative ways to use and display our handmade crochet pieces
          </p>
        </motion.div>

        <div className="columns-2 md:columns-3 gap-4 space-y-4">
          {galleryItems.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="break-inside-avoid"
            >
              <div className="rounded-3xl bg-card shadow-soft overflow-hidden card-hover group">
                <div className="overflow-hidden" style={{ height: `${220 + (i % 3) * 60}px` }}>
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
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

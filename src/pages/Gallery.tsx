import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import aiRosesNightstand from "@/assets/gallery/ai-roses-nightstand.jpg";
import aiGajraWear from "@/assets/gallery/ai-gajra-wear.jpg";
import aiKeychainUse from "@/assets/gallery/ai-keychain-use.jpg";
import aiNurseryDecor from "@/assets/gallery/ai-nursery-decor.jpg";
import aiGiftUnbox from "@/assets/gallery/ai-gift-unbox.jpg";
import aiBagOutdoor from "@/assets/gallery/ai-bag-outdoor.jpg";
import aiWeddingTable from "@/assets/gallery/ai-wedding-table.jpg";
import aiDeskSucculents from "@/assets/gallery/ai-desk-succulents.jpg";
import aiChildToy from "@/assets/gallery/ai-child-toy.jpg";
import aiWindowsill from "@/assets/gallery/ai-windowsill.jpg";
import aiCarCharm from "@/assets/gallery/ai-car-charm.jpg";
import aiFestiveDecor from "@/assets/gallery/ai-festive-decor.jpg";

const galleryItems = [
  { image: aiRosesNightstand, title: "Cozy Nightstand Bouquet", tags: ["Bedroom Decor", "Roses"], desc: "Crochet roses in a glass vase for a warm bedside glow" },
  { image: aiGajraWear, title: "Festive Gajra Styling", tags: ["Wedding", "Hair Accessory"], desc: "Wearing a crochet floral gajra at a celebration" },
  { image: aiKeychainUse, title: "Bag Charm Collection", tags: ["Accessories", "Daily Use"], desc: "Cute keychains clipped to your backpack & keys" },
  { image: aiNurseryDecor, title: "Nursery Shelf Display", tags: ["Baby Room", "Amigurumi"], desc: "Stuffed animals lined up on a nursery shelf" },
  { image: aiGiftUnbox, title: "Unboxing a Crochet Gift", tags: ["Gifting", "Special Moment"], desc: "The joy of opening a handmade gift box" },
  { image: aiBagOutdoor, title: "Garden Day with Rose Bag", tags: ["Fashion", "Outdoor"], desc: "Carrying a crochet crossbody bag on a sunny stroll" },
  { image: aiWeddingTable, title: "Wedding Table Setting", tags: ["Wedding", "Centerpiece"], desc: "Elegant crochet flowers as reception centerpieces" },
  { image: aiDeskSucculents, title: "Workspace Plant Friends", tags: ["Office Decor", "Desk"], desc: "Mini crochet succulents next to your laptop" },
  { image: aiChildToy, title: "Toddler's Best Friend", tags: ["Kids", "Playtime"], desc: "A child hugging their favorite crochet penguin" },
  { image: aiWindowsill, title: "Sunny Windowsill Garden", tags: ["Home Decor", "Plants"], desc: "Crochet flower pots catching golden hour light" },
  { image: aiCarCharm, title: "Car Mirror Charm", tags: ["Accessories", "Car Decor"], desc: "A crochet flower hanging from the rearview mirror" },
  { image: aiFestiveDecor, title: "Festive Table Setup", tags: ["Eid", "Celebration"], desc: "Crochet flowers decorating a festive celebration table" },
];

const Gallery = () => (
  <div className="min-h-screen">
    <Navbar />
    <div className="pt-28 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-3">🤖 Gallery by AI</h1>
          <p className="text-muted-foreground font-body max-w-md mx-auto">
            Creative ways by AI to use and display our handmade crochet pieces
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
                  <h3 className="font-display font-semibold text-sm mb-1">{item.title}</h3>
                  <p className="text-xs text-muted-foreground mb-2">{item.desc}</p>
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

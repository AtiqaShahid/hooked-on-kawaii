import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const galleryItems = [
  { image: "/products/rose-bouquet.jpg", title: "Rose Bouquet Centerpiece", tags: ["Home Decor", "Wedding"] },
  { image: "/products/teddy-bear.webp", title: "Teddy Bear Stuffie", tags: ["Baby", "Amigurumi"] },
  { image: "/products/sunflower-bouquet.jpg", title: "Sunflower Bouquet", tags: ["Seasonal", "Bouquets"] },
  { image: "/products/floral-bag-pink.webp", title: "Floral Bag Collection", tags: ["Accessories", "Bags"] },
  { image: "/products/honey-bee.webp", title: "Honey Bee Keychain", tags: ["Accessories", "Keychains"] },
  { image: "/products/rose-gajra.webp", title: "Rose Gajra for Mehndi", tags: ["Festive", "Gajra"] },
  { image: "/products/mini-daisy-pot.webp", title: "Mini Daisy Pot", tags: ["Home Decor", "Pots"] },
  { image: "/products/pookie.jpg", title: "Pookie Bouquet", tags: ["Bestseller", "Bouquets"] },
  { image: "/products/turtle-plushie.jpeg", title: "Turtle Plushie", tags: ["Amigurumi", "Gift"] },
  { image: "/products/sunflower-gajra.jpg", title: "Sunflower Gajra", tags: ["Festive", "Gajra"] },
  { image: "/products/dino-stuffie.webp", title: "Dino Stuffie", tags: ["Amigurumi", "Kids"] },
  { image: "/products/enchanted.jpeg", title: "Enchanted Bouquet", tags: ["Wedding", "Premium"] },
  { image: "/products/heart-keychain.webp", title: "Heart Keychain", tags: ["Accessories", "Gift"] },
  { image: "/products/tulip-pot.webp", title: "Tulip Pot Decor", tags: ["Home Decor", "Pots"] },
  { image: "/products/floral-bag-red.webp", title: "Red Floral Bag", tags: ["Accessories", "Bags"] },
  { image: "/products/penguin-stuffy.webp", title: "Penguin Stuffy", tags: ["Amigurumi", "Kids"] },
  { image: "/products/eternal-flame.jpeg", title: "Eternal Flame Bouquet", tags: ["Bestseller", "Premium"] },
  { image: "/products/white-gajra.webp", title: "White Gajra", tags: ["Festive", "Gajra"] },
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

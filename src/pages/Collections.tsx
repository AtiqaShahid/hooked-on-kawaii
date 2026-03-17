import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  image_url: string | null;
};

type CollectionItem = {
  name: string;
  price: number;
  image: string;
};

type CollectionGroup = {
  name: string;
  emoji: string;
  description: string;
  buttonLabel: string;
  headerColor: string;
  buttonColor: string;
  items: CollectionItem[];
};

const HOOKONLOOP_COLLECTIONS: CollectionGroup[] = [
  {
    name: "Floral Bags",
    emoji: "👜",
    description: "Handmade crochet floral bags in dreamy colors.",
    buttonLabel: "View All Floral Bags",
    headerColor: "hsl(var(--peach) / 0.28)",
    buttonColor: "hsl(var(--primary))",
    items: [
      { name: "Floral Bag - Pink", price: 2500, image: "/products/floral-bag-pink.webp" },
      { name: "Floral Bag - Pink & White", price: 2500, image: "/products/floral-bag-pink-white.webp" },
      { name: "Floral Bag - Red", price: 2500, image: "/products/floral-bag-red.webp" },
      { name: "Rose Crossbody Bag", price: 3500, image: "/products/rose-crossbody-bag.webp" },
      { name: "Floral Bag - White", price: 2500, image: "/products/floral-bag-white.webp" },
    ],
  },
  {
    name: "Gajra",
    emoji: "🌺",
    description: "Crochet gajra and bracelet styles for festive looks.",
    buttonLabel: "View All Gajra",
    headerColor: "hsl(var(--lavender) / 0.36)",
    buttonColor: "hsl(var(--primary))",
    items: [
      { name: "Bracelet", price: 1000, image: "/products/bracelet.webp" },
      { name: "Dual Tone Gajra", price: 1500, image: "/products/dual-tone-gajra.webp" },
      { name: "Red Gajra", price: 1500, image: "/products/red-gajra.webp" },
      { name: "Rose Gajra", price: 1800, image: "/products/rose-gajra.webp" },
      { name: "Sunflower Gajra", price: 1500, image: "/products/sunflower-gajra.jpg" },
      { name: "White Gajra", price: 1500, image: "/products/white-gajra.webp" },
    ],
  },
  {
    name: "Pots",
    emoji: "🌼",
    description: "Cute crochet flower pots for desks, gifts and decor.",
    buttonLabel: "View All Pots",
    headerColor: "hsl(var(--mint) / 0.32)",
    buttonColor: "hsl(var(--primary))",
    items: [
      { name: "Mini Daisy Pot", price: 1200, image: "/products/mini-daisy-pot.webp" },
      { name: "Rose Pot", price: 1200, image: "/products/rose-pot.webp" },
      { name: "Sun Flower Pot", price: 1500, image: "/products/sunflower-pot.webp" },
      { name: "Tulip Pot", price: 1200, image: "/products/tulip-pot.webp" },
    ],
  },
  {
    name: "Stuffies",
    emoji: "🧸",
    description: "Huggable handmade crochet stuffed animals and plushies.",
    buttonLabel: "View All Stuffies",
    headerColor: "hsl(var(--baby-blue) / 0.34)",
    buttonColor: "hsl(var(--primary))",
    items: [
      { name: "Crochet Teddy Bear", price: 2500, image: "/products/teddy-bear.webp" },
      { name: "Dino Stuffie", price: 1500, image: "/products/dino-stuffie.webp" },
      { name: "Honey Bee Stuffy", price: 1500, image: "/products/honey-bee.webp" },
      { name: "Penguin Stuffy", price: 1000, image: "/products/penguin-stuffy.webp" },
      { name: "Rattles", price: 1000, image: "/products/rattles.webp" },
      { name: "Turtle Plushie", price: 1500, image: "/products/turtle-plushie.jpeg" },
    ],
  },
  {
    name: "Gift Boxes",
    emoji: "🎁",
    description: "Curated gift boxes with handpicked crochet items.",
    buttonLabel: "View All Gift Boxes",
    headerColor: "hsl(var(--peach) / 0.34)",
    buttonColor: "hsl(var(--primary))",
    items: [
      { name: "GIFT BOX 1", price: 3900, image: "/products/gift-box-1.jpg" },
      { name: "GIFT BOX 2", price: 4600, image: "/products/gift-box-2.jpeg" },
      { name: "GIFT BOX 3", price: 5650, image: "/products/gift-box-3.jpeg" },
    ],
  },
  {
    name: "Accessories",
    emoji: "🌻",
    description: "Keychains, charms, bows & more cute crochet accessories.",
    buttonLabel: "View All Accessories",
    headerColor: "hsl(var(--mint) / 0.28)",
    buttonColor: "hsl(var(--primary))",
    items: [
      { name: "Bows", price: 500, image: "/products/bows.jpeg" },
      { name: "Car Charm", price: 600, image: "/products/car-charm.webp" },
      { name: "Heart Keychain", price: 700, image: "/products/heart-keychain.webp" },
      { name: "Mini Daisy Keychain", price: 350, image: "/products/mini-daisy-keychain.webp" },
      { name: "Sunflower Charm", price: 700, image: "/products/sunflower-charm.jpg" },
      { name: "Sunflower Keychain", price: 700, image: "/products/sunflower-keychain.webp" },
    ],
  },
];

const normalizeText = (value: string) =>
  value.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, " ").trim();

const Collections = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("products")
        .select("id, name, slug, price, image_url")
        .eq("is_active", true)
        .order("name");

      if (data) setProducts(data);
    };

    load();
  }, []);

  const productLookup = useMemo(() => {
    const lookup = new Map<string, Product>();
    products.forEach((product) => {
      lookup.set(normalizeText(product.name), product);
    });
    return lookup;
  }, [products]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-28 pb-20 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-3">💎 Collections</h1>
            <p className="text-muted-foreground font-body max-w-2xl mx-auto">
              Browse our handmade crochet collections — every piece crafted with love.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {HOOKONLOOP_COLLECTIONS.map((group, index) => (
              <motion.article
                key={group.name}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
                className="overflow-hidden rounded-[2rem] border border-border/50 bg-card shadow-soft"
              >
                <header className="px-6 pt-6 pb-5 text-center" style={{ background: group.headerColor }}>
                  <div className="mb-3 text-3xl">{group.emoji}</div>
                  <h2 className="font-display text-2xl font-bold text-foreground">{group.name}</h2>
                  <p className="mt-3 text-sm font-body text-muted-foreground">{group.description}</p>
                  <div className="mt-4 inline-flex rounded-full border border-background bg-background px-4 py-1 text-sm font-semibold text-foreground shadow-sm">
                    {group.items.length} items
                  </div>
                </header>

                <div className="bg-card px-5 py-4">
                  <div className="space-y-2">
                    {group.items.map((item) => {
                      const matchedProduct = productLookup.get(normalizeText(item.name));
                      const href = matchedProduct ? `/product/${matchedProduct.id}` : "/shop";

                      return (
                        <Link
                          key={item.name}
                          to={href}
                          className="flex items-center gap-4 rounded-2xl px-2 py-2.5 transition-colors hover:bg-muted/60"
                        >
                          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted shadow-sm border-2 border-card">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-full w-full object-cover"
                              loading="lazy"
                            />
                          </div>
                          <span className="flex-1 truncate font-body text-base font-medium text-foreground">
                            {item.name}
                          </span>
                          <span className="whitespace-nowrap text-sm font-medium text-muted-foreground">
                            Rs {item.price.toLocaleString()}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-card px-5 pb-5">
                  <Link
                    to="/shop"
                    className="block w-full rounded-full py-3 text-center font-display text-lg font-semibold text-primary-foreground shadow-soft transition-transform hover:scale-[1.01]"
                    style={{ background: group.buttonColor }}
                  >
                    {group.buttonLabel}
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Collections;

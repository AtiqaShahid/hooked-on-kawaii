export type Product = {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  badges: string[];
  description: string;
  colors: string[];
  rating: number;
  reviews: number;
};

export type Category = {
  id: string;
  name: string;
  emoji: string;
  description: string;
  color: string;
};

export const categories: Category[] = [
  { id: "flowers", name: "Crochet Flowers", emoji: "🌸", description: "Handmade bouquets & singles", color: "bg-pink" },
  { id: "keychains", name: "Keychains", emoji: "🔑", description: "Adorable bag charms", color: "bg-lavender" },
  { id: "toys", name: "Amigurumi", emoji: "🧸", description: "Cute stuffed friends", color: "bg-mint" },
  { id: "decor", name: "Home Decor", emoji: "🏠", description: "Cozy home accents", color: "bg-peach" },
  { id: "bouquets", name: "Bouquets", emoji: "💐", description: "Forever flower arrangements", color: "bg-baby-blue" },
  { id: "accessories", name: "Accessories", emoji: "🎀", description: "Bags, scrunchies & more", color: "bg-warm-beige" },
];

export const products: Product[] = [
  {
    id: "1",
    name: "Pink Rose Bouquet",
    price: 45,
    originalPrice: 55,
    image: "",
    category: "bouquets",
    badges: ["Bestseller", "Handmade"],
    description: "A stunning handcrafted crochet rose bouquet in soft pink shades. Perfect for gifts that last forever.",
    colors: ["#FFD1DC", "#FF9EBB", "#FFF0F5", "#E6A4B4"],
    rating: 4.9,
    reviews: 128,
  },
  {
    id: "2",
    name: "Sunflower Keychain",
    price: 12,
    image: "",
    category: "keychains",
    badges: ["Handmade", "Customizable"],
    description: "Brighten up your keys with this cheerful sunflower keychain. Available in multiple color combos.",
    colors: ["#FFD700", "#FFA500", "#FF6B6B", "#87CEEB"],
    rating: 4.8,
    reviews: 95,
  },
  {
    id: "3",
    name: "Cozy Bear Amigurumi",
    price: 35,
    image: "",
    category: "toys",
    badges: ["Bestseller", "Handmade"],
    description: "This adorable teddy bear is crocheted with love using premium cotton yarn. A perfect cuddle companion.",
    colors: ["#D2B48C", "#FFD1DC", "#E6E6FA", "#B2F2BB"],
    rating: 5.0,
    reviews: 67,
  },
  {
    id: "4",
    name: "Lavender Dream Scrunchie Set",
    price: 18,
    originalPrice: 22,
    image: "",
    category: "accessories",
    badges: ["Limited Edition"],
    description: "Set of 3 crocheted scrunchies in dreamy lavender tones. Soft, stretchy, and gentle on hair.",
    colors: ["#E6E6FA", "#DDA0DD", "#D8BFD8"],
    rating: 4.7,
    reviews: 43,
  },
  {
    id: "5",
    name: "Tulip Table Arrangement",
    price: 38,
    image: "",
    category: "decor",
    badges: ["Handmade"],
    description: "A charming crochet tulip arrangement in a mini pot. Brings springtime joy to any room.",
    colors: ["#FF6B6B", "#FFD700", "#FFB6C1", "#FFF8DC"],
    rating: 4.9,
    reviews: 52,
  },
  {
    id: "6",
    name: "Daisy Chain Garland",
    price: 28,
    image: "",
    category: "decor",
    badges: ["Handmade", "Customizable"],
    description: "A delicate daisy garland to drape across walls, shelves, or party spaces. Fully customizable colors.",
    colors: ["#FFFACD", "#FFD1DC", "#B2F2BB", "#E6E6FA"],
    rating: 4.6,
    reviews: 38,
  },
  {
    id: "7",
    name: "Baby Bunny Gift Set",
    price: 55,
    image: "",
    category: "toys",
    badges: ["Bestseller", "Handmade"],
    description: "Perfect baby shower gift! Includes a crochet bunny, matching hat, and a tiny blanket.",
    colors: ["#FFD1DC", "#FFFACD", "#B2F2BB", "#E6E6FA"],
    rating: 5.0,
    reviews: 89,
  },
  {
    id: "8",
    name: "Cherry Blossom Earrings",
    price: 15,
    image: "",
    category: "accessories",
    badges: ["Handmade", "Limited Edition"],
    description: "Delicate crochet cherry blossom earrings. Lightweight and unique — wearable art!",
    colors: ["#FFB7C5", "#FFF0F5", "#DDA0DD"],
    rating: 4.8,
    reviews: 31,
  },
];

export const featuredProduct: Product = {
  id: "weekly",
  name: "Enchanted Garden Bouquet",
  price: 65,
  image: "",
  category: "bouquets",
  badges: ["Crochet of the Week", "Limited Stock"],
  description: "This week's masterpiece — a lush garden bouquet featuring roses, daisies, lavender, and baby's breath, all handcrafted in soft pastels. Only 10 available!",
  colors: ["#FFD1DC", "#E6E6FA", "#B2F2BB", "#FFFACD", "#FFB6C1"],
  rating: 5.0,
  reviews: 12,
};

export const occasions = [
  { id: "birthday", name: "Birthday Gifts", emoji: "🎂", image: "" },
  { id: "wedding", name: "Wedding Favors", emoji: "💒", image: "" },
  { id: "baby-shower", name: "Baby Shower", emoji: "👶", image: "" },
  { id: "valentines", name: "Valentine's Day", emoji: "💝", image: "" },
  { id: "eid", name: "Eid Collection", emoji: "🌙", image: "" },
];

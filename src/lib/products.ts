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
    name: "Rose Bouquet",
    price: 1000,
    image: "/products/rose-bouquet.jpg",
    category: "bouquets",
    badges: ["Bestseller", "Handmade"],
    description: "1 rose in wrap. Colour of flower can be customized.",
    colors: ["#FFD1DC", "#FF9EBB", "#FFF0F5", "#E6A4B4"],
    rating: 4.9,
    reviews: 128,
  },
  {
    id: "2",
    name: "Sunflower Charm",
    price: 700,
    image: "/products/sunflower-charm.jpg",
    category: "keychains",
    badges: ["Handmade", "Customizable"],
    description: "Cute sunflower crochet charm accessory.",
    colors: ["#FFD700", "#FFA500", "#FF6B6B", "#87CEEB"],
    rating: 4.8,
    reviews: 95,
  },
  {
    id: "3",
    name: "Turtle Plushie",
    price: 1500,
    image: "/products/turtle-plushie.jpeg",
    category: "toys",
    badges: ["Bestseller", "Handmade"],
    description: "Adorable handmade crochet turtle plushie.",
    colors: ["#D2B48C", "#FFD1DC", "#E6E6FA", "#B2F2BB"],
    rating: 5.0,
    reviews: 67,
  },
  {
    id: "4",
    name: "Bows",
    price: 500,
    image: "/products/bows.jpeg",
    category: "accessories",
    badges: ["Handmade"],
    description: "Handmade crochet bows. Available in Red, White, Purple, Pink, Black.",
    colors: ["#E6E6FA", "#DDA0DD", "#D8BFD8", "#FF6B6B"],
    rating: 4.7,
    reviews: 43,
  },
  {
    id: "5",
    name: "Tulip Bouquet",
    price: 1000,
    image: "/products/tulip-bouquet.jpg",
    category: "bouquets",
    badges: ["Handmade", "Customizable"],
    description: "1 tulip in wrap. Colour of flower can be customized.",
    colors: ["#FF6B6B", "#FFD700", "#FFB6C1", "#FFF8DC"],
    rating: 4.9,
    reviews: 52,
  },
  {
    id: "6",
    name: "Daisy",
    price: 700,
    image: "/products/daisy.jpeg",
    category: "flowers",
    badges: ["Handmade", "Customizable"],
    description: "Single crochet daisy flower. Available in White, Purple, Pink.",
    colors: ["#FFFACD", "#FFD1DC", "#B2F2BB", "#E6E6FA"],
    rating: 4.6,
    reviews: 38,
  },
  {
    id: "7",
    name: "Sunny Bunny",
    price: 3900,
    image: "/products/sunny-bunny.jpg",
    category: "bouquets",
    badges: ["Bestseller", "Handmade"],
    description: "Bouquet includes 1 bunny stick, 3 sunflowers, 2 mini daisy in cloth wrap.",
    colors: ["#FFD1DC", "#FFFACD", "#FFD700", "#E6E6FA"],
    rating: 5.0,
    reviews: 89,
  },
  {
    id: "8",
    name: "Enchanted",
    price: 4500,
    image: "/products/enchanted.jpeg",
    category: "bouquets",
    badges: ["Handmade", "Limited Edition"],
    description: "Beautiful handmade crochet bouquet.",
    colors: ["#FFB7C5", "#FFF0F5", "#DDA0DD"],
    rating: 4.8,
    reviews: 31,
  },
  {
    id: "9",
    name: "Big Sunflower",
    price: 1500,
    image: "/products/big-sunflower.jpeg",
    category: "flowers",
    badges: ["Handmade"],
    description: "Beautiful large handmade crochet sunflower.",
    colors: ["#FFD700", "#FFA500"],
    rating: 4.9,
    reviews: 45,
  },
  {
    id: "10",
    name: "Daisy Dreamland",
    price: 1600,
    image: "/products/daisy-dreamland.jpeg",
    category: "bouquets",
    badges: ["Handmade"],
    description: "Dreamy daisy crochet bouquet.",
    colors: ["#FFFACD", "#FFD1DC"],
    rating: 4.8,
    reviews: 33,
  },
  {
    id: "11",
    name: "Dove",
    price: 2900,
    image: "/products/dove.jpeg",
    category: "bouquets",
    badges: ["Handmade"],
    description: "Elegant dove-themed crochet bouquet.",
    colors: ["#FFF0F5", "#E6E6FA"],
    rating: 4.7,
    reviews: 27,
  },
  {
    id: "12",
    name: "Eternal Flame",
    price: 3700,
    image: "/products/eternal-flame.jpeg",
    category: "bouquets",
    badges: ["Handmade", "Bestseller"],
    description: "Fiery red crochet bouquet with eternal beauty.",
    colors: ["#FF6B6B", "#FFD700", "#FF4500"],
    rating: 4.9,
    reviews: 58,
  },
  {
    id: "13",
    name: "Mystic Falls",
    price: 8900,
    image: "/products/mystic-falls.jpeg",
    category: "bouquets",
    badges: ["Limited Edition", "Handmade"],
    description: "Premium exclusive crochet bouquet.",
    colors: ["#DDA0DD", "#E6E6FA", "#FFB7C5"],
    rating: 5.0,
    reviews: 15,
  },
  {
    id: "14",
    name: "Heart on Fire",
    price: 1000,
    image: "/products/heart-on-fire.jpg",
    category: "bouquets",
    badges: ["Handmade"],
    description: "Romantic heart-themed crochet bouquet.",
    colors: ["#FF6B6B", "#FFD1DC"],
    rating: 4.8,
    reviews: 22,
  },
  {
    id: "15",
    name: "Sunflower Bouquet",
    price: 1000,
    image: "/products/sunflower-bouquet.jpg",
    category: "bouquets",
    badges: ["Handmade"],
    description: "1 sunflower in wrap.",
    colors: ["#FFD700", "#FFA500"],
    rating: 4.7,
    reviews: 19,
  },
  {
    id: "16",
    name: "Pookie",
    price: 5300,
    image: "/products/pookie.jpg",
    category: "bouquets",
    badges: ["Bestseller", "Handmade"],
    description: "Bouquet includes 2 bunny sticks, 3 open tulips, bunch of 6 forget me nots wrapped in pink cloth wrap.",
    colors: ["#FFD1DC", "#FFB7C5", "#E6E6FA"],
    rating: 5.0,
    reviews: 41,
  },
];

export const featuredProduct: Product = {
  id: "weekly",
  name: "Mystic Falls",
  price: 8900,
  image: "/products/mystic-falls.jpeg",
  category: "bouquets",
  badges: ["Crochet of the Week", "Limited Stock"],
  description: "This week's masterpiece — a premium exclusive crochet bouquet featuring an enchanting arrangement of handcrafted flowers. Only 10 available!",
  colors: ["#DDA0DD", "#E6E6FA", "#FFB7C5", "#FFFACD", "#FFB6C1"],
  rating: 5.0,
  reviews: 15,
};

export const occasions = [
  { id: "birthday", name: "Birthday Gifts", emoji: "🎂", image: "/products/pookie.jpg" },
  { id: "wedding", name: "Wedding Favors", emoji: "💒", image: "/products/enchanted.jpeg" },
  { id: "baby-shower", name: "Baby Shower", emoji: "👶", image: "/products/sunny-bunny.jpg" },
  { id: "valentines", name: "Valentine's Day", emoji: "💝", image: "/products/heart-on-fire.jpg" },
  { id: "eid", name: "Eid Collection", emoji: "🌙", image: "/products/eternal-flame.jpeg" },
];

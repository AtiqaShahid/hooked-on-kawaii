export type Review = {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  text: string;
  imageUrl?: string;
  date: string;
  verified: boolean;
};

// Mock reviews for display until backend is connected
export const mockReviews: Review[] = [
  { id: "r1", productId: "1", userName: "Sarah M.", rating: 5, text: "Beautiful handmade crochet flower bouquet, looks even better in real life! The colors are so vibrant and the stitching is perfect.", date: "2025-03-10", verified: true },
  { id: "r2", productId: "1", userName: "Emily R.", rating: 5, text: "Ordered this as a gift for my mom's birthday and she absolutely loved it. Will order again!", date: "2025-03-05", verified: true },
  { id: "r3", productId: "2", userName: "Noor A.", rating: 4, text: "Super cute keychain! The sunflower detail is amazing. Only wish it was slightly bigger.", date: "2025-02-28", verified: true },
  { id: "r4", productId: "3", userName: "Lisa K.", rating: 5, text: "This little bear is the cutest thing ever! My daughter won't put it down. So soft and well-made.", date: "2025-03-12", verified: true },
  { id: "r5", productId: "7", userName: "Fatima H.", rating: 5, text: "Perfect baby shower gift! Everything in the set was beautifully crafted. The bunny is adorable.", date: "2025-02-20", verified: true },
  { id: "r6", productId: "5", userName: "Jessica T.", rating: 5, text: "The tulip arrangement sits perfectly on my desk. Brings such joy every time I look at it!", date: "2025-03-01", verified: true },
  { id: "r7", productId: "4", userName: "Aisha B.", rating: 4, text: "Love the lavender color set. They're gentle on my hair and look so pretty.", date: "2025-02-15", verified: true },
  { id: "r8", productId: "8", userName: "Maya L.", rating: 5, text: "These earrings are wearable art! So many compliments. Lightweight and unique.", date: "2025-03-08", verified: true },
];

export const getReviewsForProduct = (productId: string) =>
  mockReviews.filter((r) => r.productId === productId);

export const getAverageRating = (productId: string) => {
  const reviews = getReviewsForProduct(productId);
  if (reviews.length === 0) return 0;
  return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
};

export const getTopReviews = (count = 6) =>
  mockReviews.filter((r) => r.rating >= 4).slice(0, count);

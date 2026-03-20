const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const PLACEHOLDER = "/placeholder.svg";

/**
 * Resolves a product image URL. Handles:
 * - Full URLs (https://...) → pass through
 * - Relative paths like /products/foo.jpg → Supabase storage URL
 * - Empty/null → placeholder
 */
export function resolveImageUrl(imageUrl: string | null | undefined): string {
  if (!imageUrl || imageUrl.trim() === "") return PLACEHOLDER;
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) return imageUrl;
  // Relative path → build Supabase storage public URL
  const cleanPath = imageUrl.startsWith("/") ? imageUrl.slice(1) : imageUrl;
  // Assume paths like "products/foo.jpg" map to product-images bucket
  const bucketPath = cleanPath.startsWith("products/") ? cleanPath.replace("products/", "") : cleanPath;
  return `${SUPABASE_URL}/storage/v1/object/public/product-images/${bucketPath}`;
}

export function handleImageError(e: React.SyntheticEvent<HTMLImageElement>) {
  const img = e.currentTarget;
  if (img.src !== window.location.origin + PLACEHOLDER) {
    img.src = PLACEHOLDER;
  }
}

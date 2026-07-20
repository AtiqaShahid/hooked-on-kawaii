import { useState, useEffect } from "react";
import { resolveImageUrl } from "@/lib/imageUtils";

const CATEGORY_EMOJI: Record<string, string> = {
  bouquets: "💐",
  flowers: "🌸",
  keychains: "🔑",
  stuffies: "🧸",
  toys: "🧸",
  accessories: "🎀",
  decor: "🏠",
  "floral-bags": "👜",
  gajra: "💮",
  "gift-boxes": "🎁",
  pots: "🪴",
};

const GRADIENTS = [
  "from-pink/30 via-peach/20 to-lavender/30",
  "from-lavender/30 via-baby-blue/20 to-mint/30",
  "from-peach/30 via-pink/20 to-warm-beige/30",
  "from-mint/30 via-baby-blue/20 to-lavender/30",
  "from-warm-beige/30 via-peach/20 to-pink/30",
];

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i);
  return Math.abs(h);
}

type Props = {
  src?: string | null;
  alt: string;
  categorySlug?: string | null;
  emoji?: string | null;
  className?: string;
  imgClassName?: string;
  showLabel?: boolean;
};

const ProductImage = ({ src, alt, categorySlug, emoji, className = "", imgClassName = "", showLabel = false }: Props) => {
  const resolved = resolveImageUrl(src);
  const isPlaceholder = !src || resolved.endsWith("/placeholder.svg");
  const [failed, setFailed] = useState(isPlaceholder);

  useEffect(() => {
    setFailed(!src || resolveImageUrl(src).endsWith("/placeholder.svg"));
  }, [src]);

  const gradient = GRADIENTS[hash(alt || "x") % GRADIENTS.length];
  const displayEmoji = emoji || (categorySlug ? CATEGORY_EMOJI[categorySlug] : null) || "🧶";

  if (failed) {
    return (
      <div className={`relative flex items-center justify-center bg-gradient-to-br ${gradient} ${className}`}>
        <div className="flex flex-col items-center gap-2 px-4 text-center">
          <span className="text-5xl md:text-6xl drop-shadow-sm select-none" aria-hidden>
            {displayEmoji}
          </span>
          {showLabel && (
            <span className="font-display text-xs md:text-sm font-semibold text-foreground/70 line-clamp-2">
              {alt}
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <img
      src={resolved}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={imgClassName || className}
    />
  );
};

export default ProductImage;

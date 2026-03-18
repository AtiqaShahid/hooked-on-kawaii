import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";

export type ShopFilterState = {
  priceRange: [number, number];
  colors: string[];
  moods: string[];
  inStockOnly: boolean;
  badges: string[];
  sortBy: string;
};

const COLOR_OPTIONS = [
  { label: "Pink", value: "#FFB6C1" },
  { label: "Red", value: "#FF0000" },
  { label: "White", value: "#FFFFFF" },
  { label: "Yellow", value: "#FFD700" },
  { label: "Purple", value: "#9370DB" },
  { label: "Blue", value: "#87CEEB" },
  { label: "Green", value: "#90EE90" },
  { label: "Orange", value: "#FFA500" },
  { label: "Brown", value: "#8B4513" },
  { label: "Black", value: "#000000" },
];

const MOOD_OPTIONS = [
  "Romantic 💕",
  "Cute & Kawaii 🌸",
  "Elegant ✨",
  "Festive 🎉",
  "Cozy 🧶",
  "Playful 🎀",
];

const BADGE_OPTIONS = [
  "Bestseller",
  "Handmade",
  "Customizable",
  "Limited Edition",
  "Sale",
  "Limited Stock",
];

const SORT_OPTIONS = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low → High", value: "price-asc" },
  { label: "Price: High → Low", value: "price-desc" },
  { label: "Top Rated", value: "rating" },
  { label: "Most Popular", value: "popular" },
];

type Props = {
  open: boolean;
  onClose: () => void;
  filters: ShopFilterState;
  onChange: (f: ShopFilterState) => void;
  maxPrice: number;
};

const Section = ({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border/40 pb-5 mb-5 last:border-0">
      <button onClick={() => setOpen(!open)} className="flex items-center justify-between w-full text-left mb-3">
        <span className="font-display font-semibold text-sm">{title}</span>
        <ChevronDown size={16} className={`text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ShopFilters = ({ open, onClose, filters, onChange, maxPrice }: Props) => {
  const update = (partial: Partial<ShopFilterState>) => onChange({ ...filters, ...partial });
  const activeCount = [
    filters.priceRange[0] > 0 || filters.priceRange[1] < maxPrice,
    filters.colors.length > 0,
    filters.moods.length > 0,
    filters.inStockOnly,
    filters.badges.length > 0,
    filters.sortBy !== "newest",
  ].filter(Boolean).length;

  const resetAll = () =>
    onChange({ priceRange: [0, maxPrice], colors: [], moods: [], inStockOnly: false, badges: [], sortBy: "newest" });

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: -320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -320, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed left-0 top-0 bottom-0 w-[320px] bg-card z-50 shadow-float overflow-y-auto p-6 pt-7 lg:static lg:rounded-3xl lg:shadow-soft lg:w-[280px] lg:max-h-[calc(100vh-180px)] lg:sticky lg:top-28"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-bold text-base">
                Filters {activeCount > 0 && <span className="ml-1 text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">{activeCount}</span>}
              </h2>
              <div className="flex items-center gap-2">
                {activeCount > 0 && (
                  <button onClick={resetAll} className="text-xs text-muted-foreground hover:text-foreground underline">
                    Reset
                  </button>
                )}
                <button onClick={onClose} className="lg:hidden p-1 rounded-xl hover:bg-muted btn-squish">
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Sort */}
            <Section title="Sort By">
              <div className="flex flex-wrap gap-2">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => update({ sortBy: opt.value })}
                    className={`px-3 py-1.5 rounded-2xl text-xs font-medium transition-all btn-squish ${
                      filters.sortBy === opt.value ? "bg-primary text-primary-foreground shadow-glow" : "bg-muted text-foreground/60"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </Section>

            {/* Price */}
            <Section title={`Price Range (Rs. ${filters.priceRange[0].toLocaleString()} – ${filters.priceRange[1].toLocaleString()})`}>
              <div className="px-1 pt-2">
                <Slider
                  min={0}
                  max={maxPrice}
                  step={100}
                  value={filters.priceRange}
                  onValueChange={(v) => update({ priceRange: v as [number, number] })}
                />
              </div>
            </Section>

            {/* Colors */}
            <Section title="Colors">
              <div className="flex flex-wrap gap-2">
                {COLOR_OPTIONS.map((c) => {
                  const active = filters.colors.includes(c.value);
                  return (
                    <button
                      key={c.value}
                      title={c.label}
                      onClick={() =>
                        update({ colors: active ? filters.colors.filter((x) => x !== c.value) : [...filters.colors, c.value] })
                      }
                      className={`w-7 h-7 rounded-full border-2 transition-all btn-squish ${
                        active ? "border-foreground scale-110 ring-2 ring-primary/40" : "border-border/50 hover:scale-105"
                      }`}
                      style={{ backgroundColor: c.value }}
                    />
                  );
                })}
              </div>
            </Section>

            {/* Mood */}
            <Section title="Mood / Vibe">
              <div className="flex flex-wrap gap-1.5">
                {MOOD_OPTIONS.map((mood) => {
                  const active = filters.moods.includes(mood);
                  return (
                    <button
                      key={mood}
                      onClick={() =>
                        update({ moods: active ? filters.moods.filter((m) => m !== mood) : [...filters.moods, mood] })
                      }
                      className={`px-3 py-1.5 rounded-2xl text-xs font-medium transition-all btn-squish ${
                        active ? "bg-secondary text-secondary-foreground shadow-soft" : "bg-muted text-foreground/60"
                      }`}
                    >
                      {mood}
                    </button>
                  );
                })}
              </div>
            </Section>

            {/* Badges */}
            <Section title="Tags">
              <div className="space-y-2">
                {BADGE_OPTIONS.map((badge) => {
                  const active = filters.badges.includes(badge);
                  return (
                    <label key={badge} className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={active}
                        onCheckedChange={() =>
                          update({ badges: active ? filters.badges.filter((b) => b !== badge) : [...filters.badges, badge] })
                        }
                      />
                      <span className="text-sm font-body">{badge}</span>
                    </label>
                  );
                })}
              </div>
            </Section>

            {/* In Stock */}
            <Section title="Availability" defaultOpen={false}>
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox checked={filters.inStockOnly} onCheckedChange={(v) => update({ inStockOnly: !!v })} />
                <span className="text-sm font-body">In Stock Only</span>
              </label>
            </Section>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default ShopFilters;

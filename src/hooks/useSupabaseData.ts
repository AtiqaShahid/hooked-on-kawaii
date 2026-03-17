import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type DbProduct = {
  id: string;
  name: string;
  slug: string;
  price: number;
  original_price: number | null;
  description: string | null;
  category_id: string | null;
  badges: string[];
  colors: string[];
  rating: number;
  review_count: number;
  image_url: string | null;
  is_featured: boolean;
  is_active: boolean;
  category?: { slug: string; name: string; emoji: string | null } | null;
};

export type DbCategory = {
  id: string;
  name: string;
  slug: string;
  emoji: string | null;
  description: string | null;
  color: string | null;
};

export const useProducts = () =>
  useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*, category:categories(slug, name, emoji)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as DbProduct[];
    },
  });

export const useProduct = (id: string) =>
  useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*, category:categories(slug, name, emoji)")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return data as DbProduct | null;
    },
    enabled: !!id,
  });

export const useCategories = () =>
  useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");
      if (error) throw error;
      return data as DbCategory[];
    },
  });

export const useProductReviews = (productId: string) =>
  useQuery({
    queryKey: ["reviews", productId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*, profile:profiles(display_name)")
        .eq("product_id", productId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!productId,
  });

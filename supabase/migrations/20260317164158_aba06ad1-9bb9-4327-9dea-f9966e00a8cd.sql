
-- Product analytics tracking
CREATE TABLE public.product_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE,
  event_type text NOT NULL, -- 'view', 'add_to_cart', 'purchase', 'wishlist', 'search'
  user_id uuid,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.product_analytics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Analytics insertable by everyone" ON public.product_analytics FOR INSERT WITH CHECK (true);
CREATE POLICY "Analytics viewable by everyone" ON public.product_analytics FOR SELECT USING (true);
CREATE INDEX idx_product_analytics_product ON public.product_analytics(product_id);
CREATE INDEX idx_product_analytics_event ON public.product_analytics(event_type);

-- Loyalty points
CREATE TABLE public.loyalty_points (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  points integer NOT NULL DEFAULT 0,
  reason text NOT NULL,
  order_id uuid REFERENCES public.orders(id),
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.loyalty_points ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own points" ON public.loyalty_points FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can earn points" ON public.loyalty_points FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Collections
CREATE TABLE public.collections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  image_url text,
  is_limited boolean DEFAULT false,
  available_count integer,
  total_count integer,
  starts_at timestamptz,
  ends_at timestamptz,
  is_active boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Collections viewable by everyone" ON public.collections FOR SELECT USING (is_active = true);

-- Collection products junction
CREATE TABLE public.collection_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id uuid REFERENCES public.collections(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  UNIQUE(collection_id, product_id)
);
ALTER TABLE public.collection_products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Collection products viewable by everyone" ON public.collection_products FOR SELECT USING (true);

-- Community posts
CREATE TABLE public.community_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  content text,
  image_url text,
  likes_count integer DEFAULT 0,
  is_approved boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Approved posts viewable" ON public.community_posts FOR SELECT USING (is_approved = true);
CREATE POLICY "Users can create posts" ON public.community_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own posts" ON public.community_posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own posts" ON public.community_posts FOR DELETE USING (auth.uid() = user_id);

-- Community comments
CREATE TABLE public.community_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES public.community_posts(id) ON DELETE CASCADE NOT NULL,
  user_id uuid NOT NULL,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.community_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Comments viewable" ON public.community_comments FOR SELECT USING (true);
CREATE POLICY "Users can create comments" ON public.community_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own comments" ON public.community_comments FOR DELETE USING (auth.uid() = user_id);

-- Craft stories
CREATE TABLE public.craft_stories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  content text NOT NULL,
  image_url text,
  product_id uuid REFERENCES public.products(id),
  time_to_make text,
  is_published boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.craft_stories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Stories viewable" ON public.craft_stories FOR SELECT USING (is_published = true);

-- Learning resources
CREATE TABLE public.learning_resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  content text NOT NULL,
  category text NOT NULL, -- 'tutorial', 'pattern', 'tip'
  difficulty text DEFAULT 'beginner', -- 'beginner', 'intermediate', 'advanced'
  image_url text,
  download_url text,
  is_published boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.learning_resources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Resources viewable" ON public.learning_resources FOR SELECT USING (is_published = true);

-- Design requests
CREATE TABLE public.design_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  image_url text,
  votes_count integer DEFAULT 0,
  status text DEFAULT 'open', -- 'open', 'planned', 'completed'
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.design_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Requests viewable" ON public.design_requests FOR SELECT USING (true);
CREATE POLICY "Users can create requests" ON public.design_requests FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Design votes
CREATE TABLE public.design_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id uuid REFERENCES public.design_requests(id) ON DELETE CASCADE NOT NULL,
  user_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(request_id, user_id)
);
ALTER TABLE public.design_votes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Votes viewable" ON public.design_votes FOR SELECT USING (true);
CREATE POLICY "Users can vote" ON public.design_votes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unvote" ON public.design_votes FOR DELETE USING (auth.uid() = user_id);

-- Surprise boxes
CREATE TABLE public.surprise_boxes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price numeric NOT NULL,
  image_url text,
  is_active boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.surprise_boxes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Surprise boxes viewable" ON public.surprise_boxes FOR SELECT USING (is_active = true);

-- Add stock_quantity and popularity_score to products
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS stock_quantity integer DEFAULT 100;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS popularity_score numeric DEFAULT 0;

-- Add order tracking fields
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS tracking_stage text DEFAULT 'received';
-- stages: received, crocheting, quality_check, packed, shipped, delivered

-- Add loyalty total to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS loyalty_points integer DEFAULT 0;

-- Social proof log (recent purchases for notifications)
CREATE TABLE public.social_proof_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE,
  city text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.social_proof_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Social proof viewable" ON public.social_proof_log FOR SELECT USING (true);
CREATE POLICY "Social proof insertable" ON public.social_proof_log FOR INSERT WITH CHECK (true);

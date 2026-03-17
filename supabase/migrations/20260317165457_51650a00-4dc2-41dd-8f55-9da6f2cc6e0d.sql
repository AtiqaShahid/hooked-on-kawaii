
-- Create user roles enum and table
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS: users can view their own roles
CREATE POLICY "Users can view own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- RLS: only admins can manage roles
CREATE POLICY "Admins can manage roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Add admin RLS policies to products table for CRUD
CREATE POLICY "Admins can insert products"
ON public.products
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update products"
ON public.products
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete products"
ON public.products
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admin policies for orders (update status)
CREATE POLICY "Admins can view all orders"
ON public.orders
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update orders"
ON public.orders
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admin policies for reviews (moderation)
CREATE POLICY "Admins can view all reviews"
ON public.reviews
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update reviews"
ON public.reviews
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete reviews"
ON public.reviews
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admin policies for categories
CREATE POLICY "Admins can insert categories"
ON public.categories
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update categories"
ON public.categories
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete categories"
ON public.categories
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admin policies for collections
CREATE POLICY "Admins can insert collections"
ON public.collections
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update collections"
ON public.collections
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete collections"
ON public.collections
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admin can view all collections (including inactive)
CREATE POLICY "Admins can view all collections"
ON public.collections
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admin policies for craft_stories
CREATE POLICY "Admins can manage craft stories"
ON public.craft_stories
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admin policies for learning_resources
CREATE POLICY "Admins can manage learning resources"
ON public.learning_resources
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admin policies for surprise_boxes
CREATE POLICY "Admins can manage surprise boxes"
ON public.surprise_boxes
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admin view all profiles
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admin view all custom orders
CREATE POLICY "Admins can view all custom orders"
ON public.custom_crochet_orders
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update custom orders"
ON public.custom_crochet_orders
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admin view all gift orders
CREATE POLICY "Admins can view all gift orders"
ON public.gift_builder_orders
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update gift orders"
ON public.gift_builder_orders
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admin manage community posts
CREATE POLICY "Admins can view all community posts"
ON public.community_posts
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all community posts"
ON public.community_posts
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete all community posts"
ON public.community_posts
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admin manage gallery
CREATE POLICY "Admins can view all gallery images"
ON public.gallery_images
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update gallery images"
ON public.gallery_images
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete gallery images"
ON public.gallery_images
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admin manage subscriptions
CREATE POLICY "Admins can view all subscriptions"
ON public.subscriptions
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all subscriptions"
ON public.subscriptions
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admin view all order items
CREATE POLICY "Admins can view all order items"
ON public.order_items
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admin manage design requests
CREATE POLICY "Admins can update design requests"
ON public.design_requests
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete design requests"
ON public.design_requests
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create product-images storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);

CREATE POLICY "Product images publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

CREATE POLICY "Admins can upload product images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update product images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete product images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));


-- Store settings (key-value store for admin-configurable settings)
CREATE TABLE public.store_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

-- Everyone can read settings (needed for storefront)
CREATE POLICY "Store settings viewable by everyone" ON public.store_settings
FOR SELECT TO public USING (true);

-- Only admins can modify
CREATE POLICY "Admins can insert store settings" ON public.store_settings
FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update store settings" ON public.store_settings
FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete store settings" ON public.store_settings
FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert default settings
INSERT INTO public.store_settings (key, value) VALUES
('store_info', '{"name": "HookOnLoop", "currency": "Rs.", "country": "Pakistan", "website": "hookonloop.com", "instagram": "@hookonloop", "whatsapp": "+92 XXX XXXXXXX"}'::jsonb),
('shipping', '{"delivery_time": "2-4 days across Pakistan", "advance_payment": 500, "free_shipping_threshold": 3000}'::jsonb),
('announcements', '["Pay Rs. 500/- in advance to confirm your order! Remaining amount can be paid on delivery. 💕", "Free shipping on orders above Rs. 3,000 🚚", "Custom orders welcome — design your own crochet creation! 🧶", "New arrivals dropping every week ✨"]'::jsonb),
('popup', '{"enabled": false, "title": "", "message": "", "image_url": "", "link": "", "type": "banner"}'::jsonb),
('sale_banner', '{"enabled": false, "text": "", "discount_percentage": 0, "end_date": ""}'::jsonb);


-- Fix orders status constraint to allow all needed statuses
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE public.orders ADD CONSTRAINT orders_status_check
CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'cod_pending', 'paid'));

-- Add payment_screenshot column to orders
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_screenshot text;

-- Create payment-proofs storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('payment-proofs', 'payment-proofs', true)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to upload to payment-proofs
CREATE POLICY "Anyone can upload payment proofs"
ON storage.objects FOR INSERT TO public
WITH CHECK (bucket_id = 'payment-proofs');

-- Allow anyone to read payment proofs
CREATE POLICY "Anyone can read payment proofs"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'payment-proofs');

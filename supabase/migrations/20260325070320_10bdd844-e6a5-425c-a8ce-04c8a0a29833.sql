-- Add admin SELECT policy for products so admins can see ALL products (including is_active=false)
CREATE POLICY "Admins can view all products"
ON public.products
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Drop and recreate admin update policy with explicit WITH CHECK
DROP POLICY IF EXISTS "Admins can update products" ON public.products;
CREATE POLICY "Admins can update products"
ON public.products
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
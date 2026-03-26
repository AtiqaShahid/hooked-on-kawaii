
-- Fix orders INSERT: allow authenticated users and guests
DROP POLICY IF EXISTS "Users can create orders" ON public.orders;
CREATE POLICY "Users can create orders"
ON public.orders FOR INSERT TO public
WITH CHECK (
  (auth.uid() IS NOT NULL AND user_id = auth.uid())
  OR
  (user_id IS NULL)
);

-- Fix order_items INSERT
DROP POLICY IF EXISTS "Users can insert order items" ON public.order_items;
CREATE POLICY "Users can insert order items"
ON public.order_items FOR INSERT TO public
WITH CHECK (
  EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = order_items.order_id
    AND (
      orders.user_id = auth.uid()
      OR orders.user_id IS NULL
    )
  )
);

-- Fix orders SELECT
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
CREATE POLICY "Users can view own orders"
ON public.orders FOR SELECT TO public
USING (
  (auth.uid() IS NOT NULL AND user_id = auth.uid())
  OR (user_id IS NULL AND auth.uid() IS NULL)
);

-- Fix order_items SELECT
DROP POLICY IF EXISTS "Users can view own order items" ON public.order_items;
CREATE POLICY "Users can view own order items"
ON public.order_items FOR SELECT TO public
USING (
  EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = order_items.order_id
    AND (
      orders.user_id = auth.uid()
      OR (orders.user_id IS NULL AND auth.uid() IS NULL)
    )
  )
);

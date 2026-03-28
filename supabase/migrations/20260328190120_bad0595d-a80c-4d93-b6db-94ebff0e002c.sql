-- Make community posts auto-approved (no admin gate)
ALTER TABLE public.community_posts ALTER COLUMN is_approved SET DEFAULT true;

-- Add user_id column to craft_stories for customer submissions
ALTER TABLE public.craft_stories ADD COLUMN IF NOT EXISTS user_id uuid;

-- Allow customers to insert craft stories
CREATE POLICY "Users can create craft stories"
ON public.craft_stories
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Allow admin to view all loyalty points
CREATE POLICY "Admins can view all loyalty points"
ON public.loyalty_points
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Allow admin to insert loyalty points
CREATE POLICY "Admins can insert loyalty points"
ON public.loyalty_points
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Add birthday field to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS birthday date;

-- Add unique constraint on design_votes to prevent double voting
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'design_votes_user_request_unique') THEN
    ALTER TABLE public.design_votes ADD CONSTRAINT design_votes_user_request_unique UNIQUE (user_id, request_id);
  END IF;
END $$;
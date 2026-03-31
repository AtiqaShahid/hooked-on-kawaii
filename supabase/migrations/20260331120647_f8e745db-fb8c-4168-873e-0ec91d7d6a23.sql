
CREATE TABLE public.otp_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_number text NOT NULL,
  otp_code text NOT NULL,
  expires_at timestamp with time zone NOT NULL,
  verified boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.otp_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "OTP codes insertable by edge functions" ON public.otp_codes FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "OTP codes selectable by edge functions" ON public.otp_codes FOR SELECT TO public USING (true);
CREATE POLICY "OTP codes updatable by edge functions" ON public.otp_codes FOR UPDATE TO public USING (true);

CREATE INDEX idx_otp_codes_phone ON public.otp_codes (phone_number, verified, expires_at);

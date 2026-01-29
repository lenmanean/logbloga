-- Subscriptions table: Stripe subscription state per user
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id text,
  stripe_subscription_id text UNIQUE,
  status text,
  plan_id text,
  current_period_end timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_subscription_id ON public.subscriptions(stripe_subscription_id);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can read their own subscription
CREATE POLICY "Users can read own subscription"
  ON public.subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Service role (webhook) can insert and update; no policy for INSERT/UPDATE so only service role can do it
-- Alternatively allow authenticated insert for first subscription:
CREATE POLICY "Users can insert own subscription row"
  ON public.subscriptions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role can update subscriptions"
  ON public.subscriptions FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Organizations (tenants)
CREATE TABLE IF NOT EXISTS public.organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read orgs they belong to"
  ON public.organizations FOR SELECT
  USING (
    id IN (
      SELECT organization_id FROM public.organization_members
      WHERE user_id = auth.uid()
    )
  );

-- Organization members (user <-> org)
CREATE TABLE IF NOT EXISTS public.organization_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  role text DEFAULT 'member',
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, organization_id)
);

ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own memberships"
  ON public.organization_members FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own membership"
  ON public.organization_members FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Profiles (optional; link to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  display_name text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (user_id) VALUES (new.id);
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

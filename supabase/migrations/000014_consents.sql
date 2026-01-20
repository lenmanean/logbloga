-- Create cookie_consents table for GDPR cookie consent tracking
CREATE TABLE IF NOT EXISTS cookie_consents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  essential BOOLEAN DEFAULT TRUE NOT NULL,
  analytics BOOLEAN DEFAULT FALSE NOT NULL,
  marketing BOOLEAN DEFAULT FALSE NOT NULL,
  consent_date TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE(user_id)
);

-- Create consents table for GDPR consent tracking (marketing, analytics, data processing)
CREATE TABLE IF NOT EXISTS consents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  consent_type TEXT NOT NULL CHECK (consent_type IN ('marketing', 'analytics', 'data_processing', 'third_party_sharing')),
  granted BOOLEAN NOT NULL,
  granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  revoked_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}'::jsonb,
  UNIQUE(user_id, consent_type)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_cookie_consents_user_id ON cookie_consents(user_id);
CREATE INDEX IF NOT EXISTS idx_consents_user_id ON consents(user_id);
CREATE INDEX IF NOT EXISTS idx_consents_consent_type ON consents(consent_type);

-- Enable RLS
ALTER TABLE cookie_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE consents ENABLE ROW LEVEL SECURITY;

-- RLS Policies for cookie_consents
CREATE POLICY "Users can view their own cookie consents"
  ON cookie_consents
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cookie consents"
  ON cookie_consents
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cookie consents"
  ON cookie_consents
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for consents
CREATE POLICY "Users can view their own consents"
  ON consents
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own consents"
  ON consents
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own consents"
  ON consents
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Service role can insert/update consents (for system operations)
CREATE POLICY "Service role can manage consents"
  ON consents
  FOR ALL
  WITH CHECK (true);

CREATE POLICY "Service role can manage cookie consents"
  ON cookie_consents
  FOR ALL
  WITH CHECK (true);

-- Add updated_at trigger function
CREATE OR REPLACE FUNCTION update_consents_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_cookie_consents_updated_at
  BEFORE UPDATE ON cookie_consents
  FOR EACH ROW
  EXECUTE FUNCTION update_consents_updated_at();

-- Add comments
COMMENT ON TABLE cookie_consents IS 'Cookie consent preferences for GDPR compliance';
COMMENT ON TABLE consents IS 'General consent tracking for GDPR compliance';
COMMENT ON COLUMN consents.consent_type IS 'Type of consent: marketing, analytics, data_processing, third_party_sharing';

-- Migration: Download Tracking and Watermarking
-- Creates tables for tracking downloads and detecting piracy

-- Drop existing download_logs table if it exists with wrong schema
DROP TABLE IF EXISTS download_logs CASCADE;

-- Download logs table
CREATE TABLE download_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  filename TEXT NOT NULL,
  download_token TEXT NOT NULL,
  ip_address INET,
  user_agent TEXT,
  referer TEXT,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  watermark_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_download_logs_user_id ON download_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_download_logs_product_id ON download_logs(product_id);
CREATE INDEX IF NOT EXISTS idx_download_logs_download_token ON download_logs(download_token);
CREATE INDEX IF NOT EXISTS idx_download_logs_created_at ON download_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_download_logs_ip_address ON download_logs(ip_address);

-- Composite index for suspicious activity detection
CREATE INDEX IF NOT EXISTS idx_download_logs_user_file ON download_logs(user_id, filename, created_at);

-- Piracy reports table (for tracking takedown requests)
CREATE TABLE IF NOT EXISTS piracy_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  infringing_url TEXT NOT NULL,
  platform TEXT NOT NULL,
  content_type TEXT NOT NULL, -- 'file', 'screenshot', 'description', etc.
  detected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'investigating', 'takedown_sent', 'resolved', 'false_positive', 'escalated')),
  watermark_token TEXT, -- If watermark was found in content
  download_token TEXT, -- If download token was found
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- If we can identify the source
  takedown_request_id TEXT, -- Reference to takedown request
  takedown_sent_at TIMESTAMP WITH TIME ZONE,
  resolved_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for piracy reports
CREATE INDEX IF NOT EXISTS idx_piracy_reports_status ON piracy_reports(status);
CREATE INDEX IF NOT EXISTS idx_piracy_reports_watermark_token ON piracy_reports(watermark_token);
CREATE INDEX IF NOT EXISTS idx_piracy_reports_download_token ON piracy_reports(download_token);
CREATE INDEX IF NOT EXISTS idx_piracy_reports_detected_at ON piracy_reports(detected_at);

-- DMCA takedown requests table
CREATE TABLE IF NOT EXISTS dmca_takedown_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  piracy_report_id UUID REFERENCES piracy_reports(id) ON DELETE SET NULL,
  platform TEXT NOT NULL,
  platform_request_id TEXT, -- ID returned by platform
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'submitted', 'processing', 'accepted', 'rejected', 'counter_notified')),
  submitted_at TIMESTAMP WITH TIME ZONE,
  response_received_at TIMESTAMP WITH TIME ZONE,
  response_text TEXT,
  counter_notification_received BOOLEAN DEFAULT FALSE,
  counter_notification_deadline TIMESTAMP WITH TIME ZONE,
  request_body JSONB NOT NULL, -- Full request data
  response_body JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for DMCA requests
CREATE INDEX IF NOT EXISTS idx_dmca_takedown_requests_status ON dmca_takedown_requests(status);
CREATE INDEX IF NOT EXISTS idx_dmca_takedown_requests_platform ON dmca_takedown_requests(platform);
CREATE INDEX IF NOT EXISTS idx_dmca_takedown_requests_submitted_at ON dmca_takedown_requests(submitted_at);

-- Enable RLS
ALTER TABLE download_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE piracy_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE dmca_takedown_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for download_logs
-- Users can only see their own download logs
CREATE POLICY "Users can view their own download logs"
  ON download_logs FOR SELECT
  USING (auth.uid() = user_id);

-- Admins can view all download logs
CREATE POLICY "Admins can view all download logs"
  ON download_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- System can insert download logs (via service role)
-- No policy needed - service role bypasses RLS

-- RLS Policies for piracy_reports
-- Only admins can view piracy reports
CREATE POLICY "Admins can view piracy reports"
  ON piracy_reports FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Only admins can insert/update piracy reports
CREATE POLICY "Admins can manage piracy reports"
  ON piracy_reports FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- RLS Policies for dmca_takedown_requests
-- Only admins can view/manage DMCA requests
CREATE POLICY "Admins can manage DMCA requests"
  ON dmca_takedown_requests FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_piracy_reports_updated_at
  BEFORE UPDATE ON piracy_reports
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dmca_takedown_requests_updated_at
  BEFORE UPDATE ON dmca_takedown_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

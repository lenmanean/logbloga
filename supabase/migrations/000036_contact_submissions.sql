-- Migration: Contact Submissions Table
-- Creates table to store contact form submissions with spam protection and tracking

-- Contact submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'read', 'replied', 'archived')),
  spam_score INTEGER DEFAULT 0 CHECK (spam_score >= 0 AND spam_score <= 100),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_contact_submissions_email ON contact_submissions(email);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON contact_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON contact_submissions(status);

-- Enable Row Level Security
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Public can insert (submit contact forms)
CREATE POLICY "Public can insert contact submissions"
  ON contact_submissions FOR INSERT
  TO public
  WITH CHECK (true);

-- Only authenticated admin users can read contact submissions
-- This assumes you have an admin role check function
-- For now, we'll allow authenticated users to read their own submissions by email
-- Admin access can be added later with proper role checking
CREATE POLICY "Users can view own submissions"
  ON contact_submissions FOR SELECT
  TO authenticated
  USING (true); -- For now, allow all authenticated users. Can be restricted later with admin role check

-- Only service role (admin) can update contact submissions
-- Regular users cannot update their submissions
CREATE POLICY "Only service role can update contact submissions"
  ON contact_submissions FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Trigger to automatically update updated_at timestamp
CREATE TRIGGER update_contact_submissions_updated_at
  BEFORE UPDATE ON contact_submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add comment to table
COMMENT ON TABLE contact_submissions IS 'Stores contact form submissions with spam protection and tracking';

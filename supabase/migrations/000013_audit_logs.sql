-- Create audit_logs table for security event tracking
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  ip_address INET,
  user_agent TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- Enable RLS
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can view their own audit logs
CREATE POLICY "Users can view their own audit logs"
  ON audit_logs
  FOR SELECT
  USING (auth.uid() = user_id);

-- Admins can view all audit logs
CREATE POLICY "Admins can view all audit logs"
  ON audit_logs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Service role can insert audit logs
CREATE POLICY "Service role can insert audit logs"
  ON audit_logs
  FOR INSERT
  WITH CHECK (true);

-- Add comment
COMMENT ON TABLE audit_logs IS 'Audit log for security and compliance tracking';
COMMENT ON COLUMN audit_logs.user_id IS 'User who performed the action (NULL for system events)';
COMMENT ON COLUMN audit_logs.action IS 'Action performed (e.g., login, order_create, account_delete)';
COMMENT ON COLUMN audit_logs.resource_type IS 'Type of resource affected (e.g., order, user, product)';
COMMENT ON COLUMN audit_logs.resource_id IS 'ID of the resource affected';
COMMENT ON COLUMN audit_logs.ip_address IS 'IP address of the user';
COMMENT ON COLUMN audit_logs.user_agent IS 'User agent string';
COMMENT ON COLUMN audit_logs.metadata IS 'Additional metadata as JSON';

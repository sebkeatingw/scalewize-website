-- Migration: Add authentication columns to mcp_servers table
-- This script adds new columns for API key-based authentication

-- Add new columns for authentication
ALTER TABLE public.mcp_servers 
ADD COLUMN IF NOT EXISTS auth_type TEXT DEFAULT 'none' CHECK (auth_type IN ('none', 'oauth', 'service_account'));

ALTER TABLE public.mcp_servers 
ADD COLUMN IF NOT EXISTS auth_config JSONB DEFAULT '{}'::jsonb;

ALTER TABLE public.mcp_servers 
ADD COLUMN IF NOT EXISTS google_drive_folder_id TEXT;

-- Add index for auth_type for better query performance
CREATE INDEX IF NOT EXISTS idx_mcp_servers_auth_type ON public.mcp_servers(auth_type);

-- Add index for google_drive_folder_id
CREATE INDEX IF NOT EXISTS idx_mcp_servers_google_drive_folder ON public.mcp_servers(google_drive_folder_id);

-- Update existing Google Drive MCP servers to use service_account auth type
UPDATE public.mcp_servers 
SET auth_type = 'service_account'
WHERE name = 'Google Drive' AND auth_type = 'none';

-- Add comment to document the new columns
COMMENT ON COLUMN public.mcp_servers.auth_type IS 'Authentication type: none, oauth, or service_account';
COMMENT ON COLUMN public.mcp_servers.auth_config IS 'JSON configuration for authentication (encrypted service account keys, OAuth settings, etc.)';
COMMENT ON COLUMN public.mcp_servers.google_drive_folder_id IS 'Google Drive folder ID for organization-specific file access';

-- Verify the migration
SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM information_schema.columns 
WHERE table_name = 'mcp_servers' 
  AND table_schema = 'public'
  AND column_name IN ('auth_type', 'auth_config', 'google_drive_folder_id')
ORDER BY column_name; 
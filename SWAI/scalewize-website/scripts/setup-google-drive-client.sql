-- Setup Google Drive MCP Server for a Client
-- This script shows how to configure Google Drive access for a specific organization

-- Example: Set up Google Drive for a client organization
-- Replace the values below with actual client data

-- 1. Insert or update Google Drive MCP server for the organization
INSERT INTO public.mcp_servers (
  name,
  description,
  endpoint,
  capabilities,
  organization_id,
  auth_type,
  auth_config,
  google_drive_folder_id,
  is_active
) VALUES (
  'Google Drive',
  'Access Google Drive files and folders with full content reading capabilities',
  'https://mcp-servers-production-c189.up.railway.app/mcp',
  ARRAY['search_file', 'list_files', 'get_file_metadata', 'read_content'],
  'YOUR_ORGANIZATION_ID_HERE', -- Replace with actual organization ID
  'service_account',
  '{
    "service_account_key": "YOUR_ENCRYPTED_SERVICE_ACCOUNT_KEY_HERE",
    "scopes": ["https://www.googleapis.com/auth/drive.readonly"],
    "client_email": "your-service-account@your-project.iam.gserviceaccount.com"
  }'::jsonb,
  'YOUR_GOOGLE_DRIVE_FOLDER_ID_HERE', -- Replace with actual Google Drive folder ID
  true
) ON CONFLICT (name, organization_id) DO UPDATE SET
  auth_type = EXCLUDED.auth_type,
  auth_config = EXCLUDED.auth_config,
  google_drive_folder_id = EXCLUDED.google_drive_folder_id,
  is_active = EXCLUDED.is_active,
  updated_at = now();

-- 2. Verify the setup
SELECT 
  o.name as organization_name,
  m.name as mcp_server_name,
  m.auth_type,
  m.google_drive_folder_id,
  m.is_active,
  m.capabilities
FROM public.mcp_servers m
JOIN public.organizations o ON m.organization_id = o.id
WHERE m.name = 'Google Drive' 
  AND m.organization_id = 'YOUR_ORGANIZATION_ID_HERE'
  AND m.is_active = true;

-- 3. Example: Set up multiple clients at once
-- You can run this for each client organization

/*
-- Client 1: Acme Corp
INSERT INTO public.mcp_servers (
  name, description, endpoint, capabilities, organization_id, auth_type, auth_config, google_drive_folder_id, is_active
) VALUES (
  'Google Drive',
  'Access Google Drive files and folders',
  'https://mcp-servers-production-c189.up.railway.app/mcp',
  ARRAY['search_file', 'list_files', 'get_file_metadata', 'read_content'],
  'acme-corp-org-id',
  'service_account',
  '{"service_account_key": "acme-encrypted-key", "scopes": ["https://www.googleapis.com/auth/drive.readonly"]}'::jsonb,
  'acme-drive-folder-id',
  true
);

-- Client 2: TechStart Inc
INSERT INTO public.mcp_servers (
  name, description, endpoint, capabilities, organization_id, auth_type, auth_config, google_drive_folder_id, is_active
) VALUES (
  'Google Drive',
  'Access Google Drive files and folders',
  'https://mcp-servers-production-c189.up.railway.app/mcp',
  ARRAY['search_file', 'list_files', 'get_file_metadata', 'read_content'],
  'techstart-org-id',
  'service_account',
  '{"service_account_key": "techstart-encrypted-key", "scopes": ["https://www.googleapis.com/auth/drive.readonly"]}'::jsonb,
  'techstart-drive-folder-id',
  true
);
*/ 
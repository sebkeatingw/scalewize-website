# Google Drive MCP Setup Guide

## 🎯 Overview

This guide explains how to set up Google Drive MCP integration using service account authentication for your agency's multi-client deployment.

## 🏗️ Architecture

```
Client Organization → MCP Server → Google Drive API
     ↓                    ↓              ↓
Supabase Config → Service Account → Client's Drive Folder
```

## 📋 Prerequisites

1. **Google Cloud Project** with Google Drive API enabled
2. **Service Account** for each client organization
3. **Supabase Database** with enhanced `mcp_servers` table
4. **MCP Server** deployed on Railway

## 🔧 Step-by-Step Setup

### 1. Database Migration

Run the migration script to add authentication columns:

```sql
-- Run this in your Supabase SQL editor
\i scripts/add-mcp-auth-columns.sql
```

### 2. Google Cloud Setup

#### A. Create Service Account for Each Client

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to **IAM & Admin** → **Service Accounts**
4. Click **Create Service Account**
5. Fill in details:
   - **Name**: `client-{organization-name}-drive-access`
   - **Description**: `Service account for Google Drive MCP access`
6. Click **Create and Continue**
7. Grant **Drive File Stream** role
8. Click **Done**

#### B. Create and Download Service Account Key

1. Click on the created service account
2. Go to **Keys** tab
3. Click **Add Key** → **Create New Key**
4. Choose **JSON** format
5. Download the key file

#### C. Create Google Drive Folder for Client

1. Go to [Google Drive](https://drive.google.com/)
2. Create a new folder: `{Client Name} - MCP Access`
3. Right-click folder → **Share**
4. Add the service account email: `client-{org-name}@your-project.iam.gserviceaccount.com`
5. Grant **Editor** permissions
6. Copy the folder ID from the URL

### 3. Client Configuration

#### A. Using the Setup Script

```typescript
import { setupClientGoogleDrive } from '@/lib/mcp-auth-utils';

// Set up Google Drive for a client
const result = await setupClientGoogleDrive(
  'client-organization-id',
  'service-account-key-json-string',
  'google-drive-folder-id',
  'service-account-email@project.iam.gserviceaccount.com'
);

if (result.success) {
  console.log('Google Drive MCP configured successfully!');
} else {
  console.error('Setup failed:', result.error);
}
```

#### B. Manual Database Insert

```sql
-- Replace with actual values
INSERT INTO public.mcp_servers (
  name, description, endpoint, capabilities, organization_id, 
  auth_type, auth_config, google_drive_folder_id, is_active
) VALUES (
  'Google Drive',
  'Access Google Drive files and folders',
  'https://mcp-servers-production-c189.up.railway.app/mcp',
  ARRAY['search_file', 'list_files', 'get_file_metadata', 'read_content'],
  'your-client-org-id',
  'service_account',
  '{
    "service_account_key": "encrypted-key-here",
    "scopes": ["https://www.googleapis.com/auth/drive.readonly"],
    "client_email": "service-account@project.iam.gserviceaccount.com"
  }'::jsonb,
  'google-drive-folder-id',
  true
);
```

### 4. MCP Server Implementation

Update your MCP server to use organization-specific credentials:

```typescript
// Enhanced MCP server with organization-based authentication
import { getMCPServerConfig, decryptServiceAccountKey } from './mcp-auth-utils';

async function getOrganizationDriveClient(organizationId: string) {
  const mcpConfig = await getMCPServerConfig(organizationId, 'Google Drive');
  
  if (!mcpConfig || mcpConfig.auth_type !== 'service_account') {
    throw new Error('Google Drive not configured for this organization');
  }

  const serviceAccountKey = decryptServiceAccountKey(
    mcpConfig.auth_config.service_account_key!
  );
  
  const credentials = JSON.parse(serviceAccountKey);
  const auth = new GoogleAuth({ credentials });
  
  return {
    drive: google.drive({ version: 'v3', auth }),
    folderId: mcpConfig.google_drive_folder_id
  };
}

// Use in MCP tools
server.tool('search_file', async ({ query, organizationId }) => {
  const { drive, folderId } = await getOrganizationDriveClient(organizationId);
  
  const response = await drive.files.list({
    q: `'${folderId}' in parents and fullText contains '${query}'`,
    fields: 'files(id,name,mimeType,size,modifiedTime)'
  });
  
  return response;
});
```

## 🚀 Client Onboarding Process

### Quick Setup (5 minutes per client)

1. **Create Google Service Account** (2 minutes)
2. **Create Google Drive Folder** (1 minute)
3. **Share folder with service account** (1 minute)
4. **Run setup script** (1 minute)

### Automated Setup Script

```typescript
// Complete client onboarding
async function onboardClient(
  organizationId: string,
  clientName: string,
  serviceAccountKey: string,
  driveFolderId: string
) {
  // 1. Validate service account key
  if (!validateServiceAccountKey(serviceAccountKey)) {
    throw new Error('Invalid service account key format');
  }

  // 2. Set up MCP server configuration
  const result = await setupClientGoogleDrive(
    organizationId,
    serviceAccountKey,
    driveFolderId
  );

  if (!result.success) {
    throw new Error(`Setup failed: ${result.error}`);
  }

  // 3. Verify configuration
  const config = await getMCPServerConfig(organizationId);
  if (!config) {
    throw new Error('Configuration verification failed');
  }

  return {
    success: true,
    message: `Google Drive MCP configured for ${clientName}`,
    config
  };
}
```

## 🔒 Security Considerations

### 1. Service Account Key Encryption

- Keys are encrypted before storage in database
- Use environment variable for encryption key
- Rotate encryption keys regularly

### 2. Folder Isolation

- Each client has their own Google Drive folder
- Service accounts only access their assigned folder
- No cross-client data access

### 3. Access Control

- Service accounts have minimal required permissions
- Read-only access to Google Drive
- No admin or management permissions

## 📊 Monitoring and Management

### View Client Configurations

```sql
-- Check all Google Drive MCP configurations
SELECT 
  o.name as organization_name,
  m.auth_type,
  m.google_drive_folder_id,
  m.is_active,
  m.updated_at
FROM public.mcp_servers m
JOIN public.organizations o ON m.organization_id = o.id
WHERE m.name = 'Google Drive'
ORDER BY o.name;
```

### Remove Client Access

```typescript
// Remove Google Drive access for a client
await removeClientGoogleDrive('client-organization-id');
```

## 🧪 Testing

### Test MCP Server Connection

```bash
# Test health endpoint
curl https://mcp-servers-production-c189.up.railway.app/health

# Test with organization ID
curl -X POST https://mcp-servers-production-c189.up.railway.app/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "method": "tools/call",
    "params": {
      "name": "search_file",
      "arguments": {
        "query": "test",
        "organizationId": "your-org-id"
      }
    }
  }'
```

### Test in Chatbot

1. Open chatbot for the client organization
2. Try: "Search for documents in my Google Drive"
3. Verify files from the client's folder are returned

## 🔧 Troubleshooting

### Common Issues

1. **"Google Drive not configured"**
   - Check if MCP server exists for organization
   - Verify `auth_type` is set to `service_account`

2. **"Invalid service account key"**
   - Validate key format with `validateServiceAccountKey()`
   - Check if key is properly encrypted

3. **"No files found"**
   - Verify Google Drive folder ID is correct
   - Check if service account has access to folder
   - Ensure files exist in the shared folder

### Debug Steps

1. **Check database configuration**
2. **Verify service account permissions**
3. **Test Google Drive API directly**
4. **Check MCP server logs**

## 📈 Scaling

### Multiple Clients

- Each client gets isolated Google Drive access
- No shared credentials or data
- Easy to add/remove clients independently

### Performance

- Service account authentication is fast
- No OAuth token refresh overhead
- Minimal API calls for authentication

---

**Last Updated**: December 2024
**Version**: 1.0.0 
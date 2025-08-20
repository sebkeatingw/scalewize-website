import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Encryption key should be stored in environment variables
const ENCRYPTION_KEY = process.env.MCP_ENCRYPTION_KEY || 'your-encryption-key-32-chars-long!';

export interface MCPServerConfig {
  id: string;
  name: string;
  description: string;
  endpoint: string;
  capabilities: string[];
  organization_id: string;
  auth_type: 'none' | 'oauth' | 'service_account';
  auth_config: {
    service_account_key?: string;
    scopes?: string[];
    client_email?: string;
  };
  google_drive_folder_id?: string;
  is_active: boolean;
}

export interface ServiceAccountCredentials {
  type: string;
  project_id: string;
  private_key_id: string;
  private_key: string;
  client_email: string;
  client_id: string;
  auth_uri: string;
  token_uri: string;
  auth_provider_x509_cert_url: string;
  client_x509_cert_url: string;
}

/**
 * Encrypt service account key for secure storage
 */
export function encryptServiceAccountKey(serviceAccountKey: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipher('aes-256-cbc', ENCRYPTION_KEY);
  
  let encrypted = cipher.update(serviceAccountKey, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  return iv.toString('hex') + ':' + encrypted;
}

/**
 * Decrypt service account key for use
 */
export function decryptServiceAccountKey(encryptedKey: string): string {
  const [ivHex, encrypted] = encryptedKey.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  
  const decipher = crypto.createDecipher('aes-256-cbc', ENCRYPTION_KEY);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

/**
 * Get MCP server configuration for an organization
 */
export async function getMCPServerConfig(
  organizationId: string, 
  serverName: string = 'Google Drive'
): Promise<MCPServerConfig | null> {
  try {
    const { data, error } = await supabase
      .from('mcp_servers')
      .select('*')
      .eq('organization_id', organizationId)
      .eq('name', serverName)
      .eq('is_active', true)
      .single();

    if (error || !data) {
      console.error('Error fetching MCP server config:', error);
      return null;
    }

    return data as MCPServerConfig;
  } catch (error) {
    console.error('Error in getMCPServerConfig:', error);
    return null;
  }
}

/**
 * Set up Google Drive MCP server for a client organization
 */
export async function setupClientGoogleDrive(
  organizationId: string,
  serviceAccountKey: string,
  googleDriveFolderId: string,
  clientEmail?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Parse and validate service account key
    const credentials: ServiceAccountCredentials = JSON.parse(serviceAccountKey);
    
    // Encrypt the service account key
    const encryptedKey = encryptServiceAccountKey(serviceAccountKey);
    
    // Prepare auth config
    const authConfig = {
      service_account_key: encryptedKey,
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
      client_email: clientEmail || credentials.client_email
    };

    // Insert or update MCP server configuration
    const { data, error } = await supabase
      .from('mcp_servers')
      .upsert({
        name: 'Google Drive',
        description: 'Access Google Drive files and folders with full content reading capabilities',
        endpoint: 'https://mcp-servers-production-c189.up.railway.app/mcp',
        capabilities: ['search_file', 'list_files', 'get_file_metadata', 'read_content'],
        organization_id: organizationId,
        auth_type: 'service_account',
        auth_config: authConfig,
        google_drive_folder_id: googleDriveFolderId,
        is_active: true
      }, {
        onConflict: 'name,organization_id'
      });

    if (error) {
      console.error('Error setting up Google Drive MCP server:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error in setupClientGoogleDrive:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Remove Google Drive MCP server for a client organization
 */
export async function removeClientGoogleDrive(
  organizationId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('mcp_servers')
      .delete()
      .eq('organization_id', organizationId)
      .eq('name', 'Google Drive');

    if (error) {
      console.error('Error removing Google Drive MCP server:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error in removeClientGoogleDrive:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Get all MCP servers for an organization
 */
export async function getOrganizationMCPServers(
  organizationId: string
): Promise<MCPServerConfig[]> {
  try {
    const { data, error } = await supabase
      .from('mcp_servers')
      .select('*')
      .eq('organization_id', organizationId)
      .eq('is_active', true);

    if (error) {
      console.error('Error fetching organization MCP servers:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getOrganizationMCPServers:', error);
    return [];
  }
}

/**
 * Validate service account key format
 */
export function validateServiceAccountKey(serviceAccountKey: string): boolean {
  try {
    const credentials: ServiceAccountCredentials = JSON.parse(serviceAccountKey);
    
    // Check required fields
    const requiredFields = [
      'type', 'project_id', 'private_key_id', 'private_key', 
      'client_email', 'client_id', 'auth_uri', 'token_uri'
    ];
    
    return requiredFields.every(field => credentials[field as keyof ServiceAccountCredentials]);
  } catch (error) {
    return false;
  }
} 
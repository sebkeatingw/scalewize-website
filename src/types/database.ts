export interface Database {
  public: {
    Tables: {
      api_keys: {
        Row: {
          id: string
          organization_id: string | null
          key_name: string
          key_value: string
          is_active: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          organization_id?: string | null
          key_name: string
          key_value: string
          is_active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          organization_id?: string | null
          key_name?: string
          key_value?: string
          is_active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      billing_records: {
        Row: {
          id: string
          organization_id: string | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          amount_usd: number | null
          billing_period_start: string | null
          billing_period_end: string | null
          status: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          organization_id?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          amount_usd?: number | null
          billing_period_start?: string | null
          billing_period_end?: string | null
          status?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          organization_id?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          amount_usd?: number | null
          billing_period_start?: string | null
          billing_period_end?: string | null
          status?: string | null
          created_at?: string | null
        }
      }
      campaigns: {
        Row: {
          id: string
          user_id: string
          campaign_name: string
          message_order: number
          message_content: string
          status: string | null
          sent_at: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          campaign_name: string
          message_order: number
          message_content: string
          status?: string | null
          sent_at?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          campaign_name?: string
          message_order?: number
          message_content?: string
          status?: string | null
          sent_at?: string | null
          created_at?: string | null
        }
      }
      chat_sessions: {
        Row: {
          id: string
          user_id: string | null
          organization_id: string | null
          title: string | null
          librechat_session_id: string | null
          model_used: string | null
          session_metadata: Json | null
          is_active: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          organization_id?: string | null
          title?: string | null
          librechat_session_id?: string | null
          model_used?: string | null
          session_metadata?: Json | null
          is_active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          organization_id?: string | null
          title?: string | null
          librechat_session_id?: string | null
          model_used?: string | null
          session_metadata?: Json | null
          is_active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      knowledge_base_documents: {
        Row: {
          id: string
          knowledge_base_id: string
          title: string
          content: string | null
          file_path: string | null
          file_type: string | null
          file_size: number | null
          embedding_vector: unknown | null
          metadata: Json | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          knowledge_base_id: string
          title: string
          content?: string | null
          file_path?: string | null
          file_type?: string | null
          file_size?: number | null
          embedding_vector?: unknown | null
          metadata?: Json | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          knowledge_base_id?: string
          title?: string
          content?: string | null
          file_path?: string | null
          file_type?: string | null
          file_size?: number | null
          embedding_vector?: unknown | null
          metadata?: Json | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      knowledge_bases: {
        Row: {
          id: string
          name: string
          description: string | null
          type: string | null
          organization_id: string
          is_active: boolean | null
          document_count: number | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          type?: string | null
          organization_id: string
          is_active?: boolean | null
          document_count?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          type?: string | null
          organization_id?: string
          is_active?: boolean | null
          document_count?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      leads: {
        Row: {
          lead_id: string
          organization_id: string
          full_name: string | null
          first_name: string | null
          last_name: string | null
          linkedin_url: string | null
          email: string | null
          company: string | null
          title: string | null
          industry: string | null
          revenue_range: string | null
          validated: boolean | null
          outreach_message: string | null
          status: string | null
          delegation_level: number | null
          source: string | null
          created_at: string | null
          user_id: string
          connection_request_sent_at: string | null
          first_message_sent_at: string | null
          last_contact_at: string | null
          updated_at: string | null
          company_description: string | null
          campaign_name: string | null
        }
        Insert: {
          lead_id?: string
          organization_id: string
          full_name?: string | null
          first_name?: string | null
          last_name?: string | null
          linkedin_url?: string | null
          email?: string | null
          company?: string | null
          title?: string | null
          industry?: string | null
          revenue_range?: string | null
          validated?: boolean | null
          outreach_message?: string | null
          status?: string | null
          delegation_level?: number | null
          source?: string | null
          created_at?: string | null
          user_id: string
          connection_request_sent_at?: string | null
          first_message_sent_at?: string | null
          last_contact_at?: string | null
          updated_at?: string | null
          company_description?: string | null
          campaign_name?: string | null
        }
        Update: {
          lead_id?: string
          organization_id?: string
          full_name?: string | null
          first_name?: string | null
          last_name?: string | null
          linkedin_url?: string | null
          email?: string | null
          company?: string | null
          title?: string | null
          industry?: string | null
          revenue_range?: string | null
          validated?: boolean | null
          outreach_message?: string | null
          status?: string | null
          delegation_level?: number | null
          source?: string | null
          created_at?: string | null
          user_id?: string
          connection_request_sent_at?: string | null
          first_message_sent_at?: string | null
          last_contact_at?: string | null
          updated_at?: string | null
          company_description?: string | null
          campaign_name?: string | null
        }
      }
      mcp_servers: {
        Row: {
          id: string
          name: string
          description: string | null
          endpoint: string
          capabilities: string[] | null
          organization_id: string
          is_active: boolean | null
          created_at: string | null
          updated_at: string | null
          auth_type: string | null
          auth_config: Json | null
          google_drive_folder_id: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          endpoint: string
          capabilities?: string[] | null
          organization_id: string
          is_active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
          auth_type?: string | null
          auth_config?: Json | null
          google_drive_folder_id?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          endpoint?: string
          capabilities?: string[] | null
          organization_id?: string
          is_active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
          auth_type?: string | null
          auth_config?: Json | null
          google_drive_folder_id?: string | null
        }
      }
      messages: {
        Row: {
          id: string
          organization_id: string
          conversation_id: string | null
          sender_linkedin_url: string | null
          recipient_linkedin_url: string | null
          from_name: string | null
          to_name: string | null
          message_date: string | null
          subject: string | null
          content: string | null
          folder: string | null
          created_at: string | null
          user_id: string | null
          message_type: string | null
        }
        Insert: {
          id?: string
          organization_id: string
          conversation_id?: string | null
          sender_linkedin_url?: string | null
          recipient_linkedin_url?: string | null
          from_name?: string | null
          to_name?: string | null
          message_date?: string | null
          subject?: string | null
          content?: string | null
          folder?: string | null
          created_at?: string | null
          user_id?: string | null
          message_type?: string | null
        }
        Update: {
          id?: string
          organization_id?: string
          conversation_id?: string | null
          sender_linkedin_url?: string | null
          recipient_linkedin_url?: string | null
          from_name?: string | null
          to_name?: string | null
          message_date?: string | null
          subject?: string | null
          content?: string | null
          folder?: string | null
          created_at?: string | null
          user_id?: string | null
          message_type?: string | null
        }
      }
      organization_invitations: {
        Row: {
          id: string
          organization_id: string
          email: string
          invited_by: string
          token: string
          expires_at: string
          status: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          organization_id: string
          email: string
          invited_by: string
          token: string
          expires_at: string
          status?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          organization_id?: string
          email?: string
          invited_by?: string
          token?: string
          expires_at?: string
          status?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      organization_members: {
        Row: {
          id: string
          organization_id: string
          user_id: string
          role: string | null
          joined_at: string | null
          invited_by: string | null
        }
        Insert: {
          id?: string
          organization_id: string
          user_id: string
          role?: string | null
          joined_at?: string | null
          invited_by?: string | null
        }
        Update: {
          id?: string
          organization_id?: string
          user_id?: string
          role?: string | null
          joined_at?: string | null
          invited_by?: string | null
        }
      }
      organizations: {
        Row: {
          id: string
          name: string
          domain: string | null
          subscription_status: string | null
          plan_type: string | null
          max_users: number | null
          max_chat_sessions: number | null
          monthly_token_limit: number | null
          librechat_config: Json | null
          n8n_webhook_url: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          domain?: string | null
          subscription_status?: string | null
          plan_type?: string | null
          max_users?: number | null
          max_chat_sessions?: number | null
          monthly_token_limit?: number | null
          librechat_config?: Json | null
          n8n_webhook_url?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          domain?: string | null
          subscription_status?: string | null
          plan_type?: string | null
          max_users?: number | null
          max_chat_sessions?: number | null
          monthly_token_limit?: number | null
          librechat_config?: Json | null
          n8n_webhook_url?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      profiles: {
        Row: {
          id: string
          organization_id: string | null
          email: string
          full_name: string | null
          role: string | null
          is_active: boolean | null
          librechat_user_id: string | null
          last_login: string | null
          created_at: string | null
          updated_at: string | null
          linkedin_url: string | null
          status: string | null
        }
        Insert: {
          id: string
          organization_id?: string | null
          email: string
          full_name?: string | null
          role?: string | null
          is_active?: boolean | null
          librechat_user_id?: string | null
          last_login?: string | null
          created_at?: string | null
          updated_at?: string | null
          linkedin_url?: string | null
          status?: string | null
        }
        Update: {
          id?: string
          organization_id?: string | null
          email?: string
          full_name?: string | null
          role?: string | null
          is_active?: boolean | null
          librechat_user_id?: string | null
          last_login?: string | null
          created_at?: string | null
          updated_at?: string | null
          linkedin_url?: string | null
          status?: string | null
        }
      }
      usage_metrics: {
        Row: {
          id: string
          organization_id: string | null
          user_id: string | null
          session_id: string | null
          message_count: number | null
          tokens_used: number | null
          cost_usd: number | null
          model_used: string | null
          endpoint_used: string | null
          date: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          organization_id?: string | null
          user_id?: string | null
          session_id?: string | null
          message_count?: number | null
          tokens_used?: number | null
          cost_usd?: number | null
          model_used?: string | null
          endpoint_used?: string | null
          date?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          organization_id?: string | null
          user_id?: string | null
          session_id?: string | null
          message_count?: number | null
          tokens_used?: number | null
          cost_usd?: number | null
          model_used?: string | null
          endpoint_used?: string | null
          date?: string | null
          created_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Type aliases for easier use
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Organization = Database['public']['Tables']['organizations']['Row']
export type OrganizationInvitation = Database['public']['Tables']['organization_invitations']['Row']
export type OrganizationMember = Database['public']['Tables']['organization_members']['Row']
export type ChatSession = Database['public']['Tables']['chat_sessions']['Row']
export type Lead = Database['public']['Tables']['leads']['Row']
export type Message = Database['public']['Tables']['messages']['Row']
export type ApiKey = Database['public']['Tables']['api_keys']['Row']
export type BillingRecord = Database['public']['Tables']['billing_records']['Row']
export type Campaign = Database['public']['Tables']['campaigns']['Row']
export type KnowledgeBase = Database['public']['Tables']['knowledge_bases']['Row']
export type KnowledgeBaseDocument = Database['public']['Tables']['knowledge_base_documents']['Row']
export type McpServer = Database['public']['Tables']['mcp_servers']['Row']
export type UsageMetric = Database['public']['Tables']['usage_metrics']['Row']

// Profile status types
export type ProfileStatus = 'pending' | 'active' | 'suspended' | 'invited'

// Organization invitation status types
export type InvitationStatus = 'pending' | 'accepted' | 'expired' | 'cancelled'

// Lead status types
export type LeadStatus = 'PENDING' | 'SENT' | 'CONNECTED' | 'RESPONDED' | 'ACTIVE' | 'BOOKED' | 'CLOSED'

// Campaign status types
export type CampaignStatus = 'ACTIVE' | 'PAUSED'

// Message type types
export type MessageType = 'general' | 'connection_request' | 'first_message' | 'response'

// Knowledge base type types
export type KnowledgeBaseType = 'documentation' | 'sales_data' | 'company_knowledge' | 'custom'

// MCP server auth type types
export type McpServerAuthType = 'none' | 'oauth' | 'service_account'

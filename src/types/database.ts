export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string
          name: string
          domain: string | null
          subscription_status: 'trial' | 'active' | 'inactive' | 'cancelled'
          plan_type: 'starter' | 'professional' | 'enterprise'
          max_users: number
          max_chat_sessions: number
          monthly_token_limit: number
          librechat_config: Json
          n8n_webhook_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          domain?: string | null
          subscription_status?: 'trial' | 'active' | 'inactive' | 'cancelled'
          plan_type?: 'starter' | 'professional' | 'enterprise'
          max_users?: number
          max_chat_sessions?: number
          monthly_token_limit?: number
          librechat_config?: Json
          n8n_webhook_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          domain?: string | null
          subscription_status?: 'trial' | 'active' | 'inactive' | 'cancelled'
          plan_type?: 'starter' | 'professional' | 'enterprise'
          max_users?: number
          max_chat_sessions?: number
          monthly_token_limit?: number
          librechat_config?: Json
          n8n_webhook_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          organization_id: string | null
          email: string
          full_name: string | null
          role: 'user' | 'admin' | 'super_admin'
          is_active: boolean
          librechat_user_id: string | null
          last_login: string | null
          created_at: string
          updated_at?: string
        }
        Insert: {
          id: string
          organization_id?: string | null
          email: string
          full_name?: string | null
          role?: 'user' | 'admin' | 'super_admin'
          is_active?: boolean
          librechat_user_id?: string | null
          last_login?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string | null
          email?: string
          full_name?: string | null
          role?: 'user' | 'admin' | 'super_admin'
          is_active?: boolean
          librechat_user_id?: string | null
          last_login?: string | null
          created_at?: string
          updated_at?: string
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
          session_metadata: Json
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          organization_id: string
          title?: string | null
          librechat_session_id?: string | null
          model_used?: string | null
          session_metadata?: Json
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          organization_id?: string | null
          title?: string | null
          librechat_session_id?: string | null
          model_used?: string | null
          session_metadata?: Json
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      leads: {
        Row: {
          lead_id: string
          organization_id: string
          user_id: string
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
          company_description: string | null
          connection_request_sent_at: string | null
          first_message_sent_at: string | null
          last_contact_at: string | null
          campaign_name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          lead_id?: string
          organization_id: string
          user_id: string
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
          company_description?: string | null
          connection_request_sent_at?: string | null
          first_message_sent_at?: string | null
          last_contact_at?: string | null
          campaign_name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          lead_id?: string
          organization_id?: string
          user_id?: string
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
          company_description?: string | null
          connection_request_sent_at?: string | null
          first_message_sent_at?: string | null
          last_contact_at?: string | null
          campaign_name?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          user_id: string | null
          organization_id: string
          message_type: string | null
          conversation_id: string | null
          sender_linkedin_url: string | null
          recipient_linkedin_url: string | null
          from_name: string | null
          to_name: string | null
          message_date: string | null
          subject: string | null
          content: string | null
          folder: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          organization_id: string
          message_type?: string | null
          conversation_id?: string | null
          sender_linkedin_url?: string | null
          recipient_linkedin_url?: string | null
          from_name?: string | null
          to_name?: string | null
          message_date?: string | null
          subject?: string | null
          content?: string | null
          folder?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          organization_id?: string
          message_type?: string | null
          conversation_id?: string | null
          sender_linkedin_url?: string | null
          recipient_linkedin_url?: string | null
          from_name?: string | null
          to_name?: string | null
          message_date?: string | null
          subject?: string | null
          content?: string | null
          folder?: string | null
          created_at?: string
        }
      }
      campaigns: {
        Row: {
          id: string
          user_id: string
          campaign_name: string
          message_order: number
          message_content: string
          sent_at: string | null
          status: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          campaign_name: string
          message_order: number
          message_content: string
          sent_at?: string | null
          status?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          campaign_name?: string
          message_order?: number
          message_content?: string
          sent_at?: string | null
          status?: string | null
          created_at?: string
        }
      }
      knowledge_bases: {
        Row: {
          id: string
          name: string
          description: string | null
          organization_id: string
          type: string | null
          is_active: boolean
          document_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          organization_id: string
          type?: string | null
          is_active?: boolean
          document_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          organization_id?: string
          type?: string | null
          is_active?: boolean
          document_count?: number
          created_at?: string
          updated_at?: string
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
          metadata: Json
          created_at: string
          updated_at: string
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
          metadata?: Json
          created_at?: string
          updated_at?: string
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
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
      }
      mcp_servers: {
        Row: {
          id: string
          name: string
          description: string | null
          endpoint: string
          organization_id: string
          auth_type: string | null
          capabilities: string[] | null
          is_active: boolean
          auth_config: Json
          google_drive_folder_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          endpoint: string
          organization_id: string
          auth_type?: string | null
          capabilities?: string[] | null
          is_active?: boolean
          auth_config?: Json
          google_drive_folder_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          endpoint?: string
          organization_id?: string
          auth_type?: string | null
          capabilities?: string[] | null
          is_active?: boolean
          auth_config?: Json
          google_drive_folder_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      api_keys: {
        Row: {
          id: string
          organization_id: string | null
          key_name: string
          key_value: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id?: string | null
          key_name: string
          key_value: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string | null
          key_name?: string
          key_value?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
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
          created_at: string
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
          created_at?: string
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
          created_at?: string
        }
      }
      usage_metrics: {
        Row: {
          id: string
          organization_id: string | null
          user_id: string | null
          session_id: string | null
          model_used: string | null
          endpoint_used: string | null
          message_count: number
          tokens_used: number
          cost_usd: number
          date: string
          created_at: string
        }
        Insert: {
          id?: string
          organization_id?: string | null
          user_id?: string | null
          session_id?: string | null
          model_used?: string | null
          endpoint_used?: string | null
          message_count?: number
          tokens_used?: number
          cost_usd?: number
          date?: string
          created_at?: string
        }
        Update: {
          id?: string
          organization_id?: string | null
          user_id?: string | null
          session_id?: string | null
          model_used?: string | null
          endpoint_used?: string | null
          message_count?: number
          tokens_used?: number
          cost_usd?: number
          date?: string
          created_at?: string
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
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          email: string
          invited_by: string
          token: string
          expires_at: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          email?: string
          invited_by?: string
          token?: string
          expires_at?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      organization_members: {
        Row: {
          id: string
          organization_id: string
          user_id: string
          role: string
          joined_at: string
          invited_by: string | null
        }
        Insert: {
          id?: string
          organization_id: string
          user_id: string
          role?: string
          joined_at?: string
          invited_by?: string | null
        }
        Update: {
          id?: string
          organization_id?: string
          user_id?: string
          role?: string
          joined_at?: string
          invited_by?: string | null
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

// Convenient row type aliases for app usage
export type Organization = Database['public']['Tables']['organizations']['Row']
export type Profile = Database['public']['Tables']['profiles']['Row']
export type ChatSession = Database['public']['Tables']['chat_sessions']['Row']
export type Lead = Database['public']['Tables']['leads']['Row']
export type Message = Database['public']['Tables']['messages']['Row']
export type Campaign = Database['public']['Tables']['campaigns']['Row']
export type KnowledgeBase = Database['public']['Tables']['knowledge_bases']['Row']
export type KnowledgeBaseDocument = Database['public']['Tables']['knowledge_base_documents']['Row']
export type McpServer = Database['public']['Tables']['mcp_servers']['Row']
export type ApiKey = Database['public']['Tables']['api_keys']['Row']
export type BillingRecord = Database['public']['Tables']['billing_records']['Row']
export type UsageMetric = Database['public']['Tables']['usage_metrics']['Row']
export type OrganizationInvitation = Database['public']['Tables']['organization_invitations']['Row']
export type OrganizationMember = Database['public']['Tables']['organization_members']['Row']

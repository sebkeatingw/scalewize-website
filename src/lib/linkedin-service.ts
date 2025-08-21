import { supabase } from './supabase-client'

export interface LinkedInLead {
  id: string
  organization_id: string
  full_name: string | null
  first_name: string | null
  last_name: string | null
  linkedin_url: string | null
  email: string | null
  company: string | null
  title: string | null
  industry: string | null
  status: 'SENT' | 'REPLIED' | 'PENDING' | 'CONNECTED' | 'RESPONDED' | 'ACTIVE' | 'BOOKED' | 'CLOSED'
  connection_request_sent_at: string | null
  first_message_sent_at: string | null
  last_contact_at: string | null
  created_at: string
  updated_at: string
}

export interface LinkedInMessage {
  id: string
  organization_id: string
  sender_linkedin_url: string | null
  recipient_linkedin_url: string | null
  message_type: 'general' | 'connection_request' | 'first_message' | 'response'
  content: string | null
  message_date: string | null
  created_at: string
}

export interface LinkedInAnalytics {
  total_leads: number
  pending_leads: number
  sent_leads: number
  connected_leads: number
  responded_leads: number
  booked_leads: number
  closed_leads: number
  total_messages: number
  connection_requests_sent: number
  first_messages_sent: number
  responses_received: number
}

export class LinkedInService {
  private organizationId: string

  constructor(organizationId: string) {
    this.organizationId = organizationId
  }

  async getLeads(status?: string): Promise<LinkedInLead[]> {
    try {
      let query = supabase
        .from('leads')
        .select('*')
        .eq('organization_id', this.organizationId)
        .not('linkedin_url', 'is', null)
        .order('created_at', { ascending: false })

      if (status && status !== 'all') {
        query = query.eq('status', status)
      }

      const { data, error } = await query
      if (error) return []
      return data || []
    } catch {
      return []
    }
  }
}

export const createLinkedInService = (organizationId: string) => new LinkedInService(organizationId)



'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase-client'
import { UserPlus, Mail, Users, Trash2, Copy, CheckCircle } from 'lucide-react'
import type { OrganizationInvitation } from '@/types/database'

export default function SettingsPage() {
  const { profile, organization } = useAuth()
  const [invitations, setInvitations] = useState<OrganizationInvitation[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [copiedToken, setCopiedToken] = useState<string | null>(null)

  useEffect(() => {
    if (profile?.role === 'admin' || profile?.role === 'super_admin') {
      loadInvitations()
    }
  }, [profile?.role])

  const loadInvitations = async () => {
    try {
      const { data, error } = await supabase
        .from('organization_invitations')
        .select('*')
        .eq('organization_id', organization?.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setInvitations(data || [])
    } catch (error) {
      console.error('Error loading invitations:', error)
    } finally {
      setLoading(false)
    }
  }

  const sendInvitation = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !organization?.id) return

    setSending(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/invite-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          organizationId: organization.id,
          userId: profile?.id,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send invitation')
      }

      setSuccess('Invitation sent successfully!')
      setEmail('')
      loadInvitations() // Refresh the list
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to send invitation')
    } finally {
      setSending(false)
    }
  }

  const copyInviteLink = async (token: string) => {
    const inviteUrl = `${window.location.origin}/invite/${token}`
    try {
      await navigator.clipboard.writeText(inviteUrl)
      setCopiedToken(token)
      setTimeout(() => setCopiedToken(null), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const cancelInvitation = async (invitationId: string) => {
    try {
      const { error } = await supabase
        .from('organization_invitations')
        .update({ status: 'cancelled' })
        .eq('id', invitationId)

      if (error) throw error
      loadInvitations() // Refresh the list
    } catch (error) {
      console.error('Error cancelling invitation:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100'
      case 'accepted': return 'text-green-600 bg-green-100'
      case 'expired': return 'text-red-600 bg-red-100'
      case 'cancelled': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  if (profile?.role !== 'admin' && profile?.role !== 'super_admin') {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Settings</h1>
          <p className="text-gray-600">You don't have permission to access organization settings.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Organization Settings */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Organization Settings</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Organization Details</h3>
            <div className="space-y-2">
              <p><span className="font-medium">Name:</span> {organization?.name}</p>
              <p><span className="font-medium">Domain:</span> {organization?.domain || 'Not set'}</p>
              <p><span className="font-medium">Plan:</span> {organization?.plan_type}</p>
              <p><span className="font-medium">Status:</span> {organization?.subscription_status}</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Usage Limits</h3>
            <div className="space-y-2">
              <p><span className="font-medium">Max Users:</span> {organization?.max_users}</p>
              <p><span className="font-medium">Max Chat Sessions:</span> {organization?.max_chat_sessions}</p>
              <p><span className="font-medium">Monthly Token Limit:</span> {organization?.monthly_token_limit?.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Invite Members */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center mb-6">
          <UserPlus className="h-6 w-6 text-blue-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">Invite Team Members</h2>
        </div>

        <form onSubmit={sendInvitation} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="colleague@company.com"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={sending || !email}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
          >
            {sending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Sending...
              </>
            ) : (
              <>
                <Mail className="h-4 w-4 mr-2" />
                Send Invitation
              </>
            )}
          </button>
        </form>
      </div>

      {/* Pending Invitations */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center mb-6">
          <Users className="h-6 w-6 text-gray-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">Pending Invitations</h2>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading invitations...</p>
          </div>
        ) : invitations.length === 0 ? (
          <p className="text-gray-600 text-center py-8">No pending invitations</p>
        ) : (
          <div className="space-y-4">
            {invitations.map((invitation) => (
              <div key={invitation.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <p className="font-medium text-gray-900">{invitation.email}</p>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(invitation.status)}`}>
                        {invitation.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Invited on {new Date(invitation.created_at).toLocaleDateString()}
                    </p>
                    {invitation.status === 'pending' && (
                      <p className="text-sm text-gray-500">
                        Expires on {new Date(invitation.expires_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {invitation.status === 'pending' && (
                      <>
                        <button
                          onClick={() => copyInviteLink(invitation.token)}
                          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                          title="Copy invite link"
                        >
                          {copiedToken === invitation.token ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          onClick={() => cancelInvitation(invitation.id)}
                          className="p-2 text-red-400 hover:text-red-600 transition-colors"
                          title="Cancel invitation"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

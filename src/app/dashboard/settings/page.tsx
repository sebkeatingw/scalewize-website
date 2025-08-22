'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase-client'
import { UserPlus, Mail, Users, Trash2, Copy, CheckCircle, Building2, Settings, Shield, TrendingUp, Clock, DollarSign, User } from 'lucide-react'
import Image from 'next/image'
import type { OrganizationInvitation, OrganizationMember } from '@/types/database'

export default function SettingsPage() {
  const { profile, organization } = useAuth()
  const [invitations, setInvitations] = useState<OrganizationInvitation[]>([])
  const [members, setMembers] = useState<OrganizationMember[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [copiedToken, setCopiedToken] = useState<string | null>(null)

  useEffect(() => {
    if (profile?.role === 'admin' || profile?.role === 'super_admin') {
      loadInvitations()
      loadMembers()
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

  const loadMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('organization_members')
        .select(`
          *,
          profile:profiles(id, email, full_name, status, role, created_at)
        `)
        .eq('organization_id', organization?.id)
        .order('joined_at', { ascending: false })

      if (error) throw error
      setMembers(data || [])
    } catch (error) {
      console.error('Error loading members:', error)
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
      case 'pending': return 'text-yellow-600 bg-yellow-100 border-yellow-200'
      case 'accepted': return 'text-green-600 bg-green-100 border-green-200'
      case 'expired': return 'text-red-600 bg-red-100 border-red-200'
      case 'cancelled': return 'text-gray-600 bg-gray-100 border-gray-200'
      default: return 'text-gray-600 bg-gray-100 border-gray-200'
    }
  }

  const getProfileStatusColor = (status: string) => {
    switch (status) {
      case 'invited': return 'text-blue-600 bg-blue-100 border-blue-200'
      case 'pending': return 'text-yellow-600 bg-yellow-100 border-yellow-200'
      case 'active': return 'text-green-600 bg-green-100 border-green-200'
      case 'suspended': return 'text-red-600 bg-red-100 border-red-200'
      default: return 'text-gray-600 bg-gray-100 border-gray-200'
    }
  }

  if (profile?.role !== 'admin' && profile?.role !== 'super_admin') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="text-center">
            <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Restricted</h1>
            <p className="text-gray-600 max-w-md mx-auto">
              You don't have permission to access organization settings. Please contact your administrator.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center justify-center w-12 h-12 rounded-lg" style={{ backgroundColor: '#f0ede8' }}>
          <Settings className="h-6 w-6" style={{ color: '#595F39' }} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Organization Settings</h1>
          <p className="text-gray-600">Manage your team and organization configuration</p>
        </div>
      </div>

      {/* Organization Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Building2 className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Organization Overview</h2>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#f0ede8' }}>
                  <Building2 className="h-5 w-5" style={{ color: '#595F39' }} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Organization</p>
                  <p className="text-lg font-semibold text-gray-900">{organization?.name}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#f0ede8' }}>
                  <Shield className="h-5 w-5" style={{ color: '#595F39' }} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Plan</p>
                  <p className="text-lg font-semibold text-gray-900 capitalize">{organization?.plan_type}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#f0ede8' }}>
                  <Users className="h-5 w-5" style={{ color: '#595F39' }} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Max Users</p>
                  <p className="text-lg font-semibold text-gray-900">{organization?.max_users}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#f0ede8' }}>
                  <TrendingUp className="h-5 w-5" style={{ color: '#595F39' }} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Status</p>
                  <p className="text-lg font-semibold text-gray-900 capitalize">{organization?.subscription_status}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Chat Sessions</span>
              </div>
              <p className="text-2xl font-bold text-blue-900 mt-1">{organization?.max_chat_sessions?.toLocaleString()}</p>
            </div>

            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-900">Token Limit</span>
              </div>
              <p className="text-2xl font-bold text-green-900 mt-1">{organization?.monthly_token_limit?.toLocaleString()}</p>
            </div>

            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <div className="flex items-center space-x-2">
                <Building2 className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-900">Domain</span>
              </div>
              <p className="text-lg font-semibold text-purple-900 mt-1">{organization?.domain || 'Not set'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Invite Members */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <UserPlus className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Invite Team Members</h2>
          </div>
          <p className="text-gray-600 mt-1">Send invitations to colleagues to join your organization</p>
        </div>

        <div className="p-6">
          <form onSubmit={sendInvitation} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="colleague@company.com"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={sending || !email}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center font-medium"
            >
              {sending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Sending Invitation...
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
      </div>

      {/* Pending Invitations */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Users className="h-6 w-6 text-gray-600" />
              <h2 className="text-xl font-semibold text-gray-900">Pending Invitations</h2>
            </div>
            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
              {invitations.filter(i => i.status === 'pending').length} pending
            </span>
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading invitations...</p>
            </div>
          ) : invitations.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No invitations yet</h3>
              <p className="text-gray-600">Start building your team by sending invitations above.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {invitations.map((invitation) => (
                <div key={invitation.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-600">
                            {invitation.email.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{invitation.email}</p>
                          <p className="text-sm text-gray-500">
                            Invited on {new Date(invitation.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(invitation.status)}`}>
                          {invitation.status}
                        </span>
                      </div>
                      {invitation.status === 'pending' && (
                        <p className="text-sm text-gray-500 ml-11">
                          Expires on {new Date(invitation.expires_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {invitation.status === 'pending' && (
                        <>
                          <button
                            onClick={() => copyInviteLink(invitation.token)}
                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
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
                            className="p-2 text-red-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
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

      {/* Organization Members */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <User className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Organization Members</h2>
            </div>
            <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
              {members.length} members
            </span>
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading members...</p>
            </div>
          ) : members.length === 0 ? (
            <div className="text-center py-12">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No members yet</h3>
              <p className="text-gray-600">Invite team members to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {members.map((member) => (
                <div key={member.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600">
                            {member.profile?.full_name?.charAt(0) || member.profile?.email?.charAt(0) || 'U'}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {member.profile?.full_name || member.profile?.email}
                          </p>
                          <p className="text-sm text-gray-500">
                            Joined on {new Date(member.joined_at || '').toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <span className={`px-3 py-1 text-xs font-medium rounded-full border ${
                            member.role === 'admin' ? 'bg-purple-100 text-purple-700 border-purple-200' :
                            member.role === 'super_admin' ? 'bg-red-100 text-red-700 border-red-200' :
                            'bg-gray-100 text-gray-700 border-gray-200'
                          }`}>
                            {member.role}
                          </span>
                          <span className={`px-3 py-1 text-xs font-medium rounded-full border ${
                            getProfileStatusColor(member.profile?.status || 'pending')
                          }`}>
                            {member.profile?.status || 'pending'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

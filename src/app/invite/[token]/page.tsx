'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase-client'
import { Loader2, CheckCircle, XCircle, Mail, Building2, User } from 'lucide-react'

interface InvitationData {
  id: string
  organization_id: string
  email: string
  expires_at: string
  status: string
  organization: {
    name: string
  }
  invited_by: {
    full_name: string
  }
}

export default function InvitePage({ params }: { params: { token: string } }) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [invitation, setInvitation] = useState<InvitationData | null>(null)
  const [processing, setProcessing] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  useEffect(() => {
    validateToken()
  }, [params.token])

  const validateToken = async () => {
    try {
      // Get invitation data
      const { data: invitationData, error: invitationError } = await supabase
        .from('organization_invitations')
        .select(`
          id,
          organization_id,
          email,
          expires_at,
          status,
          organization:organizations(name),
          invited_by:profiles!organization_invitations_invited_by_fkey(full_name)
        `)
        .eq('token', params.token)
        .eq('status', 'pending')
        .single()

      if (invitationError || !invitationData) {
        setError('Invalid or expired invitation link')
        setLoading(false)
        return
      }

      // Check if invitation is expired
      if (new Date(invitationData.expires_at) < new Date()) {
        setError('This invitation has expired')
        setLoading(false)
        return
      }

      setInvitation(invitationData)
      setLoading(false)
    } catch (error) {
      console.error('Token validation error:', error)
      setError('Failed to validate invitation')
      setLoading(false)
    }
  }

  const handleAcceptInvitation = async () => {
    if (!invitation) return

    setProcessing(true)
    try {
      // Check if user is already authenticated
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        // User is logged in, check if they match the invitation email
        if (user.email !== invitation.email) {
          setError('This invitation is for a different email address. Please log out and sign in with the correct account.')
          setProcessing(false)
          return
        }

        // Update user's profile to join the organization
        await joinOrganization(user.id)
      } else {
        // User needs to sign up/sign in
        // Store invitation data in session storage for after auth
        sessionStorage.setItem('pendingInvitation', JSON.stringify(invitation))
        
        // Redirect to signup with email pre-filled
        router.push(`/signup?email=${encodeURIComponent(invitation.email)}&invite=true`)
        return
      }
    } catch (error) {
      console.error('Accept invitation error:', error)
      setError('Failed to accept invitation')
      setProcessing(false)
    }
  }

  const joinOrganization = async (userId: string) => {
    try {
      // Update user's profile to join the organization
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          organization_id: invitation!.organization_id,
          role: 'user' // Default role for invited users
        })
        .eq('id', userId)

      if (profileError) {
        throw profileError
      }

      // Mark invitation as accepted
      const { error: invitationError } = await supabase
        .from('organization_invitations')
        .update({
          status: 'accepted',
          updated_at: new Date().toISOString()
        })
        .eq('id', invitation!.id)

      if (invitationError) {
        console.error('Failed to update invitation status:', invitationError)
      }

      setSuccess(true)
      setProcessing(false)

      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)

    } catch (error) {
      console.error('Join organization error:', error)
      setError('Failed to join organization')
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">Validating invitation...</h2>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
          <div className="text-center">
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Invalid Invitation</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => router.push('/login')}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
          <div className="text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Welcome to {invitation?.organization.name}!</h2>
            <p className="text-gray-600 mb-6">You've successfully joined the organization. Redirecting to dashboard...</p>
            <Loader2 className="h-6 w-6 animate-spin text-blue-600 mx-auto" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <div className="text-center mb-6">
          <Building2 className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900">You're Invited!</h2>
          <p className="text-gray-600 mt-2">Join {invitation?.organization.name} on ScaleWize AI</p>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <Mail className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900">{invitation?.email}</p>
              <p className="text-xs text-gray-500">Invited email address</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <User className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900">{invitation?.invited_by.full_name}</p>
              <p className="text-xs text-gray-500">Invited by</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <Building2 className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900">{invitation?.organization.name}</p>
              <p className="text-xs text-gray-500">Organization</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleAcceptInvitation}
            disabled={processing}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            {processing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Processing...
              </>
            ) : (
              'Accept Invitation'
            )}
          </button>

          <button
            onClick={() => router.push('/login')}
            className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
          >
            I already have an account
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            This invitation expires on {new Date(invitation?.expires_at || '').toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  )
}

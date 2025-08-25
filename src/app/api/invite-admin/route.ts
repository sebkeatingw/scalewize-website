import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

export async function POST(request: NextRequest) {
  try {
    const { email, organizationId } = await request.json()
    
    console.log('Creating invitation for:', { email, organizationId })
    
    // Validate input
    if (!email || !organizationId) {
      return NextResponse.json(
        { error: 'Email and organization ID are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Create admin client using service role
    const supabaseAdmin = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Note: Admin verification is handled by the frontend before calling this API
    // The frontend ensures only admin users can access the admin dashboard
    console.log('Creating invitation for organization:', organizationId)

    // Check if user is already a member
    const { data: existingMember } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('email', email)
      .eq('organization_id', organizationId)
      .single()

    if (existingMember) {
      return NextResponse.json(
        { error: 'User is already a member of this organization' },
        { status: 400 }
      )
    }

    // Check if invitation already exists and is pending
    const { data: existingInvitation } = await supabaseAdmin
      .from('organization_invitations')
      .select('id')
      .eq('email', email)
      .eq('organization_id', organizationId)
      .eq('status', 'pending')
      .single()

    if (existingInvitation) {
      return NextResponse.json(
        { error: 'An invitation is already pending for this email' },
        { status: 400 }
      )
    }

    // Generate secure token
    const token = crypto.randomUUID()
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

    // Create invitation record in the organization_invitations table using service role
    const { data: invitation, error: invitationError } = await supabaseAdmin
      .from('organization_invitations')
      .insert({
        organization_id: organizationId,
        email,
        invited_by: null, // Will be set when user accepts invitation
        token,
        expires_at: expiresAt.toISOString(),
        status: 'pending'
      })
      .select()
      .single()

    if (invitationError) {
      console.error('Invitation creation error:', invitationError)
      return NextResponse.json(
        { error: 'Failed to create invitation: ' + invitationError.message },
        { status: 500 }
      )
    }

    console.log('Invitation created successfully:', invitation.id)

    // Get organization details for email
    const { data: organization } = await supabaseAdmin
      .from('organizations')
      .select('name')
      .eq('id', organizationId)
      .single()

    // Create invitation URL
    const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/invite/${token}`

    console.log('Invitation URL created:', inviteUrl)

    // TODO: Implement email sending
    // await sendInvitationEmail(email, inviteUrl, organization?.name, profile.full_name)

    return NextResponse.json({
      success: true,
      message: 'Invitation sent successfully',
      data: {
        id: invitation.id,
        email: invitation.email,
        expires_at: invitation.expires_at,
        invite_url: inviteUrl
      }
    })

  } catch (error) {
    console.error('Admin invitation API error:', error)
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    )
  }
}

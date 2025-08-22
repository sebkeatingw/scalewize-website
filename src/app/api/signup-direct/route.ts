import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

export async function POST(request: NextRequest) {
  try {
    const { email, password, fullName, organizationName } = await request.json()

    if (!email || !password || !fullName || !organizationName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create user with auto-confirmed email
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
      user_metadata: { full_name: fullName }
    })

    if (userError || !userData.user) {
      console.error('User creation error:', userError)
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      )
    }

    const userId = userData.user.id

    // Create organization
    const { data: orgData, error: orgError } = await supabaseAdmin
      .from('organizations')
      .insert({
        name: organizationName,
        subscription_status: 'trial',
        plan_type: 'starter',
        max_users: 50,
        max_chat_sessions: 1000,
        monthly_token_limit: 100000
      })
      .select()
      .single()

    if (orgError || !orgData) {
      console.error('Organization creation error:', orgError)
      // Clean up user if org creation fails
      await supabaseAdmin.auth.admin.deleteUser(userId)
      return NextResponse.json(
        { error: 'Failed to create organization' },
        { status: 500 }
      )
    }

    // Create profile with 'active' status for the new user
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: userId,
        organization_id: orgData.id,
        email,
        full_name: fullName,
        role: 'admin', // First user becomes admin
        status: 'active', // Set status to active for new signups
        is_active: true
      })

    if (profileError) {
      console.error('Profile creation error:', profileError)
      // Clean up user and org if profile creation fails
      await supabaseAdmin.auth.admin.deleteUser(userId)
      await supabaseAdmin.from('organizations').delete().eq('id', orgData.id)
      return NextResponse.json(
        { error: 'Failed to create profile' },
        { status: 500 }
      )
    }

    // Create organization member record
    const { error: memberError } = await supabaseAdmin
      .from('organization_members')
      .insert({
        organization_id: orgData.id,
        user_id: userId,
        role: 'admin',
        joined_at: new Date().toISOString()
      })

    if (memberError) {
      console.error('Organization member creation error:', memberError)
      // Profile and org are already created, so just log the error
      console.warn('Failed to create organization member record, but user and org were created')
    }

    return NextResponse.json({
      success: true,
      message: 'User, organization, and profile created successfully',
      data: {
        userId,
        organizationId: orgData.id,
        organizationName: orgData.name
      }
    })

  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

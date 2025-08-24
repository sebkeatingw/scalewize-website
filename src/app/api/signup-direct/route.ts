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

    console.log('Starting signup process for:', email)

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
        { error: userError?.message || 'Failed to create user' },
        { status: 500 }
      )
    }

    const userId = userData.user.id
    console.log('User created successfully:', userId)

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

    console.log('Organization created successfully:', orgData.id)

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
        is_active: true,
        onboarding_step: 'completed',
        profile_completion_percentage: 100
      })

    if (profileError) {
      console.error('Profile creation error:', profileError)
      // Clean up user and org if profile creation fails
      await supabaseAdmin.auth.admin.deleteUser(userId)
      await supabaseAdmin.from('organizations').delete().eq('id', orgData.id)
      return NextResponse.json(
        { error: 'Failed to create profile: ' + profileError.message },
        { status: 500 }
      )
    }

    console.log('Profile created successfully')

    // Verify the profile was created by reading it back
    const { data: verifyProfile, error: verifyError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (verifyError || !verifyProfile) {
      console.error('Profile verification failed:', verifyError)
      return NextResponse.json(
        { error: 'Profile created but verification failed' },
        { status: 500 }
      )
    }

    console.log('Profile verification successful:', verifyProfile)

    return NextResponse.json({
      success: true,
      message: 'User, organization, and profile created successfully',
      data: {
        userId,
        organizationId: orgData.id,
        organizationName: orgData.name,
        profile: verifyProfile
      }
    })

  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    )
  }
}

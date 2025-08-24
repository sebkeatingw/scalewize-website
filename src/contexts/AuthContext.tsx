'use client'
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase-client'
import type { Profile, Organization } from '@/types/database'

interface AuthContextType {
  user: any
  profile: Profile | null
  organization: Organization | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    let unsubscribed = false

    async function loadSession() {
      setLoading(true)
      try {
        console.log('Loading session...')
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          console.error('Session error:', sessionError)
        }
        
        if (unsubscribed) return
        
        console.log('Session loaded:', session?.user?.id || 'No user')
        setUser(session?.user ?? null)
        
        if (session?.user) {
          await fetchProfile(session.user.id)
        }
      } catch (error) {
        console.error('Error loading session:', error)
      } finally {
        if (!unsubscribed) {
          setLoading(false)
        }
      }
    }

    loadSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (unsubscribed) return
        
        console.log('Auth state changed:', _event, session?.user?.id || 'No user')
        setUser(session?.user ?? null)
        
        if (session?.user) {
          await fetchProfile(session.user.id)
        } else {
          console.log('No session, clearing profile and organization')
          setProfile(null)
          setOrganization(null)
          if (window.location.pathname !== '/login') router.push('/login')
        }
        setLoading(false)
      }
    )

    return () => {
      unsubscribed = true
      subscription.unsubscribe()
    }
  }, [router])

  const fetchProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId)
      
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (profileError) {
        console.error('Profile fetch error:', profileError)
        console.error('Error details:', {
          message: profileError.message,
          details: profileError.details,
          hint: profileError.hint,
          code: profileError.code
        })
        setProfile(null)
        setOrganization(null)
        return
      }

      console.log('Profile fetched successfully:', profileData)
      setProfile(profileData)

      if (profileData?.organization_id) {
        console.log('Fetching organization:', profileData.organization_id)
        
        const { data: orgData, error: orgError } = await supabase
          .from('organizations')
          .select('*')
          .eq('id', profileData.organization_id)
          .single()
        
        if (orgError) {
          console.error('Organization fetch error:', orgError)
          console.error('Organization error details:', {
            message: orgError.message,
            details: orgError.details,
            hint: orgError.hint,
            code: orgError.code
          })
          setOrganization(null)
        } else {
          console.log('Organization fetched successfully:', orgData)
          setOrganization(orgData)
        }
      } else {
        console.log('No organization_id in profile')
        setOrganization(null)
      }
    } catch (error) {
      console.error('Unexpected error in fetchProfile:', error)
      console.error('Error stack:', (error as Error).stack)
      setProfile(null)
      setOrganization(null)
    }
  }

  const signOut = async () => {
    try {
      console.log('Signing out...')
      await supabase.auth.signOut()
      localStorage.clear()
      sessionStorage.clear()
      window.location.href = '/login'
    } catch (error) {
      console.error('Error during sign out:', error)
      // Force redirect even if there's an error
      window.location.href = '/login'
    }
  }

  return (
    <AuthContext.Provider value={{ user, profile, organization, loading, signOut }}>
      {loading ? (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-t-2" style={{ borderColor: '#595F39' }} />
            <h2 className="text-xl font-semibold text-gray-900 mt-4">Loading ScaleWize AI</h2>
            <p className="text-gray-600">Connecting to your workspace...</p>
          </div>
        </div>
      ) : children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}



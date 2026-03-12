'use client'

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase-client"
import { User, Session } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  session: Session | null
  loading: boolean
  isAuthenticated: boolean
  isAdmin: boolean
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    isAuthenticated: false,
    isAdmin: false,
  })

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      checkUserRole(session)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      checkUserRole(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function checkUserRole(session: Session | null) {
    if (session?.user) {
      // Check if user is admin
      const { data: userData } = await supabase
        .from('User')
        .select('role')
        .eq('id', session.user.id)
        .single()

      setState({
        user: session.user,
        session,
        loading: false,
        isAuthenticated: true,
        isAdmin: userData?.role === 'ADMIN',
      })
    } else {
      setState({
        user: null,
        session: null,
        loading: false,
        isAuthenticated: false,
        isAdmin: false,
      })
    }
  }

  return state
}

export function useUser() {
  const { user, loading } = useAuth()
  return { user, loading }
}

export function useSession() {
  const { session, loading } = useAuth()
  return { session, loading }
}

'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthContext } from '@/contexts/auth-context'

interface RequireAuthProps {
  children: React.ReactNode
  requireAdmin?: boolean
  fallback?: React.ReactNode
}

export function RequireAuth({ children, requireAdmin = false, fallback }: RequireAuthProps) {
  const router = useRouter()
  const { isAuthenticated, isAdmin, loading } = useAuthContext()

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push('/admin/login')
      } else if (requireAdmin && !isAdmin) {
        router.push('/')
      }
    }
  }, [isAuthenticated, isAdmin, loading, requireAdmin, router])

  if (loading) {
    return (
      fallback ?? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      )
    )
  }

  if (!isAuthenticated) {
    return null
  }

  if (requireAdmin && !isAdmin) {
    return null
  }

  return <>{children}</>
}

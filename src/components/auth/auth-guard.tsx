'use client'

import { useAuthContext } from "@/contexts/auth-context"

interface AuthGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  requireAuth?: boolean
  requireAdmin?: boolean
}

/**
 * Component to conditionally render content based on auth state
 * Unlike RequireAuth, this doesn't redirect - just shows/hides content
 */
export function AuthGuard({
  children,
  fallback = null,
  requireAuth = false,
  requireAdmin = false,
}: AuthGuardProps) {
  const { isAuthenticated, isAdmin, loading } = useAuthContext()

  if (loading) {
    return <>{fallback}</>
  }

  // If auth required but not authenticated
  if (requireAuth && !isAuthenticated) {
    return <>{fallback}</>
  }

  // If admin required but not admin
  if (requireAdmin && !isAdmin) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

/**
 * Show content only when user is authenticated
 */
export function AuthOnly({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard requireAuth={true} fallback={null}>
      {children}
    </AuthGuard>
  )
}

/**
 * Show content only when user is NOT authenticated
 */
export function GuestOnly({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuthContext()

  if (loading || isAuthenticated) {
    return null
  }

  return <>{children}</>
}

/**
 * Show content only for admins
 */
export function AdminOnly({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard requireAdmin={true} fallback={null}>
      {children}
    </AuthGuard>
  )
}

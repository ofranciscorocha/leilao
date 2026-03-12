import { createServerClient } from "./supabase-server"

export async function getCurrentUser() {
  const supabase = await createServerClient()

  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return null
  }

  return user
}

export async function getSession() {
  const supabase = await createServerClient()

  const { data: { session }, error } = await supabase.auth.getSession()

  if (error || !session) {
    return null
  }

  return session
}

export async function requireAuth() {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  return user
}

export async function signOut() {
  const supabase = await createServerClient()
  await supabase.auth.signOut()
}

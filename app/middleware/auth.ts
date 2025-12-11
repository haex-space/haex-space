export default defineNuxtRouteMiddleware(async () => {
  // Only run on client - Supabase auth uses localStorage which isn't available on server
  if (import.meta.server) {
    return
  }

  const user = useSupabaseUser()
  const localePath = useLocalePath()

  // Redirect to login if not authenticated
  if (!user.value) {
    return navigateTo(localePath('/auth/login'))
  }
})

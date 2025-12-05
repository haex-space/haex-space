import { useMarketplaceStore } from '~/stores/marketplace'

export default defineNuxtRouteMiddleware(async (to) => {
  // Skip middleware for auth pages
  if (to.path.includes('/developer/auth')) {
    return
  }

  // Only run on client - Supabase auth uses localStorage which isn't available on server
  if (import.meta.server) {
    return
  }

  const store = useMarketplaceStore()
  const localePath = useLocalePath()

  // Wait for store to initialize if not yet done
  if (!store.initialized) {
    await store.init()
  }

  // Redirect to login if not authenticated
  if (!store.isAuthenticated) {
    return navigateTo(localePath('/auth/login?tab=marketplace'))
  }

  // Redirect to settings if no publisher profile (except settings page itself)
  if (!store.hasPublisher && !to.path.includes('/developer/settings')) {
    return navigateTo(localePath('/developer/settings'))
  }
})

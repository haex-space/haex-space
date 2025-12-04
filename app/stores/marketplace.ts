import { defineStore } from 'pinia'
import { createClient, type SupabaseClient, type User, type Session } from '@supabase/supabase-js'

// Types
export interface Publisher {
  id: string
  userId: string
  displayName: string
  slug: string
  description?: string
  website?: string
  email?: string
  verified: boolean
  avatarUrl?: string
  createdAt: string
  updatedAt: string
}

export interface Extension {
  id: string
  publisherId: string
  name: string
  slug: string
  shortDescription: string
  description?: string
  iconUrl?: string
  verified: boolean
  status: 'draft' | 'pending_review' | 'published' | 'rejected' | 'unlisted'
  totalDownloads: number
  averageRating: number
  reviewCount: number
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  name: string
  slug: string
}

export const useMarketplaceStore = defineStore('marketplace', () => {
  const config = useRuntimeConfig()

  // State
  const client = ref<SupabaseClient | null>(null)
  const user = ref<User | null>(null)
  const session = ref<Session | null>(null)
  const loading = ref(true)
  const publisher = ref<Publisher | null>(null)
  const extensions = ref<Extension[]>([])
  const categories = ref<Category[]>([])

  // Getters
  const isAuthenticated = computed(() => !!user.value)
  const hasPublisher = computed(() => !!publisher.value)
  const accessToken = computed(() => session.value?.access_token ?? null)

  // Initialize Supabase client
  function initClient() {
    if (client.value) return client.value

    const url = config.public.marketplaceSupabaseUrl as string
    const key = config.public.marketplaceSupabaseKey as string

    if (!url || !key) {
      console.warn('Marketplace Supabase credentials not configured')
      loading.value = false
      return null
    }

    client.value = createClient(url, key, {
      auth: {
        persistSession: true,
        storageKey: 'marketplace-auth',
      }
    })

    return client.value
  }

  // Initialize auth state
  async function init() {
    const supabase = initClient()
    if (!supabase) return

    try {
      const { data } = await supabase.auth.getSession()
      session.value = data.session
      user.value = data.session?.user ?? null

      // Listen for auth changes
      supabase.auth.onAuthStateChange((_event, newSession) => {
        session.value = newSession
        user.value = newSession?.user ?? null

        // Clear publisher when logged out
        if (!newSession) {
          publisher.value = null
          extensions.value = []
        }
      })

      // Load publisher if authenticated
      if (user.value) {
        await fetchPublisher()
      }
    } finally {
      loading.value = false
    }
  }

  // Auth actions
  async function signIn(email: string, password: string) {
    const supabase = initClient()
    if (!supabase) throw new Error('Marketplace client not initialized')

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) throw error

    // Fetch publisher after login
    await fetchPublisher()

    return data
  }

  async function signUp(email: string, password: string) {
    const supabase = initClient()
    if (!supabase) throw new Error('Marketplace client not initialized')

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/developer/auth/confirm`
      }
    })

    if (error) throw error
    return data
  }

  async function signOut() {
    const supabase = initClient()
    if (!supabase) throw new Error('Marketplace client not initialized')

    const { error } = await supabase.auth.signOut()
    if (error) throw error

    user.value = null
    session.value = null
    publisher.value = null
    extensions.value = []
  }

  // API helper
  async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const apiUrl = config.public.marketplaceApiUrl as string
    const token = accessToken.value

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers
    }

    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(`${apiUrl}${endpoint}`, {
      ...options,
      headers
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }))
      throw new Error(error.error || 'Request failed')
    }

    return response.json()
  }

  // Publisher actions
  async function fetchPublisher() {
    try {
      const data = await fetchApi<{ publisher: Publisher }>('/publishers/me')
      publisher.value = data.publisher
    } catch {
      // No publisher profile yet - that's ok
      publisher.value = null
    }
  }

  async function createPublisher(data: {
    displayName: string
    slug: string
    description?: string
    website?: string
    email?: string
  }) {
    const result = await fetchApi<{ publisher: Publisher }>('/publishers', {
      method: 'POST',
      body: JSON.stringify(data)
    })
    publisher.value = result.publisher
    return result.publisher
  }

  async function updatePublisher(data: Partial<{
    displayName: string
    slug: string
    description?: string
    website?: string
    email?: string
  }>) {
    const result = await fetchApi<{ publisher: Publisher }>('/publishers/me', {
      method: 'PATCH',
      body: JSON.stringify(data)
    })
    publisher.value = result.publisher
    return result.publisher
  }

  // Extension actions
  async function fetchMyExtensions() {
    const data = await fetchApi<{ extensions: Extension[] }>('/publish/extensions')
    extensions.value = data.extensions
    return data.extensions
  }

  async function createExtension(data: {
    name: string
    slug: string
    shortDescription: string
    description?: string
    categoryId?: string
    tags?: string[]
  }) {
    const result = await fetchApi<{ extension: Extension }>('/publish/extensions', {
      method: 'POST',
      body: JSON.stringify(data)
    })
    extensions.value.push(result.extension)
    return result.extension
  }

  async function updateExtension(slug: string, data: Partial<{
    name: string
    shortDescription: string
    description: string
    categoryId: string
    tags: string[]
    status: string
  }>) {
    const result = await fetchApi<{ extension: Extension }>(`/publish/extensions/${slug}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    })

    // Update in local state
    const index = extensions.value.findIndex(e => e.slug === slug)
    if (index !== -1) {
      extensions.value[index] = result.extension
    }

    return result.extension
  }

  async function uploadExtensionIcon(slug: string, file: File) {
    const apiUrl = config.public.marketplaceApiUrl as string
    const token = accessToken.value

    const formData = new FormData()
    formData.append('icon', file)

    const response = await fetch(`${apiUrl}/publish/extensions/${slug}/icon`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Upload failed' }))
      throw new Error(error.error || 'Upload failed')
    }

    return response.json() as Promise<{ iconUrl: string }>
  }

  async function uploadExtensionBundle(slug: string, file: File, version: string) {
    const apiUrl = config.public.marketplaceApiUrl as string
    const token = accessToken.value

    const formData = new FormData()
    formData.append('bundle', file)
    formData.append('version', version)

    const response = await fetch(`${apiUrl}/publish/extensions/${slug}/bundle`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Upload failed' }))
      throw new Error(error.error || 'Upload failed')
    }

    return response.json() as Promise<{ version: { id: string; version: string } }>
  }

  // Public data actions
  async function fetchCategories() {
    const data = await fetchApi<{ categories: Category[] }>('/categories')
    categories.value = data.categories
    return data.categories
  }

  async function fetchPublicExtensions(params?: {
    page?: number
    limit?: number
    category?: string
    search?: string
  }) {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.set('page', String(params.page))
    if (params?.limit) searchParams.set('limit', String(params.limit))
    if (params?.category) searchParams.set('category', params.category)
    if (params?.search) searchParams.set('search', params.search)

    const query = searchParams.toString()
    return fetchApi<{
      extensions: Extension[]
      pagination: { page: number; limit: number; total: number; totalPages: number }
    }>(`/extensions${query ? `?${query}` : ''}`)
  }

  async function fetchExtension(slug: string) {
    return fetchApi<{ extension: Extension }>(`/extensions/${slug}`)
  }

  return {
    // State
    client,
    user,
    session,
    loading,
    publisher,
    extensions,
    categories,

    // Getters
    isAuthenticated,
    hasPublisher,
    accessToken,

    // Auth
    init,
    signIn,
    signUp,
    signOut,

    // Publisher
    fetchPublisher,
    createPublisher,
    updatePublisher,

    // Extensions
    fetchMyExtensions,
    createExtension,
    updateExtension,
    uploadExtensionIcon,
    uploadExtensionBundle,

    // Public
    fetchCategories,
    fetchPublicExtensions,
    fetchExtension,
  }
})

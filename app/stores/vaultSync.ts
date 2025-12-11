import { defineStore } from 'pinia'
import { decryptVaultName } from '@haex-space/vault-sdk'

export interface VaultInfo {
  vaultId: string
  encryptedVaultName: string
  vaultNameNonce: string
  vaultNameSalt: string
  createdAt: string
  decryptedName?: string
}

export const useVaultSyncStore = defineStore('vaultSync', () => {
  // State
  const syncServerUrl = ref('https://sync.haex.space')
  const vaults = ref<VaultInfo[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const hasFetched = ref(false)
  const isDecrypted = ref(false)
  const decryptionError = ref<string | null>(null)
  // Password stored in memory only (not persisted)
  const serverPassword = ref<string | null>(null)

  // Getters
  const isConnected = computed(() => hasFetched.value)
  const vaultCount = computed(() => vaults.value.length)

  // Fetch vaults using the existing haex.space session token
  async function fetchVaults(): Promise<VaultInfo[]> {
    const supabase = useSupabaseClient()
    const { data: sessionData } = await supabase.auth.getSession()

    if (!sessionData.session?.access_token) {
      throw new Error('Not authenticated')
    }

    loading.value = true
    error.value = null

    try {
      // Fetch vaults using the haex.space token (same Supabase instance)
      const vaultsResponse = await fetch(`${syncServerUrl.value}/sync/vaults`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${sessionData.session.access_token}`,
        },
      })

      if (!vaultsResponse.ok) {
        throw new Error('Failed to fetch vaults')
      }

      const vaultsData = await vaultsResponse.json()
      vaults.value = vaultsData.vaults || []
      hasFetched.value = true

      return vaults.value
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Unknown error'
      throw e
    } finally {
      loading.value = false
    }
  }

  function reset() {
    vaults.value = []
    error.value = null
    hasFetched.value = false
    isDecrypted.value = false
    decryptionError.value = null
  }

  // Set the server password (called from login)
  function setServerPassword(password: string) {
    serverPassword.value = password
  }

  // Clear the password (called on logout)
  function clearServerPassword() {
    serverPassword.value = null
  }

  // Delete a vault from the server
  async function deleteVault(vaultId: string): Promise<void> {
    const supabase = useSupabaseClient()
    const { data: sessionData } = await supabase.auth.getSession()

    if (!sessionData.session?.access_token) {
      throw new Error('Not authenticated')
    }

    const response = await fetch(`${syncServerUrl.value}/sync/vaults/${vaultId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${sessionData.session.access_token}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || 'Failed to delete vault')
    }

    // Remove vault from local state
    vaults.value = vaults.value.filter((v) => v.vaultId !== vaultId)
  }

  // Decrypt vault names with the server password
  async function decryptVaultNames(password: string): Promise<boolean> {
    decryptionError.value = null

    try {
      const decryptedVaults = await Promise.all(
        vaults.value.map(async (vault) => {
          try {
            const decryptedName = await decryptVaultName(
              vault.encryptedVaultName,
              vault.vaultNameNonce,
              vault.vaultNameSalt,
              password
            )
            return { ...vault, decryptedName }
          } catch {
            // If decryption fails for one vault, return it with undefined name
            return { ...vault, decryptedName: undefined }
          }
        })
      )

      // Check if at least one vault was decrypted successfully
      const anyDecrypted = decryptedVaults.some((v) => v.decryptedName !== undefined)
      if (!anyDecrypted && decryptedVaults.length > 0) {
        decryptionError.value = 'Invalid password'
        return false
      }

      vaults.value = decryptedVaults
      isDecrypted.value = true
      return true
    } catch (e) {
      decryptionError.value = e instanceof Error ? e.message : 'Decryption failed'
      return false
    }
  }

  return {
    // State
    syncServerUrl,
    vaults,
    loading,
    error,
    isDecrypted,
    decryptionError,
    serverPassword,

    // Getters
    isConnected,
    vaultCount,

    // Actions
    fetchVaults,
    deleteVault,
    decryptVaultNames,
    setServerPassword,
    clearServerPassword,
    reset,
  }
})

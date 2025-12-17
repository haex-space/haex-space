```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@haex-space/vault-sdk/nuxt'],
  haexVault: {
    extensionDir: 'haextension'
  }
})
```

```typescript
// stores/haexvault.ts
import type { SqliteRemoteDatabase } from 'drizzle-orm/sqlite-proxy'
import * as schema from '~/database/schemas'

export const useHaexVaultStore = defineStore('haexvault', () => {
  const nuxtApp = useNuxtApp()
  const orm = shallowRef<SqliteRemoteDatabase<typeof schema> | null>(null)

  const getHaexVault = () => {
    const haexVault = nuxtApp.$haexVault
    if (!haexVault) {
      throw new Error('HaexVault plugin not available')
    }
    return haexVault
  }

  const initializeAsync = async () => {
    const haexVault = getHaexVault()

    // Register setup hook BEFORE calling setupComplete()
    haexVault.client.onSetup(async () => {
      // Run migrations or other setup tasks here
    })

    // Initialize Drizzle ORM with your schema
    orm.value = haexVault.client.initializeDatabase(schema)

    // Trigger setup to run registered hooks
    await haexVault.client.setupComplete()
  }

  return {
    get client() { return getHaexVault().client },
    get state() { return getHaexVault().state },
    orm,
    initializeAsync,
  }
})
```

```vue
<!-- app.vue -->
<script setup lang="ts">
const haexVaultStore = useHaexVaultStore()

onMounted(async () => {
  await haexVaultStore.initializeAsync()
})
</script>

<template>
  <div v-if="!haexVaultStore.state.isSetupComplete">Loading...</div>
  <div v-else>
    <p>Theme: {{ haexVaultStore.state.context?.theme }}</p>
    <NuxtPage />
  </div>
</template>
```

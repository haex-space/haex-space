```vue
<script setup lang="ts">
import { useHaexVaultSdk } from '@haex-space/vault-sdk/vue'
import manifest from '../haextension/manifest.json'

const {
  client,           // HaexVaultSdk instance
  extensionInfo,    // Ref<ExtensionInfo | null>
  context,          // Ref<ApplicationContext | null>
  isSetupComplete,  // Ref<boolean>
  db,               // Drizzle ORM instance
  storage,          // StorageAPI
  getTableName      // (name: string) => string
} = useHaexVaultSdk({ manifest, debug: true })

// Wait for initialization
onMounted(async () => {
  await client.ready()
  console.log('Extension loaded:', extensionInfo.value?.name)
})
</script>

<template>
  <div v-if="!isSetupComplete">Loading...</div>
  <div v-else>
    <p>Theme: {{ context?.theme }}</p>
    <p>Platform: {{ context?.platform }}</p>
  </div>
</template>
```

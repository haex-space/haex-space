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
// stores/haex.ts
export const useHaexStore = defineStore('haex', () => {
  const { $haex } = useNuxtApp()
  const db = ref<ReturnType<typeof $haex.client.initializeDatabase>>()

  $haex.client.onSetup(async () => {
    db.value = $haex.client.initializeDatabase(schema)
  })

  return { db, client: $haex.client, storage: $haex.storage }
})
```

```vue
<!-- app.vue -->
<script setup lang="ts">
const { $haex } = useNuxtApp()
const { context } = storeToRefs(useHaexStore())
</script>

<template>
  <div v-if="!$haex.isSetupComplete">Loading...</div>
  <div v-else>
    <p>Theme: {{ context?.theme }}</p>
  </div>
</template>
```

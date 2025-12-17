```vue
<!-- src/App.vue -->
<script setup lang="ts">
import { useHaexVaultSdk } from '@haex-space/vault-sdk/vue'

const { client, context } = useHaexVaultSdk()

// Access context (reactive refs)
const theme = computed(() => context.value?.theme)       // 'light' | 'dark'
const locale = computed(() => context.value?.locale)     // 'en', 'de', etc.
const platform = computed(() => context.value?.platform) // 'linux', 'windows', 'macos', 'android', 'ios'

// Example: Store data
async function saveNote() {
  await client.storage.set('my-note', 'Hello from my extension!')
}

// Example: Read data
async function loadNote() {
  const note = await client.storage.get('my-note')
  console.log(note)
}
</script>

<template>
  <div class="container">
    <h1>My First Extension</h1>
    <p>Theme: {{ theme }} | Locale: {{ locale }} | Platform: {{ platform }}</p>
    <button @click="saveNote">Save Note</button>
    <button @click="loadNote">Load Note</button>
  </div>
</template>
```

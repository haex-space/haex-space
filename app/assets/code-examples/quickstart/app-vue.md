```vue
<!-- src/App.vue -->
<script setup lang="ts">
import { useHaexClient } from '@haex-space/vault-sdk/vue'

const client = useHaexClient()

// Access context (theme, locale, platform)
const theme = computed(() => client.context.value?.theme ?? 'system')

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
    <p>Current theme: {{ theme }}</p>
    <button @click="saveNote">Save Note</button>
    <button @click="loadNote">Load Note</button>
  </div>
</template>
```

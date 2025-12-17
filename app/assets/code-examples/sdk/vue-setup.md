```vue
<script setup lang="ts">
import { useHaexVaultSdk } from '@haex-space/vault-sdk/vue'
import manifest from '../haextension/manifest.json'

// Initialize SDK with manifest
const { client, context, extensionInfo, getTableName } = useHaexVaultSdk({
  manifest,
  debug: import.meta.env.DEV
})

// Watch for context changes (theme/locale)
watch(() => context.value, (ctx) => {
  if (ctx) {
    document.documentElement.classList.toggle('dark', ctx.theme === 'dark')
  }
}, { immediate: true })
</script>
```

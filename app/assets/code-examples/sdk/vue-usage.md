```vue
<script setup lang="ts">
import { useHaexVaultSdk } from '@haex-space/vault-sdk/vue'

const { client, context, getTableName } = useHaexVaultSdk()

// Access context - reactive refs
const theme = computed(() => context.value?.theme)     // 'light' | 'dark'
const locale = computed(() => context.value?.locale)   // 'en', 'de', etc.
const platform = computed(() => context.value?.platform) // 'linux', 'windows', 'macos', 'android', 'ios', etc.

// Database operations with namespaced table names
async function loadData() {
  const tableName = getTableName('users')
  const users = await client.query(`SELECT * FROM ${tableName}`)
  console.log(users)
}
</script>
```

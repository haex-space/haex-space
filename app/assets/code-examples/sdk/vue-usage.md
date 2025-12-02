```vue
<script setup lang="ts">
import { useHaexClient } from '@haex-space/vault-sdk/vue'

const client = useHaexClient()

// Access context
const theme = computed(() => client.context.value?.theme)
const locale = computed(() => client.context.value?.locale)

// Database operations
async function loadData() {
  const users = await client.query('SELECT * FROM users')
  console.log(users)
}
</script>
```

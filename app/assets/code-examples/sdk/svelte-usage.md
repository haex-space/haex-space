```svelte
<script lang="ts">
  import { haexVaultSdk, context } from '@haex-space/vault-sdk/svelte'

  // Access context via Svelte store - automatically reactive
  $: theme = $context?.theme       // 'light' | 'dark'
  $: locale = $context?.locale     // 'en', 'de', etc.
  $: platform = $context?.platform // 'linux', 'windows', 'macos', 'android', 'ios', etc.

  async function loadData() {
    const tableName = haexVaultSdk.getTableName('users')
    const users = await haexVaultSdk.client.query(`SELECT * FROM ${tableName}`)
    console.log(users)
  }
</script>
```

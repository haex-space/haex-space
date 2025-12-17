```svelte
<script lang="ts">
  import { onMount } from 'svelte'
  import { initHaexVaultSdk, haexVaultSdk, isSetupComplete, context } from '@haex-space/vault-sdk/svelte'
  import manifest from '../haextension/manifest.json'

  onMount(async () => {
    initHaexVaultSdk({ manifest, debug: true })

    haexVaultSdk.client.onSetup(async () => {
      const tableName = haexVaultSdk.getTableName('todos')
      await haexVaultSdk.client.execute(`
        CREATE TABLE IF NOT EXISTS ${tableName} (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL
        )
      `)
    })

    await haexVaultSdk.client.setupComplete()
  })
</script>

{#if $isSetupComplete}
  <div>
    <p>Theme: {$context?.theme}</p>
    <p>Platform: {$context?.platform}</p>
  </div>
{:else}
  <p>Loading...</p>
{/if}
```

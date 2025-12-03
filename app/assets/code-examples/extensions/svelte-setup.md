```svelte
<script lang="ts">
  import { onMount } from 'svelte'
  import { initHaexVault, haexHub, isSetupComplete, context } from '@haex-space/vault-sdk/svelte'
  import manifest from '../haextension/manifest.json'

  onMount(async () => {
    initHaexVault({ manifest, debug: true })

    haexHub.client.onSetup(async () => {
      const tableName = haexHub.getTableName('todos')
      await haexHub.client.execute(`
        CREATE TABLE IF NOT EXISTS ${tableName} (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL
        )
      `)
    })

    await haexHub.client.setupComplete()
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

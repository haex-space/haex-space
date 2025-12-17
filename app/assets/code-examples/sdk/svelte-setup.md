```svelte
<!-- App.svelte -->
<script lang="ts">
  import { onMount } from 'svelte'
  import { initHaexVaultSdk, isSetupComplete } from '@haex-space/vault-sdk/svelte'
  import manifest from '../haextension/manifest.json'

  onMount(() => {
    // Initialize SDK with manifest (call once at app startup)
    initHaexVaultSdk({ manifest, debug: import.meta.env.DEV })
  })
</script>

{#if $isSetupComplete}
  <slot />
{:else}
  <p>Initializing...</p>
{/if}
```

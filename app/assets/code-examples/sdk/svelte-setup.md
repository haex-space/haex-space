```svelte
<!-- App.svelte -->
<script>
  import { setHaexContext, createHaexClient } from '@haex-space/vault-sdk/svelte'

  const client = createHaexClient()
  setHaexContext(client)
</script>
```

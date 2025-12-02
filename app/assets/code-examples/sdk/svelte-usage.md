```svelte
<script>
  import { getHaexClient } from '@haex-space/vault-sdk/svelte'

  const client = getHaexClient()

  async function loadData() {
    const users = await client.query('SELECT * FROM users')
    console.log(users)
  }
</script>
```

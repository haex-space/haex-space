```tsx
import { useHaexClient } from '@haex-space/vault-sdk/react'

function Component() {
  const client = useHaexClient()

  const loadData = async () => {
    const users = await client.query('SELECT * FROM users')
    console.log(users)
  }

  return <button onClick={loadData}>Load Data</button>
}
```

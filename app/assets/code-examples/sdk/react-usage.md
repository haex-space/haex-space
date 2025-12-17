```tsx
import { useHaexVaultSdk } from '@haex-space/vault-sdk/react'

function Component() {
  const { client, context, getTableName } = useHaexVaultSdk()

  // Access context - automatically updates
  const theme = context?.theme     // 'light' | 'dark'
  const locale = context?.locale   // 'en', 'de', etc.
  const platform = context?.platform // 'linux', 'windows', 'macos', 'android', 'ios', etc.

  const loadData = async () => {
    const tableName = getTableName('users')
    const users = await client.query(`SELECT * FROM ${tableName}`)
    console.log(users)
  }

  return <button onClick={loadData}>Load Data</button>
}
```

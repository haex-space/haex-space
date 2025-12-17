```typescript
import { createHaexVaultSdk } from '@haex-space/vault-sdk'
import manifest from '../haextension/manifest.json'

const client = createHaexVaultSdk({ manifest, debug: true })

// Register setup hook for database initialization
client.onSetup(async () => {
  const tableName = client.getTableName('users')
  await client.execute(`CREATE TABLE IF NOT EXISTS ${tableName} (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL
  )`)
})

// Wait for SDK and setup to complete
await client.setupComplete()

// Subscribe to context changes
client.subscribe(() => {
  const ctx = client.context
  if (ctx) {
    console.log('Theme:', ctx.theme)       // 'light' | 'dark'
    console.log('Locale:', ctx.locale)     // 'en', 'de', etc.
    console.log('Platform:', ctx.platform) // 'linux', 'windows', 'macos', etc.
  }
})
```

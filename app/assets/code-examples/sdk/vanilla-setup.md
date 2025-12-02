```typescript
import { HaexClient } from '@haex-space/vault-sdk'

const client = new HaexClient()

// Initialize the client
await client.initialize()

// Setup database tables
client.onSetup(async () => {
  await client.execute('CREATE TABLE IF NOT EXISTS ...')
})

await client.setupComplete()
```

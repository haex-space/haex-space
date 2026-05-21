```typescript
// Inside an extension: listen for relevant sync updates
import { HAEXTENSION_EVENTS } from '@haex-space/vault-sdk'

const { client } = useHaexVaultSdk()

client.on(HAEXTENSION_EVENTS.SYNC_TABLES_UPDATED, async (event) => {
  const tables = event.data?.tables ?? []
  const ourPrefix = client.getTableName('') // '<pubKey>__<extName>__'

  if (tables.some((t) => t.startsWith(ourPrefix))) {
    await reloadDataAsync()
  }
})
```

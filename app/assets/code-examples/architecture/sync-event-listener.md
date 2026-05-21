```typescript
// Inside haex-vault: stores register for sync events
// (internal API, not used from extensions).
import { registerStoreForTables } from '@/stores/sync/syncEvents'

registerStoreForTables(
  'passwordsStore',
  ['haex_passwords', '*'],
  async ({ tables }) => {
    await reloadAffectedRowsAsync(tables)
  },
)
```

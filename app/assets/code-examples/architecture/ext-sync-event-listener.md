```typescript
// In your extension (using vault-sdk)
import { HAEXTENSION_EVENTS } from '@haex-space/vault-sdk'

vault.on(HAEXTENSION_EVENTS.SYNC_TABLES_UPDATED, async (event) => {
  const tables = event.data?.tables || []

  // Check if our tables are affected
  const ourTablePrefix = vault.getTableName('')
  const hasOurTables = tables.some(t => t.startsWith(ourTablePrefix))

  if (hasOurTables) {
    // Reload data from database
    await reloadDataAsync()
  }
})
```

```typescript
import { HAEXTENSION_EVENTS, EXTERNAL_EVENTS } from '@haex-space/vault-sdk'

const { client } = useHaexVaultSdk()

// Listen for context changes (theme / locale / platform)
client.on(HAEXTENSION_EVENTS.CONTEXT_CHANGED, (event) => {
  const { theme, locale, platform } = event.data.context
  console.log('Context updated:', { theme, locale, platform })
})

// Sync notification: tables relevant to this extension have new data
client.on(HAEXTENSION_EVENTS.SYNC_TABLES_UPDATED, async (event) => {
  const tables = event.data?.tables ?? []
  const ourPrefix = client.getTableName('') // '<pubKey>__<extName>__'
  if (tables.some(t => t.startsWith(ourPrefix))) {
    await reloadDataAsync()
  }
})

// Search requests (when haex-vault routes a search to this extension)
client.on(HAEXTENSION_EVENTS.SEARCH_REQUEST, async (event) => {
  const { query, requestId } = event.data
  const results = await performSearch(query)
  await client.respondToSearch(requestId, results)
})

// External requests (from browser extension, CLI, other apps)
client.on(EXTERNAL_EVENTS.REQUEST, async (event) => {
  const { requestId, action, payload, publicKey } = event.data
  const data = await handle(action, payload)
  await client.respondToExternalRequest({ requestId, success: true, data })
})
```

```typescript
import { HAEXTENSION_EVENTS, EXTERNAL_EVENTS } from '@haex-space/vault-sdk'

const { client } = useHaexVaultSdk()

// Listen for context changes
client.on(HAEXTENSION_EVENTS.CONTEXT_CHANGED, (event) => {
  const { theme, locale, platform } = event.data.context
  console.log('Context updated:', { theme, locale, platform })
})

// Listen for search requests (if extension supports search)
client.on(HAEXTENSION_EVENTS.SEARCH_REQUEST, async (event) => {
  const { query, requestId } = event.data

  // Perform search
  const results = await performSearch(query)

  // Send results back
  await client.respondToSearch(requestId, results)
})

// Listen for external requests (from browser extensions, CLI tools, etc.)
client.on(EXTERNAL_EVENTS.REQUEST, async (event) => {
  const { clientId, action, payload, requestId } = event.data

  // Handle the external request
  const response = await handleExternalRequest(action, payload)

  // Send response back
  await client.respondToExternalRequest(requestId, response)
})
```

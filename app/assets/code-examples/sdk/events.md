```typescript
const client = useHaexClient()

// Listen for context changes
client.on('haextension:context:changed', (event) => {
  const { theme, locale, platform } = event.data.context
  console.log('Context updated:', { theme, locale, platform })
})

// Listen for search requests (if extension supports search)
client.on('haextension:search:request', async (event) => {
  const { query, requestId } = event.data

  // Perform search
  const results = await performSearch(query)

  // Send results back
  await client.respondToSearch(requestId, results)
})
```

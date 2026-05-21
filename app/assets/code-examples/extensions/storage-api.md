```typescript
// The Storage API is scoped to the extension.
// Methods: getItem / setItem / removeItem / keys / clear.

await client.storage.setItem('lastSync', new Date().toISOString())
await client.storage.setItem('settings', JSON.stringify({ theme: 'dark' }))

// Retrieve data
const lastSync = await client.storage.getItem('lastSync')
const settings = JSON.parse((await client.storage.getItem('settings')) ?? '{}')

// List all keys
const keys = await client.storage.keys()

// Remove specific key
await client.storage.removeItem('lastSync')

// Clear all storage for this extension
await client.storage.clear()
```

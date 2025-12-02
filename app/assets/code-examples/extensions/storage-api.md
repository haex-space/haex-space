```typescript
// Store simple key-value data
await storage.setItem('lastSync', new Date().toISOString())
await storage.setItem('settings', JSON.stringify({ theme: 'dark' }))

// Retrieve data
const lastSync = await storage.getItem('lastSync')
const settings = JSON.parse(await storage.getItem('settings') || '{}')

// List all keys
const keys = await storage.keys()

// Remove specific key
await storage.removeItem('lastSync')

// Clear all storage for this extension
await storage.clear()
```

```typescript
// Listen for sync events in your extension
vault.on('sync:tables-updated', async (event) => {
  const tables = event.data?.tables || []

  // Check if your tables were updated
  if (tables.some(t => t.includes('my_extension_table'))) {
    // Reload your data
    await reloadDataAsync()
  }
})
```

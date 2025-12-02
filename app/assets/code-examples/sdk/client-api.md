```typescript
const client = useHaexClient()

// Extension info
client.extensionInfo        // { publicKey, name, version }
client.getTableName('users') // Prefixed table name

// Database
await client.query(sql, params)
await client.execute(sql, params)
await client.insert(table, data)
await client.update(table, data, where, whereParams)
await client.delete(table, where, whereParams)

// Storage
await client.storage.get(key)
await client.storage.set(key, value)
await client.storage.remove(key)

// Filesystem
await client.filesystem.saveFileAsync(data, options)
await client.filesystem.openFileAsync(options)

// Web
await client.web.fetchAsync(url, options)
await client.web.openAsync(url)

// Permissions
await client.checkDatabaseAsync(table, operation)
await client.checkFilesystemAsync(path, operation)
await client.checkWebAsync(url)
```

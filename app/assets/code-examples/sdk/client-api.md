```typescript
const { client, extensionInfo, context, getTableName } = useHaexVaultSdk()

// Extension info (reactive in Vue/React/Svelte)
extensionInfo          // { publicKey, name, version }
getTableName('users')  // Prefixed table name

// Context (reactive)
context.theme          // 'light' | 'dark'
context.locale         // 'en', 'de', etc.
context.platform       // 'linux', 'windows', 'macos', 'android', 'ios'

// Database
await client.query(sql, params)
await client.execute(sql, params)
await client.database.insert(table, data)
await client.database.update(table, data, where, whereParams)
await client.database.delete(table, where, whereParams)

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
await client.permissions.checkDatabaseAsync(table, operation)
await client.permissions.checkFilesystemAsync(path, operation)
await client.permissions.checkWebAsync(url)
```

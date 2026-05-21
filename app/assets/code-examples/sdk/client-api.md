```typescript
const { client, extensionInfo, context, getTableName } = useHaexVaultSdk()

// Identity & context (reactive in Vue / React / Svelte adapters)
extensionInfo          // { publicKey, name, version, displayName }
context.theme          // 'light' | 'dark'
context.locale         // 'de' | 'en' | ...
context.platform       // 'linux' | 'windows' | 'macos' | 'android' | 'ios'

// Table naming
getTableName('users')
client.getDependencyTableName(publicKey, extensionName, 'users')
client.parseTableName(fullTableName)

// Database (shortcuts and full DatabaseAPI)
await client.query(sql, params)
await client.execute(sql, params)
await client.database.queryOne(sql, params)
await client.database.transaction([{ sql, params }, ...])
await client.database.insert(table, data)
await client.database.update(table, data, where, whereParams)
await client.database.delete(table, where, whereParams)
await client.registerMigrationsAsync(extensionVersion, migrations)

// Drizzle ORM
const db = client.initializeDatabase({ users })
await db.select().from(users)

// Storage (key-value, scoped to the extension)
await client.storage.getItem(key)
await client.storage.setItem(key, value)
await client.storage.removeItem(key)
await client.storage.keys()
await client.storage.clear()

// Filesystem
await client.filesystem.saveFileAsync(data, options)
await client.filesystem.openFileAsync(options)
await client.filesystem.openMultipleAsync(options)
await client.filesystem.showImageAsync(options)

// Web
await client.web.fetchAsync(url, options)
await client.web.fetchJsonAsync(url, options)
await client.web.fetchTextAsync(url, options)
await client.web.fetchBlobAsync(url, options)
await client.web.openAsync(url)

// Permissions (SDK boundary uses 'read' | 'write')
await client.permissions.checkDatabaseAsync(resource, 'read' | 'write')
await client.permissions.checkFilesystemAsync(path,    'read' | 'write')
await client.permissions.checkWebAsync(url)

// External requests (browser ext / CLI / external apps)
client.onExternalRequest('my-action', async (req) => ({ ok: true }))
await client.respondToExternalRequest(response)

// Lifecycle
client.onSetup(async () => { /* run migrations etc. */ })
await client.setupComplete()
```

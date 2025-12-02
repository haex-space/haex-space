```typescript
// Check database permission before query
const canRead = await client.permissions.checkDatabaseAsync(
  'other_extension_table',
  'read'
)

if (canRead) {
  const data = await client.query('SELECT * FROM other_extension_table')
}

// Check web permission
const canFetch = await client.permissions.checkWebAsync(
  'https://api.external.com'
)

// Check filesystem permission
const canWrite = await client.permissions.checkFilesystemAsync(
  '/exports/backup.json',
  'write'
)
```

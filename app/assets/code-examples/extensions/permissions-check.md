```typescript
// SDK permission checks are simplified to read | write.
// Use the full table name as the "resource" target.

const otherTable = client.getDependencyTableName(
  'MCowBQYDK2Vw...',
  'password-manager',
  'credentials',
)

// Check database permission
const canRead = await client.permissions.checkDatabaseAsync(otherTable, 'read')

if (canRead) {
  const data = await client.query(`SELECT * FROM ${otherTable}`)
}

// Check web permission (URL must match a manifest http target)
const canFetch = await client.permissions.checkWebAsync('https://api.external.com/v1/data')

// Check filesystem permission
const canWrite = await client.permissions.checkFilesystemAsync(
  '/exports/backup.json',
  'write',
)
```

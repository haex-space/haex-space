```typescript
// count(table: string, where?: string, whereParams?: unknown[]): Promise<number>
// Count records in a table

const tableName = client.getTableName('users')

const totalUsers = await client.count(tableName)

const activeUsers = await client.count(
  tableName,
  'active = ?',
  [true]
)
```

```typescript
// update(table: string, data: Record<string, unknown>,
//        where: string, whereParams?: unknown[]): Promise<number>
// Helper for updating records, returns rows affected

const tableName = client.getTableName('users')

const rowsAffected = await client.update(
  tableName,
  { name: 'Jane Doe', updated_at: new Date().toISOString() },
  'id = ?',
  [userId]
)

// Multiple conditions
await client.update(
  tableName,
  { active: false },
  'role = ? AND last_login < ?',
  ['guest', thirtyDaysAgo]
)
```

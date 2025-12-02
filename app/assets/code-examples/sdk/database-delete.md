```typescript
// delete(table: string, where: string, whereParams?: unknown[]): Promise<number>
// Helper for deleting records, returns rows deleted

const tableName = client.getTableName('users')
const sessionsTable = client.getTableName('sessions')

const rowsDeleted = await client.delete(tableName, 'id = ?', [userId])

// Delete multiple
await client.delete(sessionsTable, 'expires_at < ?', [Date.now()])
```

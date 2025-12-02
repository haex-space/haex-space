```typescript
// insert(table: string, data: Record<string, unknown>): Promise<number>
// Helper for inserting a record, returns last insert ID

const tableName = client.getTableName('users')

const id = await client.insert(tableName, {
  id: crypto.randomUUID(),
  name: 'John Doe',
  email: 'john@example.com',
  created_at: new Date().toISOString()
})
```

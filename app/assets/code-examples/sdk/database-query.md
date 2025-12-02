```typescript
// query<T>(sql: string, params?: unknown[]): Promise<T[]>
// Executes a SELECT query and returns rows

const tableName = client.getTableName('users')

const users = await client.query<User>(`SELECT * FROM ${tableName}`)

// With parameters
const user = await client.query<User>(
  `SELECT * FROM ${tableName} WHERE id = ?`,
  [userId]
)

// With multiple conditions
const filtered = await client.query<User>(
  `SELECT * FROM ${tableName} WHERE role = ? AND active = ?`,
  ['admin', true]
)
```

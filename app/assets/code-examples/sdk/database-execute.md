```typescript
// execute(sql: string, params?: unknown[]): Promise<ExecuteResult>
// Executes INSERT, UPDATE, DELETE, CREATE, ALTER statements

const tableName = client.getTableName('users')

// CREATE TABLE
await client.execute(`
  CREATE TABLE IF NOT EXISTS ${tableName} (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE
  )
`)

// INSERT
const result = await client.execute(
  `INSERT INTO ${tableName} (id, name, email) VALUES (?, ?, ?)`,
  [crypto.randomUUID(), 'John Doe', 'john@example.com']
)
console.log('Last insert ID:', result.lastInsertId)
console.log('Rows affected:', result.rowsAffected)

// UPDATE
await client.execute(
  `UPDATE ${tableName} SET name = ? WHERE id = ?`,
  ['Jane Doe', userId]
)

// DELETE
await client.execute(`DELETE FROM ${tableName} WHERE id = ?`, [userId])
```

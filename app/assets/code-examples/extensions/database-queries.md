```typescript
// Query data
const passwords = await client.query<Password>(
  `SELECT * FROM ${getTableName('passwords')}`
)

// Query with parameters
const password = await client.query<Password>(
  `SELECT * FROM ${getTableName('passwords')} WHERE id = ?`,
  [passwordId]
)

// Insert data
await client.execute(
  `INSERT INTO ${getTableName('passwords')} (id, title, password) VALUES (?, ?, ?)`,
  [crypto.randomUUID(), 'My Login', 'secret123']
)

// Update data
await client.execute(
  `UPDATE ${getTableName('passwords')} SET title = ?, updated_at = datetime('now') WHERE id = ?`,
  ['New Title', passwordId]
)

// Delete data
await client.execute(
  `DELETE FROM ${getTableName('passwords')} WHERE id = ?`,
  [passwordId]
)
```

```typescript
// getTableName(name: string): string
// Get the full prefixed table name

const tableName = client.getTableName('users')
// Returns: "a1b2c3d4__my-extension__users"

// Use in queries
const users = await client.query(`SELECT * FROM ${tableName}`)
```

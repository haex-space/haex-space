```typescript
// Define your migrations
const migrations = [
  {
    name: '0001_create_passwords_table',
    sql: `
      CREATE TABLE IF NOT EXISTS ${getTableName('passwords')} (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        username TEXT,
        password TEXT NOT NULL,
        url TEXT,
        notes TEXT,
        category_id TEXT,
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now'))
      )
    `
  },
  {
    name: '0002_create_categories_table',
    sql: `
      CREATE TABLE IF NOT EXISTS ${getTableName('categories')} (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        icon TEXT,
        color TEXT
      )
    `
  }
]

// Register migrations during setup
client.onSetup(async () => {
  const result = await client.registerMigrationsAsync('1.0.0', migrations)
  console.log(`Applied ${result.appliedCount} migrations`)
})

await client.setupComplete()
```

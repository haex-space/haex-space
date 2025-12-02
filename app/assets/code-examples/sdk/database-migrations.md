```typescript
// registerMigrationsAsync(version: string, migrations: Migration[]): Promise<MigrationResult>
// Register and run database migrations

interface Migration {
  name: string
  sql: string
}

const tableName = client.getTableName('users')

const result = await client.registerMigrationsAsync('1.0.0', [
  {
    name: '001_create_users',
    sql: `
      CREATE TABLE IF NOT EXISTS ${tableName} (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL
      )
    `
  },
  {
    name: '002_add_email',
    sql: `ALTER TABLE ${tableName} ADD COLUMN email TEXT`
  }
])

console.log('Applied:', result.appliedCount)
console.log('Already applied:', result.alreadyAppliedCount)
```

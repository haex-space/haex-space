```typescript
interface ExecuteResult {
  rowsAffected: number
  lastInsertId?: number
}

interface Migration {
  name: string
  sql: string
}

interface MigrationResult {
  appliedCount: number
  alreadyAppliedCount: number
  appliedMigrations: string[]
}

interface DatabaseTableInfo {
  name: string
  columns: DatabaseColumnInfo[]
}

interface DatabaseColumnInfo {
  name: string
  type: string  // 'TEXT', 'INTEGER', 'REAL', 'BLOB'
  notNull: boolean
  defaultValue?: unknown
  primaryKey: boolean
}
```

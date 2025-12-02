<script setup lang="ts">
import { Database, Code, Search, PenLine, Trash2, GitBranch, Layers } from 'lucide-vue-next'

definePageMeta({
  layout: 'docs'
})

const { t } = useI18n()

// Set table of contents
const tableOfContents = useState('docs-toc')
tableOfContents.value = [
  { id: 'overview', title: t('docs.sdkDatabase.toc.overview'), level: 2 },
  { id: 'query-methods', title: t('docs.sdkDatabase.toc.queryMethods'), level: 2 },
  { id: 'helper-methods', title: t('docs.sdkDatabase.toc.helperMethods'), level: 2 },
  { id: 'transactions', title: t('docs.sdkDatabase.toc.transactions'), level: 2 },
  { id: 'migrations', title: t('docs.sdkDatabase.toc.migrations'), level: 2 },
  { id: 'drizzle', title: t('docs.sdkDatabase.toc.drizzle'), level: 2 },
  { id: 'types', title: t('docs.sdkDatabase.toc.types'), level: 2 },
]

const code = {
  query: `// query<T>(sql: string, params?: unknown[]): Promise<T[]>
// Executes a SELECT query and returns rows

const users = await client.query<User>('SELECT * FROM users')

// With parameters
const user = await client.query<User>(
  'SELECT * FROM users WHERE id = ?',
  [userId]
)

// With multiple conditions
const filtered = await client.query<User>(
  'SELECT * FROM users WHERE role = ? AND active = ?',
  ['admin', true]
)`,

  select: `// select<T>(sql: string, params?: unknown[]): Promise<T[]>
// Alias for query() - use whichever you prefer

const posts = await client.select<Post>(
  'SELECT * FROM posts WHERE author_id = ? ORDER BY created_at DESC',
  [authorId]
)`,

  execute: `// execute(sql: string, params?: unknown[]): Promise<ExecuteResult>
// Executes INSERT, UPDATE, DELETE, CREATE, ALTER statements

// CREATE TABLE
await client.execute(\`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE
  )
\`)

// INSERT
const result = await client.execute(
  'INSERT INTO users (id, name, email) VALUES (?, ?, ?)',
  [crypto.randomUUID(), 'John Doe', 'john@example.com']
)
console.log('Last insert ID:', result.lastInsertId)
console.log('Rows affected:', result.rowsAffected)

// UPDATE
await client.execute(
  'UPDATE users SET name = ? WHERE id = ?',
  ['Jane Doe', userId]
)

// DELETE
await client.execute('DELETE FROM users WHERE id = ?', [userId])`,

  insert: `// insert(table: string, data: Record<string, unknown>): Promise<number>
// Helper for inserting a record, returns last insert ID

const id = await client.insert('users', {
  id: crypto.randomUUID(),
  name: 'John Doe',
  email: 'john@example.com',
  created_at: new Date().toISOString()
})`,

  update: `// update(table: string, data: Record<string, unknown>,
//        where: string, whereParams?: unknown[]): Promise<number>
// Helper for updating records, returns rows affected

const rowsAffected = await client.update(
  'users',
  { name: 'Jane Doe', updated_at: new Date().toISOString() },
  'id = ?',
  [userId]
)

// Multiple conditions
await client.update(
  'users',
  { active: false },
  'role = ? AND last_login < ?',
  ['guest', thirtyDaysAgo]
)`,

  deleteMethod: `// delete(table: string, where: string, whereParams?: unknown[]): Promise<number>
// Helper for deleting records, returns rows deleted

const rowsDeleted = await client.delete('users', 'id = ?', [userId])

// Delete multiple
await client.delete('sessions', 'expires_at < ?', [Date.now()])`,

  count: `// count(table: string, where?: string, whereParams?: unknown[]): Promise<number>
// Count records in a table

const totalUsers = await client.count('users')

const activeUsers = await client.count(
  'users',
  'active = ?',
  [true]
)`,

  transaction: `// transaction(statements: string[]): Promise<void>
// Execute multiple statements in a transaction

await client.transaction([
  \`INSERT INTO orders (id, user_id, total) VALUES ('\${orderId}', '\${userId}', \${total})\`,
  \`UPDATE inventory SET quantity = quantity - \${qty} WHERE product_id = '\${productId}'\`,
  \`INSERT INTO order_items (order_id, product_id, quantity) VALUES ('\${orderId}', '\${productId}', \${qty})\`
])`,

  migrations: `// registerMigrationsAsync(version: string, migrations: Migration[]): Promise<MigrationResult>
// Register and run database migrations

interface Migration {
  name: string
  sql: string
}

const result = await client.registerMigrationsAsync('1.0.0', [
  {
    name: '001_create_users',
    sql: \`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL
      )
    \`
  },
  {
    name: '002_add_email',
    sql: 'ALTER TABLE users ADD COLUMN email TEXT'
  }
])

console.log('Applied:', result.appliedCount)
console.log('Already applied:', result.alreadyAppliedCount)`,

  tableName: `// getTableName(name: string): string
// Get the full prefixed table name

const tableName = client.getTableName('users')
// Returns: "a1b2c3d4__my-extension__users"

// Use in queries
const users = await client.query(\`SELECT * FROM \${tableName}\`)`,

  drizzle: `import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { eq, and, desc } from 'drizzle-orm'

// Define schema
const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').unique(),
  role: text('role').default('user'),
  createdAt: text('created_at').default('CURRENT_TIMESTAMP'),
})

// Initialize Drizzle
const db = client.initializeDatabase({ users })

// Type-safe queries
const allUsers = await db.select().from(users)

const admins = await db
  .select()
  .from(users)
  .where(eq(users.role, 'admin'))
  .orderBy(desc(users.createdAt))

// Insert
await db.insert(users).values({
  id: crypto.randomUUID(),
  name: 'John',
  email: 'john@example.com'
})

// Update
await db
  .update(users)
  .set({ role: 'admin' })
  .where(eq(users.id, userId))

// Delete
await db.delete(users).where(eq(users.id, userId))`,

  types: `interface ExecuteResult {
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
}`
}
</script>

<template>
  <div class="max-w-4xl mx-auto px-6 py-12">
    <!-- Header -->
    <div class="mb-12">
      <div class="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <NuxtLink to="/docs" class="hover:text-foreground">{{ t('docs.title') }}</NuxtLink>
        <span>/</span>
        <NuxtLink to="/docs/sdk" class="hover:text-foreground">{{ t('docs.nav.sdkReference') }}</NuxtLink>
        <span>/</span>
        <span>{{ t('docs.nav.sdkDatabase') }}</span>
      </div>
      <h1 class="text-4xl font-bold mb-4">{{ t('docs.sdkDatabase.title') }}</h1>
      <p class="text-xl text-muted-foreground">{{ t('docs.sdkDatabase.subtitle') }}</p>
    </div>

    <!-- Overview -->
    <DocsSection id="overview" :title="t('docs.sdkDatabase.sections.overview.title')" :icon="Database">
      <p class="text-muted-foreground mb-6">{{ t('docs.sdkDatabase.sections.overview.intro') }}</p>

      <h3 class="font-semibold mb-3">{{ t('docs.sdkDatabase.sections.overview.tableName') }}</h3>
      <DocsCodeBlock :code="code.tableName" language="typescript" />
    </DocsSection>

    <!-- Query Methods -->
    <DocsSection id="query-methods" :title="t('docs.sdkDatabase.sections.queryMethods.title')" :icon="Search">
      <h3 class="font-semibold mb-3">query()</h3>
      <DocsCodeBlock :code="code.query" language="typescript" class="mb-6" />

      <h3 class="font-semibold mb-3">select()</h3>
      <DocsCodeBlock :code="code.select" language="typescript" class="mb-6" />

      <h3 class="font-semibold mb-3">execute()</h3>
      <DocsCodeBlock :code="code.execute" language="typescript" />

      <DocsAlert type="info" class="mt-6">
        {{ t('docs.sdkDatabase.sections.queryMethods.note') }}
      </DocsAlert>
    </DocsSection>

    <!-- Helper Methods -->
    <DocsSection id="helper-methods" :title="t('docs.sdkDatabase.sections.helperMethods.title')" :icon="Code">
      <p class="text-muted-foreground mb-6">{{ t('docs.sdkDatabase.sections.helperMethods.intro') }}</p>

      <h3 class="font-semibold mb-3 flex items-center gap-2">
        <PenLine class="w-4 h-4 text-primary" />
        insert()
      </h3>
      <DocsCodeBlock :code="code.insert" language="typescript" class="mb-6" />

      <h3 class="font-semibold mb-3 flex items-center gap-2">
        <PenLine class="w-4 h-4 text-primary" />
        update()
      </h3>
      <DocsCodeBlock :code="code.update" language="typescript" class="mb-6" />

      <h3 class="font-semibold mb-3 flex items-center gap-2">
        <Trash2 class="w-4 h-4 text-primary" />
        delete()
      </h3>
      <DocsCodeBlock :code="code.deleteMethod" language="typescript" class="mb-6" />

      <h3 class="font-semibold mb-3 flex items-center gap-2">
        <Search class="w-4 h-4 text-primary" />
        count()
      </h3>
      <DocsCodeBlock :code="code.count" language="typescript" />
    </DocsSection>

    <!-- Transactions -->
    <DocsSection id="transactions" :title="t('docs.sdkDatabase.sections.transactions.title')" :icon="GitBranch">
      <p class="text-muted-foreground mb-6">{{ t('docs.sdkDatabase.sections.transactions.intro') }}</p>
      <DocsCodeBlock :code="code.transaction" language="typescript" />

      <DocsAlert type="warning" class="mt-6">
        {{ t('docs.sdkDatabase.sections.transactions.warning') }}
      </DocsAlert>
    </DocsSection>

    <!-- Migrations -->
    <DocsSection id="migrations" :title="t('docs.sdkDatabase.sections.migrations.title')" :icon="GitBranch">
      <p class="text-muted-foreground mb-6">{{ t('docs.sdkDatabase.sections.migrations.intro') }}</p>
      <DocsCodeBlock :code="code.migrations" language="typescript" />
    </DocsSection>

    <!-- Drizzle ORM -->
    <DocsSection id="drizzle" :title="t('docs.sdkDatabase.sections.drizzle.title')" :icon="Layers">
      <p class="text-muted-foreground mb-6">{{ t('docs.sdkDatabase.sections.drizzle.intro') }}</p>
      <DocsCodeBlock :code="code.drizzle" language="typescript" />
    </DocsSection>

    <!-- Types -->
    <DocsSection id="types" :title="t('docs.sdkDatabase.sections.types.title')" :icon="Code">
      <p class="text-muted-foreground mb-6">{{ t('docs.sdkDatabase.sections.types.intro') }}</p>
      <DocsCodeBlock :code="code.types" language="typescript" />
    </DocsSection>

    <!-- Navigation -->
    <div class="flex justify-between pt-8 border-t mt-12">
      <NuxtLink to="/docs/sdk" class="group flex items-center gap-2 text-muted-foreground hover:text-foreground">
        <span>&larr;</span>
        <span>{{ t('docs.nav.sdkOverview') }}</span>
      </NuxtLink>
      <NuxtLink to="/docs/sdk/storage" class="group flex items-center gap-2 text-muted-foreground hover:text-foreground">
        <span>{{ t('docs.nav.sdkStorage') }}</span>
        <span>&rarr;</span>
      </NuxtLink>
    </div>
  </div>
</template>

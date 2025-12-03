<script setup lang="ts">
import { Database, Table, GitBranch, Code, Layers, RefreshCw } from 'lucide-vue-next'

definePageMeta({
  layout: 'docs'
})

const { t } = useI18n()

// Set table of contents
const tableOfContents = useState('docs-toc')
tableOfContents.value = [
  { id: 'overview', title: t('docs.database.toc.overview'), level: 2 },
  { id: 'table-naming', title: t('docs.database.toc.tableNaming'), level: 2 },
  { id: 'creating-tables', title: t('docs.database.toc.creatingTables'), level: 2 },
  { id: 'migrations', title: t('docs.database.toc.migrations'), level: 2 },
  { id: 'queries', title: t('docs.database.toc.queries'), level: 2 },
  { id: 'crdt-sync', title: t('docs.database.toc.crdtSync'), level: 2 },
  { id: 'drizzle-orm', title: t('docs.database.toc.drizzleOrm'), level: 2 },
]

const code = {
  tableNaming: `import { useHaexClient } from '@haex-space/vault-sdk/vue'

const client = useHaexClient()

// Get the full prefixed table name
const tableName = client.getTableName('users')
// Returns: "a1b2c3d4__my-extension__users"

// Use in SQL queries
const users = await client.query(\`SELECT * FROM \${tableName}\`)`,

  createTable: `// Using the setup hook (recommended)
client.onSetup(async () => {
  const tableName = client.getTableName('passwords')

  await client.execute(\`
    CREATE TABLE IF NOT EXISTS \${tableName} (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      username TEXT,
      password TEXT NOT NULL,
      url TEXT,
      notes TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  \`)
})

// Don't forget to call setupComplete()
await client.setupComplete()`,

  migrations: `import { useHaexClient } from '@haex-space/vault-sdk/vue'

const client = useHaexClient()

client.onSetup(async () => {
  const tableName = client.getTableName('passwords')

  await client.registerMigrationsAsync('1.0.0', [
    {
      name: '001_create_passwords_table',
      sql: \`
        CREATE TABLE IF NOT EXISTS \${tableName} (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          password TEXT NOT NULL,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
      \`
    },
    {
      name: '002_add_category_column',
      sql: \`
        ALTER TABLE \${tableName}
        ADD COLUMN category TEXT DEFAULT 'general'
      \`
    },
    {
      name: '003_add_url_column',
      sql: \`
        ALTER TABLE \${tableName}
        ADD COLUMN url TEXT
      \`
    }
  ])
})

await client.setupComplete()`,

  querySelect: `// Simple SELECT
const users = await client.query<User>('SELECT * FROM users')

// With parameters (prevents SQL injection)
const user = await client.query<User>(
  'SELECT * FROM users WHERE id = ?',
  [userId]
)

// Using select() alias
const activeUsers = await client.select<User>(
  'SELECT * FROM users WHERE active = ?',
  [true]
)`,

  queryInsert: `// Using execute() for INSERT
const result = await client.execute(
  'INSERT INTO users (id, name, email) VALUES (?, ?, ?)',
  [crypto.randomUUID(), 'John Doe', 'john@example.com']
)
console.log('Inserted ID:', result.lastInsertId)

// Using the insert() helper
const id = await client.insert('users', {
  id: crypto.randomUUID(),
  name: 'Jane Doe',
  email: 'jane@example.com'
})`,

  queryUpdate: `// Using execute() for UPDATE
const result = await client.execute(
  'UPDATE users SET name = ? WHERE id = ?',
  ['John Smith', userId]
)
console.log('Rows affected:', result.rowsAffected)

// Using the update() helper
const rowsAffected = await client.update(
  'users',
  { name: 'John Smith', updated_at: new Date().toISOString() },
  'id = ?',
  [userId]
)`,

  queryDelete: `// Using execute() for DELETE
await client.execute('DELETE FROM users WHERE id = ?', [userId])

// Using the delete() helper
const rowsDeleted = await client.delete('users', 'id = ?', [userId])`,

  transactions: `// Execute multiple statements in a transaction
await client.transaction([
  'INSERT INTO users (id, name) VALUES ("1", "John")',
  'INSERT INTO profiles (user_id, bio) VALUES ("1", "Hello!")',
  'UPDATE stats SET user_count = user_count + 1'
])`,

  crdtTable: `// haex-vault automatically adds CRDT columns to all tables
// You don't need to define them in your schema

await client.execute(\`
  CREATE TABLE IF NOT EXISTS \${tableName} (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT
  )
\`)

// The following columns are automatically managed by haex-vault:
// - haex_timestamp: Row-level timestamp for sync ordering
// - haex_column_hlcs: Per-column hybrid logical clocks
// - haex_deleted: Soft delete flag for sync

// Important: Do NOT create columns starting with 'haex_'
// They will be overwritten by the sync system`,

  drizzleSetup: `import { useHaexClient } from '@haex-space/vault-sdk/vue'
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

const client = useHaexClient()

// Define your schema
const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').unique(),
  createdAt: text('created_at').default('CURRENT_TIMESTAMP'),
})

const posts = sqliteTable('posts', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id),
  title: text('title').notNull(),
  content: text('content'),
})

// Initialize Drizzle ORM
const db = client.initializeDatabase({ users, posts })`,

  drizzleQueries: `// Type-safe queries with Drizzle
import { eq, like, and, desc } from 'drizzle-orm'

// Select all users
const allUsers = await db.select().from(users)

// Select with conditions
const activeUsers = await db
  .select()
  .from(users)
  .where(eq(users.active, true))

// Join tables
const postsWithAuthors = await db
  .select({
    postTitle: posts.title,
    authorName: users.name
  })
  .from(posts)
  .leftJoin(users, eq(posts.userId, users.id))
  .orderBy(desc(posts.createdAt))

// Insert with type safety
await db.insert(users).values({
  id: crypto.randomUUID(),
  name: 'John Doe',
  email: 'john@example.com'
})

// Update
await db
  .update(users)
  .set({ name: 'Jane Doe' })
  .where(eq(users.id, userId))`
}
</script>

<template>
  <div>
    <!-- Header -->
    <div class="mb-12">
      <div class="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <NuxtLinkLocale to="/docs" class="hover:text-foreground">{{ t('docs.title') }}</NuxtLinkLocale>
        <span>/</span>
        <NuxtLinkLocale to="/docs/extensions" class="hover:text-foreground">{{ t('docs.nav.extensions') }}</NuxtLinkLocale>
        <span>/</span>
        <span>{{ t('docs.nav.database') }}</span>
      </div>
      <h1 class="text-4xl font-bold mb-4">{{ t('docs.database.title') }}</h1>
      <p class="text-xl text-muted-foreground">{{ t('docs.database.subtitle') }}</p>
    </div>

    <!-- Overview -->
    <DocsSection id="overview" :title="t('docs.database.sections.overview.title')" :icon="Database">
      <p class="text-muted-foreground mb-6">{{ t('docs.database.sections.overview.intro') }}</p>

      <DocsAlert type="info" class="mb-6">
        {{ t('docs.database.sections.overview.ownTablesNote') }}
      </DocsAlert>

      <DocsAlert type="warning" class="mb-6">
        {{ t('docs.database.sections.overview.systemTablesNote') }}
      </DocsAlert>

      <DocsFeatureGrid :features="[
        {
          icon: Table,
          title: t('docs.database.features.sqlite.title'),
          description: t('docs.database.features.sqlite.description')
        },
        {
          icon: Layers,
          title: t('docs.database.features.namespaced.title'),
          description: t('docs.database.features.namespaced.description')
        },
        {
          icon: GitBranch,
          title: t('docs.database.features.migrations.title'),
          description: t('docs.database.features.migrations.description')
        },
        {
          icon: RefreshCw,
          title: t('docs.database.features.crdt.title'),
          description: t('docs.database.features.crdt.description')
        }
      ]" />
    </DocsSection>

    <!-- Table Naming -->
    <DocsSection id="table-naming" :title="t('docs.database.sections.tableNaming.title')" :icon="Table">
      <p class="text-muted-foreground mb-4">{{ t('docs.database.sections.tableNaming.intro') }}</p>

      <div class="bg-muted rounded-lg p-4 mb-6">
        <code class="text-sm">"{public_key}__{extension_name}__{table_name}"</code>
      </div>

      <p class="text-muted-foreground mb-4">{{ t('docs.database.sections.tableNaming.helper') }}</p>
      <DocsCodeBlock :code="code.tableNaming" language="typescript" />
    </DocsSection>

    <!-- Creating Tables -->
    <DocsSection id="creating-tables" :title="t('docs.database.sections.creatingTables.title')" :icon="Code">
      <p class="text-muted-foreground mb-6">{{ t('docs.database.sections.creatingTables.intro') }}</p>
      <DocsCodeBlock :code="code.createTable" language="typescript" />

      <DocsAlert type="info" class="mt-6">
        {{ t('docs.database.sections.creatingTables.note') }}
      </DocsAlert>
    </DocsSection>

    <!-- Migrations -->
    <DocsSection id="migrations" :title="t('docs.database.sections.migrations.title')" :icon="GitBranch">
      <p class="text-muted-foreground mb-6">{{ t('docs.database.sections.migrations.intro') }}</p>
      <DocsCodeBlock :code="code.migrations" language="typescript" />

      <DocsAlert type="warning" class="mt-6">
        {{ t('docs.database.sections.migrations.warning') }}
      </DocsAlert>
    </DocsSection>

    <!-- Queries -->
    <DocsSection id="queries" :title="t('docs.database.sections.queries.title')" :icon="Code">
      <p class="text-muted-foreground mb-6">{{ t('docs.database.sections.queries.intro') }}</p>

      <h3 class="font-semibold mb-3">SELECT</h3>
      <DocsCodeBlock :code="code.querySelect" language="typescript" class="mb-6" />

      <h3 class="font-semibold mb-3">INSERT</h3>
      <DocsCodeBlock :code="code.queryInsert" language="typescript" class="mb-6" />

      <h3 class="font-semibold mb-3">UPDATE</h3>
      <DocsCodeBlock :code="code.queryUpdate" language="typescript" class="mb-6" />

      <h3 class="font-semibold mb-3">DELETE</h3>
      <DocsCodeBlock :code="code.queryDelete" language="typescript" class="mb-6" />

      <h3 class="font-semibold mb-3">{{ t('docs.database.sections.queries.transactions') }}</h3>
      <DocsCodeBlock :code="code.transactions" language="typescript" />
    </DocsSection>

    <!-- CRDT Sync -->
    <DocsSection id="crdt-sync" :title="t('docs.database.sections.crdtSync.title')" :icon="RefreshCw">
      <p class="text-muted-foreground mb-6">{{ t('docs.database.sections.crdtSync.intro') }}</p>

      <div class="overflow-x-auto mb-6">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b">
              <th class="text-left py-3 px-4 font-medium">{{ t('docs.database.sections.crdtSync.column') }}</th>
              <th class="text-left py-3 px-4 font-medium">{{ t('docs.database.sections.crdtSync.type') }}</th>
              <th class="text-left py-3 px-4 font-medium">{{ t('docs.database.sections.crdtSync.purpose') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b">
              <td class="py-3 px-4"><code class="text-primary">haex_timestamp</code></td>
              <td class="py-3 px-4 text-muted-foreground">INTEGER</td>
              <td class="py-3 px-4 text-muted-foreground">{{ t('docs.database.sections.crdtSync.timestampDesc') }}</td>
            </tr>
            <tr class="border-b">
              <td class="py-3 px-4"><code class="text-primary">haex_column_hlcs</code></td>
              <td class="py-3 px-4 text-muted-foreground">TEXT</td>
              <td class="py-3 px-4 text-muted-foreground">{{ t('docs.database.sections.crdtSync.hlcsDesc') }}</td>
            </tr>
            <tr>
              <td class="py-3 px-4"><code class="text-primary">haex_deleted</code></td>
              <td class="py-3 px-4 text-muted-foreground">INTEGER</td>
              <td class="py-3 px-4 text-muted-foreground">{{ t('docs.database.sections.crdtSync.deletedDesc') }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <DocsCodeBlock :code="code.crdtTable" language="typescript" />

      <DocsAlert type="warning" class="mt-6">
        {{ t('docs.database.sections.crdtSync.warning') }}
      </DocsAlert>
    </DocsSection>

    <!-- Drizzle ORM -->
    <DocsSection id="drizzle-orm" :title="t('docs.database.sections.drizzleOrm.title')" :icon="Layers">
      <p class="text-muted-foreground mb-6">{{ t('docs.database.sections.drizzleOrm.intro') }}</p>

      <h3 class="font-semibold mb-3">{{ t('docs.database.sections.drizzleOrm.setup') }}</h3>
      <DocsCodeBlock :code="code.drizzleSetup" language="typescript" class="mb-6" />

      <h3 class="font-semibold mb-3">{{ t('docs.database.sections.drizzleOrm.queries') }}</h3>
      <DocsCodeBlock :code="code.drizzleQueries" language="typescript" />
    </DocsSection>

    <!-- Navigation -->
    <div class="flex justify-between pt-8 border-t mt-12">
      <NuxtLinkLocale to="/docs/extensions/permissions" class="group flex items-center gap-2 text-muted-foreground hover:text-foreground">
        <span>&larr;</span>
        <span>{{ t('docs.nav.permissions') }}</span>
      </NuxtLinkLocale>
      <NuxtLinkLocale to="/docs/extensions/publishing" class="group flex items-center gap-2 text-muted-foreground hover:text-foreground">
        <span>{{ t('docs.nav.publishing') }}</span>
        <span>&rarr;</span>
      </NuxtLinkLocale>
    </div>
  </div>
</template>

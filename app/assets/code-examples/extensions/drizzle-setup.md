```typescript
import { sqliteTable, text } from 'drizzle-orm/sqlite-core'

// Define schema (table names will be auto-prefixed)
const passwords = sqliteTable('passwords', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  username: text('username'),
  password: text('password').notNull(),
})

// Initialize Drizzle with your schema
const db = client.initializeDatabase({ passwords })

// Use Drizzle query builder
const allPasswords = await db
  .select()
  .from(passwords)

// Insert with Drizzle
await db.insert(passwords).values({
  id: crypto.randomUUID(),
  title: 'My Login',
  password: 'secret123',
})
```

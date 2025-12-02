```typescript
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
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
await db.delete(users).where(eq(users.id, userId))
```

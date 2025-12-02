```typescript
// select<T>(sql: string, params?: unknown[]): Promise<T[]>
// Alias for query() - use whichever you prefer

const postsTable = client.getTableName('posts')

const posts = await client.select<Post>(
  `SELECT * FROM ${postsTable} WHERE author_id = ? ORDER BY created_at DESC`,
  [authorId]
)
```

```typescript
// fetchJsonAsync<T>(url: string, options?: WebRequestOptions): Promise<T>
// Fetches and parses JSON automatically

interface User {
  id: number
  name: string
  email: string
}

// Type-safe JSON fetching
const users = await client.web.fetchJsonAsync<User[]>('https://api.example.com/users')

for (const user of users) {
  console.log(user.name, user.email)
}

// With POST
const newUser = await client.web.fetchJsonAsync<User>('https://api.example.com/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Jane', email: 'jane@example.com' })
})
```

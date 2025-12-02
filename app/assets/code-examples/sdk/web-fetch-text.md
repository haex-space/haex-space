```typescript
// fetchTextAsync(url: string, options?: WebRequestOptions): Promise<string>
// Fetches and returns text content

const readme = await client.web.fetchTextAsync('https://raw.githubusercontent.com/user/repo/main/README.md')
console.log(readme)

// Fetch and process CSV
const csv = await client.web.fetchTextAsync('https://example.com/data.csv')
const rows = csv.split('\n').map(row => row.split(','))
```

```typescript
// openAsync(url: string): Promise<void>
// Opens URL in the user's default browser

// Open a webpage
await client.web.openAsync('https://example.com')

// Open documentation
await client.web.openAsync('https://docs.example.com/getting-started')

// Open with parameters
const searchQuery = encodeURIComponent('haex vault')
await client.web.openAsync(`https://google.com/search?q=${searchQuery}`)
```

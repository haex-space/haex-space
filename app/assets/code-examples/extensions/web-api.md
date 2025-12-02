```typescript
// Simple GET request
const data = await client.web.fetchJsonAsync<ApiResponse>(
  'https://api.example.com/data'
)

// POST request with body
const response = await client.web.fetchAsync(
  'https://api.example.com/submit',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify({ name: 'Test' })
  }
)

// Download binary data
const blob = await client.web.fetchBlobAsync(
  'https://cdn.example.com/file.zip'
)

// Open URL in browser
await client.web.openAsync('https://example.com/help')
```

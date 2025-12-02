```typescript
// fetchAsync(url: string, options?: WebRequestOptions): Promise<WebResponse>

// Simple GET request
const response = await client.web.fetchAsync('https://api.example.com/users')
console.log('Status:', response.status)
console.log('Data:', response.data)

// POST request with JSON body
const createResponse = await client.web.fetchAsync('https://api.example.com/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer token123'
  },
  body: JSON.stringify({ name: 'John', email: 'john@example.com' })
})

// Handle response
if (createResponse.status === 201) {
  const user = JSON.parse(createResponse.data)
  console.log('Created user:', user)
}
```

```typescript
// Request with custom headers
const response = await client.web.fetchAsync('https://api.github.com/user', {
  method: 'GET',
  headers: {
    'Accept': 'application/vnd.github.v3+json',
    'Authorization': 'token ghp_xxxx'
  }
})

// Access response headers
console.log('Rate limit:', response.headers['x-ratelimit-remaining'])
```

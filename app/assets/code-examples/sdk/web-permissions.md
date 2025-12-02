```typescript
// HTTP permissions must be declared in manifest.json

// manifest.json
{
  "permissions": {
    "http": [
      { "target": "https://api.example.com/**" },
      { "target": "https://*.github.com/*" }
    ]
  }
}

// Check permission before fetching
const canFetch = await client.checkWebAsync('https://api.example.com/users')

if (canFetch) {
  const data = await client.web.fetchJsonAsync('https://api.example.com/users')
} else {
  console.log('No permission to fetch from this URL')
}
```

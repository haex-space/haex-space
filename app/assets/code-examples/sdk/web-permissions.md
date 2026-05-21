```typescript
// HTTP permissions are declared by URL pattern in manifest.json.
// The runtime check only matches the URL / domain - HTTP methods
// are NOT enforced today.
//
//   "permissions": {
//     "http": [
//       { "target": "https://api.example.com/**" },
//       { "target": "https://*.github.com/api/*" }
//     ]
//   }

// Check permission before fetching. The URL must match a manifest target.
const canFetch = await client.permissions.checkWebAsync(
  'https://api.example.com/users',
)

if (canFetch) {
  const data = await client.web.fetchJsonAsync('https://api.example.com/users')
} else {
  console.log('No permission to fetch from this URL')
}
```

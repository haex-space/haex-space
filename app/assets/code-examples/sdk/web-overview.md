```typescript
import { useHaexClient } from '@haex-space/vault-sdk/vue'

const client = useHaexClient()

// Fetch data from an API
const response = await client.web.fetchAsync('https://api.example.com/data')

// Convenience methods for common formats
const json = await client.web.fetchJsonAsync('https://api.example.com/users')
const text = await client.web.fetchTextAsync('https://example.com/readme.txt')
const blob = await client.web.fetchBlobAsync('https://example.com/image.png')

// Open URL in default browser
await client.web.openAsync('https://example.com')
```

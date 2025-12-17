```typescript
import { createHaexVaultSdk } from '@haex-space/vault-sdk'
import manifest from '../haextension/manifest.json'

const client = createHaexVaultSdk({ manifest, debug: true })

// Wait for initialization
await client.ready()

console.log('Extension loaded:', client.extensionInfo?.name)
console.log('Theme:', client.context?.theme)

// Subscribe to changes
client.subscribe(() => {
  console.log('Context updated:', client.context)
})
```

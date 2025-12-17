```typescript
import { useHaexVaultSdk } from '@haex-space/vault-sdk/vue'

const { client } = useHaexVaultSdk()

// All filesystem operations show native dialogs
// Users have full control over file access

// Save a file
await client.filesystem.saveFileAsync(data, options)

// Open/read a file
const file = await client.filesystem.openFileAsync(options)

// Display an image
await client.filesystem.showImageAsync(options)
```

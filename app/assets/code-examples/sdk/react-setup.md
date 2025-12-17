```tsx
// App.tsx
import { useHaexVaultSdk } from '@haex-space/vault-sdk/react'
import manifest from '../haextension/manifest.json'

function App() {
  const { client, context, isSetupComplete, getTableName } = useHaexVaultSdk({
    manifest,
    debug: import.meta.env.DEV
  })

  // Show loading until SDK is ready
  if (!isSetupComplete) {
    return <div>Initializing...</div>
  }

  return <YourApp />
}
```

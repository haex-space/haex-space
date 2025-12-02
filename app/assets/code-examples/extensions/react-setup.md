```tsx
import { useHaexHub } from '@haex-space/vault-sdk/react'
import manifest from '../haextension/manifest.json'

function App() {
  const {
    client,
    extensionInfo,
    context,
    isSetupComplete,
    db,
    storage,
    getTableName
  } = useHaexHub({ manifest, debug: true })

  if (!isSetupComplete) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <p>Theme: {context?.theme}</p>
      <p>Platform: {context?.platform}</p>
    </div>
  )
}

export default App
```

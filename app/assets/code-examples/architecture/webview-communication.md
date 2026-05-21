```typescript
// Window/WebView extensions on desktop and mobile use the same
// SDK and the same `haextension:invoke` / `haextension:response`
// protocol. On native windows the messages are bridged through
// the Tauri WebviewWindow rather than a browser iframe.
//
// As an extension developer you never write this code by hand -
// the SDK handles it. The example below is illustrative only.
import { invoke } from '@tauri-apps/api/core'

// Issued by the SDK under the hood:
await invoke('extension_request', {
  method: 'database.query',
  args: ['SELECT * FROM haex_passwords', []],
})
```

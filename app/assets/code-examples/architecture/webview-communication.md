```typescript
// WebView extensions use Tauri events directly
import { listen, emit } from '@tauri-apps/api/event'

// Extension → Host
await emit('haextension:invoke', {
  method: 'database',
  action: 'select',
  args: ['haex_passwords']
})

// Host → Extension
await listen('haextension:response', (event) => {
  console.log(event.payload)
})
```

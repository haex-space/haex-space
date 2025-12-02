```typescript
// main.ts
import { createApp } from 'vue'
import { createHaexPlugin } from '@haex-space/vault-sdk/vue'
import App from './App.vue'

const app = createApp(App)
app.use(createHaexPlugin())
app.mount('#app')
```

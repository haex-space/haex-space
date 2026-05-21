```typescript
// In a Vue / React / Svelte adapter, `context` is reactive.
// In the plain JS client it's a plain getter (`client.context`).

const { context } = useHaexVaultSdk()

// Vue: context is a Ref<ApplicationContext | null>
const ctx = context.value

ctx?.theme    // 'light' | 'dark'
ctx?.locale   // 'de' | 'en' | ...
ctx?.platform // 'linux' | 'windows' | 'macos' | 'android' | 'ios'

// React to context changes (Vue)
watch(() => context.value?.theme, (theme) => {
  document.documentElement.classList.toggle('dark', theme === 'dark')
})

// In plain JS:
//   const client = createHaexVaultSdk()
//   await client.ready()
//   console.log(client.context?.theme)
//   client.on('haextension:context:changed', (e) => { /* ... */ })
```

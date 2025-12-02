```typescript
const client = useHaexClient()

// Access current context
const context = client.context.value

// Available properties
context.theme    // 'light' | 'dark' | 'system'
context.locale   // 'en' | 'de' | ...
context.platform // 'windows' | 'macos' | 'linux' | 'ios' | 'android'

// React to context changes (Vue)
watch(() => client.context.value?.theme, (theme) => {
  console.log('Theme changed:', theme)
})
```

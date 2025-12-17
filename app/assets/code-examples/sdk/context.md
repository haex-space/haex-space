```typescript
const { context } = useHaexVaultSdk()

// Access current context (reactive ref in Vue)
const ctx = context.value

// Available properties
ctx.theme    // 'light' | 'dark'
ctx.locale   // 'en' | 'de' | ...
ctx.platform // 'linux' | 'windows' | 'macos' | 'android' | 'ios'

// React to context changes (Vue)
watch(() => context.value?.theme, (theme) => {
  console.log('Theme changed:', theme)
  document.documentElement.classList.toggle('dark', theme === 'dark')
})

watch(() => context.value?.platform, (platform) => {
  console.log('Platform:', platform)
  // Adapt UI for mobile/desktop
})
```

```typescript
// Get current context
const context = await client.request('haextension:context:get')
console.log('Theme:', context.theme)      // 'light' | 'dark' | 'system'
console.log('Locale:', context.locale)    // 'en' | 'de' | ...
console.log('Platform:', context.platform) // 'linux' | 'macos' | 'windows' | 'android' | 'ios'

// Listen for context changes
client.on('haextension:context:changed', (event) => {
  const { context } = event.data
  // Update your UI theme, locale, etc.
  applyTheme(context.theme)
})
```

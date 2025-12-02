```typescript
// Save JSON data
const settings = { theme: 'dark', fontSize: 14 }
const json = JSON.stringify(settings, null, 2)
const data = new TextEncoder().encode(json)

await client.filesystem.saveFileAsync(data, {
  defaultPath: 'settings.json',
  filters: [{ name: 'JSON Files', extensions: ['json'] }]
})
```

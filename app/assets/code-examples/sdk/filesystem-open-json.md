```typescript
// Open and parse JSON file
const result = await client.filesystem.openFileAsync({
  filters: [{ name: 'JSON Files', extensions: ['json'] }],
  multiple: false
})

if (result.files.length > 0) {
  const content = new TextDecoder().decode(result.files[0].data)
  const data = JSON.parse(content)
  console.log('Loaded data:', data)
}
```

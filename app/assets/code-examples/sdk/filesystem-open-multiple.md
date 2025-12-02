```typescript
// Open multiple files
const result = await client.filesystem.openFileAsync({
  filters: [{ name: 'Images', extensions: ['png', 'jpg', 'gif'] }],
  multiple: true
})

for (const file of result.files) {
  console.log('Processing:', file.name)
  // Process each file...
}
```

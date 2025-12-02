```typescript
// openFileAsync(options: OpenFileOptions): Promise<OpenFileResult>

// Open a text file
const result = await client.filesystem.openFileAsync({
  filters: [
    { name: 'Text Files', extensions: ['txt', 'md'] },
    { name: 'All Files', extensions: ['*'] }
  ],
  multiple: false
})

if (result.files.length > 0) {
  const file = result.files[0]
  console.log('File path:', file.path)
  console.log('File name:', file.name)
  console.log('File size:', file.size)

  // Read content
  const decoder = new TextDecoder()
  const content = decoder.decode(file.data)
  console.log('Content:', content)
}
```

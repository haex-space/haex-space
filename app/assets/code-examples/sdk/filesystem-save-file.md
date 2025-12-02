```typescript
// saveFileAsync(data: Uint8Array, options?: SaveFileOptions): Promise<SaveFileResult | null>

// Save text as a file
const text = 'Hello, World!'
const encoder = new TextEncoder()
const data = encoder.encode(text)

const result = await client.filesystem.saveFileAsync(data, {
  defaultPath: 'hello.txt',
  filters: [
    { name: 'Text Files', extensions: ['txt'] },
    { name: 'All Files', extensions: ['*'] }
  ]
})

if (result) {
  console.log('Saved to:', result.path)
}
```

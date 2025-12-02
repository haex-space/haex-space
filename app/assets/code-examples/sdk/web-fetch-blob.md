```typescript
// fetchBlobAsync(url: string, options?: WebRequestOptions): Promise<Blob>
// Fetches binary data as Blob

const imageBlob = await client.web.fetchBlobAsync('https://example.com/avatar.png')

// Create object URL for display
const imageUrl = URL.createObjectURL(imageBlob)
imageElement.src = imageUrl

// Convert to Uint8Array if needed
const arrayBuffer = await imageBlob.arrayBuffer()
const bytes = new Uint8Array(arrayBuffer)
```

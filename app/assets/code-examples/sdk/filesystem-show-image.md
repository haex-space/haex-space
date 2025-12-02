```typescript
// showImageAsync(options: ShowImageOptions): Promise<ShowImageResult>
// Opens an image picker and returns the selected image

const result = await client.filesystem.showImageAsync({
  maxWidth: 800,
  maxHeight: 600,
  quality: 0.8  // JPEG quality (0-1)
})

if (result.data) {
  // Use the image data
  const blob = new Blob([result.data], { type: result.mimeType })
  const url = URL.createObjectURL(blob)

  // Display in img element
  imageElement.src = url
}
```

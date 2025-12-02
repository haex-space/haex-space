```typescript
// Save a file (opens save dialog)
const data = new TextEncoder().encode(JSON.stringify(exportData))
const result = await client.filesystem.saveFileAsync(data, {
  defaultPath: 'passwords-backup.json',
  title: 'Export Passwords',
  filters: [
    { name: 'JSON Files', extensions: ['json'] },
    { name: 'All Files', extensions: ['*'] }
  ]
})

if (result?.success) {
  console.log('Saved to:', result.path)
}

// Open a file with system viewer
const pdfData = await generatePDF()
await client.filesystem.openFileAsync(pdfData, {
  fileName: 'report.pdf',
  mimeType: 'application/pdf'
})

// Show an image
await client.filesystem.showImageAsync({
  dataUrl: 'data:image/png;base64,...'
})
```

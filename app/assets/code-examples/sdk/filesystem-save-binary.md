```typescript
// Save binary data (e.g., export)
const exportData = await generateExport()

await client.filesystem.saveFileAsync(exportData, {
  defaultPath: 'backup.dat',
  filters: [{ name: 'Backup Files', extensions: ['dat', 'bak'] }]
})
```

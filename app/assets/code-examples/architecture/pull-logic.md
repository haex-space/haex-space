```typescript
// Pull walks the server change log forward from the last cursor.
// For every change the local HLC for that (row, column) wins or loses.
for (const change of serverChanges) {
  const localRow = await getRow(change.tableName, change.rowPks)
  const localHlc = localRow?.haex_column_hlcs?.[change.columnName]

  if (!localHlc || change.haexHlc > localHlc) {
    // Remote wins: decrypt, apply, update column HLC
    const value = decrypt(change.encryptedValue, change.nonce, vaultKey)
    await updateColumn(change.tableName, change.rowPks, change.columnName, value)
    await updateColumnHlc(change.tableName, change.rowPks, change.columnName, change.haexHlc)
  }
  // else: local is newer, ignore this change.
}
```

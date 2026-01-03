```typescript
// Pull Logic (simplified)
for (const change of serverChanges) {
  const localRow = await getRow(change.tableName, change.rowPks)
  const localHlc = localRow?.haex_column_hlcs[change.columnName]

  if (!localHlc || change.hlcTimestamp > localHlc) {
    // Remote wins - apply the change
    const decryptedValue = decrypt(change.encryptedValue, vaultKey)
    await updateColumn(change.tableName, change.rowPks,
                       change.columnName, decryptedValue)
    await updateColumnHlc(change.tableName, change.rowPks,
                          change.columnName, change.hlcTimestamp)
  }
  // else: Local wins - keep existing value
}
```

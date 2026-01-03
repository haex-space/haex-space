```typescript
// Column Change Structure (sent to server)
{
  tableName: "haex_passwords",
  rowPks: '{"id": "abc-123"}',
  columnName: "password",
  hlcTimestamp: "2024-01-03T10:45:30.200-A",
  encryptedValue: "base64...",  // AES-256-GCM
  nonce: "base64...",
  batchId: "uuid",
  batchSeq: 1,
  batchTotal: 5
}
```

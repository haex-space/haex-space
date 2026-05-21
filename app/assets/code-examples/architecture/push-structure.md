```typescript
// One entry inside a push batch (sent to haex-sync-server).
{
  tableName:      "haex_passwords",
  rowPks:         '{"id":"abc-123"}',
  columnName:     "password",
  haexHlc:        "7B7E2C9E10000000/8a4e23f76b0a4d9faabbccddeeff0011",
  encryptedValue: "<base64 AES-256-GCM ciphertext>",
  nonce:          "<base64 nonce>",
  deviceId:       "<device-id>",
}

// Push semantics:
// - Dirty tables are scanned per backend.
// - Column-changes are grouped by HLC.
// - Chunks are sent with <= 2000 changes per request.
// - Atomic HLC: all changes from one HLC tick stay in the same chunk.
```

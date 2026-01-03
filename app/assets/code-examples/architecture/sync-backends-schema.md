```sql
CREATE TABLE haex_sync_backends (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  server_url TEXT NOT NULL,
  vault_id TEXT NOT NULL,
  email TEXT NOT NULL,
  password TEXT NOT NULL,           -- Encrypted server password
  sync_key TEXT NOT NULL,           -- Encrypted sync key
  vault_key_salt TEXT NOT NULL,     -- Salt for vault key derivation
  enabled INTEGER DEFAULT 1,
  priority INTEGER DEFAULT 0,
  last_push_hlc_timestamp TEXT,     -- Last pushed HLC
  last_pull_server_timestamp TEXT,  -- Last pull timestamp
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,

  -- CRDT columns
  haex_timestamp TEXT NOT NULL,
  haex_column_hlcs TEXT NOT NULL DEFAULT '{}',
  haex_tombstone INTEGER NOT NULL DEFAULT 0
);
```

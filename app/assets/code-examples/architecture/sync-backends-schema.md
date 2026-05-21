```sql
CREATE TABLE haex_sync_backends (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  home_server_url TEXT NOT NULL,    -- haex-sync-server base URL
  space_id TEXT NOT NULL,           -- Shared space identifier
  identity_id TEXT NOT NULL,        -- DID identity used for auth
  enabled INTEGER NOT NULL DEFAULT 1,
  priority INTEGER NOT NULL DEFAULT 0,
  last_push_hlc TEXT,               -- Last pushed HLC
  last_pull_server_at TEXT,         -- Last pull timestamp
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,

  -- CRDT columns added automatically:
  haex_hlc TEXT NOT NULL,
  haex_column_hlcs TEXT NOT NULL DEFAULT '{}'
);
```

```sql
-- All synced tables have these columns
CREATE TABLE haex_passwords (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  username TEXT,
  password TEXT,

  -- CRDT Columns (added automatically):
  haex_timestamp TEXT NOT NULL,      -- Max HLC across all columns
  haex_column_hlcs TEXT NOT NULL     -- JSON object with HLC per column
                     DEFAULT '{}',
  haex_tombstone INTEGER NOT NULL    -- 0 = active, 1 = soft-deleted
                     DEFAULT 0
);
```

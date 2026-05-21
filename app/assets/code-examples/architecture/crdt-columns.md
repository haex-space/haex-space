```sql
-- All synced tables get these columns automatically:
CREATE TABLE haex_passwords (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  username TEXT,
  password TEXT,

  -- CRDT Columns (added automatically by haex-vault):
  haex_hlc TEXT NOT NULL,            -- Row-level HLC (max of column HLCs)
  haex_column_hlcs TEXT NOT NULL     -- JSON object with HLC per column
                     DEFAULT '{}'
);

-- Deletes are NOT marked with a tombstone column. They are logged
-- in a separate table haex_deleted_rows by a BEFORE DELETE trigger.
```

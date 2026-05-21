```sql
-- CRDT columns added automatically to all synced tables
haex_hlc TEXT NOT NULL,            -- Row-level HLC (max over all column HLCs)
haex_column_hlcs TEXT NOT NULL     -- JSON object with HLC per column
                 DEFAULT '{}'

-- Note: no tombstone column. Deletes are logged to haex_deleted_rows
-- by a BEFORE DELETE trigger and replicated through sync.
```

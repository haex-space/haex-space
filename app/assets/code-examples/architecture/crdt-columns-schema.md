```sql
-- CRDT columns added to all synced tables
haex_timestamp TEXT NOT NULL,      -- Max HLC across all columns
haex_column_hlcs TEXT NOT NULL     -- JSON object with HLC per column
                 DEFAULT '{}',
haex_tombstone INTEGER NOT NULL    -- 0 = active, 1 = soft-deleted
                 DEFAULT 0
```

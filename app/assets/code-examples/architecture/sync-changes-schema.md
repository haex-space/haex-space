```sql
CREATE TABLE sync_changes (
  vault_id TEXT NOT NULL,
  table_name TEXT NOT NULL,
  row_pks JSONB NOT NULL,            -- Primary key(s) as JSON
  column_name TEXT NOT NULL,
  new_value BYTEA,                   -- Encrypted column value
  hlc_timestamp TEXT NOT NULL,
  device_id TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  PRIMARY KEY (vault_id, hlc_timestamp, table_name, row_pks, column_name)
) PARTITION BY LIST (vault_id);

-- Partitions created automatically per vault:
-- sync_changes_abc123_def456_...
-- Auto-created when vault first syncs
```

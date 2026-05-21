```sql
-- Server-side change log. One row per (column, row, change).
-- The server only stores encrypted ciphertext; HLC ordering decides
-- replacement.
CREATE TABLE sync_changes (
  space_id      TEXT NOT NULL,
  table_name    TEXT NOT NULL,
  row_pks       JSONB NOT NULL,        -- Primary key(s) as JSON
  column_name   TEXT NOT NULL,
  encrypted_value BYTEA,                -- AES-256-GCM ciphertext
  nonce         BYTEA NOT NULL,
  haex_hlc      TEXT NOT NULL,         -- HLC of this column change
  device_id     TEXT NOT NULL,
  created_at    TIMESTAMP DEFAULT now(),
  PRIMARY KEY (space_id, haex_hlc, table_name, row_pks, column_name)
);

-- Indexed for "give me everything since cursor X" pull queries.
CREATE INDEX ON sync_changes (space_id, haex_hlc);
```

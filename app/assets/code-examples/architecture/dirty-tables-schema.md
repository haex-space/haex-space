```sql
-- Tracks tables with pending local changes.
-- Local-only, never synced.
CREATE TABLE haex_crdt_dirty_tables (
  table_name TEXT PRIMARY KEY,
  last_modified TEXT NOT NULL
);

-- Example entry after editing a password:
-- table_name:    "haex_passwords"
-- last_modified: "2026-05-21 10:45:30"

-- Companion: haex_deleted_rows logs DELETE operations
-- per row so the sync server can replicate deletions.
CREATE TABLE haex_deleted_rows (
  table_name TEXT NOT NULL,
  row_pks TEXT NOT NULL,     -- JSON: primary key columns
  haex_hlc TEXT NOT NULL,
  PRIMARY KEY (table_name, row_pks)
);
```

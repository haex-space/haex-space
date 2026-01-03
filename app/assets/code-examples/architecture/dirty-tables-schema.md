```sql
-- Tracks tables with pending changes
CREATE TABLE haex_crdt_dirty_tables (
  table_name TEXT PRIMARY KEY,
  last_modified TEXT NOT NULL
);

-- Example entry:
-- table_name: "haex_passwords"
-- last_modified: "2024-01-03 10:45:30"
```

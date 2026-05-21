```sql
-- haex-vault installs three triggers per CRDT table.
-- Naming convention: z_dirty_{TABLE}_{insert|update|delete}

-- INSERT / UPDATE: mark the table as dirty so the sync
-- orchestrator picks it up on the next push.
CREATE TRIGGER IF NOT EXISTS "z_dirty_haex_passwords_insert"
AFTER INSERT ON "haex_passwords"
FOR EACH ROW BEGIN
  INSERT OR REPLACE INTO haex_crdt_dirty_tables
  (table_name, last_modified)
  VALUES ('haex_passwords', datetime('now'));
END;

CREATE TRIGGER IF NOT EXISTS "z_dirty_haex_passwords_update"
AFTER UPDATE ON "haex_passwords"
FOR EACH ROW BEGIN
  INSERT OR REPLACE INTO haex_crdt_dirty_tables
  (table_name, last_modified)
  VALUES ('haex_passwords', datetime('now'));
END;

-- DELETE: log the deletion in haex_deleted_rows BEFORE
-- the actual row is removed, then also mark dirty.
CREATE TRIGGER IF NOT EXISTS "z_dirty_haex_passwords_delete"
BEFORE DELETE ON "haex_passwords"
FOR EACH ROW BEGIN
  INSERT INTO haex_deleted_rows
  (table_name, row_pks, haex_hlc)
  VALUES ('haex_passwords',
          json_object('id', OLD.id),
          /* current HLC */ ?);

  INSERT OR REPLACE INTO haex_crdt_dirty_tables
  (table_name, last_modified)
  VALUES ('haex_passwords', datetime('now'));
END;
```

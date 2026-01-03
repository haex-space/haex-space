```sql
-- Trigger naming convention:
z_dirty_{TABLE_NAME}_{insert|update}

-- Example triggers for haex_passwords table:
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
```

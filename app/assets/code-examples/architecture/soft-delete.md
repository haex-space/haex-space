```sql
-- haex-vault does NOT add a tombstone column to your tables.
-- Instead, a BEFORE DELETE trigger logs deletions to a
-- dedicated table so they can be synced like any other change.

DELETE FROM haex_passwords WHERE id = 'abc-123';

-- The trigger writes a row into haex_deleted_rows:
--   table_name  = 'haex_passwords'
--   row_pks     = '{"id":"abc-123"}'
--   haex_hlc    = '<current HLC>'

-- Active rows are simply rows that still exist in their
-- original table. No `WHERE haex_tombstone = 0` filter is needed.

-- An age-based cleanup job prunes haex_deleted_rows
-- entries whose haex_hlc is older than the retention window.
```

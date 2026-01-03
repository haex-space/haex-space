```sql
-- Instead of:
DELETE FROM haex_passwords WHERE id = 'abc-123';

-- Use:
UPDATE haex_passwords SET haex_tombstone = 1 WHERE id = 'abc-123';

-- Query active records:
SELECT * FROM haex_passwords WHERE haex_tombstone = 0;
```

```sql
-- Query CRDT columns
SELECT
  id,
  title,
  haex_timestamp,
  haex_column_hlcs,
  haex_tombstone
FROM haex_passwords
WHERE id = 'abc-123';

-- Result:
-- id: "abc-123"
-- title: "Gmail"
-- haex_timestamp: "2024-01-03T10:45:30.200-B"
-- haex_column_hlcs: '{"id":"2024-01-03T10:00:00.000-A","title":"2024-01-03T10:45:30.200-B"}'
-- haex_tombstone: 0
```

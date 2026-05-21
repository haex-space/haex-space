```sql
-- Query CRDT columns
SELECT
  id,
  title,
  haex_hlc,
  haex_column_hlcs
FROM haex_passwords
WHERE id = 'abc-123';

-- Result:
-- id: "abc-123"
-- title: "Gmail"
-- haex_hlc: "7B7E2C9E10000000/8a4e23f76b0a4d9faabbccddeeff0011"
-- haex_column_hlcs: '{"id":"7B7E2C800000000/8a4e...","title":"7B7E2C9E10000000/8a4e..."}'
```

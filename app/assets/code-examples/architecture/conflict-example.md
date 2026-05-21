```
Device A: UPDATE passwords SET title = 'Gmail' WHERE id = 'abc'
         (haex_column_hlcs.title = 7B7E2C800000000/<nodeA>)

Device B: UPDATE passwords SET password = 'newpass' WHERE id = 'abc'
         (haex_column_hlcs.password = 7B7E2C9E10000000/<nodeB>)

Result after sync (column-level last-write-wins by HLC):
- title    = 'Gmail'    (kept from Device A)
- password = 'newpass'  (kept from Device B)

Both changes are preserved.
```

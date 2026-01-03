```
Device A: UPDATE passwords SET title = 'Gmail' WHERE id = 'abc'
         (timestamp: 2024-01-03T10:00:00-A)

Device B: UPDATE passwords SET password = 'newpass' WHERE id = 'abc'
         (timestamp: 2024-01-03T10:00:15-B)

Result after sync:
- title = 'Gmail'     (from Device A)
- password = 'newpass' (from Device B)

Both changes are preserved!
```

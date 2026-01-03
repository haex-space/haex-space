```typescript
// Extension → Host (via postMessage)
window.parent.postMessage({
  type: 'haextension:invoke',
  id: 'request-123',
  method: 'database',
  action: 'select',
  args: ['haex_passwords', { where: { id: 'abc' } }]
}, '*')

// Host → Extension (via postMessage)
window.frames[extensionId].postMessage({
  type: 'haextension:response',
  id: 'request-123',
  result: [{ id: 'abc', title: 'Gmail' }]
}, '*')
```

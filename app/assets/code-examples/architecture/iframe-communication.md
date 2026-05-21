```typescript
// Iframe extensions talk to haex-vault via postMessage.
// The SDK wraps this. As an extension developer you use the client API
// (client.query, client.permissions.*, ...) - the protocol is internal.

// Conceptually, every SDK call becomes a request like this:
window.parent.postMessage({
  type: 'haextension:invoke',
  id: 'request-123',
  method: 'database.query',
  args: ['SELECT * FROM haex_passwords', []],
}, '*')

// And haex-vault answers with a response:
window.postMessage({
  type: 'haextension:response',
  id: 'request-123',
  success: true,
  data: [{ id: 'abc', title: 'Gmail' }],
}, '*')
```

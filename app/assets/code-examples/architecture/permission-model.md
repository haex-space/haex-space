```typescript
// Internal representation of a granted permission
// (ts-rs binding: ExtensionPermission)
{
  id: string,
  extensionId: string,
  resourceType: 'db' | 'fs' | 'web' | 'shell'
              | 'filesync' | 'spaces' | 'identities' | 'passwords' | 'mail',
  action: { Database: 'read' | 'readWrite' | 'create' | 'delete' | 'alterDrop' }
        | { Filesystem: 'read' | 'readWrite' }
        | { Web: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | '*' /* parsed but not enforced */ }
        | { Shell: 'execute' }
        | /* ... other resource types ... */,
  target: string,
  constraints: Record<string, unknown> | null,
  status: 'ask' | 'granted' | 'denied',
}

// Note: for Web permissions, only `target` (URL / domain pattern)
// is consulted in the runtime check today. The HTTP method action is
// parsed from the manifest but not enforced.
```

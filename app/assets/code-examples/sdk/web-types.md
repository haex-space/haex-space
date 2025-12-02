```typescript
interface WebRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  headers?: Record<string, string>
  body?: string
  timeout?: number  // milliseconds
}

interface WebResponse {
  status: number
  statusText: string
  headers: Record<string, string>
  data: string
}

// Example response
{
  status: 200,
  statusText: 'OK',
  headers: {
    'content-type': 'application/json',
    'x-request-id': 'abc123'
  },
  data: '{"users": [...]}'
}
```

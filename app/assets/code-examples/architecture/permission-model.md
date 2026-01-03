```typescript
// Permission Model
{
  resourceType: "db" | "fs" | "web" | "shell",
  action: "read" | "write" | "create" | "delete" | "alterDrop",
  target: "haex_passwords" | "/home/user/*" | "https://api.example.com/*",
  constraints: { maxFileSize: "10MB" },  // optional
  status: "granted" | "denied" | "ask"
}
```

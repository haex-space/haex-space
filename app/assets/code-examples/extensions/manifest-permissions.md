```json
{
  "permissions": {
    "database": [
      {
        "target": "MCowBQYDK2Vw...__password-manager__credentials",
        "operation": "read"
      },
      {
        "target": "MCowBQYDK2Vw...__password-manager__categories",
        "operation": "read_write"
      }
    ],
    "filesystem": [
      {
        "target": "/exports",
        "operation": "read_write"
      }
    ],
    "http": [
      {
        "target": "https://api.example.com/**"
      },
      {
        "target": "https://cdn.example.com/*"
      }
    ],
    "shell": null
  }
}
```

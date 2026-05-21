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
        "operation": "readWrite"
      }
    ],
    "filesystem": [
      {
        "target": "/exports",
        "operation": "readWrite"
      }
    ],
    "http": [
      { "target": "https://api.example.com/**" },
      { "target": "https://cdn.example.com/*" }
    ],
    "shell": null
  }
}
```

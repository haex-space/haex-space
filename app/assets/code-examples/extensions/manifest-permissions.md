```json
{
  "permissions": {
    "database": [
      {
        "target": "passwords",
        "operation": "readWrite"
      },
      {
        "target": "categories",
        "operation": "read"
      }
    ],
    "filesystem": [
      {
        "target": "/exports",
        "operation": "readWrite"
      }
    ],
    "http": [
      {
        "target": "https://api.example.com/**"
      },
      {
        "target": "https://cdn.example.com/*"
      }
    ]
  }
}
```

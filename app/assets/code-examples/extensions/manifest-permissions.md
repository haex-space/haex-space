```json
{
  "permissions": {
    "database": [
      {
        "target": "passwords",
        "operation": "read_write"
      },
      {
        "target": "categories",
        "operation": "read"
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

```json
// manifest.json
{
  "displayMode": "auto"   // "auto" | "window" | "iframe"
  //
  // auto:    desktop → "window" (Tauri WebviewWindow),
  //          mobile  → "iframe"
  // window:  always open in a native window
  // iframe:  always render embedded inside haex-vault
}
```

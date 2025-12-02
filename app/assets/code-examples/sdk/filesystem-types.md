```typescript
interface SaveFileOptions {
  defaultPath?: string
  filters?: FileFilter[]
}

interface SaveFileResult {
  path: string
}

interface OpenFileOptions {
  filters?: FileFilter[]
  multiple?: boolean
}

interface OpenFileResult {
  files: OpenedFile[]
}

interface OpenedFile {
  path: string
  name: string
  size: number
  data: Uint8Array
}

interface FileFilter {
  name: string      // Display name (e.g., "Text Files")
  extensions: string[]  // File extensions without dots (e.g., ["txt", "md"])
}

interface ShowImageOptions {
  maxWidth?: number
  maxHeight?: number
  quality?: number  // 0-1, JPEG quality
}

interface ShowImageResult {
  data: Uint8Array | null
  mimeType: string
  width: number
  height: number
}
```

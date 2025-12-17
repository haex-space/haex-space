```typescript
// External request received by your extension
interface ExternalRequest {
  requestId: string                    // Unique ID for response correlation
  publicKey: string                    // Client's public key (identifier)
  action: string                       // Action to perform (your constants)
  payload: Record<string, unknown>     // Request data
}

// Response sent back to external client
interface ExternalResponse {
  requestId: string                    // Must match request
  success: boolean                     // Whether request succeeded
  data?: unknown                       // Response data (if success)
  error?: string                       // Error message (if failed)
}

// Authorized client (stored in database)
interface AuthorizedClient {
  id: string
  clientId: string                     // Public key fingerprint
  clientName: string                   // Human-readable name
  publicKey: string                    // Full public key (base64)
  extensionId: string                  // Which extension this client can access
  authorizedAt: string | null          // ISO 8601 timestamp
  lastSeen: string | null              // Last connection time
}

// Blocked client (stored in database)
interface BlockedClient {
  id: string
  clientId: string
  clientName: string
  publicKey: string
  blockedAt: string | null
}

// Pending authorization (in-memory, shown in approval dialog)
interface PendingAuthorization {
  clientId: string
  clientName: string
  publicKey: string
  requestedExtensions: RequestedExtension[]
}

interface RequestedExtension {
  name: string                         // e.g., "haex-pass"
  extensionPublicKey: string           // Extension's manifest public key
}
```

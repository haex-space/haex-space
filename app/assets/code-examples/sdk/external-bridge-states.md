```typescript
import {
  ExternalConnectionState,
  ExternalConnectionErrorCode,
  isExternalClientConnected,
  canExternalClientSendRequests
} from '@haex-space/vault-sdk'

// Connection states (used by external clients like browser extensions)
ExternalConnectionState.DISCONNECTED    // Not connected to HaexVault
ExternalConnectionState.CONNECTING      // Attempting to connect
ExternalConnectionState.CONNECTED       // WebSocket connected, not authorized
ExternalConnectionState.PENDING_APPROVAL // Waiting for user approval
ExternalConnectionState.PAIRED          // Authorized and ready

// Error codes for i18n
ExternalConnectionErrorCode.NONE                  // No error
ExternalConnectionErrorCode.CLIENT_NOT_AUTHORIZED // Not authorized
ExternalConnectionErrorCode.CLIENT_BLOCKED        // User blocked this client
ExternalConnectionErrorCode.CONNECTION_FAILED     // HaexVault not running
ExternalConnectionErrorCode.CONNECTION_TIMEOUT    // Timeout
ExternalConnectionErrorCode.CONNECTION_CLOSED     // Unexpected disconnect
ExternalConnectionErrorCode.DECRYPTION_FAILED     // Invalid key
ExternalConnectionErrorCode.INVALID_MESSAGE       // Corrupted message

// Helper functions
isExternalClientConnected(state)      // true if connected/pending/paired
canExternalClientSendRequests(state)  // true only if PAIRED
```

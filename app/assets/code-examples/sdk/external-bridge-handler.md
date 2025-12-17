```typescript
import { EXTERNAL_EVENTS } from '@haex-space/vault-sdk'
import type { ExternalRequest, ExternalResponse } from '@haex-space/vault-sdk'

// Define your extension's action constants
export const ACTIONS = {
  GET_CREDENTIALS: 'getCredentials',
  SAVE_CREDENTIAL: 'saveCredential',
  DELETE_CREDENTIAL: 'deleteCredential',
} as const

const { client } = useHaexVaultSdk()

// Listen for external requests
client.on(EXTERNAL_EVENTS.REQUEST, async (event) => {
  const request: ExternalRequest = event.data
  const { requestId, publicKey, action, payload } = request

  console.log(`External request from ${publicKey}: ${action}`)

  try {
    let responseData: unknown

    switch (action) {
      case ACTIONS.GET_CREDENTIALS:
        responseData = await getCredentialsForUrl(payload.url as string)
        break

      case ACTIONS.SAVE_CREDENTIAL:
        await saveCredential(payload)
        responseData = { saved: true }
        break

      default:
        throw new Error(`Unknown action: ${action}`)
    }

    // Send success response
    await client.respondToExternalRequest(requestId, {
      requestId,
      success: true,
      data: responseData
    })
  } catch (error) {
    // Send error response
    await client.respondToExternalRequest(requestId, {
      requestId,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})
```

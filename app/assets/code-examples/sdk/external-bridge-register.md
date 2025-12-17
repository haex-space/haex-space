```typescript
import type { ExternalRequest, ExternalResponse } from '@haex-space/vault-sdk'

// Define your extension's action constants
export const ACTIONS = {
  GET_CREDENTIALS: 'getCredentials',
  SAVE_CREDENTIAL: 'saveCredential',
} as const

const { client } = useHaexVaultSdk()

// Register handlers for specific actions (cleaner alternative to event listener)
client.onExternalRequest(ACTIONS.GET_CREDENTIALS, async (request: ExternalRequest) => {
  const { url } = request.payload as { url: string }
  const credentials = await getCredentialsForUrl(url)

  return {
    requestId: request.requestId,
    success: true,
    data: credentials
  }
})

client.onExternalRequest(ACTIONS.SAVE_CREDENTIAL, async (request: ExternalRequest) => {
  await saveCredential(request.payload)

  return {
    requestId: request.requestId,
    success: true,
    data: { saved: true }
  }
})
```

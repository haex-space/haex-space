```typescript
// haex-vault maintains a single shared WebSocket (haex-sync-server)
// authenticated with the device's DID identity. WebSocket events
// trigger a debounced pull from the server (the pull endpoint is the
// authoritative path; the WS only signals that there is something new).

const realtime = useRealtime()
await realtime.connect(backend.homeServerUrl, identity.privateKey, identity.did)

// One handler per relevant event type. Per-spaceId routing happens here.
realtime.on('sync', (event) => {
  if (event.spaceId !== backend.spaceId) return
  // Debounced (~500ms) to coalesce bursts.
  triggerPullForBackend(backend.id)
})

// Android/Doze: the WebSocket is reconnected when the app comes back
// to the foreground (visibilitychange listener with exponential backoff).
```

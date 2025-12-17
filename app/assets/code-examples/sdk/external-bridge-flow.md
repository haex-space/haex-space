```
External Client                    HaexVault                     Extension
(Browser Extension)               (Desktop App)                   (Plugin)
       |                               |                              |
       |-- WebSocket Connect --------->|                              |
       |                               |                              |
       |<-- Connection Accepted -------|                              |
       |                               |                              |
       |-- Handshake (publicKey, ------| ← Shows Authorization        |
       |   clientName, extensions)     |   Dialog to User             |
       |                               |                              |
       |<-- Paired (authorized) -------|                              |
       |                               |                              |
       |-- Request (action, payload) ->| ← Auto-starts Extension      |
       |                               |   if not running (minimized) |
       |                               |                              |
       |                               |-- Event: external:request -->|
       |                               |                              |
       |                               |<-- Response (data) ----------|
       |                               |                              |
       |<-- Response (data) -----------|                              |
       |                               |                              |
```

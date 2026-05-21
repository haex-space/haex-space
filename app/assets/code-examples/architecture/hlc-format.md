```
HLC Format: {ntp_time_hex}/{node_uuid_hex}

"7B7E2C9E10000000/8a4e23f76b0a4d9faabbccddeeff0011"
        │                          │
   16 hex chars               32 hex chars
   NTP-style timestamp        Device UUID
   (uhlc::Timestamp)          (16 byte node ID)

// Implementation: uhlc crate (Rust), persisted in haex_crdt_configs.
// Lexicographic comparison on this string yields correct
// happens-before ordering between devices.
```

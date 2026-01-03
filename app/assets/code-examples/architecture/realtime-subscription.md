```typescript
// Supabase Realtime Subscription
const channel = supabase
  .channel(`sync_changes:${vaultId}`)
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: `sync_changes_${vaultId.replace(/-/g, '_')}`  // Partition
  }, (payload) => {
    // Skip if change is from this device
    if (payload.new.device_id === myDeviceId) return

    // Trigger debounced pull (500ms)
    triggerPull()
  })
  .subscribe()
```

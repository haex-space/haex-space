```rust
// Rust - Permission Check Flow (simplified)
//
// 1. Frontend sends an extension request through Tauri IPC.
// 2. The relevant command handler resolves the resource and action,
//    looks up a matching ExtensionPermission in haex_extension_permissions,
//    and routes by status.
fn handle_db_request(extension_id: &str, sql: &str) -> Result<...> {
    let target = parse_table_target(sql)?;            // e.g. "pkA__ext__items"
    let action = derive_db_action(sql)?;              // Read | ReadWrite | Create | Delete | AlterDrop

    let permission = permission_manager.lookup(
        extension_id,
        ResourceType::Db,
        action,
        &target,
    )?;

    match permission.status {
        PermissionStatus::Granted => run_sql(sql),
        PermissionStatus::Denied  => Err(PermissionDenied),
        PermissionStatus::Ask     => prompt_user_and_cache(permission),
    }
}
```

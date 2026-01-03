```rust
// Rust - Permission Check Flow
fn execute_sql(extension_id: &str, sql: &str) -> Result<...> {
    let permission = permission_manager.check_permission(
        extension_id,
        ResourceType::Database,
        Action::ReadWrite,
        sql_table_name,
        None
    )?;

    match permission.status {
        Status::Granted => execute(sql),
        Status::Denied => Err(PermissionDenied),
        Status::Ask => {
            // Show permission prompt in UI
            // Cache decision for future
        }
    }
}
```

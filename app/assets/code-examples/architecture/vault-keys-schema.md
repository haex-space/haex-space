```sql
CREATE TABLE vault_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  vault_id TEXT NOT NULL,
  encrypted_vault_key TEXT NOT NULL,   -- AES-256-GCM encrypted
  encrypted_vault_name TEXT NOT NULL,  -- AES-256-GCM encrypted
  vault_key_salt TEXT NOT NULL,        -- Argon2 salt for key derivation
  vault_name_salt TEXT NOT NULL,       -- Argon2 salt for name derivation
  vault_key_nonce TEXT NOT NULL,
  vault_name_nonce TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  UNIQUE(user_id, vault_id)
);
```

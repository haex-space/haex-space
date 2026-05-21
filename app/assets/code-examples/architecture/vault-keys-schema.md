```sql
-- Server-side: per-identity vault key metadata stored in the
-- haex-sync-server. Authentication is DID-based (the server never
-- sees the user's vault password).
CREATE TABLE vault_keys (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  did                   TEXT NOT NULL,         -- Decentralized Identifier (DID)
  vault_id              TEXT NOT NULL,
  encrypted_vault_key   BYTEA NOT NULL,        -- AES-256-GCM ciphertext
  encrypted_vault_name  BYTEA NOT NULL,        -- AES-256-GCM ciphertext
  vault_key_salt        BYTEA NOT NULL,
  vault_name_salt       BYTEA NOT NULL,
  vault_key_nonce       BYTEA NOT NULL,
  vault_name_nonce      BYTEA NOT NULL,
  created_at            TIMESTAMP DEFAULT now(),
  updated_at            TIMESTAMP DEFAULT now(),
  UNIQUE(did, vault_id)
);
```

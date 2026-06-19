# Privacy Policy – Haex Vault

Effective: 2026-06-19

## 1. Controller

Martin Drechsel
Heinrich-Schütz-Straße 76
09130 Chemnitz
Germany
Email: privacy@haex.space

## 2. Core principle

Haex Vault is a local-first application. All user data is stored exclusively on
your device in an AES-256 encrypted SQLite database (SQLCipher). Data is
transmitted to servers only if you configure sync servers yourself or share
content with others. There are no ads, no tracking, no analytics SDKs, and no
telemetry.

## 3. Local processing (no transfer)

Processed locally on your device:

- Vault contents (passwords, notes, files, calendar entries, etc., depending on
  installed Haextensions) – AES-256 encrypted
- Device identity: ed25519 key pair (Decentralized Identifier, DID)
- Biometric material: on Android, in the Android KeyStore (RSA-4096 +
  AES-256-GCM); never leaves the device

## 4. Optional server sync

If you configure a sync server (e.g. the server we operate at `sync.haex.space`
or a self-hosted one), the following data is transferred to that server for
synchronisation:

- Encrypted content (ciphertext) – not readable by us as server operator
- Sync metadata: vault ID, table names, primary keys, CRDT columns (HLC
  timestamps), device DIDs

**Additionally**, if you create a sync account on our server `sync.haex.space`,
we collect:

- Email address — used as your unique account identifier and to contact you
  about service-relevant matters (e.g. confirming a deletion request,
  invoicing once paid tiers are available)

Operators of self-hosted or third-party sync servers decide independently
which data they require for account registration; their own privacy policies
apply, not this one.

Legal basis (GDPR): Art. 6(1)(b) (contract performance) when using our server,
or Art. 6(1)(f) (legitimate interest in sync functionality).

Retention and deletion are described separately at
[Account Deletion](https://haex.space/account-deletion). In short: free
accounts (no payment history) can be fully deleted within 30 days; paid
accounts retain billing-relevant data for the legally required period
(up to 10 years per § 147 AO), after which everything is permanently deleted.

## 5. Optional sharing with others (MLS / RFC 9420)

When you share a space with others, content is end-to-end encrypted using the
Messaging Layer Security protocol (RFC 9420). The sync server relays encrypted
packets but cannot read them.

## 6. Peer-to-peer sync on local networks

On local networks, devices sync directly device-to-device over QUIC after mDNS
discovery. No data is transmitted to third parties.

## 7. Permissions

- Internet: for optional server sync and mDNS discovery
- Camera (optional): for scanning QR codes during device pairing. No photos are
  stored or transmitted.
- Biometrics (optional): only to unlock the vault; biometric features never
  leave the device.

## 8. Third parties

- Google Play Store: distributes the app. Subject to Google's Privacy Policy:
  https://policies.google.com/privacy
- Sync servers / cloud storage you choose: if you configure third-party
  providers (S3, R2, MinIO etc.), their privacy policies apply.

We do not share your data with advertising or analytics providers.

## 9. Your rights (GDPR)

You have the right to access (Art. 15), rectification (Art. 16), erasure
(Art. 17), restriction of processing (Art. 18), data portability (Art. 20), and
objection (Art. 21). You may lodge a complaint with a supervisory authority.
Requests to: privacy@haex.space

## 10. Contact

Martin Drechsel
privacy@haex.space

## 11. Changes

This policy may change as features or legal requirements evolve. The current
version is available at https://haex.space/privacy.

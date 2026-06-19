# Account & Data Deletion – Haex Vault

Last updated: 2026-06-19

This page explains how to delete your Haex Vault sync account and all
associated data on `sync.haex.space`.

## Who this applies to

This page is for users who created a sync account on our server
`sync.haex.space`. If you only use Haex Vault locally on your device,
without enabling sync — there is no account to delete. Just uninstall the
app; everything is on your device.

If you use a third-party or self-hosted sync server, please contact that
server operator directly. We can only delete data on our own server.

## What gets deleted — and what we must retain

How we handle your deletion request depends on whether you have a billing
history with us (one-time purchases, paid quota upgrades, or active
subscriptions). Both cases are described below.

### Free accounts with no billing history

If you have only ever used the free tier and never paid us, we delete
everything permanently:

- Your account record (email address used for registration)
- Encrypted vault content (ciphertext) you uploaded for sync
- Synchronisation metadata (vault ID, primary keys, CRDT timestamps)
- Device identifiers (DIDs) bound to your account

Deletion is permanent and irreversible. We do not retain backups.

### Paid accounts (current or historical billing)

If you have made any payment to us — currently or in the past — we are
**legally required** to retain certain data for tax compliance under
German tax law (§ 147 AO, generally 10 years for invoice-relevant
records). In that case:

**Deleted within 30 days of confirmation:**

- Encrypted vault content (ciphertext) you uploaded for sync
- Synchronisation metadata (vault ID, primary keys, CRDT timestamps)
- Device identifiers (DIDs) bound to your account
- Active session tokens, API keys, current account state

**Pseudonymised and retained for the legal retention period
(up to 10 years from the relevant tax year), then deleted:**

- Your email address (replaced with an internal customer ID; we can no
  longer use it to contact you or identify you)
- Invoice and transaction records required by § 147 AO and § 14 UStG:
  name, billing address, invoice numbers, amounts, VAT breakdown, dates,
  service descriptions

After the retention period expires, all remaining data is permanently
deleted.

### Legal basis

The retention is based on Article 17(3)(b) GDPR (compliance with a legal
obligation) in connection with § 147 AO and § 14 UStG. The retained data
is processed solely to fulfil our legal record-keeping obligations and
will not be used for any other purpose.

## What does NOT get deleted

- Data stored locally on your devices. Uninstall the app or reset the
  vault from inside the app to remove that.
- Data you have shared with other users via end-to-end encrypted Spaces
  (MLS, RFC 9420). Once you have shared content, recipients have their
  own copy that you cannot revoke. If you remove yourself from a Space,
  others retain what was already exchanged.
- Data on third-party or self-hosted sync servers — contact that server's
  operator.

## How to request deletion

Send an email to **privacy@haex.space** from the email address you used to
register your sync account, with the subject:

```
Delete my Haex sync account
```

You don't need to include any other information — the email address you
send from is the identifier we use.

## What happens next

1. Within 7 business days you will receive a reply asking you to confirm
   the deletion request. This step prevents accidental or unauthorised
   deletion.
2. Once you confirm, we delete your account and all associated data on
   `sync.haex.space` within 30 days of the confirmation.
3. You will receive a final email confirming deletion.

## Contact

Martin Drechsel
Heinrich-Schütz-Straße 76
09130 Chemnitz, Germany
privacy@haex.space

# Datenschutzerklärung – Haex Vault

Stand: 15.06.2026

## 1. Verantwortliche Stelle

Martin Drechsel
Heinrich-Schütz-Straße 76
09130 Chemnitz
Deutschland
E-Mail: privacy@haex.space

## 2. Grundprinzip

Haex Vault ist eine local-first Anwendung. Alle Nutzerdaten werden ausschließlich
lokal auf deinem Gerät in einer mit AES-256 verschlüsselten SQLite-Datenbank
(SQLCipher) gespeichert. Eine Übertragung an Server findet nur statt, wenn du
selbst Sync-Server konfigurierst oder Inhalte mit anderen teilst. Es gibt keine
Werbung, kein Tracking, keine Analyse-SDKs und keine Telemetrie.

## 3. Lokale Datenverarbeitung (kein Datentransfer)

Lokal auf dem Gerät werden verarbeitet:

- Vault-Inhalte (Passwörter, Notizen, Dateien, Kalender etc., je nach
  installierten Haextensions) – AES-256 verschlüsselt
- Geräte-Identität: ed25519-Schlüsselpaar (Decentralized Identifier, DID)
- Biometrie-Material: Auf Android im Android KeyStore (RSA-4096 + AES-256-GCM);
  verlässt das Gerät nie

## 4. Optionaler Sync mit Servern

Wenn du einen Sync-Server konfigurierst (z. B. den von uns betriebenen Server
`sync.haex.space` oder einen selbstgehosteten), werden zur Synchronisation
folgende Daten an den von dir gewählten Server übertragen:

- Verschlüsselte Inhalte (Ciphertext) – für uns als Server-Betreiber nicht
  lesbar
- Synchronisations-Metadaten: Vault-ID, Tabellennamen, Primärschlüssel,
  CRDT-Spalten (HLC-Zeitstempel), Geräte-DIDs

Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung), sofern du
unseren Server nutzt; alternativ Art. 6 Abs. 1 lit. f DSGVO (berechtigtes
Interesse an Funktionsfähigkeit der Synchronisation).

Speicherdauer: Synchronisations-Daten werden gespeichert, solange du den Sync
aktiviert lässt. Du kannst die Daten jederzeit löschen, indem du den Vault auf
dem Server zurücksetzt oder uns kontaktierst.

## 5. Optionales Teilen mit anderen Personen (MLS / RFC 9420)

Wenn du einen Space mit anderen teilst, werden Inhalte Ende-zu-Ende verschlüsselt
über das Messaging Layer Security Protocol (RFC 9420) ausgetauscht. Der
Sync-Server vermittelt die verschlüsselten Pakete, kann sie aber nicht lesen.

## 6. Peer-to-Peer-Sync im lokalen Netzwerk

Im lokalen Netzwerk findet eine direkte Geräte-zu-Geräte-Synchronisation per
QUIC nach mDNS-Discovery statt. Es werden keine Daten an Dritte übertragen.

## 7. Berechtigungen

- Internet: für optionalen Server-Sync und mDNS-Discovery
- Kamera (optional): für das Scannen von QR-Codes zur Geräte-Kopplung. Es werden
  keine Fotos gespeichert oder übertragen.
- Biometrie (optional): nur zum Entsperren des Vaults; das biometrische Merkmal
  verlässt das Gerät nicht.

## 8. Dritte

- Google Play Store: stellt die App bereit. Es gelten die Datenschutzbestimmungen
  von Google: https://policies.google.com/privacy
- Selbst gewählte Sync-Server / Cloud-Speicher: wenn du Drittanbieter (S3, R2,
  MinIO etc.) konfigurierst, gelten deren Datenschutzbestimmungen.

Es findet keine Weitergabe deiner Daten an Werbe- oder Analyse-Anbieter statt.

## 9. Deine Rechte (DSGVO)

Du hast das Recht auf Auskunft (Art. 15), Berichtigung (Art. 16), Löschung
(Art. 17), Einschränkung der Verarbeitung (Art. 18), Datenübertragbarkeit
(Art. 20) und Widerspruch (Art. 21). Beschwerde kannst du bei einer
Datenschutz-Aufsichtsbehörde einlegen. Anfragen an: privacy@haex.space

## 10. Kontakt

Martin Drechsel
privacy@haex.space

## 11. Änderungen

Diese Erklärung kann angepasst werden, wenn sich Funktionen oder rechtliche
Anforderungen ändern. Die jeweils aktuelle Version findet sich unter
https://haex.space/de/privacy.

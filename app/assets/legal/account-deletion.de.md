# Konto- und Datenlöschung – Haex Vault

Stand: 19.06.2026

Diese Seite beschreibt, wie du dein Haex-Vault-Sync-Konto und alle
zugehörigen Daten auf `sync.haex.space` löschen kannst.

## Für wen das gilt

Diese Seite richtet sich an Nutzer, die ein Sync-Konto auf unserem
Server `sync.haex.space` erstellt haben. Wenn du Haex Vault nur lokal
auf deinem Gerät benutzt, ohne Sync zu aktivieren, gibt es kein Konto
zu löschen — du musst nur die App deinstallieren; alle Daten liegen auf
deinem Gerät.

Wenn du einen Sync-Server eines Drittanbieters oder einen selbst
gehosteten Server nutzt, wende dich bitte direkt an dessen Betreiber.
Wir können nur Daten auf unserem eigenen Server löschen.

## Was gelöscht wird — und was wir aufbewahren müssen

Wie wir mit deiner Löschanfrage umgehen, hängt davon ab, ob du bei uns
eine Zahlungshistorie hast (einmalige Käufe, kostenpflichtige Quota-
Erweiterungen oder aktive Abonnements). Beide Fälle sind unten
beschrieben.

### Free-Accounts ohne Zahlungshistorie

Wenn du ausschließlich den kostenlosen Tarif genutzt und nie gezahlt
hast, löschen wir alles vollständig:

- Dein Kontoeintrag (Email-Adresse, die bei der Registrierung verwendet
  wurde)
- Verschlüsselte Vault-Inhalte (Ciphertext), die du zur Synchronisation
  hochgeladen hast
- Synchronisations-Metadaten (Vault-ID, Primärschlüssel,
  CRDT-Zeitstempel)
- Geräte-Identifikatoren (DIDs), die mit deinem Konto verbunden sind

Die Löschung ist dauerhaft und unwiderruflich. Wir behalten keine
Backups.

### Bezahlte Accounts (aktuell oder historisch)

Wenn du jemals — aktuell oder in der Vergangenheit — eine Zahlung an uns
geleistet hast, sind wir **gesetzlich verpflichtet**, bestimmte Daten
für die steuerliche Aufbewahrung gemäß § 147 AO (in der Regel 10 Jahre
für rechnungsrelevante Belege) zu speichern. In diesem Fall gilt:

**Gelöscht innerhalb von 30 Tagen nach Bestätigung:**

- Verschlüsselte Vault-Inhalte (Ciphertext), die du zur Synchronisation
  hochgeladen hast
- Synchronisations-Metadaten (Vault-ID, Primärschlüssel,
  CRDT-Zeitstempel)
- Geräte-Identifikatoren (DIDs), die mit deinem Konto verbunden sind
- Aktive Session-Tokens, API-Schlüssel, aktueller Account-State

**Pseudonymisiert und aufbewahrt für die gesetzliche
Aufbewahrungsfrist (bis zu 10 Jahre ab dem maßgeblichen Steuerjahr),
danach gelöscht:**

- Deine Email-Adresse (ersetzt durch eine interne Kunden-ID; sie kann
  nicht mehr verwendet werden, um dich zu kontaktieren oder zu
  identifizieren)
- Rechnungs- und Transaktionsdaten, die nach § 147 AO und § 14 UStG
  aufzubewahren sind: Name, Rechnungsadresse, Rechnungsnummern,
  Beträge, Umsatzsteuer-Aufschlüsselung, Daten, Leistungsbeschreibungen

Nach Ablauf der Aufbewahrungsfrist werden alle verbleibenden Daten
dauerhaft gelöscht.

### Rechtsgrundlage

Die Aufbewahrung stützt sich auf Art. 17 Abs. 3 Buchst. b DSGVO
(Erfüllung einer rechtlichen Verpflichtung) in Verbindung mit § 147 AO
und § 14 UStG. Die aufbewahrten Daten werden ausschließlich zur
Erfüllung unserer gesetzlichen Aufbewahrungspflichten verarbeitet und
nicht für andere Zwecke verwendet.

## Was NICHT gelöscht wird

- Lokal auf deinen Geräten gespeicherte Daten. Deinstalliere die App
  oder setze den Vault innerhalb der App zurück, um diese zu entfernen.
- Daten, die du via Ende-zu-Ende verschlüsselter Spaces (MLS, RFC 9420)
  mit anderen Nutzern geteilt hast. Geteilte Inhalte liegen bei den
  Empfängern in deren eigener Kopie und können nicht widerrufen werden.
  Wenn du einen Space verlässt, behalten andere Teilnehmer die bereits
  ausgetauschten Inhalte.
- Daten auf Drittanbieter- oder selbstgehosteten Sync-Servern — wende
  dich an deren Betreiber.

## So forderst du die Löschung an

Sende eine E-Mail an **privacy@haex.space** von der E-Mail-Adresse, mit
der du dein Sync-Konto registriert hast, mit dem Betreff:

```
Delete my Haex sync account
```

Du brauchst keine weiteren Angaben — die E-Mail-Adresse, von der du
schreibst, dient als Identifikator.

## Was danach passiert

1. Innerhalb von 7 Werktagen erhältst du eine Antwort mit der Bitte um
   Bestätigung der Löschanfrage. Dieser Schritt verhindert versehentliche
   oder unautorisierte Löschungen.
2. Sobald du bestätigt hast, löschen wir dein Konto und alle zugehörigen
   Daten auf `sync.haex.space` innerhalb von 30 Tagen nach der
   Bestätigung.
3. Du erhältst eine abschließende E-Mail, die die Löschung bestätigt.

## Kontakt

Martin Drechsel
Heinrich-Schütz-Straße 76
09130 Chemnitz, Deutschland
privacy@haex.space

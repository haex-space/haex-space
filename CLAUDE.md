# CLAUDE.md - Projektanweisungen

## Knowledge Database

Du führst für dieses Projekt eine persistente Wissensdatenbank im Ordner `.claude/`.

### Anweisungen

1. **Erstelle und pflege aktiv** eine Knowledge Database in `.claude/`
2. **Speichere kontinuierlich** alle wichtigen Erkenntnisse über das Projekt
3. **Lese die Knowledge Database** zu Beginn jeder Session, um den Kontext wiederherzustellen

### Was du dokumentieren sollst

- **Architektur**: Systemdesign, Komponenten-Beziehungen, Datenflüsse
- **Entscheidungen**: Warum wurde X statt Y gewählt? Trade-offs und Begründungen
- **Patterns**: Wiederkehrende Code-Patterns und Konventionen im Projekt
- **Tech-Stack**: Verwendete Bibliotheken, Frameworks, Tools mit Versionen
- **Schema**: Datenbank-Schema, API-Contracts, wichtige Interfaces
- **Konfiguration**: Umgebungsvariablen, Build-Konfiguration, Deployment
- **Probleme & Lösungen**: Bugs die aufgetreten sind und wie sie gelöst wurden
- **Konventionen**: Naming, Code-Style, Projektstruktur-Regeln
- **Wichtige Dateien**: Einstiegspunkte, zentrale Module, ihre Verantwortlichkeiten

### Dateistruktur in `.claude/`

Organisiere die Knowledge Database nach Themen:

```
.claude/
├── overview.md          # Projektübersicht, Tech-Stack, Struktur
├── architecture.md      # Architektur-Entscheidungen, Systemdesign
├── patterns.md          # Code-Patterns, Konventionen
├── api.md               # API-Endpunkte, Contracts
├── database.md          # Schema, Migrations, Queries
├── decisions.md         # ADRs (Architecture Decision Records)
├── problems.md          # Bekannte Probleme und Lösungen
└── session-log.md       # Chronologisches Log der Arbeits-Sessions
```

Du kannst diese Struktur anpassen oder erweitern je nach Projektbedürfnissen.

### Wann du aktualisieren sollst

- **Sofort** wenn eine architektonische Entscheidung getroffen wird
- **Sofort** wenn du etwas Wichtiges über die Codebasis lernst
- **Sofort** wenn ein Problem gelöst wird
- **Am Ende** jeder Session: Kurzer Eintrag im Session-Log

### Wichtig

- Halte die Dokumentation **prägnant und nützlich** - keine Prosa, sondern Fakten
- Aktualisiere bestehende Informationen wenn sie sich ändern
- Lösche veraltete Informationen
- Die Knowledge Database ist für dich - schreibe so, dass du den Kontext schnell wiederherstellen kannst

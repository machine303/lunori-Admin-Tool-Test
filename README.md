# Lunori Glossary Admin Tool (V1)

Ein modernes React + TypeScript Tool zur Verwaltung von Glossar-Einträgen.

## 🚀 Schnellstart

### Option 1: StackBlitz (Empfohlen für schnelles Testen)

1. Gehe zu **https://stackblitz.com/fork/vite-react-ts**
2. Lösche alle vorhandenen Dateien im `src/` Ordner
3. Kopiere alle Dateien aus diesem Projekt
4. Die App startet automatisch!

**Schritt-für-Schritt:**
1. Öffne https://stackblitz.com/fork/vite-react-ts
2. Warte bis das Projekt geladen ist
3. Im linken Datei-Explorer:
   - Lösche `src/App.tsx`, `src/App.css`, `src/index.css`
   - Erstelle die Ordner `src/lib/` und `src/components/`
4. Kopiere die Dateien:
   - `package.json` → ersetze die bestehende
   - `src/main.tsx`
   - `src/styles.css`
   - `src/App.tsx`
   - `src/lib/types.ts`
   - `src/lib/validate.ts`
   - `src/lib/csv.ts`
   - `src/lib/exporters.ts`
   - `src/components/TopBar.tsx`
   - `src/components/Filters.tsx`
   - `src/components/EntryList.tsx`
   - `src/components/EntryEditor.tsx`
   - `src/components/BulkEdit.tsx`
   - `src/components/FindReplace.tsx`
5. Klicke auf "Install dependencies" wenn StackBlitz fragt
6. Die App sollte automatisch neu laden!

### Option 2: Lokal entwickeln

```bash
# Repository klonen oder Dateien kopieren
cd lunori-glossary

# Dependencies installieren
npm install

# Development Server starten
npm run dev
```

Die App läuft dann auf `http://localhost:5173`

## 📋 Features

- **CSV Import**: Lade deine `glossary_master.csv` Datei
- **Suche & Filter**: Durchsuche alle Felder, filtere nach Status und Kategorie
- **Inline-Editing**: Änderungen werden automatisch gespeichert
- **Bulk Edit**: Bearbeite mehrere Einträge gleichzeitig
- **Find & Replace**: Ersetze Text in mehreren Feldern
- **QA Warnings**: Automatische Hinweise bei fehlenden Feldern
- **Export**: CSV, Seed JSON und Slug Index

## 🎨 Brand Colors

- Primary Navy: `#121A2F`
- Sand Gold: `#C8AD73`
- Off-White: `#E6DCC8`

## 📁 Projektstruktur

```
lunori-glossary/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── sample_glossary.csv      # Test-Daten
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── styles.css
    ├── lib/
    │   ├── types.ts
    │   ├── validate.ts
    │   ├── csv.ts
    │   └── exporters.ts
    └── components/
        ├── TopBar.tsx
        ├── Filters.tsx
        ├── EntryList.tsx
        ├── EntryEditor.tsx
        ├── BulkEdit.tsx
        └── FindReplace.tsx
```

## 📄 CSV Format

Die CSV-Datei muss folgende Spalten in dieser Reihenfolge haben:

```
id,slug,url,title,short,long,level,visibility,category,tags,app_priority,status,updated_at,synonyms,sources,notes
```

## ⚠️ Deprecated Regel

Wenn ein Eintrag den Status `deprecated` hat:
- Der Status ist **gesperrt** und kann nicht mehr geändert werden
- Alle anderen Felder (title, tags, etc.) können weiterhin bearbeitet werden
- In der Liste erscheint ein 🔒 Lock-Icon
- Bei Bulk-Operationen werden deprecated Einträge übersprungen

## 🧪 Test-Daten

Eine `sample_glossary.csv` ist enthalten mit 15 Beispieleinträgen:
- Verschiedene Status (active, draft, deprecated)
- Mit und ohne Tags
- Mit QA-Warnungen (fehlender Titel, leere Tags, etc.)

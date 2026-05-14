# Cloud Declutter – M3 High-Fidelity Prototyp

**Gruppe:** 03  
**Team:** Manuel Fink, Alexander Si, Maria Pandolfo, David Bachhofer, Marko Nakev TEST
**Thema:** Cloud Declutter – Intelligenter Assistent für Cloud-Speicherbereinigung

---

## Projektübersicht

Cloud Declutter ist eine React-Native-App für Android, die Nutzer:innen hilft, fragmentierten Cloud-Speicher zu bereinigen. Die App verbindet mehrere Cloud-Dienste (Google Drive, Dropbox, iCloud, OneDrive), erkennt Duplikate, Junk-Dateien und Speicherfresser, und ermöglicht sicheres Löschen mit Rückgängig-Funktion.

**Package Name:** `at.ac.univie.hci.clouddeclutter`

---

## Zielplattform

- **Betriebssystem:** Android
- **Zielgerät:** Pixel 6
- **Min. API-Level:** 24 (Android 7.0)
- **Ziel-API-Level:** 36 (Android 16)

---

## Funktionsumfang

### Onboarding (UC-02: Cloud-Konten verbinden)

- Simulation der OAuth-Verbindung für Google Drive, Dropbox, iCloud, OneDrive
- Transparenz über Berechtigungen (Lesezugriff, Löschzugriff, kein Hochladen)
- Sicherheitskarte: Daten verbleiben auf dem Gerät

### Dashboard (UC-01: Notfall-Speicherrettung)

- Übersicht des Gesamtspeichers mit Farbcodierung pro Cloud-Anbieter
- Schnellaktionen: Scan starten, Swipe-Modus, Tiefenreinigung
- Größte Speicherfresser auf einen Blick
- Verbundene Cloud-Konten mit Belegungsgrad

### Scan/Kategorien (UC-03: KI-gesteuerte Duplikat- & Junk-Erkennung)

- Kategorisierte Scan-Ergebnisse: Duplikate, unscharfe Fotos, große ungenutzte Dateien, alte Downloads, Screenshots, temporäre Dateien
- Pro Kategorie: Dateianzahl und freigebbaren Speicher
- Dateiauswahl mit Checkbox (einzel/alle auswählen)
- Sensible Dateien werden als „aufbewahrungspflichtig" markiert (Bezug auf Persona Manuel Gruber)
- Löschbestätigungsdialog mit Papicorb-Hinweis

### Detail/Review

- Dateidetails: Name, Größe, Typ, Cloud-Anbieter, Änderungsdatum
- Duplikat-Markierung und Sensibilitäts-Warnung
- Behalten/Löschen-Entscheidung mit Sicherheits-Hinweis
- Klare Erklärung der Rückgängig-Option

### Swipe-Modus (Gamification + UC-01)

- Tinder-ähnliches Wischen: links = löschen, rechts = behalten
- Fortschrittsbalken und Session-Statistiken
- Lösch-Streak mit Feuer-Emoji (Gamification nach UX Magazine)
- Rückgängig-Button prominent nach jeder Aktion (Bezug auf M2-Feedback)
- Session-Abschluss mit Zusammenfassung

### Papierkorb (UC-04: Sicheres Löschen mit Rückgängig)

- 30 Tage wiederherstellbare gelöschte Dateien
- Tage bis zum Ablauf sichtbar
- Einzelne Wiederherstellung oder komplettes Leeren
- Prominent in der Tab-Navigation (nicht in den Einstellungen versteckt)

---

## Projektstruktur

```
CloudDeclutter/
├── App.tsx                           # Navigation-Setup (Stack + Bottom Tabs)
├── src/
│   ├── api/                          # API-Layer (für zukünftige echte Anbindung)
│   ├── components/
│   │   ├── CategoryCard.tsx          # Scan-Kategorie-Karte
│   │   ├── CloudProviderCard.tsx     # Cloud-Anbieter-Karte mit Speicherbalken
│   │   └── FileCard.tsx              # Datei-Karte mit Checkbox & Anbieter-Badge
│   ├── data/
│   │   └── mockData.ts              # Mock-Daten & Hilfsfunktionen
│   ├── screens/
│   │   ├── OnboardingScreen.tsx      # Cloud-Verbindung & Berechtigungen
│   │   ├── DashboardScreen.tsx       # Speicherübersicht & Schnellaktionen
│   │   ├── ScanCategoriesScreen.tsx  # Kategorisierte Scan-Ergebnisse
│   │   ├── DetailScreen.tsx          # Dateidetail-Ansicht
│   │   ├── SwipeModeScreen.tsx       # Tinder-ähnlicher Swipe-Modus
│   │   └── RecycleBinScreen.tsx      # Papierkorb mit Wiederherstellung
│   ├── theme/
│   │   └── index.ts                 # Design-Tokens (Farben, Abstände, Schriftgrößen)
│   └── types/
│       └── index.ts                 # TypeScript-Typdefinitionen
├── android/                          # Android-Projektdateien
└── README.md
```

---

## Verwendete Technologien

- **React Native** v0.85 – Cross-Platform Framework
- **TypeScript** – Typisierung
- **React Navigation** (Native Stack + Bottom Tabs) – Navigation
- **React Native Gesture Handler** – Swipe-Interaktionen
- **React Native Reanimated** – Animationen
- **Mock-Backend** – Simulierte Cloud-Daten (prototypisch)

---

## Designentscheidungen (Bezug auf M1/M2)

### 1. Dashboard statt langwierigem Scan

**Bezug:** Persona Markus (effizienter Manager) und M2-Feedback „Dashboard entschlacken"
**Entscheidung:** Das Dashboard zeigt sofort die größten Speicherfresser und konkrete nächste Aktionen statt abstrakter Analysen.

### 2. Swipe-Modus mit Gamification

**Bezug:** UX Magazine (Gamification) und M2-Interview-Feedback
**Entscheidung:** Tinder-ähnliches Wischen mit Streak-Counter und Fortschrittsbalken reduziert Decision Fatigue (Hick's Law) und erhöht Motivation.

### 3. Prominenter Rückgängig-Button & Papierkorb

**Bezug:** Persona Maria (unsichere Gelegenheitsnutzerin), Alon & Nachmias (2020), M2-Feedback
**Entscheidung:** Undo-Button nach jeder Löschaktion sichtbar, Papierkorb als eigener Tab. Löscht man versehentlich, kann man sofort rückgängig machen – das nimmt die Angst vor Datenverlust.

### 4. Cloud-Anbieter pro Datei sichtbar

**Bezug:** M2-Kritik „Cloud-Anbieter pro Datei nicht sichtbar", Persona Markus (Transparenz)
**Entscheidung:** Jede Datei zeigt farbcodiert den zugehörigen Cloud-Anbieter.

### 5. Sensible Datei-Markierung

**Bezug:** Persona Manuel (Freelancer, rechtliche Dokumente)
**Entscheidung:** Dateien, die als aufbewahrungspflichtig erkannt werden, werden mit Warnung markiert und im Swipe-Modus ausgeschlossen.

### 6. Einfache Sprache, kein Fachjargon

**Bezug:** Persona Maria, M2-Feedback „Sprache vereinfachen"
**Entscheidung:** UI-Text in einfachem Deutsch, keine Begriffe wie „Fragmentierung", „Cache" oder „GB" in Nutzer-Kommunikation.

### 7. Chunking der Scan-Ergebnisse

**Bezug:** Hick's Law (M1-Literaturanalyse)
**Entscheidung:** Scan-Ergebnisse werden in Kategorien gruppiert statt als endlose Liste einzelner Dateien. Nutzer entscheiden pro Kategorie statt pro Datei.

---

## App starten

```bash
# Abhängigkeiten installieren
npm install

# Metro Bundler starten
npm start

# In einem zweiten Terminal: Android-App bauen und starten
npm run android
```

Alternativ: Projekt in Android Studio öffnen (`android/` Ordner) und von dort starten.

---

## Transparenz zur KI-Nutzung

Bei der Entwicklung dieser App wurde KI (opencode / Claude) unterstützend eingesetzt:

- Generierung von Boilerplate-Code für React Navigation, Screen-Strukturen und Komponenten
- Unterstützung bei TypeScript-Typdefinitionen und Mock-Daten
- Debugging von Gradle- und Abhängigkeitsproblemen

---

## Arbeitsverteilung (M3)

- **Manuel Fink:** Onboarding-Screen, Berechtigungskonzept
- **Alexander Si:** Dashboard-Screen, Speicherübersicht & Statistiken
- **Maria Pandolfo:** ScanCategories-Screen, CategoryCard-Komponente
- **David Bachhofer:** SwipeMode-Screen, Projektstruktur, Navigation-Setup, Build-Konfiguration
- **Marko Nakev:** RecycleBin-Screen, DetailScreen, FileCard-Komponente

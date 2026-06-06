## Readme - M3

* Gruppe: 3
* Team-Nr.: 308
* Projektthema: Cloud Declutter – Intelligenter Assistent für Cloud-Speicherbereinigung

### Implementierung

Framework: React Native (Expo)

API-Version: Android API-Level 24–36 (Min. API 24 / Android 7.0, Ziel API 36 / Android 16) / Expo SDK 56

Gerät(e), auf dem(denen) getestet wurde:
Pixel 6, Pixel 9, Samsung A54, Samsung S23, Expo Go

Externe Libraries und Frameworks:
- Expo SDK 56
- React Native v0.85
- TypeScript
- React Navigation (Native Stack + Bottom Tabs)
- React Native Gesture Handler
- React Native Reanimated

Dauer der Entwicklung:
ca. 40 Stunden gesamt über 5 Teammitglieder (Manuel Fink, Alexander Si, Maria Pandolfo, David Bachhofer, Marko Nakev)

Weitere Anmerkungen:

Cloud Declutter ist eine React-Native-App (umgestellt auf Expo), die Nutzer:innen hilft, fragmentierten Cloud-Speicher zu bereinigen. Die App verbindet mehrere Cloud-Dienste (Google Drive, Dropbox, iCloud, OneDrive), erkennt Duplikate, Junk-Dateien und Speicherfresser, und ermöglicht sicheres Löschen mit Rückgängig-Funktion.

Package Name: at.ac.univie.hci.clouddeclutter

Installationsanleitung:

Voraussetzungen: Node.js, Android Studio (mit eingerichtetem Emulator) ODER ein Smartphone mit der "Expo Go" App. Kein Java JDK oder Android SDK zwingend erforderlich auf dem Entwickler-Rechner.

1. Abhängigkeiten installieren:
   npm install

2. App starten:
   npx expo start

3. Testen:
   - Im Android Emulator: Drücken Sie die Taste "a" in der Konsole, nachdem Sie "npx expo start" ausgeführt haben. 
   - Auf einem echten Endgerät: Scannen Sie den generierten QR-Code im Terminal mit der Expo Go App.

Empfohlenes Testgerät: Pixel 6 Emulator (API 36) oder persönliches Smartphone via Expo Go (mit expo SDK 56).
# Technische Notizen: SCSS-Layout und Grid-Struktur im CoinFlux-Projekt

> **Ziel:** Diese Datei dokumentiert technische Entscheidungen, Layoutprinzipien und Breakpoint-Erfahrungen im Zusammenhang mit dem SCSS-basierten Grid-System im Projekt "CoinFlux".

---

## ✨ Einordnung

Diese Datei ist im Verzeichnis `doc/styles/` abgelegt. Sie ist Bestandteil der technischen Dokumentation für das SCSS-Layoutsystem.

---

## ✔️ 24er Grid-System (Eigenentwicklung)

Das verwendete Grid-System basiert auf **24 Spalten** und ist **völlig unabhängig von Bootstrap**. Es kann auch in Projekten verwendet werden, die kein Bootstrap einbinden.

### Merkmale

* Mobile-First: kleinste Viewports erhalten 24 Spalten (`.col--24`)
* Klassenstruktur: `.col--[breakpoint]-[spaltenzahl]`
* Beispiel: `.col--ultra-lg-6` = 6 Spalten auf ultra-großen Displays
* Über SCSS-Variablen und `@each`-Schleifen generiert
* Eigene Breakpoints (siehe unten)
* Namenspräfix `col--` vermeidet Konflikte mit Bootstrap

### Vorteil

* Feingranulare Kontrolle bei responsivem Verhalten
* Saubere Trennung von Bootstrap und Custom Grid

---

## 🌎 Breakpoints & Auflösungserfahrungen

Die Breakpoints gehen weit über die Standardwerte von Bootstrap hinaus.

### Bootstrap Standard (zum Vergleich)

* `xxl`: ab 1400px

### Eigene Breakpoints (CoinFlux)

* `ultra-md`:    ab 1600px
* `ultra-lg`:    ab 1920px
* `ultra-xl`:    ab 2400px  ✔️ **empfohlen** (siehe unten)
* `ultra-xxl`:   ab 2880px
* `ultra-5xl`:   ab 3840px (4K TV etc.)

### Erfahrungswert:

* Viele Monitore mit 2560px Breite nutzen intern eine effektiv nutzbare CSS-Breite von ca. **2550px**.
* Deshalb wurde der Breakpoint `ultra-xl` von ursprünglich `2500px` auf **2400px** reduziert.
* 4K-Auflösung (z. B. 3840px) bedeutet nicht automatisch mehr Breite im CSS-Kontext, da Skalierungseinstellungen (z. B. 125%, 150%) dies beeinflussen.

---

## 📅 Container- und Seitenaufbau

### Strukturierte Layoutbereiche:

* `<div class="layout layout-default" id="layout">`

  * Definiert Grid-Bereiche mit `grid-template-areas`
  * Enthält z. B. `main`, `nav`, `aside`, `footer`

### Modulare Box-Klassen

* `.content-box`

  * Basisklasse für Inhaltsbereiche
  * Modifier z. B. `--main`, `--sidebar-widget-right`, `--footer`, `--footer-bar`

### Dynamische Größenverteilung:

* Der `<main>`-Bereich erhält die **verfügbare Höhe automatisch**, während `footer` und `nav` ihre **eigene Höhe durch Inhalt** bestimmen.

---

## 🔢 SCSS-Dateistruktur

Alle SCSS-Dateien liegen unter `styles/scss/` in strukturierter Form:

```plaintext
styles/
├── scss/
│   ├── abstracts/     # Variablen, Breakpoints, Mixins
│   ├── base/          # Reset, globale Elementstile
│   ├── components/    # Buttons, Boxen, Navigation
│   ├── layouts/       # Grid-Struktur, Layout-Definitionen
│   ├── pages/         # Seitenbezogene Styles
│   ├── tools/         # Hilfsfunktionen (z. B. Grid-Generator)
│   ├── vendors/       # Externe Bibliotheken (z. B. Bootstrap)
│   └── main.scss      # Haupt-Datei (Importiert alles)
```

---

## 📘 Weitere Hinweise

* Die kompilierten CSS-Dateien liegen in `public/styles/`
* Bootstrap ist optional eingebunden, stört das eigene Grid aber **nicht**
* Die eigene Struktur erlaubt später leichten Wechsel zu alternativen CSS-Frameworks

---

**Stand:** 2025-07-04

Diese Datei ist für interne technische Zwecke bestimmt.

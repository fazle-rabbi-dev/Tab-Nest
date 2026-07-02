<p align="center">
  <h1 align="center">TabNest 🧭</h1>
  <p align="center"><em>Vibe-coded tab navigator — keyboard-first, cozy, and minimal.</em></p>
  <p align="center">Switch and manage browser tabs without touching the mouse. Works in Chrome and Firefox.</p>
</p>

---

## Features

- **Keyboard-first** — Open with `Ctrl+Shift+K`, navigate with arrows, select with Enter
- **MRU sorting** — Active tab + top 10 most recently used tabs, sorted by last access
- **Tab management** — Switch to a tab or close one directly from the popup (`Ctrl+K`)
- **Favicon display** — Site favicons with emoji fallbacks when missing
- **Dark cozy theme** — GitHub-dark inspired UI, smooth animations
- **Zero dependencies** — Vanilla JS, no frameworks, no build step

## Usage

| Key | Action |
|-----|--------|
| `Ctrl+Shift+K` | Open TabNest |
| `↑` / `↓` | Navigate tabs |
| `Enter` | Switch to tab |
| `Ctrl+K` | Close selected tab |
| `Escape` | Dismiss |

Click the extension icon in the toolbar to open it as well.

## Install

**Chrome / Chromium**
```
chrome://extensions → Developer mode → Load unpacked → select tab-nest/
```

**Firefox**
```
about:debugging#/runtime/this-firefox → Load Temporary Add-on → select firefox/manifest.json
```

## Structure

```
tab-nest/
├── manifest.json         # Chrome version
├── background.js
├── popup.html
├── popup.js
├── popup.css
├── icons/
├── firefox/              # Firefox version
│   ├── manifest.json
│   ├── background.js
│   ├── popup.html
│   ├── popup.js
│   ├── popup.css
│   └── icons/
└── README.md
```

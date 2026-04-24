# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Pomodoro Timer (番茄钟) — an Electron desktop app with a circular progress ring UI. Supports work/short-break/long-break cycles (25/5/15 min), auto-phase switching, desktop notifications, and a completed-pomodoro dot tracker.

## Tech Stack

- Electron (v41.x) with contextIsolation enabled
- Pure HTML/CSS/JS — no framework, no bundler, no TypeScript

## Architecture

Single-window Electron app with three files:

- `main.js` — Electron main process. Creates a fixed-size BrowserWindow (400×520), loads `index.html`.
- `preload.js` — Context bridge (currently exposes empty API).
- `renderer.js` — All timer logic runs here: countdown, phase transitions, SVG ring animation (`stroke-dashoffset`), and `Notification` API calls. Constants at top define durations.
- `styles.css` — Themed UI with phase-specific colors (red=work, green=short-break, blue=long-break).

All rendering is DOM-based with `getElementById` — no virtual DOM or templating.

## Commands

```bash
# Install dependencies
npm install

# Run the app
npm start
```

No test suite, linter, or build step is configured.

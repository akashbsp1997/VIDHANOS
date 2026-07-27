# VIDHANOS

Offline-first legal case management, installable to a phone's home screen as a Progressive Web App.

## What it does

- Fully offline: cases, clients, opponents, hearings/deadlines, documents (with PDF/EXIF metadata extraction), and citations are all stored locally in the browser (IndexedDB via Dexie.js) — no backend, no account, no sync.
- Calendar with an in-app Overdue/Today/This Week view (browsers have no reliable background-alarm API without a push server, so reminders are always-correct-when-opened rather than guaranteed background notifications).
- AI Guidance: reads an uploaded document and suggests relevant government departments, legal mechanisms, and forums, with a clarifying-question loop. Requires an internet connection and a Gemini API key (Settings).
- eCourts: opens the official case-status site in a new tab for the user to look up manually (no cross-origin scraping is possible from a browser).
- Citations: searches Indian Kanoon when a token is configured (Settings); falls back to manual entry if the API call fails (e.g. CORS).
- Settings: API key management, storage usage, `navigator.storage.persist()`, and a zip export/import backup — the real backup mechanism, since IndexedDB storage isn't guaranteed durable (especially in Safari).

## Development

```sh
npm install
npm run dev       # dev server
npm run build     # production build (tsc -b && vite build)
npm run preview   # serve the production build over localhost, needed to test service worker/installability
```

Service workers only register over HTTPS or `localhost`, so use `npm run preview` (not `npm run dev`) to verify offline behavior and "Add to Home Screen" locally.

## Stack

Vite + React + TypeScript, Dexie.js (IndexedDB) for storage, `react-router` for routing, `vite-plugin-pwa` (Workbox) for the manifest/service worker, `pdf-lib` + `exifr` for document metadata, `@google/genai` for AI guidance.

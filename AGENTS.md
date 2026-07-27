# VIDHANOS

Offline-first legal case management PWA. Vite + React + TypeScript, Dexie.js (IndexedDB) for
storage, `react-router` for routing, `vite-plugin-pwa` for the manifest/service worker.

- Service workers only register over HTTPS or `localhost` — use `npm run build && npm run preview`
  (not `npm run dev`) to test offline behavior or installability.
- All app data (cases, clients, documents, etc.) lives in the browser's IndexedDB via Dexie
  (`src/db/schema.ts`). There is no backend — API keys (Gemini, Indian Kanoon) are entered by the
  user in Settings and stored client-side in the same database.
- `npx tsc -b --noEmit` for type-checking; `npx oxlint src` for linting.

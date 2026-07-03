# Frontend

React + TypeScript + Vite frontend for the realtime dashboard.

## Important Commands

Run from repository root:

```bash
npm -w packages/frontend run dev
npm -w packages/frontend run build
npm -w packages/frontend run test
npm -w packages/frontend run lint
```

## Env Variables

- `VITE_WS_URL` is the base WebSocket URL (used in production and as a fallback in development).

## Structure

- `src/pages` - route-level UI
- `src/modules` - feature modules (dashboard, connection)
- `src/contexts` - dashboard state providers
- `src/hooks` - socket and data logic

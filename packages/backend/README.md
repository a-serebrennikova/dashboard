# Backend

Node.js + TypeScript backend for realtime dashboard data and WebSocket streaming. Express handles HTTP routes; the HTTP server also serves the WebSocket endpoint.

## Scripts

Run from repository root:

```bash
npm -w packages/backend run dev
npm -w packages/backend run build
npm -w packages/backend run seed
npm -w packages/backend run start
```

## Env Variables

- `DATABASE_URL` - PostgreSQL connection string (`postgres://` or `postgresql://`).

Optional:

- `PORT` - HTTP/WebSocket server port. Default: `8080`.
- `LOG_LEVEL` - one of `error`, `warn`, `info`, `debug`. Default: `error`.
- `CORS_ALLOWED_ORIGINS` - comma-separated allowlist for HTTP API origins.

## Notes

- `dev` and `seed` scripts load env from `packages/backend/.env` via `dotenv-cli`.
- Apply the SQL migrations in `packages/backend/migrations` to your PostgreSQL database before running the backend.
- `prebuild` compiles `packages/shared` before backend build.

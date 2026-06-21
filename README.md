# Dashboard

A simple project built with React and Node.js using WebSockets.

## Overview

This app demonstrates a basic real-time dashboard using:

- `React` for the frontend
- `Node.js` for the backend
- `WebSocket` communication between client and server

## Purpose

Created as a learning project to practice:

- creating a Node.js WebSocket server
- sending live updates through WebSockets

## Structure

- `frontend/` — React application
- `backend/` — Node.js WebSocket server

## Environment Variables

### Backend

See [backend/.env.example](backend/.env.example).

- `PORT` — HTTP/WebSocket server port
- `NODE_ENV` — `development` or `production`

### Frontend

See [frontend/.env.production.example](frontend/.env.production.example).

- `VITE_WS_URL` — public WebSocket URL used by the app in production

## Health Check

Backend exposes a health endpoint:

- `GET /health` returns `200` with `{ "status": "ok" }`

This is useful for hosting providers such as Render.

## Deployment Checklist

1. Deploy backend (Render):
   - Root directory: `backend`
   - Build command: `npm ci && npm run build`
   - Start command: `npm run start`
2. Copy deployed backend URL and configure frontend env:
   - `VITE_WS_URL=wss://<your-backend-host>`
3. Deploy frontend (Vercel):
   - Root directory: `frontend`
   - Build command: `npm run build`
   - Output directory: `dist`
4. Verify:
   - Frontend opens successfully
   - WebSocket connection is established
   - `https://<backend-host>/health` returns `200`

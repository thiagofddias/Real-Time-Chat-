# EnternessProject – Real-Time Chat

A real-time chat application built with NestJS (backend) and React + Vite (frontend) using Socket.IO.

## Requirements

- Node.js >= 18
- npm (or yarn/pnpm)

## Quick Start

In two separate terminals:

Backend:

```powershell
cd backend
npm install
$env:FRONTEND_ORIGIN = "http://localhost:5173"  # optional
npm run start:dev
```

Frontend:

```powershell
cd frontend
npm install
# $env:VITE_BACKEND_URL = "http://localhost:3000"  # optional
npm run dev
```

Access the frontend at http://localhost:5173. Open multiple tabs/windows to simulate different users.

## Environment Variables

- Backend
  - `FRONTEND_ORIGIN`: allowed CORS origin. Default: `http://localhost:5173`.
- Frontend
  - `VITE_BACKEND_URL`: Socket.IO server URL. Default: `http://localhost:3000`.

## Features

- Simple login with display name (saved in `localStorage`).
- Real-time messaging via Socket.IO.
- User join/leave notifications.
- Message list with auto-scroll.
- Responsive dark-mode UI.
- Conversation start time displayed in system locale format.

## Useful Scripts

Backend:

- `npm run start:dev` – development with watch
- `npm run build` – production build

Frontend:

- `npm run dev` – Vite development server
- `npm run build` – production build

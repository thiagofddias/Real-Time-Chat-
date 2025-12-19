# Real-Time Chat

A real-time chat application built with NestJS (backend) and React + Vite (frontend) using Socket.IO.

## Quick Start

In two separate terminals:

Backend:

```powershell
cd backend
copy .env.example .env
npm install
npm run start:dev
```

Frontend:

```powershell
cd frontend
copy .env.example .env
npm install
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
- Responsive UI.

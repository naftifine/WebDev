# WebDev

WebDev is a web application for searching and analyzing Vietnamese high-school
graduation exam scores from 2024. The repository contains an Express API backed
by MongoDB and a React/Vite dashboard.

## Demo

- Frontend: [https://webdev-frontend.fly.dev](https://webdev-frontend.fly.dev)
- Backend API: [https://webdev-backend.fly.dev](https://webdev-backend.fly.dev)

## Project structure

```text
WebDev/
├── WebDev-Backend/     # Express + TypeScript + MongoDB API
└── WebDev-Frontend/    # React + Vite dashboard
```

## Prerequisites

- Node.js 22 or newer
- npm
- MongoDB, either local or a MongoDB Atlas database

## Run locally

### 1. Start the backend

Create `WebDev-Backend/.env`:

```env
MONGO_DB=YOUR_MONGO_DB
MONGO_DB_NAME=YOUR_MONGO_DB_NAME
PORT=3000
```

Install dependencies and start the development server:

```powershell
cd WebDev-Backend
npm i
npm run dev
```

The API is available at `http://localhost:3000`. To initialize the database
with the CSV data, run these commands once while MongoDB is running:

```powershell
npm run migrate
npm run seed
```

### 2. Start the frontend

Create `WebDev-Frontend/.env`:

```env
VITE_API_URL=http://localhost:3000
```

In a second terminal, install dependencies and start Vite:

```powershell
cd WebDev-Frontend
npm i
npm run dev
```

Open the local URL printed by Vite, usually
`http://localhost:5173`.

## Useful commands

### Backend

```powershell
npm run build
npm run dev
```

### Frontend

```powershell
npm run build
npm test
```

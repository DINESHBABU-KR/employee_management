# Employee Management App

This project has two parts:

- `backend` - Node.js, Express, MongoDB API
- `my-app` - React/Vite frontend

## Requirements

- Node.js
- npm
- MongoDB running locally or a MongoDB connection string

## Backend Setup

Open a terminal from the project root:

```bash
cd backend
npm install
```

Create or update `backend/.env.local`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/auth_module
JWT_SECRET=RAnDomKeyForrInterVIEW@!
JWT_EXPIRES_IN=7d
```

Start the backend:

```bash
npm start
```

Backend runs on:

```text
http://localhost:5000
```

## Frontend Setup

Open another terminal from the project root:

```bash
cd my-app
npm install
```

Optional: create `my-app/.env` if your backend URL is different:

```env
VITE_API_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

Frontend runs on the Vite URL shown in the terminal, usually:

```text
http://localhost:5173
```

## How To Run The Full App

1. Start MongoDB.
2. Start backend:

```bash
cd backend
npm start
```

3. Start frontend in a second terminal:

```bash
cd my-app
npm run dev
```

4. Open the frontend URL in the browser.

## App Flow

- Register a user from `/register`
- Login from `/`
- After login, the JWT token is stored in browser storage
- Authenticated users are redirected to `/dashboard`
- Dashboard supports employee listing, create, edit, delete, search, and filters
- Logout clears the stored token and redirects to login

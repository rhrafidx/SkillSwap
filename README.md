# SkillSwap — Backend API

A simple, modular Node.js + Express REST API for SkillSwap, using **PostgreSQL** and **Prisma**.

Each feature (auth, skills, exchanges, messages, contact) lives in its own folder with the same three files — `routes → controller → service` — so it's easy to find things and add new features.

---

## Contents

1. [Folder structure](#folder-structure)
2. [Get a PostgreSQL URL from Render](#1-get-a-postgresql-url-from-render)
3. [Run the backend locally](#2-run-the-backend-locally)
4. [Run the frontend locally](#3-run-the-frontend-locally)
5. [Deploy the backend to Render](#4-deploy-the-backend-to-render)
6. [Deploy the frontend to Render](#5-deploy-the-frontend-to-render)
7. [API endpoints](#api-endpoints)

---

## Folder structure

```
client/
├── app/                      Premium Next.js app router experience
├── components/               JSX-driven UI sections
├── lib/                      API helpers and mock data fallbacks
├── public/                   Static assets
└── package.json              Next.js + Jest setup

server/
├── prisma/
│   ├── schema.prisma          Database models
│   ├── migrations/            SQL that creates the tables
│   └── seed.js                Optional demo data
├── src/
│   ├── index.js               Starts the server
│   ├── app.js                 Builds the Express app (CORS, JSON, routes, errors)
│   ├── routes.js              Combines all feature routes under /api
│   ├── config/                env + shared Prisma client
│   ├── middleware/            auth check + error handler
│   ├── utils/                 small helpers (JWT, async, errors)
│   └── modules/               auth · skills · exchanges · messages · contact
└── .env.example               Copy to .env and fill in
```

---

## 1. Get a PostgreSQL URL from Render

You only need to do this once. Render gives you a free managed PostgreSQL database.

1. Go to **https://dashboard.render.com** and sign in (or sign up — it's free).
2. Click **New +** (top right) → **Postgres**.
3. Give it a **Name** (e.g. `skillswap-db`), pick a **Region** close to you, and choose the **Free** instance type.
4. Click **Create Database** and wait a minute until its status is **Available**.
5. Open the database and scroll to the **Connections** section. You'll see two URLs:
   - **Internal Database URL** — use this for the backend once it's *also* deployed on Render (same region).
   - **External Database URL** — use this to connect from **your own computer** (local development and running migrations).
6. Copy the **External Database URL**. It looks like:
   ```
   postgresql://skillswap_user:somepassword@dpg-xxxxx.oregon-postgres.render.com/skillswap_db
   ```

> **Prisma + Render tip:** External connections to Render require SSL. Add `?sslmode=require` to the end of the URL, e.g.
> `postgresql://...render.com/skillswap_db?sslmode=require`

---

## 2. Run the backend locally

From the `server/` folder:

```bash
# 1. Install dependencies
npm install

# 2. Create your .env file
#    Windows (Command Prompt):  copy .env.example .env
#    Mac/Linux:                 cp .env.example .env
```

Open `.env` and paste your Render **External Database URL** into `DATABASE_URL`,
and change `JWT_SECRET` to any long random string:

```
DATABASE_URL="postgresql://...render.com/skillswap_db?sslmode=require"
JWT_SECRET="some-long-random-string"
```

Then create the tables and start the server:

```bash
# 3. Create the database tables
npx prisma migrate dev --name init

# 4. (optional) Add demo data — login: aisha@example.com / password123
npm run db:seed

# 5. Start the server (auto-reloads on changes)
npm run dev
```

You should see `🚀 SkillSwap API running at http://localhost:4000`.
Check it: open **http://localhost:4000/api/health** → `{"status":"ok"}`.

---

## 3. Run the frontend locally

The premium frontend now lives in `client/` as a Next.js + JSX app. From the **client** folder:

```bash
npm install
cp .env.example .env.local
npm run dev
```

Then open **http://localhost:3000**.

The client uses `NEXT_PUBLIC_API_BASE_URL` (defaulting to `http://localhost:4000/api`) to talk to the backend from step 2. Keep the backend running and the sign-in, registration, and contact forms will work against the real API.

For verification, run:

```bash
npm test
npm run build
```

---

## 4. Deploy the backend to Render

1. Push this project to a GitHub repository.
2. In the Render dashboard: **New +** → **Web Service** → connect your repo.
3. Configure it:
   - **Root Directory:** `server`
   - **Runtime:** Node
   - **Build Command:** `npm install && npx prisma generate && npx prisma migrate deploy`
   - **Start Command:** `npm start`
   - **Region:** the same one as your database.
4. Under **Environment**, add these variables:

   | Key | Value |
   |-----|-------|
   | `DATABASE_URL` | your Render **Internal Database URL** (from step 1) |
   | `JWT_SECRET` | a long random string |
   | `CORS_ORIGIN` | your frontend URL (fill in after step 5), e.g. `https://skillswap-web.onrender.com` |

   > `PORT` is set automatically by Render — you don't need to add it.

5. Click **Create Web Service**. When it finishes, your API is live at something like
   `https://skillswap-api.onrender.com`. Test `…/api/health`.

> If `prisma migrate deploy` ever fails, you can switch the Build Command to use
> `npx prisma db push` instead — it creates the tables directly from the schema.

---

## 5. Deploy the frontend to Render

1. In the Render dashboard: **New +** → **Static Site** → connect the same repo.
2. Configure it:
   - **Root Directory:** leave blank (project root)
   - **Build Command:** leave blank (nothing to build)
   - **Publish Directory:** `.`
3. Click **Create Static Site**. It deploys at something like
   `https://skillswap-web.onrender.com` (open `/pages/index.html`).
4. **Point the frontend at your live API:** open `assets/js/api.js`, set
   `PROD_API_BASE` to your backend URL, and push the change:
   ```js
   const PROD_API_BASE = 'https://skillswap-api.onrender.com';
   ```
5. **Allow the frontend in CORS:** back on the backend web service, set the
   `CORS_ORIGIN` env var to your static site URL (from step 3) and let it redeploy.

That's it — the deployed frontend now talks to the deployed backend.

---

## API endpoints

All routes are prefixed with `/api`. Protected routes (✔) need an
`Authorization: Bearer <token>` header — you get the token from login/register.

| Method | Path | Auth | What it does |
|--------|------|------|--------------|
| GET  | `/health` | — | Health check |
| POST | `/auth/register` | — | Create an account, returns `{ user, token }` |
| POST | `/auth/login` | — | Log in, returns `{ user, token }` |
| GET  | `/auth/me` | ✔ | Current logged-in user |
| GET  | `/skills` | — | List skills. Supports `?q=` and `?category=` |
| GET  | `/skills/:id` | — | One skill |
| POST | `/skills` | ✔ | Create a skill |
| POST | `/exchanges` | ✔ | Request an exchange for a skill |
| GET  | `/exchanges/sent` | ✔ | Requests you sent |
| GET  | `/exchanges/received` | ✔ | Requests others sent you |
| PATCH| `/exchanges/:id/status` | ✔ | Accept / decline a request |
| GET  | `/messages` | ✔ | Your conversation list |
| GET  | `/messages/:userId` | ✔ | Full chat with one user |
| POST | `/messages` | ✔ | Send a message |
| POST | `/contact` | — | Submit the contact form |

---

## Notes

- Passwords are hashed with bcrypt — plain passwords are never stored.
- CORS is open (`*`) by default for easy local development; set `CORS_ORIGIN`
  to your frontend URL in production.
- Render's Free database and web service can sleep/expire — fine for testing,
  upgrade for anything real.
- `test-e2e.js` is a small smoke test that boots the app and hits every
  endpoint. Run it against a test database with `node test-e2e.js`.

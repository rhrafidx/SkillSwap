# SkillSwap — Backend API

A simple, modular Node.js + Express REST API for SkillSwap, using **PostgreSQL** and **Prisma**.

The code is organised so each feature (auth, skills, exchanges, messages, contact) lives in its own folder with the same three files: routes → controller → service. This makes it easy to find things and add new features.

---

## Folder structure

```
server/
├── prisma/
│   ├── schema.prisma          Database models (User, Skill, Exchange, Message, ContactMessage)
│   ├── migrations/            SQL to create the tables
│   └── seed.js                Optional demo data
├── src/
│   ├── index.js               Starts the server
│   ├── app.js                 Builds the Express app (CORS, JSON, routes, errors)
│   ├── routes.js              Combines all feature routes under /api
│   ├── config/
│   │   ├── env.js             Reads .env in one place
│   │   └── prisma.js          Shared Prisma database client
│   ├── middleware/
│   │   ├── auth.js            Checks the login token on protected routes
│   │   └── errorHandler.js    Turns errors into clean JSON responses
│   ├── utils/
│   │   ├── ApiError.js        Error with an HTTP status code
│   │   ├── asyncHandler.js    Lets controllers use async/await safely
│   │   └── token.js           Create / verify JWT login tokens
│   └── modules/
│       ├── auth/              register, login, me
│       ├── skills/            list, search, view, create skills
│       ├── exchanges/         request an exchange, accept/decline
│       ├── messages/          chat conversations and messages
│       └── contact/           public contact form
└── .env.example               Copy to .env and fill in
```

Each module folder contains:

- `*.routes.js` — the URLs
- `*.controller.js` — reads the request, sends the response
- `*.service.js` — the actual logic and database calls

---

## Getting started

**1. Install dependencies**

```bash
cd server
npm install
```

**2. Set up your environment**

```bash
cp .env.example .env
```

Then open `.env` and paste in your PostgreSQL connection string (the `DATABASE_URL` you'll provide) and change `JWT_SECRET` to any long random string.

**3. Create the database tables**

```bash
npx prisma migrate dev --name init
```

(Or, if you prefer to just push the schema without migration files: `npx prisma db push`.)

**4. (Optional) Add demo data**

```bash
npm run db:seed
```

Demo login after seeding: `aisha@example.com` / `password123`

**5. Run the server**

```bash
npm run dev      # auto-reloads on changes
# or
npm start        # plain start
```

You should see: `🚀 SkillSwap API running at http://localhost:4000`
Check it: open `http://localhost:4000/api/health` → `{"status":"ok"}`

---

## API endpoints

All routes are prefixed with `/api`. Protected routes need an
`Authorization: Bearer <token>` header (you get the token from login/register).

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

## How the frontend connects

The frontend talks to this API through `assets/js/api.js`, which points at
`http://localhost:4000/api`. If you host the API somewhere else, change the
`API_BASE` value at the top of that file. The login and register pages already
store the returned token and use it automatically on protected requests.

---

## Notes

- Passwords are hashed with bcrypt — plain passwords are never stored.
- CORS is open (`*`) by default for easy local development; set `CORS_ORIGIN`
  in `.env` to your frontend URL before going live.
- `test-e2e.js` is a small smoke test that boots the app and hits every
  endpoint. Run it against a test database with `node test-e2e.js`.

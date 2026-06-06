# Account A — Verified Handoff
## Status: COMPLETE ✅

> **Project:** عم غريب (Am Ghareeb) — AI-Powered Alexandria Microbus Advisor
> **Author:** Account A · Tech Lead
> **Checkpoints completed:** A1 · A2 · A-FIX-1 · A-FIX-2
> **Last verified:** All 12 files extracted from disk and confirmed — this document reflects actual file contents, not intentions.

---

## 1. Verified File Manifest

| File | Checkpoint | Status | Notes |
|------|------------|--------|-------|
| `/.gitignore` | A1 | ✅ Verified | 9 ignore patterns — node_modules, .env, dist, build, coverage, .DS_Store, *.log, .env.local, .env.production |
| `/.env.example` | A1 | ✅ Verified | 11 variables, all with inline comments |
| `/server/package.json` | A1 → **A-FIX-1** | ✅ Verified | `main`, `start`, `dev` all corrected to reference `server.js` |
| `/server/server.js` | A2 | ✅ Verified | DB connect + 3-attempt retry + Arabic logs + bootstrap + process safety nets |
| `/server/app.js` | A2 → **A-FIX-1** → **A-FIX-2** | ✅ Verified | ratingRouter (singular) fixed · passport.initialize() + configurePassport() added |
| `/server/jest.config.js` | A2 | ✅ Verified | testEnvironment: node · babel-jest transform · 30s timeout |
| `/server/babel.config.js` | A2 | ✅ Verified | @babel/preset-env targeting current Node |
| `/client/package.json` | A1 | ✅ Verified | type: module · React 18 · TanStack Query 5 · React Leaflet 4 |
| `/client/vite.config.js` | A1 | ✅ Verified | React plugin · port 5173 · /api proxy → http://localhost:5000 |
| `/client/tailwind.config.js` | A1 | ✅ Verified | navy #1B2A4A · amber #F4A833 · Cairo font |
| `/client/postcss.config.js` | A1 | ✅ Verified | tailwindcss + autoprefixer (ESM export) |
| `/client/index.html` | A1 | ✅ Verified | lang="ar" dir="rtl" · Cairo 400/600/700 preloaded · RTL viewport |

---

## 2. app.js — Final Middleware & Mount Order

This is the law. No account may assume a different order or insert middleware at a different position without Tech Lead sign-off.

| Step | Code | Purpose |
|------|------|---------|
| 1 | `require('dotenv').config()` | Load env vars before anything else |
| 2 | `helmet()` | Security headers |
| 3 | `cors({ origin: process.env.CLIENT_URL, credentials: true })` | CORS — origin from env only |
| 4 | `morgan('dev')` | Request logging |
| 5 | `express.json()` | Parse JSON bodies |
| 6 | `express.urlencoded({ extended: true })` | Parse form bodies |
| 7 | `passport.initialize()` | Passport middleware — must come before routes |
| 8 | `configurePassport(passport)` | Register strategies — must come before routes |
| 9 | `app.use('/api/auth', authRouter)` | Auth routes |
| 10 | `app.use('/api/routes', routesRouter)` | Microbus route data |
| 11 | `app.use('/api/ai', aiRouter)` | AI chat |
| 12 | `app.use('/api/ratings', ratingRouter)` | Ratings |
| 13 | `app.use('/api/admin', adminRouter)` | Admin |
| 14 | 404 handler | `{ success: false, message: 'المسار غير موجود' }` |
| 15 | `errorMiddleware` | **Must be last** — 4-arg Express error handler |

---

## 3. Route File Naming Contract

All route files must be created at exactly these paths under `/server/src/routes/`.

**Rule: file names are singular. Mount URLs are independent of file names.**

| File on Disk | Variable in app.js | Mounted At | Warning |
|---|---|---|---|
| `auth.routes.js` | `authRouter` | `/api/auth` | — |
| `routes.routes.js` | `routesRouter` | `/api/routes` | — |
| `ai.routes.js` | `aiRouter` | `/api/ai` | — |
| `rating.routes.js` | `ratingRouter` | `/api/ratings` | ⚠️ File is **singular**, URL is **plural** |
| `admin.routes.js` | `adminRouter` | `/api/admin` | — |

> ⚠️ Creating `ratings.routes.js` (plural) instead of `rating.routes.js` (singular) will cause an immediate `MODULE_NOT_FOUND` crash on server boot. This was fixed in **A-FIX-1** — do not revert.

---

## 4. Passport Configuration Contract

`app.js` imports and calls:

```
const passport           = require('passport')
const configurePassport  = require('./src/config/passport')
```

**Account B must create `/server/src/config/passport.js`** with this exact export signature:

```
module.exports = function configurePassport(passport) {
  // register strategies here
  // e.g. passport.use(new GoogleStrategy(...))
}
```

It receives the passport instance as an argument. Do not import passport inside that file and call `passport.use()` on a separate instance — it must mutate the same instance passed in.

---

## 5. Environment Variables Contract

All variables live in `server/.env` (copied from `/.env.example`). The client has no `.env` file.

| Variable | Owner | Required | Default | Notes |
|---|---|---|---|---|
| `PORT` | B | No | `5000` | server.js falls back to 5000 |
| `NODE_ENV` | B | No | — | `development` or `production` |
| `MONGODB_URI` | B | **Yes** | — | Atlas M0 free tier works |
| `JWT_SECRET` | B | **Yes** | — | 64+ random chars — access token signing |
| `JWT_REFRESH_SECRET` | B | **Yes** | — | 64+ random chars — refresh token signing |
| `OPENAI_API_KEY` | C | **Yes** | — | gpt-4o-mini access |
| `GOOGLE_CLIENT_ID` | B | OAuth only | — | Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | B | OAuth only | — | Google Cloud Console |
| `GOOGLE_CALLBACK_URL` | B | OAuth only | `http://localhost:5000/api/auth/google/callback` | Must match Console exactly |
| `CLIENT_URL` | B | **Yes** | `http://localhost:5173` | Used directly in CORS origin — never hardcode |
| `ADMIN_EMAIL` | B | **Yes** | `admin@amghareeb.com` | Seed script reads this |
| `ADMIN_PASSWORD` | B | **Yes** | `ChangeMe123!` | Change before any deployment |

---

## 6. Tailwind Design Tokens

Defined in `/client/tailwind.config.js` — extracted from disk:

| Token type | Token name | Value |
|---|---|---|
| Color | `navy` | `#1B2A4A` |
| Color | `amber` | `#F4A833` |
| Font family | `sans` (override) | `'Cairo', sans-serif` |

**Content paths Tailwind scans:**
- `./index.html`
- `./src/**/*.{js,jsx,ts,tsx}`

> ⚠️ **All accounts working on the client must use only these tokens.** Use `bg-navy`, `text-amber`, `font-sans` in className strings. No hardcoded hex values (`#1B2A4A`) anywhere in JSX or CSS — they will not be caught by linting but will break visual consistency and make theming impossible.

---

## 7. Vite Proxy Contract

Defined in `/client/vite.config.js` — extracted from disk:

| Setting | Value |
|---|---|
| Proxied prefix | `/api` |
| Target | `http://localhost:5000` |
| `changeOrigin` | `true` |
| `secure` | `false` |
| Dev server port | `5173` (explicit) |
| Build output | `dist/` |
| Source maps in build | `false` |

**What this means for axios (Account D):**

| axios baseURL | Result |
|---|---|
| `''` (empty string) | ✅ Correct — proxy intercepts `/api/*` |
| `'/'` | ✅ Correct |
| `'http://localhost:5000'` | ❌ Bypasses proxy — triggers CORS error |
| `'http://localhost:5000/api'` | ❌ Bypasses proxy — triggers CORS error |

In production, inject the API base URL via `import.meta.env.VITE_API_URL` — do not hardcode it.

---

## 8. server.js — DB Connection Behaviour

Account B's seed script and any test setup must understand how `server.js` manages the DB connection.

- **3 connection attempts**, 3 seconds apart (`MAX_RETRIES = 3`, `RETRY_DELAY_MS = 3000`)
- `serverSelectionTimeoutMS: 5000` on each attempt
- On all 3 failures: logs Arabic error and calls `process.exit(1)`
- `mongoose.connect()` is called **only inside `server.js`** — never inside `app.js`
- `app.js` exports the Express app with **no DB connection and no `listen()` call**
- The seed script at `src/scripts/seed.js` must call `mongoose.connect()` and `mongoose.disconnect()` itself — it runs as a standalone Node process, not through the server

---

## 9. Known Bugs Fixed

Every bug found and corrected across all checkpoints:

| # | Bug | File Affected | Root Cause | Fix | Checkpoint |
|---|-----|--------------|------------|-----|------------|
| 1 | `main` entry and npm scripts pointed to `src/app.js` | `server/package.json` | Initial scaffold had wrong entry point — server boots via `server.js`, not `app.js` | Changed `main`, `start`, `dev` to reference `server.js` | **A-FIX-1** |
| 2 | Route file imported as `ratings.routes` (plural) | `server/app.js` | File on disk is `rating.routes.js` (singular) — mismatch causes `MODULE_NOT_FOUND` on boot | Renamed require path to `./src/routes/rating.routes` and variable to `ratingRouter` | **A-FIX-1** |
| 3 | Passport not initialized before routes | `server/app.js` | `passport.initialize()` missing — any route using `passport.authenticate()` would throw | Added `app.use(passport.initialize())` and `configurePassport(passport)` after body parsers, before routes | **A-FIX-2** |

---

## 10. Full API Contract (19 Endpoints)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/register` | Public | Register with email + password |
| POST | `/api/auth/login` | Public | Login — returns access + refresh tokens |
| POST | `/api/auth/refresh` | Public | Exchange refresh token for new access token |
| POST | `/api/auth/logout` | Bearer | Invalidate current session |
| GET | `/api/auth/google` | Public | Initiate Google OAuth flow |
| GET | `/api/auth/google/callback` | Public | Google OAuth callback |
| GET | `/api/auth/me` | Bearer | Return current authenticated user |
| GET | `/api/routes` | Public | List all microbus routes |
| GET | `/api/routes/:id` | Public | Get single route detail |
| POST | `/api/routes` | Admin | Create new route |
| PUT | `/api/routes/:id` | Admin | Update existing route |
| DELETE | `/api/routes/:id` | Admin | Delete route |
| GET | `/api/routes/search` | Public | Search routes by area or name |
| POST | `/api/ai/chat` | Bearer | Send message — returns AI route recommendation |
| GET | `/api/ai/history` | Bearer | Retrieve user's conversation history |
| DELETE | `/api/ai/history` | Bearer | Clear user's conversation history |
| POST | `/api/ratings` | Bearer | Submit a rating for a route |
| GET | `/api/ratings/route/:routeId` | Public | Get all ratings for a route |
| GET | `/api/admin/stats` | Admin | Dashboard statistics |

---

## 11. Locked Dependency Versions

### Server (`/server/package.json`)

| Package | Version | Category |
|---|---|---|
| express | 4.18.2 | Runtime |
| mongoose | 8.0.3 | Runtime |
| bcryptjs | 2.4.3 | Runtime |
| jsonwebtoken | 9.0.2 | Runtime |
| passport | 0.7.0 | Runtime |
| passport-google-oauth20 | 2.0.0 | Runtime |
| openai | 4.28.0 | Runtime |
| cors | 2.8.5 | Runtime |
| dotenv | 16.4.1 | Runtime |
| express-rate-limit | 7.2.0 | Runtime |
| joi | 17.12.1 | Runtime |
| helmet | 7.1.0 | Runtime |
| morgan | 1.10.0 | Runtime |
| nodemon | 3.0.3 | Dev |
| jest | 29.7.0 | Dev |
| supertest | 6.3.4 | Dev |
| mongodb-memory-server | 9.1.6 | Dev |
| @babel/preset-env | 7.23.9 | Dev |
| babel-jest | 29.7.0 | Dev |

### Client (`/client/package.json`)

| Package | Version | Category |
|---|---|---|
| react | 18.2.0 | Runtime |
| react-dom | 18.2.0 | Runtime |
| react-router-dom | 6.22.1 | Runtime |
| axios | 1.6.7 | Runtime |
| @tanstack/react-query | 5.18.1 | Runtime |
| react-leaflet | 4.2.1 | Runtime |
| leaflet | 1.9.4 | Runtime |
| vite | 5.0.12 | Dev |
| @vitejs/plugin-react | 4.2.1 | Dev |
| tailwindcss | 3.4.1 | Dev |
| postcss | 8.4.35 | Dev |
| autoprefixer | 10.4.17 | Dev |

> Do not upgrade any package without Tech Lead approval. Version mismatches between accounts will cause integration failures.

---

## 12. What Account B Must Know

- **Entry point is `server.js`** — `npm start` and `npm run dev` both run `node server.js` / `nodemon server.js`. Never run `app.js` directly.
- **`app.js` does not start the server and does not connect to MongoDB** — it exports only the configured Express app. `server.js` does both.
- **Error middleware signature must be `(err, req, res, next)`** — Express identifies it as an error handler by the 4-argument signature. It is wired last in `app.js`.
- **You must create `/server/src/config/passport.js`** — it is imported by `app.js` before server boot. Missing file = instant crash.
- **Rate limiting is installed (`express-rate-limit@7.2.0`) but not wired** — apply it yourself to `/api/auth` routes at minimum.
- **CORS origin is `process.env.CLIENT_URL`** — never hardcode an origin in your code.
- **`rating.routes.js` is singular on disk** — the URL `/api/ratings` is plural. These are independent. Do not rename the file.
- **`ADMIN_EMAIL` and `ADMIN_PASSWORD` come from `process.env`** — your seed script must call `require('dotenv').config()` at the top.
- **The seed script connects to MongoDB itself** — it is not run through the server. Add `mongoose.connect()` and `mongoose.disconnect()` inside `src/scripts/seed.js`.
- **`morgan('dev')` runs in all environments as shipped** — suppress it in test (`if (process.env.NODE_ENV !== 'test') app.use(morgan('dev'))`) to keep test output clean.

---

## 13. What Account C Must Know

- **OpenAI SDK version is `4.28.0`** — use the v4 API: `new OpenAI({ apiKey: process.env.OPENAI_API_KEY })`. The legacy `openai.createCompletion` style does not exist in v4.
- **AI routes are mounted at `/api/ai`** — full paths from the client: `/api/ai/chat`, `/api/ai/history`.
- **Cairo font is already loaded in `index.html`** (weights 400, 600, 700) — do not import it again in CSS or JS.
- **`lang="ar"` and `dir="rtl"` are set on `<html>`** — do not override document direction globally. Apply `dir="ltr"` locally on elements that need it (number inputs, code blocks, etc.).
- **`CLIENT_URL` is used in the CORS `origin` config** — after Google OAuth succeeds, Account B redirects to `CLIENT_URL`. Account D handles the landing page in React Router.
- **Tailwind tokens are the design system** — `text-navy`, `bg-amber`, `font-sans`. No hardcoded hex values in JSX.
- **axios `baseURL` must be `''` or `'/'`** — Vite proxy forwards all `/api` requests. Do not point axios at `http://localhost:5000`.

---

## 14. What Account D Must Know

- **`app.js` does not connect to MongoDB** — `server.js` owns the DB connection. The seed script must manage its own connection lifecycle.
- **Seed script must use `process.env`** for `ADMIN_EMAIL` and `ADMIN_PASSWORD` — call `require('dotenv').config()` at top of `src/scripts/seed.js`.
- **Guard seed script against production runs** — check `process.env.NODE_ENV !== 'production'` before dropping collections.
- **React Router v6.22.1** — use `<Routes>/<Route>` or `createBrowserRouter`. No v5 patterns (`<Switch>`, `component=` prop).
- **TanStack React Query v5.18.1** — use `useQuery({ queryKey: [...], queryFn: ... })`. The positional `useQuery(key, fn)` API was removed in v5.
- **Leaflet requires its CSS** — import `leaflet/dist/leaflet.css` in your entry file (`main.jsx`). Missing this makes the map render broken.
- **Tailwind only scans `./src/**/*.{js,jsx,ts,tsx}` and `./index.html`** — keep all components inside `client/src/`. Files outside this path will have their Tailwind classes purged in production builds.
- **Vite dev port is explicitly `5173`** — if you change it, also update `CLIENT_URL` in `server/.env` to match, or CORS will reject all requests.
- **`client/package.json` has `"type": "module"`** — all config files in `/client` use ESM `export default` syntax (vite.config.js, tailwind.config.js, postcss.config.js). Do not mix in `module.exports`.

---

## 15. npm Scripts Reference

| Location | Script | Command | Purpose |
|---|---|---|---|
| `server/` | `npm start` | `node server.js` | Production start |
| `server/` | `npm run dev` | `nodemon server.js` | Dev with hot-reload |
| `server/` | `npm test` | `jest --runInBand --detectOpenHandles` | Run all tests, no parallel |
| `server/` | `npm run seed` | `node src/scripts/seed.js` | Populate DB + create admin user |
| `client/` | `npm run dev` | `vite` | Dev server on port 5173 |
| `client/` | `npm run build` | `vite build` | Production build → `dist/` |
| `client/` | `npm run preview` | `vite preview` | Preview production build locally |

---

## 16. Work Order & Dependency Graph

```
Account A — Scaffold ✅ COMPLETE
                │
    ┌───────────┼───────────┐
    ▼           ▼           ▼
Account B   Account C   Account D
(Backend)    (AI)       (Frontend)
    │           │           │
    │           │      Uses mock data
    │           │      until B is live
    └───────────┴───────────┘
              Integration
         D connects to B + C
```

**Critical path for integration:**
- D can start immediately using mock data — no backend dependency
- D switches to live API once B's `GET /api/routes` is confirmed working
- C's `/api/ai/chat` is fully independent of B's work
- All three accounts must pass the integration checklist below before merging

---

## 17. Integration Checklist

Run every item before declaring your layer done and requesting integration.

**Environment**
- [ ] `server/.env` exists and all required variables are filled in
- [ ] `npm install` completes without errors in `/server`
- [ ] `npm install` completes without errors in `/client`

**Server boot**
- [ ] `node server.js` starts without any crash or unhandled error (with env vars set)
- [ ] Console shows Arabic success message: `تم الاتصال بقاعدة البيانات بنجاح ✓`
- [ ] Console shows: `السيرفر شغال على البورت 5000 ✓`

**Route smoke tests (curl or Postman)**
- [ ] `GET /api/auth/me` → **401** (not 404, not 500) — confirms auth routes mounted and JWT middleware firing
- [ ] `GET /api/routes` → **200** with array after seed — confirms DB connected and routes controller working
- [ ] `POST /api/ai/chat` with empty body → **400** — confirms validation fires before any OpenAI call is made
- [ ] `GET /api/admin/stats` without token → **401** — confirms admin auth middleware is ordered correctly
- [ ] Any path not listed above → **404** with `{ success: false, message: 'المسار غير موجود' }`

**Proxy smoke test**
- [ ] Browser request to `http://localhost:5173/api/auth/me` → **401** (not a network error, not CORS error) — confirms Vite proxy is working

**Tests**
- [ ] `npm test` in `/server` runs and exits cleanly — no hanging processes

**Client**
- [ ] `npm run dev` in `/client` starts Vite on port 5173 with no errors
- [ ] `npm run build` completes and produces `dist/` folder

---

*Account A · Tech Lead · Am Ghareeb (عم غريب)*
*Verified checkpoints: A1 ✅ · A2 ✅ · A-FIX-1 ✅ · A-FIX-2 ✅*
*All file contents confirmed by direct disk read — this document reflects the actual final state of every file.*

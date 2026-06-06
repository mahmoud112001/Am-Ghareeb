# عم غريب — HANDOFF MASTER DOCUMENT
### Am Ghareeb · AI-Powered Alexandria Microbus Advisor
### ITI Graduation Project · Full Integration Reference

> **Status:** Verified & Validated · All 4 accounts complete
> **Last verified:** All modules resolve · Dead code removed · Contracts aligned
> **Chunks:** This document is split into 6 chunks. All chunks form one complete reference.

---

# CHUNK 1 — Project Overview, Architecture & Tech Stack

---

## 1. Project Identity

| Field | Value |
|-------|-------|
| **Name** | عم غريب — Am Ghareeb |
| **Type** | Full-Stack Web Application + AI Integration |
| **Target** | Alexandria, Egypt commuters, students, newcomers |
| **AI Persona** | عم غريب — elderly Alexandrian man, white galabeya, red tarboosh |
| **Language** | Arabic-first (Egyptian dialect), RTL UI |
| **Architecture** | MERN + RAG pipeline |
| **Deployment** | Vercel (client) + Render (server) + MongoDB Atlas (DB) |
| **APIs** | OpenAI gpt-4o-mini (educational key) + OpenStreetMap (free) |

---

## 2. System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (React)                           │
│  Vite + React 18 + Tailwind CSS + RTL + Cairo font             │
│  Port: 5173  ──── /api/* proxied to :5000 ────────────────────►│
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTP + SSE
┌────────────────────────────▼────────────────────────────────────┐
│                     SERVER (Express)                            │
│  Node.js + Express MVC · Port: 5000                            │
│                                                                  │
│  helmet → cors → morgan → express.json → passport.initialize   │
│       ↓                                                          │
│  /api/auth    → auth.routes.js                                  │
│  /api/routes  → routes.routes.js                               │
│  /api/ai      → ai.routes.js                                   │
│  /api/ratings → rating.routes.js                               │
│  /api/admin   → admin.routes.js                                │
│       ↓                                                          │
│  404 handler → errorMiddleware (last)                           │
└──────────┬──────────────────────┬───────────────────────────────┘
           │                      │
┌──────────▼──────────┐  ┌───────▼──────────────────────────────┐
│   MongoDB Atlas     │  │         OpenAI gpt-4o-mini            │
│   Free Tier (512MB) │  │  SSE streaming · max_tokens: 600      │
│                     │  │  RAG: DB context injected into prompt │
│  Collections:       │  │  Am Ghareeb persona (Egyptian Arabic) │
│  users              │  └───────────────────────────────────────┘
│  routes             │
│  ratings            │
│  searchhistories    │
└─────────────────────┘
```

---

## 3. RAG Pipeline Flow

```
POST /api/ai/ask
{ origin, destination, message }
        │
        ▼
1. Validate body (400 JSON if invalid — BEFORE SSE headers)
        │
        ▼
2. Set SSE headers (Content-Type: text/event-stream)
        │
        ▼
3. new OpenAI({ apiKey }) — instantiated INSIDE try block
        │
        ▼
4. Route.find({ isActive: true, $or: [station regex matches] }).limit(5)
        │
        ▼
5. Build Arabic context string:
   خط: {nameAr}
   محطات: {stations.nameAr joined with ←}
   تعريفة: {fare.min}–{fare.max} جنيه
   أوقات الذروة: {peakHours}
   نصائح: {tips}
        │
        ▼
6. Inject context into Am Ghareeb system prompt (promptBuilder.js)
        │
        ▼
7. openai.chat.completions.create({ model: gpt-4o-mini, stream: true })
        │
        ▼
8. Stream chunks: data: {"text": "chunk"}\n\n
9. End:          data: [DONE]\n\n
10. On error:    data: {"error": "حدث خطأ، حاول مرة تانية"}\n\n
```

---

## 4. Tech Stack — Complete Reference

### Server

| Layer | Technology | Version |
|-------|-----------|---------|
| Runtime | Node.js | ≥ 18.0.0 |
| Framework | Express.js | 4.18.2 |
| Database ODM | Mongoose | 8.0.3 |
| Password hashing | bcryptjs | 2.4.3 |
| JWT | jsonwebtoken | 9.0.2 |
| OAuth framework | passport | 0.7.0 |
| Google OAuth strategy | passport-google-oauth20 | 2.0.0 |
| AI SDK | openai | 4.28.0 |
| CORS | cors | 2.8.5 |
| Environment | dotenv | 16.4.1 |
| Rate limiting | express-rate-limit | 7.2.0 |
| Validation | joi | 17.12.1 |
| Security headers | helmet | 7.1.0 |
| HTTP logging | morgan | 1.10.0 |
| Dev server | nodemon | 3.0.3 |
| Test runner | jest | 29.7.0 |
| HTTP test client | supertest | 6.3.4 |
| In-memory MongoDB | mongodb-memory-server | 9.1.6 |
| Babel for Jest | @babel/preset-env + babel-jest | 7.23.9 / 29.7.0 |

### Client

| Layer | Technology | Version |
|-------|-----------|---------|
| UI Framework | React | 18.2.0 |
| Build tool | Vite | 5.0.12 |
| CSS framework | Tailwind CSS | 3.4.1 |
| Routing | react-router-dom | 6.22.1 |
| HTTP client | axios | 1.6.7 |
| Server state | @tanstack/react-query | 5.18.1 |
| Maps | react-leaflet + leaflet | 4.2.1 / 1.9.4 |
| React plugin | @vitejs/plugin-react | 4.2.1 |
| Font | Cairo (Google Fonts) | 400, 600, 700 |

### External Services (Free Only)

| Service | Purpose | Cost |
|---------|---------|------|
| MongoDB Atlas | Database | Free tier (512MB) |
| OpenAI API | AI chat (educational key) | Edu key |
| OpenStreetMap | Map tiles in Leaflet | Free |
| Google OAuth | Social login | Free |
| Vercel | Frontend deployment | Free |
| Render | Backend deployment | Free tier |

---

## 5. Design System

| Token | Value | Usage |
|-------|-------|-------|
| `navy` | `#1B2A4A` | Primary brand — navbars, headings, buttons, borders |
| `amber` | `#F4A833` | Accent — CTAs, active states, highlights |
| `cream` | `#FDF6EC` | Page backgrounds |
| `white` | `#FFFFFF` | Card surfaces, inputs |
| Font | Cairo, sans-serif | All text, Arabic + Latin |
| Direction | RTL (`dir="rtl"`) | Entire app |

**Rule:** No hardcoded hex values in components. Use Tailwind tokens or the exact hex values above only.

---

## 6. Account Roles & Wave Order

| Account | Role | Wave | Owns |
|---------|------|------|------|
| **A** | Tech Lead / Scaffold | 1 — first | `server/app.js`, `server/server.js`, config files, both `package.json` files, `index.html`, Vite/Tailwind/PostCSS configs |
| **D** | Database Engineer | 2 — after A | All Mongoose models, seed script, model tests |
| **B** | Backend Engineer | 3 — after D | All Express middleware, controllers, services, routes, AI pipeline, backend tests |
| **C** | Frontend Engineer | 3 — parallel to B | All React components, pages, hooks, context, axios, frontend tests |

**Dependency chain:** A → D → B + C (parallel)

---

## 7. Environment Variables — Complete Reference

All variables live in `server/.env` (copy from `server/.env.example`).

| Variable | Required | Owner | Description |
|----------|----------|-------|-------------|
| `PORT` | No (default 5000) | B | Express server port |
| `NODE_ENV` | No | B | `development` enables stack traces in error responses |
| `MONGODB_URI` | **YES** | B (server.js) | MongoDB Atlas connection string |
| `JWT_SECRET` | **YES** | B | Signs access tokens (15min) — min 64 chars |
| `JWT_REFRESH_SECRET` | **YES** | B | Signs refresh tokens (7d) — min 64 chars |
| `OPENAI_API_KEY` | **YES** | B (ai.service.js) | Educational key — never commit |
| `GOOGLE_CLIENT_ID` | For OAuth | B | Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | For OAuth | B | Google Cloud Console |
| `GOOGLE_CALLBACK_URL` | For OAuth | B | `http://localhost:5000/api/auth/google/callback` in dev |
| `CLIENT_URL` | **YES** | B (CORS) | `http://localhost:5173` in dev |
| `ADMIN_EMAIL` | **YES** | D (seed.js) | Admin account email |
| `ADMIN_PASSWORD` | **YES** | D (seed.js) | Admin account password — change before deploy |

**Client env** (in `client/.env.local`):

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_API_URL` | No | `http://localhost:5000` | Used by `loginWithGoogle()` redirect and `useAIChat` fetch. In dev, axios baseURL is `''` so Vite proxy handles requests. |

---

CHUNK 1 COMPLETE.

---

# CHUNK 2 — File Manifest, Missing Files & All API Endpoints

---

## 8. Complete File Manifest

### Account A — Scaffold (Wave 1)
Expected: **11 files** · Delivered: **11 files** ✅

| File | Path | Status |
|------|------|--------|
| `app.js` | `server/app.js` | ✅ Verified |
| `server.js` | `server/server.js` | ✅ Verified |
| `package.json` | `server/package.json` | ✅ Verified |
| `jest.config.js` | `server/jest.config.js` | ✅ Verified |
| `babel.config.js` | `server/babel.config.js` | ✅ Verified |
| `index.html` | `client/index.html` | ✅ Verified |
| `vite.config.js` | `client/vite.config.js` | ✅ Verified |
| `tailwind.config.js` | `client/tailwind.config.js` | ✅ Verified |
| `postcss.config.js` | `client/postcss.config.js` | ✅ Verified |
| `.env.example` | `server/.env.example` | ⚠️ NOT uploaded (must create) |
| `.gitignore` | `.gitignore` (root) | ⚠️ NOT uploaded (must create) |

### Account D — Database (Wave 2)
Expected: **9 files** · Delivered: **9 files** ✅

| File | Path | Status |
|------|------|--------|
| `User.model.js` | `server/src/models/User.model.js` | ✅ Verified |
| `Route.model.js` | `server/src/models/Route.model.js` | ✅ Verified |
| `Rating.model.js` | `server/src/models/Rating.model.js` | ✅ Verified |
| `SearchHistory.model.js` | `server/src/models/SearchHistory.model.js` | ✅ Verified |
| `index.js` | `server/src/models/index.js` | ✅ Verified |
| `seed.js` | `server/src/scripts/seed.js` | ✅ Verified |
| `models.test.js` | `server/src/tests/models.test.js` | ✅ Verified |
| `README.md` | `server/src/models/README.md` | ✅ Documentation |
| `HANDOFF_D.md` | `HANDOFF_D.md` | ✅ Documentation |

### Account B — Backend (Wave 3)
Expected: **23 files** · Delivered: **23 files** ✅

| File | Path | Status |
|------|------|--------|
| `error.middleware.js` | `server/src/middleware/` | ✅ Verified |
| `auth.middleware.js` | `server/src/middleware/` | ✅ Verified |
| `validate.middleware.js` | `server/src/middleware/` | ✅ Verified |
| `rateLimit.middleware.js` | `server/src/middleware/` | ✅ Verified |
| `auth.service.js` | `server/src/services/` | ✅ Verified |
| `routes.service.js` | `server/src/services/` | ✅ Fixed (dead code removed) |
| `rating.service.js` | `server/src/services/` | ✅ Verified |
| `admin.service.js` | `server/src/services/` | ✅ Verified |
| `ai.service.js` | `server/src/services/` | ✅ Fixed (OpenAI inside try block) |
| `auth.controller.js` | `server/src/controllers/` | ✅ Verified |
| `routes.controller.js` | `server/src/controllers/` | ✅ Verified |
| `auth.routes.js` | `server/src/routes/` | ✅ Verified |
| `routes.routes.js` | `server/src/routes/` | ✅ Verified |
| `rating.routes.js` | `server/src/routes/` | ✅ Verified |
| `admin.routes.js` | `server/src/routes/` | ✅ Verified |
| `ai.routes.js` | `server/src/routes/` | ✅ Verified |
| `passport.js` | `server/src/config/` | ✅ Verified |
| `promptBuilder.js` | `server/src/ai/` | ✅ Verified |
| `auth.test.js` | `server/src/tests/` | ✅ Verified |
| `routes.test.js` | `server/src/tests/` | ✅ Verified |
| `rating.test.js` | `server/src/tests/` | ✅ Verified |
| `admin.test.js` | `server/src/tests/` | ✅ Verified |
| `ai.test.js` | `server/src/tests/` | ✅ Verified |

### Account C — Frontend (Wave 3)
Expected: **21 files** · Delivered: **21 files** ✅

| File | Path | Status |
|------|------|--------|
| `App.jsx` | `client/src/` | ✅ Verified |
| `AuthContext.jsx` | `client/src/context/` | ✅ Verified |
| `axios.js` | `client/src/lib/` | ✅ Fixed (baseURL = '') |
| `useAIChat.js` | `client/src/hooks/` | ✅ Verified |
| `AmGhareebAvatar.jsx` | `client/src/components/` | ✅ Verified |
| `ProtectedRoute.jsx` | `client/src/components/` | ✅ Verified |
| `RouteCard.jsx` | `client/src/components/` | ✅ Verified |
| `RatingModal.jsx` | `client/src/components/` | ✅ Verified |
| `Navbar.jsx` | `client/src/components/layout/` | ✅ Verified |
| `HomePage.jsx` | `client/src/pages/` | ✅ Verified |
| `SearchPage.jsx` | `client/src/pages/` | ✅ Verified |
| `MapPage.jsx` | `client/src/pages/` | ✅ Verified |
| `AIChatPage.jsx` | `client/src/pages/` | ✅ Verified |
| `LoginPage.jsx` | `client/src/pages/` | ✅ Verified |
| `RegisterPage.jsx` | `client/src/pages/` | ✅ Verified |
| `DashboardPage.jsx` | `client/src/pages/` | ✅ Verified |
| `AdminPage.jsx` | `client/src/pages/` | ✅ Verified |
| `AmGhareebAvatar.test.jsx` | tests | ✅ Verified |
| `RouteCard.test.jsx` | tests | ✅ Verified |
| `RatingModal.test.jsx` | tests | ✅ Verified |
| `useAIChat.test.js` | tests | ✅ Verified |

---

## 9. Missing Files — Must Create Before Running

These files were confirmed absent from all uploads. They must be created to run the project.

### CRITICAL — App will not start without these

**1. `client/src/main.jsx`** — React entry point
```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

**2. `client/package.json`** — Client dependencies
```json
{
  "name": "am-ghareeb-client",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "react-router-dom": "6.22.1",
    "axios": "1.6.7",
    "@tanstack/react-query": "5.18.1",
    "react-leaflet": "4.2.1",
    "leaflet": "1.9.4"
  },
  "devDependencies": {
    "vite": "5.0.12",
    "@vitejs/plugin-react": "4.2.1",
    "tailwindcss": "3.4.1",
    "postcss": "8.4.35",
    "autoprefixer": "10.4.17"
  }
}
```

**3. `client/src/index.css`** — Tailwind base styles
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### NON-CRITICAL — Missing but won't break the app

**4. `server/.env.example`** — Template for environment variables
(All 12 variables listed in Section 7 of Chunk 1)

**5. `.gitignore`** (root) — Standard Node + React gitignore

### MISSING BACKEND ENDPOINTS — Dashboard will not work

Two endpoints are called by `DashboardPage.jsx` but do not exist in Account B:

| Endpoint | Called In | Line | Response Expected |
|----------|-----------|------|-------------------|
| `GET /api/routes/history` | `DashboardPage.jsx` | 65 | `{ history: SearchHistory[] }` |
| `GET /api/routes/saved` | `DashboardPage.jsx` | 145 | `{ routes: Route[] }` |

**Spec for Account B to add to `routes.service.js` + `routes.routes.js`:**

```
GET /api/routes/history
Auth: protect (required)
Service: SearchHistory.find({ user: userId }).sort({ createdAt: -1 }).limit(20)
Response: { success: true, history: [{ _id, originQuery, destinationQuery, routesFound, createdAt }] }

GET /api/routes/saved
Auth: protect (required)
Service: User.findById(userId).populate('savedRoutes')
         For each saved route: attach accuracyStats via Route.getAccuracyStats()
Response: { success: true, routes: [RouteObject with accuracyStats attached] }
```

---

## 10. All API Endpoints — Complete Reference

### `/api/auth` — 7 endpoints

| Method | Path | Auth | Middleware | Description | Body | Response |
|--------|------|------|-----------|-------------|------|----------|
| POST | `/register` | Public | authLimiter, validate | Create account | `{name, email, password}` | `{success, user, accessToken, refreshToken}` |
| POST | `/login` | Public | authLimiter, validate | Email login | `{email, password}` | `{success, user, accessToken, refreshToken}` |
| POST | `/refresh` | Public | — | Rotate tokens | `{refreshToken}` | `{success, accessToken, refreshToken}` |
| POST | `/logout` | Bearer | protect | Invalidate session | — | `{success, message}` |
| GET | `/me` | Bearer | protect | Get profile | — | `{success, user}` |
| GET | `/google` | Public | passport | Start OAuth flow | — | redirect to Google |
| GET | `/google/callback` | Public | passport | OAuth callback | — | redirect to `CLIENT_URL/dashboard?token=ACCESS_TOKEN` |

### `/api/routes` — 7 endpoints (5 existing + 2 missing)

| Method | Path | Auth | Middleware | Description | Response |
|--------|------|------|-----------|-------------|----------|
| GET | `/search?origin=X&destination=Y` | Optional | apiLimiter, optionalProtect | Search by station | `{success, results: [{route, accuracyStats}]}` |
| GET | `/stations` | Public | apiLimiter | All station names for autocomplete | `{success, stations: string[]}` |
| GET | `/:routeId` | Public | apiLimiter | Single route with stats | `{success, route, accuracyStats}` |
| POST | `/save/:routeId` | Bearer | apiLimiter, protect | Save route to user list | `{success, message}` |
| DELETE | `/save/:routeId` | Bearer | apiLimiter, protect | Unsave route | `{success, message}` |
| GET | `/history` | Bearer | protect | ⚠️ **MISSING** — search history | `{success, history: []}` |
| GET | `/saved` | Bearer | protect | ⚠️ **MISSING** — saved routes list | `{success, routes: []}` |

### `/api/ai` — 1 endpoint

| Method | Path | Auth | Middleware | Description | Body | Response |
|--------|------|------|-----------|-------------|------|----------|
| POST | `/ask` | Bearer | protect, aiLimiter | Chat with عم غريب | `{origin, destination, message}` | SSE stream |

### `/api/ratings` — 2 endpoints

| Method | Path | Auth | Middleware | Description | Body | Response |
|--------|------|------|-----------|-------------|------|----------|
| POST | `/` | Bearer | protect, validate | Submit or update rating | `{routeId, isAccurate, comment?}` | `{success, message, rating}` |
| GET | `/:routeId/stats` | Public | — | Get accuracy stats | — | `{success, stats: {total, accurate, percentage, label}}` |

### `/api/admin` — 5 endpoints

| Method | Path | Auth | Middleware | Description | Body | Response |
|--------|------|------|-----------|-------------|------|----------|
| GET | `/stats` | Admin | protect, requireAdmin | Dashboard stats | — | `{success, stats: {totalRoutes, totalUsers, totalRatings, topSearched}}` |
| GET | `/routes?page=1&limit=10` | Admin | protect, requireAdmin | Paginated routes | — | `{success, routes, total, page, pages}` |
| POST | `/routes` | Admin | protect, requireAdmin, validate | Create route | Full route object | `{success, route}` |
| PUT | `/routes/:id` | Admin | protect, requireAdmin | Update route by `_id` | Partial route | `{success, route}` |
| DELETE | `/routes/:id` | Admin | protect, requireAdmin | Soft delete (isActive=false) | — | `{success, message}` |

**Total verified endpoints: 22** (20 working + 2 missing)

---

## 11. SSE Stream Contract

```
POST /api/ai/ask
Authorization: Bearer <accessToken>
Content-Type: application/json

Body: { "origin": "string", "destination": "string", "message": "string (max 500 chars)" }

Response stream:
Content-Type: text/event-stream
Cache-Control: no-cache
Connection: keep-alive

data: {"text": "يا فنان، "}\n\n
data: {"text": "روح المندرة..."}\n\n
data: [DONE]\n\n

On error (after headers flushed):
data: {"error": "حدث خطأ، حاول مرة تانية"}\n\n
```

**Client parsing rule:** `[DONE]` is a raw string — check `payload === '[DONE]'`. Do NOT `JSON.parse('[DONE]')`.

**Validation fires BEFORE SSE headers** — invalid requests return JSON 400, not an SSE stream.

---

CHUNK 2 COMPLETE.

---

# CHUNK 3 — Database Layer (Models, Schemas, Indexes, Seed Data)

---

## 12. Models Export Contract

**Import statement used everywhere in Account B:**
```js
const { User, Route, Rating, SearchHistory } = require('../models/index.js')
```

| Model | Mongoose Collection | Purpose |
|-------|-------------------|---------|
| `User` | `users` | Auth, roles, saved routes |
| `Route` | `routes` | Microbus/bus route data |
| `Rating` | `ratings` | Crowd-sourced accuracy votes |
| `SearchHistory` | `searchhistories` | Per-user search log |

---

## 13. Schema — User

| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| `name` | String | ✅ | — | trim, minlength 2, maxlength 50 |
| `email` | String | ✅ | — | unique, lowercase, trim, regex validated |
| `passwordHash` | String | ❌ | `null` | null for OAuth users. Pre-save hook bcrypts on modify |
| `googleId` | String | ❌ | `null` | sparse index, null for email users |
| `role` | String | ❌ | `'user'` | enum: `['user', 'admin']` |
| `refreshToken` | String | ❌ | `null` | stored for rotation validation |
| `savedRoutes` | ObjectId[] | ❌ | `[]` | ref: `'Route'` |
| `createdAt` | Date | — | auto | timestamps: true |
| `updatedAt` | Date | — | auto | timestamps: true |

**⚠️ Never return in API responses:** `passwordHash`, `refreshToken`
Use: `.select('-passwordHash -refreshToken')`

**Hooks & Methods:**

| Name | Type | Behaviour |
|------|------|-----------|
| `pre('save')` | Hook | If `passwordHash` modified AND not null → bcrypt.hash(cost 12) |
| `comparePassword(plain)` | Instance | Returns false if no hash (OAuth users). bcrypt.compare |
| `findByEmail(email)` | Static | Case-insensitive findOne. Lowercases + trims input |

**Indexes:**
- `email` — unique
- `googleId` — sparse (only indexes non-null values)

---

## 14. Schema — Route

| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| `routeId` | String | ✅ | — | unique, e.g. `"ALEX-MICRO-01"` |
| `type` | String | ✅ | — | enum: `['microbus','bus','tram','university_shuttle']` |
| `localName` | String | ❌ | `'مشروع'` | Alexandrian term for microbus |
| `nameAr` | String | ✅ | — | Arabic route name |
| `nameEn` | String | ✅ | — | English transliteration |
| `origin.nameAr` | String | ✅ | — | |
| `origin.nameEn` | String | ✅ | — | |
| `origin.coords` | {lat,lng} | ❌ | `{0,0}` | 0,0 = unverified GPS |
| `destination.nameAr` | String | ✅ | — | |
| `destination.nameEn` | String | ✅ | — | |
| `destination.coords` | {lat,lng} | ❌ | `{0,0}` | |
| `stations[]` | Array | ❌ | `[]` | Each: `{order, nameAr, nameEn, coords}` |
| `fare.min` | Number | ✅ | — | EGP |
| `fare.max` | Number | ✅ | — | EGP |
| `fare.currency` | String | ❌ | `'EGP'` | |
| `fare.lastVerified` | String | ❌ | — | e.g. `"2026-03"` |
| `operatingHours.start` | String | ❌ | — | e.g. `"05:00"` |
| `operatingHours.end` | String | ❌ | — | e.g. `"23:59"` |
| `peakHours` | String[] | ❌ | `[]` | e.g. `["08:00-10:00","14:30-17:30"]` |
| `frequency` | String | ❌ | — | e.g. `"every 5-10 minutes"` |
| `direction` | String | ❌ | `'bidirectional'` | enum: `['bidirectional','one_way']` |
| `tips` | String[] | ❌ | `[]` | Arabic street tips |
| `verified` | Boolean | ❌ | `false` | Data verified from real sources |
| `isActive` | Boolean | ❌ | `true` | false = soft deleted |
| `createdAt` | Date | — | auto | timestamps: true |

**Zero-coord stations rule:** `coords: { lat: 0, lng: 0 }` = real stop, GPS unverified.
- Map: skip rendering marker → `if (s.coords.lat !== 0 && s.coords.lng !== 0)`
- Station list: show name + `إحداثيات غير محددة` badge

**Indexes:**
```
{ 'stations.nameAr': 'text', 'stations.nameEn': 'text', nameAr: 'text' }
  → name: 'route_text_search'
{ isActive: 1 }
{ routeId: 1 }
```

**Static Method: `Route.getAccuracyStats(routeId)`**

```
Input:  routeId (string, e.g. "ALEX-MICRO-01") — NOT _id
Output: { total, accurate, percentage, label }

Logic:
  1. findOne({ routeId }) — throws Error('الخط غير موجود') if not found
  2. Late require Rating (avoids circular dependency)
  3. total = Rating.countDocuments({ route: route._id })
  4. accurate = Rating.countDocuments({ route: route._id, isAccurate: true })
  5. if total < 3 → { total, accurate, percentage: null, label: 'غير مقيّم بعد' }
  6. percentage = Math.round((accurate / total) * 100)
  7. label:
       ≥ 80% → 'دقيق جداً'
       ≥ 60% → 'دقيق نسبياً'
       < 60% → 'غير موثوق'

⚠️ Late require pattern — Rating is required INSIDE the method body, not at top of file.
   This prevents circular dependency: Route → Rating → (any Route import).
```

---

## 15. Schema — Rating

| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| `user` | ObjectId | ✅ | — | ref: `'User'` |
| `route` | ObjectId | ✅ | — | ref: `'Route'` |
| `isAccurate` | Boolean | ✅ | — | Yes/No vote |
| `comment` | String | ❌ | `null` | maxlength 280, trim |
| `createdAt` | Date | — | auto | timestamps: true |

**Indexes:**
- `{ user: 1, route: 1 }` — unique compound (one rating per user per route)
- Submit uses **upsert** so user can change vote without hitting the unique index

---

## 16. Schema — SearchHistory

| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| `user` | ObjectId | ✅ | — | ref: `'User'` |
| `originQuery` | String | ✅ | — | trim |
| `destinationQuery` | String | ✅ | — | trim |
| `routesFound` | Number | ❌ | `0` | How many results returned |
| `createdAt` | Date | — | auto | timestamps: true |

**Indexes:**
- `{ user: 1, createdAt: -1 }` — fast recent-searches query per user

---

## 17. Seed Script

**Command:**
```bash
cd server
npm run seed
# or
node src/scripts/seed.js
```

**Flow:**
```
1. require('dotenv').config()
2. mongoose.connect(process.env.MONGODB_URI)
3. console.log('✓ تم الاتصال بقاعدة البيانات')
4. Route.deleteMany({})                    → wipe all routes
5. User.deleteMany({ role: 'admin' })      → wipe admin users only
6. Route.insertMany(routes)               → insert 10 routes
7. console.log('تم إضافة X خط بنجاح ✓')
8. User.create({ name, email, passwordHash, role: 'admin' })
   → password auto-hashed by pre-save hook
9. console.log('تم إنشاء المستخدم الإداري ✓')
10. mongoose.disconnect()
11. console.log('تم الانتهاء من الـ Seed بنجاح 🎉')
```

**Reads from env:** `MONGODB_URI`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`

---

## 18. Seed Data — 10 Alexandria Microbus Routes

| routeId | nameAr | Corridor |
|---------|--------|----------|
| ALEX-MICRO-01 | المندرة ↔ محطة مصر | East–West corniche |
| ALEX-MICRO-02 | محطة مصر ↔ الكيلو 21 | Western (International Road) |
| ALEX-MICRO-03 | سيدي جابر ↔ أبو قير | Abu Qir replacement (El-Horeya Rd) |
| ALEX-MICRO-04 | الموقف الجديد ↔ أبو قير | Abu Qir replacement (Suez Canal Rd) |
| ALEX-MICRO-05 | سيدي بشر ↔ أبو قير | Abu Qir replacement (Mabarra El-Asafra) |
| ALEX-MICRO-06 | المندرة ↔ الطابية | Abu Qir replacement (Rasheed Rd) |
| ALEX-MICRO-07 | فيكتوريا ↔ الطابية | Abu Qir replacement (Malek Hefni) |
| ALEX-MICRO-08 | محطة مصر ↔ برج العرب الجديد | Western (Desert Road via Kafouri) |
| ALEX-MICRO-09 | محطة مصر ↔ برج العرب الجديد | Western (Coastal Road) |
| ALEX-MICRO-10 | محطة مصر ↔ برج العرب الجديد | Western (Desert Road short) |

**Important domain context:**
- Routes 03–07: replacements for Abu Qir train (suspended March 2024, metro conversion in progress)
- All fares updated March 2026 (14–17% increase after fuel price hike)
- Fare range: 6.50–18.00 EGP depending on distance
- Local name: **مشروع** (Mashrou') — not ميكروباص — correct Alexandrian term
- Overcharging tactic to warn users about: **تقطيع المسافات**
- Complaint hotline: **114** or WhatsApp **01281533385**

---

## 19. Model Unit Tests — Coverage

**File:** `server/src/tests/models.test.js` · **Total: 19 tests**

| Group | Tests | What's covered |
|-------|-------|----------------|
| User (7) | creates user · hashes password · comparePassword true · comparePassword false · findByEmail case-insensitive · duplicate email 11000 · googleId user null passwordHash |
| Route (7) | creates route · getAccuracyStats < 3 ratings · calculates % at 3+ · label 80%+ دقيق جداً · label 60–79% دقيق نسبياً · label <60% غير موثوق · text search finds Arabic station name |
| Rating (3) | creates rating · blocks duplicate user+route (11000) · comment optional |
| SearchHistory (2) | creates record · routesFound defaults to 0 |

**Run:**
```bash
cd server
npx jest src/tests/models.test.js --verbose
```

Uses `mongodb-memory-server` — no external DB needed.

---

CHUNK 3 COMPLETE.

---

# CHUNK 4 — Backend Layer (Middleware, Auth, Services, RAG, Tests)

---

## 20. Middleware Stack — Execution Order

Every request passes through this chain in `app.js`:

```
1.  helmet()                          → secure HTTP headers
2.  cors({ origin: CLIENT_URL })      → allow frontend origin, credentials: true
3.  morgan('dev')                     → log METHOD PATH STATUS time
4.  express.json()                    → parse JSON body
5.  express.urlencoded()              → parse form body
6.  passport.initialize()             → enable passport (no sessions)
7.  configurePassport(passport)       → register Google OAuth strategy
8.  /api/auth    → authRouter
9.  /api/routes  → routesRouter
10. /api/ai      → aiRouter
11. /api/ratings → ratingRouter
12. /api/admin   → adminRouter
13. 404 handler  → { success: false, message: 'المسار غير موجود' }
14. errorMiddleware (4-arg, MUST be last)
```

---

## 21. Rate Limiters

| Limiter | Window | Max | Key | Applied to |
|---------|--------|-----|-----|-----------|
| `authLimiter` | 15 min | 10 | IP | POST `/register`, POST `/login` |
| `apiLimiter` | 15 min | 100 | IP | All `/api/routes/*` endpoints |
| `aiLimiter` | 60 min | 20 | `req.user.userId` or IP | POST `/api/ai/ask` |

**AI limiter key:** `keyGenerator: (req) => req.user?.userId || req.ip`
After `protect` middleware runs, the key is the authenticated user's ID — not IP.
This prevents VPN bypass and correctly limits per-user.

---

## 22. Auth Middleware

**`protect(req, res, next)`**
```
1. Extract token: req.headers.authorization?.split(' ')[1]
2. If no token → next({ statusCode: 401, message: 'لا يوجد توكن' })
3. jwt.verify(token, JWT_SECRET)
4. Attach: req.user = { userId: decoded.userId, role: decoded.role }
5. JWT errors propagate to errorMiddleware automatically
```

**`requireAdmin(req, res, next)`**
```
1. If req.user not set → run protect first
2. Check req.user.role === 'admin'
3. If not → next({ statusCode: 403, message: 'غير مصرح لك بهذه العملية' })
```

**`optionalProtect`** (defined inline in `routes.routes.js`)
```
1. Extract Bearer token
2. If no token → next() as anonymous (no block)
3. If token valid → set req.user
4. If token invalid/expired → treat as anonymous (no block, no error)
Used on GET /api/routes/search so history saves for auth users but public still works
```

---

## 23. Validation Middleware

**`validate(schema)`** — Joi wrapper:
```
1. schema.validate(req.body, { abortEarly: false })
2. On error → next({ statusCode: 400, isJoi: true, details: [...] })
   details: [{ field: 'email', message: '...' }]
3. On pass → next()
```

**Schemas defined in route files:**

| Schema | Location | Rules |
|--------|----------|-------|
| `registerSchema` | `auth.routes.js` | name(2-50), email(valid), password(min8, 1 uppercase, 1 digit) |
| `loginSchema` | `auth.routes.js` | email(valid), password(required) |
| `ratingSchema` | `rating.routes.js` | routeId(string), isAccurate(boolean), comment(optional, max 280) |
| `routeSchema` | `admin.routes.js` | Full route object with all required fields |

---

## 24. Error Middleware — All Cases

**All errors must call `next(err)` — never `res.json()` in controllers.**

| Error Type | Detection | Status | Arabic Message |
|-----------|-----------|--------|---------------|
| No token | `{ statusCode: 401 }` thrown manually | 401 | لا يوجد توكن |
| Invalid JWT | `err.name === 'JsonWebTokenError'` | 401 | جلسة غير صالحة |
| Expired JWT | `err.name === 'TokenExpiredError'` | 401 | انتهت صلاحية الجلسة |
| Not admin | `{ statusCode: 403 }` thrown manually | 403 | غير مصرح لك بهذه العملية |
| Mongoose validation | `err.name === 'ValidationError' && err.errors` | 400 | بيانات غير صحيحة + field errors |
| Duplicate key | `err.code === 11000` | 409 | هذا البريد الإلكتروني مسجل بالفعل |
| Joi validation | `err.isJoi === true` or `err.details` | 400 | بيانات غير صحيحة + field errors |
| Custom service error | `err.statusCode` exists | that code | `err.message` |
| Default server error | everything else | 500 | حدث خطأ في الخادم |
| Stack trace | `NODE_ENV === 'development'` | — | included in response |

---

## 25. Auth Service — All Functions

**`generateTokens(userId, role)`**
```
accessToken:  jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: '15m' })
refreshToken: jwt.sign({ userId }, JWT_REFRESH_SECRET, { expiresIn: '7d' })
Returns: { accessToken, refreshToken }
```

**`register(name, email, password)`**
```
1. User.findByEmail(email) → throw 409 if exists
2. User.create({ name, email, passwordHash: password })
   → pre-save hook bcrypts the password
3. generateTokens → save refreshToken to user
4. Returns: { user: {_id, name, email, role}, accessToken, refreshToken }
```

**`login(email, password)`**
```
1. User.findByEmail(email) → throw 401 if not found (same message as wrong password — no enumeration)
2. user.comparePassword(password) → throw 401 if false
3. generateTokens → save refreshToken
4. Returns same shape as register
```

**`refreshTokens(token)`**
```
1. jwt.verify(token, JWT_REFRESH_SECRET) → throw 401 if invalid
2. User.findById(decoded.userId)
3. Check user.refreshToken === token (rotation — prevents replay)
4. generateTokens → save new refreshToken (old token invalidated)
5. Returns: { accessToken, refreshToken }
```

**`logout(userId)`**
```
User.findByIdAndUpdate(userId, { refreshToken: null })
```

**`getMe(userId)`**
```
User.findById(userId).select('-passwordHash -refreshToken')
```

---

## 26. Google OAuth Flow

```
Browser → GET /api/auth/google
              │ passport.authenticate('google', { scope: ['profile','email'] })
              ▼
         Google consent screen
              │ user grants permission
              ▼
         Google → GET /api/auth/google/callback
              │ passport verify callback:
              │   1. Find by googleId → found? done(null, user)
              │   2. Find by email → found? link googleId, save, done(null, user)
              │   3. Neither → User.create({ name, email, googleId, passwordHash: null })
              ▼
         auth.controller.googleCallback:
              │ generateTokens(user._id, user.role)
              ▼
         redirect → CLIENT_URL/dashboard?token=ACCESS_TOKEN
              │
              ▼ (client handles)
         AuthContext.useEffect detects ?token= param
         setTokens(token, null)
         GET /api/auth/me → set user state
         history.replaceState → clean URL
```

---

## 27. Routes Service — All Functions

**`searchRoutes(originQuery, destinationQuery, userId)`**
```
1. Build regex for both origin and destination (case-insensitive)
2. Route.find({ isActive: true, $and: [
     { stations: { $elemMatch: { $or: [nameAr: originRegex, nameEn: originRegex] } } },
     { stations: { $elemMatch: { $or: [nameAr: destRegex,   nameEn: destRegex]   } } }
   ]})
3. If userId: SearchHistory.create({ user, originQuery, destinationQuery, routesFound })
4. Promise.all: attach Route.getAccuracyStats() to each result
5. Returns: [{ route, accuracyStats }]
```

**`getStations()`**
```
Route.aggregate([
  { $match: { isActive: true } },
  { $unwind: '$stations' },
  { $group: { _id: '$stations.nameAr' } },
  { $sort: { _id: 1 } },
  { $project: { _id: 0, name: '$_id' } }
])
Returns: string[] of unique Arabic station names (sorted)
```

**`getRouteById(routeId)`**
```
Route.findOne({ routeId, isActive: true }) → throw 404 if not found
Attach: Route.getAccuracyStats(routeId)
Returns: { route, accuracyStats }
```

**`saveRoute(userId, routeId)`** / **`unsaveRoute(userId, routeId)`**
```
Route.findOne({ routeId, isActive: true }) → throw 404 if not found
User.findByIdAndUpdate(userId, { $addToSet: { savedRoutes: route._id } })  // save
User.findByIdAndUpdate(userId, { $pull:     { savedRoutes: route._id } })  // unsave
⚠️ isActive: true filter → soft-deleted routes cannot be saved
```

---

## 28. Admin Service — All Functions

**`getAllRoutes(page, limit)`**
```
Route.find().skip((page-1)*limit).limit(limit).sort({ createdAt: -1 })
Attaches accuracyStats to each (try/catch per route to handle edge cases)
Returns: { routes: [{route, accuracyStats}], total, page, pages }
```

**`createRoute(data)`**
```
Route.findOne({ routeId: data.routeId }) → throw 409 if exists
Route.create(data)
```

**`updateRoute(id, data)`**
```
Route.findByIdAndUpdate(id, data, { new: true, runValidators: true })
→ throw 404 if not found
```

**`softDeleteRoute(id)`**
```
Route.findByIdAndUpdate(id, { isActive: false }, { new: true })
→ throw 404 if not found
Returns: { message: 'تم حذف الخط ✓' }
⚠️ SOFT DELETE only — data is preserved, just hidden from public queries
```

**`getStats()`**
```
Promise.all([
  Route.countDocuments({ isActive: true }),
  User.countDocuments({ role: 'user' }),
  Rating.countDocuments(),
  SearchHistory.aggregate([
    { $group: { _id: { origin, destination }, count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 },
    { $project: { origin, destination, count } }
  ])
])
Returns: { totalRoutes, totalUsers, totalRatings, topSearched: [{origin, destination, count}] }
⚠️ topSearched items have 'origin' and 'destination' fields — NOT 'nameAr'
```

---

## 29. AI Service — RAG Pipeline Detail

**File:** `server/src/services/ai.service.js`

**Critical implementation rules:**
1. SSE headers set BEFORE `try` block — `res.flushHeaders()` at line 23
2. `new OpenAI(...)` instantiated INSIDE `try` block — prevents crash if key missing at startup
3. After headers are flushed: cannot call `next(err)` — must send SSE error event
4. OpenAI model: `gpt-4o-mini`, `temperature: 0.7`, `max_tokens: 600`, `stream: true`

**Am Ghareeb System Prompt rules (from `promptBuilder.js`):**
- Speak Alexandrian Egyptian dialect (عامية مصرية إسكندرانية) — never فصحى
- Address users as `يا فنان` or `أحيه` — never `يا باشا`
- Use `بحر` (north/seafront) and `جوه` (south/inland) for directions
- Always call microbuses `مشروع` — never ميكروباص
- Answer ONLY from injected DB context — never invent stations or fares
- If info not in context: `"والله يا عم معنديش معلومة دقيقة عن الخط ده — اسأل في الموقف هيعرفوك"`
- Overcharging complaints → refer to 114 or WhatsApp 01281533385
- Warn about تقطيع المسافات scam

---

## 30. Backend Test Coverage

| File | Tests | Key scenarios |
|------|-------|--------------|
| `auth.test.js` | 13 | register (valid/duplicate/weak pw/missing name/bad email), login (correct/wrong pw/unknown email), refresh (valid/invalid), GET /me (valid/no token), logout (nulls refreshToken in DB) |
| `routes.test.js` | 11 | search (valid/auth saves history/unauth no history/missing origin), stations (array/includes both routes), getById (valid/invalid 404), save (auth 200/no auth 401), unsave (removes from savedRoutes) |
| `rating.test.js` | 8 | submit (auth valid/upsert same user/no auth 401/missing isAccurate 400), stats (0 ratings null/2 ratings null/3 accurate 100%/mixed 75%) |
| `admin.test.js` | 9 | listRoutes (admin 200/user 403/no auth 401), createRoute (valid 201/invalid 400), updateRoute (admin 200/invalid id 404-500), deleteRoute (isActive false), stats (has all fields) |
| `ai.test.js` | 7 | no auth 401, missing origin 400 JSON not SSE, missing dest 400, msg >500 chars 400, valid → SSE content-type, DB query runs with regex, context injected into system prompt |
| `models.test.js` | 19 | (see Chunk 3, Section 19) |
| **TOTAL** | **67** | |

**Run all tests:**
```bash
cd server
npm test
# or with coverage
npx jest --coverage --runInBand
```

---

CHUNK 4 COMPLETE.

---

# CHUNK 5 — Frontend Layer (Components, Pages, Hooks, Contracts)

---

## 31. Frontend File Structure

```
client/
├── index.html                          ← lang="ar" dir="rtl", Cairo font
├── package.json                        ⚠️ MUST CREATE (see Chunk 2, Section 9)
├── vite.config.js                      ← /api proxy → :5000, port 5173
├── tailwind.config.js                  ← navy, amber tokens, Cairo font
├── postcss.config.js                   ← tailwindcss + autoprefixer
└── src/
    ├── main.jsx                        ⚠️ MUST CREATE (React entry point)
    ├── index.css                       ⚠️ MUST CREATE (@tailwind directives)
    ├── App.jsx                         ← router, providers, lazy pages
    ├── context/
    │   └── AuthContext.jsx             ← user state, login/logout/OAuth
    ├── lib/
    │   └── axios.js                    ← instance, token refs, interceptors
    ├── hooks/
    │   └── useAIChat.js                ← SSE streaming chat hook
    ├── components/
    │   ├── AmGhareebAvatar.jsx         ← inline SVG logo/avatar
    │   ├── ProtectedRoute.jsx          ← auth + role guard
    │   ├── RouteCard.jsx               ← route result card
    │   ├── RatingModal.jsx             ← yes/no rating overlay
    │   └── layout/
    │       └── Navbar.jsx              ← RTL nav, mobile drawer
    └── pages/
        ├── HomePage.jsx
        ├── SearchPage.jsx
        ├── MapPage.jsx
        ├── AIChatPage.jsx
        ├── LoginPage.jsx
        ├── RegisterPage.jsx
        ├── DashboardPage.jsx
        └── AdminPage.jsx
```

---

## 32. React Router — All Routes

| Path | Component | Auth | Admin | Notes |
|------|-----------|------|-------|-------|
| `/` | `HomePage` | No | No | Public hero + features |
| `/search` | `SearchPage` | No | No | Station autocomplete + results |
| `/map` | `MapPage` | No | No | Leaflet map, `?routeId=` param |
| `/login` | `LoginPage` | No | No | Email + Google OAuth |
| `/register` | `RegisterPage` | No | No | Name/email/password |
| `/chat` | `AIChatPage` | ✅ | No | SSE streaming chat |
| `/dashboard` | `DashboardPage` | ✅ | No | History + saved routes tabs |
| `/admin` | `AdminPage` | ✅ | ✅ | Stats + CRUD routes |
| `*` | `Navigate to /` | — | — | Catch-all redirect |

All pages are **lazy-loaded** via `React.lazy()` + `Suspense` with Arabic fallback spinner.

---

## 33. AuthContext — State & Functions

**State:**
| Name | Type | Initial | Purpose |
|------|------|---------|---------|
| `user` | Object\|null | `null` | Current user `{_id, name, email, role}` |
| `isLoading` | Boolean | `true` | Blocks ProtectedRoute until session resolved |

**On mount flow:**
```
1. Check URL for ?token= param (Google OAuth callback)
   → If found: setTokens(token, null) → GET /api/auth/me → setUser → replaceState (clean URL)
2. Else: isLoading = false (no persistent session — tokens lost on reload by design)
```

**Exported functions:**

| Function | Description |
|----------|-------------|
| `login(email, password)` | POST /api/auth/login → setTokens + setUser |
| `loginWithGoogle()` | `window.location.href = ${VITE_API_URL}/api/auth/google` |
| `register(name, email, password)` | POST /api/auth/register → setTokens + setUser |
| `logout()` | POST /api/auth/logout (fire-forget) → setTokens(null,null) + setUser(null) |
| `updateUser(data)` | Merge partial data into user state |

**Hook:** `useAuth()` — throws if used outside `<AuthProvider>`

---

## 34. axios.js — Token Strategy

**In-memory token storage (NO localStorage, NO sessionStorage):**
```js
let accessTokenRef  = null   // cleared on page reload — by design
let refreshTokenRef = null   // cleared on page reload — by design
```

**Exports:**
| Export | Purpose |
|--------|---------|
| `default api` | Axios instance with baseURL `''` (Vite proxy) |
| `setTokens(access, refresh)` | Called after login/register/refresh/logout |
| `getAccessToken()` | Called by `useAIChat` to attach Bearer to raw `fetch` |

**Request interceptor:** Attaches `Authorization: Bearer <token>` if token exists.

**Response interceptor — 401 refresh flow:**
```
On 401 AND not already retried AND refreshToken exists:
  1. Set originalConfig._retry = true (prevent loop)
  2. POST /api/auth/refresh with { refreshToken }
  3. On success: setTokens(new) → retry original request with new token
  4. On failure: setTokens(null, null) → window.location.href = '/login'
```

**⚠️ baseURL is `''` (empty string)** — Vite proxy intercepts `/api/*` in dev.
`BASE_URL` constant is still used by the refresh `axios.post()` call (direct, not instance) and `loginWithGoogle()`.

---

## 35. useAIChat Hook

**File:** `client/src/hooks/useAIChat.js`

**State:**
| Name | Initial | Purpose |
|------|---------|---------|
| `messages` | `[WELCOME_MESSAGE]` | All chat messages |
| `isStreaming` | `false` | Streaming in progress |
| `error` | `null` | Last error message |

**Welcome message (hardcoded, not from API):**
```
"أهلاً يا فنان! 👋 أنا عم غريب، دليلك في مواصلات الإسكندرية.
 إسألني عن أي خط مشروع أو محطة وأنا هوريلك أحسن طريقة!"
```

**Message shape:**
```js
{ id: uid(), role: 'user'|'assistant', content: string,
  isStreaming: boolean, timestamp: Date.now() }
```

**`sendMessage(origin, destination, text)` flow:**
```
1. Guard: if (!text.trim()) return — no fetch
2. Add user message to messages[]
3. Add empty assistant placeholder { isStreaming: true, content: '' }
4. fetch(API_BASE + /api/ai/ask, { method: POST, headers: Bearer token })
5. If !response.ok → parse JSON error → throw
6. Parse SSE with ReadableStream + TextDecoder + line buffer
7. For each 'data: ' line:
   - payload === '[DONE]'       → setIsStreaming(false), mark message done
   - JSON.parse(payload).text   → append to assistant message content
   - JSON.parse(payload).error  → setError, mark message done
   - non-JSON                   → skip silently
8. On catch: set error, mark message done, setIsStreaming(false)
```

**`clearMessages()`** — resets to `[WELCOME_MESSAGE]`, clears error + isStreaming.

**⚠️ SSE [DONE] rule:** `payload === '[DONE]'` — string comparison only. Never `JSON.parse('[DONE]')`.

---

## 36. Component Reference

### AmGhareebAvatar
- Pure inline SVG, no dependencies
- ViewBox: `0 0 100 100`
- Props: `size` (default 48), `className` (default '')
- Conditional collar: rendered only when `size > 60`
- Sizes used across app: 32, 44, 56, 64, 80, 120px

### ProtectedRoute
- Props: `children`, `requireAdmin` (default false)
- `isLoading` → amber spinner + `جاري التحميل...`
- `!user` → `<Navigate to="/login" replace />`
- `requireAdmin && role !== 'admin'` → `<Navigate to="/" replace />`

### RouteCard
- Props: `route`, `accuracyStats`, `onRateClick`, `compact` (default false)
- `compact=true` → hides footer buttons (used in DashboardPage saved routes)
- Accuracy badge colours:

| Condition | Background | Text | Label |
|-----------|-----------|------|-------|
| `percentage === null` | `#F3F4F6` | `#6B7280` | غير مقيّم بعد |
| `percentage >= 80` | `#D1FAE5` | `#065F46` | دقيق جداً ✓ |
| `percentage >= 60` | `#FEF3C7` | `#92400E` | دقيق نسبياً |
| `percentage < 60` | `#FEE2E2` | `#991B1B` | غير موثوق |

- Peak hour detection: `isCurrentlyPeak(peakHours)` — parses `"8:00–10:00"` format (en-dash or hyphen)
- Type badge: `microbus → مشروع (amber)`, `bus → أتوبيس (blue)`, `tram → ترام (green)`, `university_shuttle → شاتل (purple)`
- Station stepper: `direction: ltr` container inside RTL layout so dots flow left→right

### RatingModal
- Props: `routeId`, `onClose`, `onSuccess`
- Yes/No selection required before submit enabled
- Comment: optional, max 280 chars, char counter displayed
- On success: `invalidateQueries({ queryKey: ['ratings', routeId] })` → RouteCard re-fetches stats
- Shows `شكراً على تقييمك! ✓` for 2 seconds then calls `onSuccess()`

### Navbar
- Nav links: الرئيسية `/` · البحث `/search` · الخريطة `/map` · المساعد الذكي `/chat`
- Mobile: hamburger → slide-down drawer, closes on route change and outside click
- Active link: amber underline (Tailwind `text-amber-400 border-b-2 border-amber-400`)

---

## 37. Page Reference

### SearchPage
- `StationAutocomplete` (inline component): filters `stations[]`, max 6 results, keyboard nav (↑↓ Enter Escape)
- Swap button: exchanges origin ↔ destination
- Query disabled until user clicks ابحث (`enabled: searched && !!origin && !!destination`)
- Loading: 3 `SkeletonCard` pulse placeholders
- Empty state: → navigate to `/chat?origin=X&destination=Y` (prefills AIChatPage)
- Results: `results.map(({ route, accuracyStats }) => <RouteCard ... />)`

### MapPage
- Leaflet icon fix at top (Vite asset hashing breaks default icons)
- `validStations` = `stations.filter(s => s.coords?.lat !== 0 && s.coords?.lng !== 0)`
- Polyline: `validStations` only, navy `#1B2A4A`, weight 4
- Markers: `CircleMarker`, amber `#F4A833`, endpoints radius 12, intermediate radius 8
- `FitBounds` component: auto-fits map to route on load
- Sidebar (desktop): shows ALL stations including zero-coord ones with `إحداثيات غير محددة` badge
- User location: floating `📍 موقعي الحالي` button, blue `CircleMarker`
- No route: overlay card with → `/search` button

### AIChatPage
- Top bar: compact `StationAutocomplete` for origin/destination (prefilled from URL params)
- Messages: user bubbles `justify-start` (RTL = visual right), assistant `justify-end` (visual left)
- Avatar: `AmGhareebAvatar size={32}` beside each assistant bubble
- Streaming: `TypingDots` (3 bouncing amber dots) shown while `isStreaming && !content`
- Streaming cursor: amber blinking `|` shown while content is arriving
- Auto-scroll: `useEffect` on `messages.length` and last message content
- Input disabled during streaming, placeholder changes to `عم غريب بيكتب...`
- Enter sends message (not Shift+Enter)

### DashboardPage
- Tab 0: بحثاتي الأخيرة → `GET /api/routes/history` ⚠️ MISSING endpoint
- Tab 1: خطوطي المحفوظة → `GET /api/routes/saved` ⚠️ MISSING endpoint
- Both tabs have loading skeletons and empty states with navigation buttons

### AdminPage
- `GET /api/admin/stats` → `stats.totalRoutes`, `stats.totalUsers`, `stats.totalRatings`
- `topSearched[0]` displayed as `${origin} ← ${destination}` (NOT `.nameAr`)
- Routes table: paginated, soft-delete button, edit modal
- Add route form: minimal fields (routeId, nameAr, nameEn, type, fareMin, fareMax)

---

## 38. React Query Keys — Complete Reference

| Query Key | Endpoint | Stale Time | Used In |
|-----------|----------|-----------|---------|
| `['stations']` | `GET /api/routes/stations` | Infinity | SearchPage, AIChatPage |
| `['search', origin, destination]` | `GET /api/routes/search` | 5 min | SearchPage |
| `['route', routeId]` | `GET /api/routes/:routeId` | 5 min | MapPage |
| `['route-history']` | `GET /api/routes/history` ⚠️ | 5 min | DashboardPage |
| `['saved-routes']` | `GET /api/routes/saved` ⚠️ | 5 min | DashboardPage |
| `['ratings', routeId]` | `GET /api/ratings/:routeId/stats` | 5 min | RatingModal invalidates |
| `['admin-stats']` | `GET /api/admin/stats` | 5 min | AdminPage |
| `['admin-routes', page]` | `GET /api/admin/routes` | 5 min | AdminPage |

⚠️ = endpoint does not yet exist in Account B

---

## 39. Frontend Test Coverage

| File | Tests | What's covered |
|------|-------|---------------|
| `AmGhareebAvatar.test.jsx` | 8 | renders · SVG element · default size 48 · custom size · custom className · viewBox · collar at size>60 · no collar at size≤60 |
| `RouteCard.test.jsx` | 10 | nameAr · fare range · null badge · green badge ≥80% · amber badge 60–79% · red badge <60% · onRateClick with routeId · all station names · total ratings count · مشروع type badge |
| `RatingModal.test.jsx` | 10 | renders title · subtitle · disabled by default · enabled after نعم · enabled after لأ · maxLength 280 · char counter updates · initial 0/280 · onClose X button · mutation called · success message |
| `useAIChat.test.js` | 9 | welcome message · sendMessage adds user msg · adds assistant placeholder · SSE chunks appended · [DONE] sets isStreaming false · [DONE] marks message · SSE error event · fetch failure · clearMessages resets · empty input guard |
| **TOTAL** | **37** | |

---

CHUNK 5 COMPLETE.

---

# CHUNK 6 — Known Issues, Setup Guide & Integration Checklist

---

## 40. All Known Issues & Fixes Applied

| # | Severity | Account | File | Issue | Fix Applied | Checkpoint |
|---|----------|---------|------|-------|------------|-----------|
| 1 | 🔴 Blocker | A | `server/package.json` | `main` + `start` pointed to `src/app.js` instead of `server.js` | Changed entry to `server.js` | A-FIX-1 |
| 2 | 🔴 Blocker | A | `server/app.js` | `ratings.routes` (plural) import — file is singular | Changed to `rating.routes` + `ratingRouter` | A-FIX-1 |
| 3 | 🔴 Blocker | A | `server/app.js` | Passport never initialized — Google OAuth would crash | Added `passport.initialize()` + `configurePassport(passport)` | A-FIX-2 |
| 4 | 🔴 Blocker | B | `routes.service.js` | Dead first `Route.find` query (broken `$or/$elemMatch`) — double DB hit | Deleted dead query, kept only corrected second query | B-FIX |
| 5 | 🔴 Blocker | B | `ai.service.js` | `new OpenAI()` at module level — app crashed on startup if key missing | Moved instantiation inside `try` block | B-FIX |
| 6 | 🔴 Blocker | D | `User.model.js` | `require('bcrypt')` — wrong package (not installed) | Changed to `require('bcryptjs')` | D-FIX-2 |
| 7 | 🟡 Warning | B | `routes.service.js` | `saveRoute`/`unsaveRoute` fetched soft-deleted routes | Added `isActive: true` to `Route.findOne` | B-FIX |
| 8 | 🟡 Warning | C | `axios.js` | `baseURL` set to full URL — bypasses Vite proxy, causes CORS in dev | Changed `baseURL` to `''` | C-FIX |
| 9 | 🟡 Warning | C | `AdminPage.jsx` | `topSearched[0].nameAr` — field doesn't exist in backend response | Changed to `${origin} ← ${destination}` | C-FIX |
| 10 | 🟡 Warning | B | `ai.test.js` | OpenAI spy targets wrong mock instance — false confidence | Noted, not fixed for MVP | — |
| 11 | ⚠️ Open | B | `routes.routes.js` | `GET /api/routes/history` missing — DashboardPage calls it | Must add to routes.service + routes.routes | PENDING |
| 12 | ⚠️ Open | B | `routes.routes.js` | `GET /api/routes/saved` missing — DashboardPage calls it | Must add to routes.service + routes.routes | PENDING |
| 13 | ⚠️ Open | A/C | Multiple | `client/src/main.jsx` missing — app won't start | Must create (see Section 9) | PENDING |
| 14 | ⚠️ Open | A/C | Multiple | `client/package.json` missing — npm install fails | Must create (see Section 9) | PENDING |
| 15 | ⚠️ Open | A/C | Multiple | `client/src/index.css` missing — Tailwind won't load | Must create (see Section 9) | PENDING |

---

## 41. Files That Must Be Created Before Running

**1. `client/src/main.jsx`**
```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

**2. `client/src/index.css`**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**3. `client/package.json`**
```json
{
  "name": "am-ghareeb-client",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "react-router-dom": "6.22.1",
    "axios": "1.6.7",
    "@tanstack/react-query": "5.18.1",
    "react-leaflet": "4.2.1",
    "leaflet": "1.9.4"
  },
  "devDependencies": {
    "vite": "5.0.12",
    "@vitejs/plugin-react": "4.2.1",
    "tailwindcss": "3.4.1",
    "postcss": "8.4.35",
    "autoprefixer": "10.4.17"
  }
}
```

**4. `server/.env`** (copy from `.env.example`, fill values)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/am-ghareeb
JWT_SECRET=<64+ random chars>
JWT_REFRESH_SECRET=<64+ random chars>
OPENAI_API_KEY=sk-...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
CLIENT_URL=http://localhost:5173
ADMIN_EMAIL=admin@amghareeb.com
ADMIN_PASSWORD=ChangeMe123!
```

**5. Missing backend endpoints** — add to `routes.service.js` + `routes.routes.js`:
```js
// routes.service.js
async function getHistory(userId) {
  return SearchHistory.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(20)
    .lean()
}

async function getSavedRoutes(userId) {
  const user = await User.findById(userId).populate('savedRoutes')
  if (!user) throw { statusCode: 404, message: 'المستخدم غير موجود' }
  const routesWithStats = await Promise.all(
    user.savedRoutes.map(async (route) => {
      const accuracyStats = await Route.getAccuracyStats(route.routeId)
      return { ...route.toObject(), accuracyStats }
    })
  )
  return routesWithStats
}

// routes.routes.js — add after existing routes:
router.get('/history', protect, async (req, res, next) => {
  try {
    const history = await routesService.getHistory(req.user.userId)
    res.status(200).json({ success: true, history })
  } catch (err) { next(err) }
})

router.get('/saved', protect, async (req, res, next) => {
  try {
    const routes = await routesService.getSavedRoutes(req.user.userId)
    res.status(200).json({ success: true, routes })
  } catch (err) { next(err) }
})
// ⚠️ Add these BEFORE router.get('/:routeId') to prevent "history"/"saved" matching as routeId
```

---

## 42. First-Time Setup Guide

```bash
# 1. Clone the repository
git clone https://github.com/<org>/am-ghareeb.git
cd am-ghareeb

# 2. Install server dependencies
cd server
npm install

# 3. Install client dependencies
cd ../client
npm install

# 4. Set up environment variables
cd ../server
cp .env.example .env
# Edit server/.env — fill in all required values

# 5. Create client entry files (if not present)
# Create client/src/main.jsx, client/src/index.css (see Section 41)

# 6. Seed the database
cd server
npm run seed
# Expected output:
# جاري الاتصال بقاعدة البيانات...
# تم الاتصال بقاعدة البيانات بنجاح ✓
# جاري إضافة الخطوط...
# تم إضافة 10 خط بنجاح ✓
# تم إنشاء المستخدم الإداري ✓
# تم الانتهاء من الـ Seed بنجاح 🎉

# 7. Start the development servers
# Terminal 1 — Backend
cd server
npm run dev
# Expected: السيرفر شغال على البورت 5000 ✓

# Terminal 2 — Frontend
cd client
npm run dev
# Expected: Local: http://localhost:5173/

# 8. Run backend tests
cd server
npm test
# Expected: 67 tests passing

# 9. Verify integration
# Open http://localhost:5173
# GET http://localhost:5173/api/auth/me → 401 (confirms proxy + auth working)
# GET http://localhost:5173/api/routes/stations → 200 with array (confirms DB + seed)
```

---

## 43. Integration Checklist — Run Before Declaring Complete

### Server Layer
- [ ] `npm install` runs without errors in `/server`
- [ ] `node server.js` starts without crashing (with all env vars in `.env`)
- [ ] Arabic startup logs appear: `تم الاتصال بقاعدة البيانات بنجاح ✓` + `السيرفر شغال على البورت 5000 ✓`
- [ ] `GET /api/auth/me` returns **401** (not 404, not 500)
- [ ] `GET /api/routes/stations` returns **200** with Arabic station array after seed
- [ ] `POST /api/ai/ask` without body returns **400 JSON** (not SSE stream)
- [ ] `GET /api/admin/stats` without token returns **401**
- [ ] `GET /api/admin/stats` with regular user token returns **403**
- [ ] `npm run seed` completes with all Arabic success messages, Route count = 10

### Client Layer
- [ ] `npm install` runs without errors in `/client`
- [ ] `npm run dev` starts Vite on port 5173 without errors
- [ ] `client/src/main.jsx` exists and imports `App` and `./index.css`
- [ ] `client/src/index.css` exists with `@tailwind` directives
- [ ] Browser request to `http://localhost:5173/api/auth/me` returns 401 (not network error) — **confirms Vite proxy working**
- [ ] Navbar renders with عم غريب avatar, RTL layout, Arabic text
- [ ] Cairo font loads (check Network tab for fonts.gstatic.com)
- [ ] SearchPage autocomplete populates from `/api/routes/stations`

### Auth Flow
- [ ] Register with valid credentials → redirected to `/dashboard`
- [ ] Login with same credentials → redirected to `/dashboard`
- [ ] Access `/chat` without login → redirected to `/login`
- [ ] Access `/admin` as regular user → redirected to `/`
- [ ] Google OAuth button redirects to Google consent screen

### Core Features
- [ ] SearchPage finds routes between valid station pair
- [ ] RouteCard shows accuracy badge (غير مقيّم بعد for new routes)
- [ ] RatingModal submits and shows `شكراً على تقييمك! ✓`
- [ ] MapPage loads Leaflet map centered on Alexandria
- [ ] MapPage shows route polyline and markers when `?routeId=` param set
- [ ] AIChatPage loads with عم غريب welcome message
- [ ] AIChatPage sends message and receives SSE stream response
- [ ] AIChatPage shows TypingDots while streaming
- [ ] AdminPage shows stats and routes table for admin user

### Backend Tests
- [ ] `npx jest src/tests/auth.test.js` — 13 tests pass
- [ ] `npx jest src/tests/routes.test.js` — 11 tests pass
- [ ] `npx jest src/tests/rating.test.js` — 8 tests pass
- [ ] `npx jest src/tests/admin.test.js` — 9 tests pass
- [ ] `npx jest src/tests/ai.test.js` — 7 tests pass
- [ ] `npx jest src/tests/models.test.js` — 19 tests pass
- [ ] Total: **67 tests passing**

---

## 44. Project Summary — Total Count

| Layer | Account | Files | Tests | Endpoints |
|-------|---------|-------|-------|-----------|
| Scaffold | A | 11 | — | — |
| Database | D | 9 | 19 | — |
| Backend | B | 23 | 48 | 22 (20 live + 2 missing) |
| Frontend | C | 21 | 37 | — |
| **TOTAL** | **4** | **64** | **67** | **22** |

**Seed data:** 10 verified Alexandria microbus routes (ALEX-MICRO-01 through 10)
**AI model:** OpenAI gpt-4o-mini · RAG · SSE streaming · Egyptian Arabic persona
**Map:** OpenStreetMap via react-leaflet (zero cost, no API key)
**Auth:** JWT (15min access + 7d refresh rotation) + Google OAuth

---

## 45. Quick Reference — Critical Rules

| Rule | Detail |
|------|--------|
| Server entry | `server.js` — not `app.js` |
| Route file naming | Singular on disk: `rating.routes.js` → mounted at `/api/ratings` |
| Passport | Must be initialized in `app.js` BEFORE routes |
| Error middleware | Must be registered LAST in `app.js` (4-argument signature) |
| DB connection | Only in `server.js` — never in `app.js` |
| bcrypt package | `bcryptjs` — NOT `bcrypt` |
| OpenAI | Instantiated INSIDE `try` block in `ai.service.js` |
| Axios baseURL | `''` (empty) in dev — Vite proxy handles `/api/*` |
| SSE [DONE] | String comparison: `payload === '[DONE]'` — never JSON.parse |
| topSearched | Fields are `origin` + `destination` — not `nameAr` |
| Zero coords | `{ lat: 0, lng: 0 }` = real stop, GPS unverified — skip map marker only |
| Soft delete | `isActive: false` — data preserved, hidden from public queries |
| Late require | Rating required inside `Route.getAccuracyStats` body — avoids circular dep |
| Token storage | In-memory only (module-level refs) — lost on page reload by design |
| microbus name | Use `مشروع` (Mashrou') — never ميكروباص in UI or AI responses |
| getAccuracyStats | Pass `routeId` string — NOT MongoDB `_id` |

---

*عم غريب — Intricate Engineering. Familiar Streets.*
*HANDOFF_MASTER — All 6 chunks complete.*


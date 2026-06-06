# HANDOFF_B.md — Account B Backend Complete
### عم غريب (Am Ghareeb) · Wave 3 · Status: ✅ Verified & Delivered

> **From:** Account B (Backend Engineer)
> **To:** Accounts C (AI), D (Frontend), and integration lead
> **Prerequisite satisfied:** Account A scaffold (13 files) ✅

---

## 1. Delivery Summary

Account B produced **23 source files** across 3 chunks plus one post-delivery bug-fix pass.
All files have been verified, fixed where needed, and extracted as final versions.

| Chunk | Scope | Files | Status |
|-------|-------|-------|--------|
| B1 | Middleware layer + Auth | 8 files | ✅ Done |
| B2 | Routes API + Rating + Admin | 7 files | ✅ Done |
| B3 | AI/RAG pipeline + Tests + README | 10 files | ✅ Done |
| B-FIX | Bug fixes on 2 services | 2 files replaced | ✅ Verified 10/10 |

---

## 2. Complete File Manifest

Every file below is the **final verified version**. Place each at the listed path inside `server/`.

### Middleware — `server/src/middleware/`

| File | Exports | Notes |
|------|---------|-------|
| `error.middleware.js` | `errorMiddleware` | 4-arg handler; register **last** in app.js |
| `auth.middleware.js` | `{ protect, requireAdmin }` | JWT verify; propagates JWT errors to error handler |
| `validate.middleware.js` | `validate` | Joi schema factory; passes `{ isJoi, details }` on failure |
| `rateLimit.middleware.js` | `{ authLimiter, apiLimiter, aiLimiter }` | Three distinct limiters |

### Config — `server/src/config/`

| File | Exports | Notes |
|------|---------|-------|
| `passport.js` | `(passport) => {}` | Google OAuth20 strategy; call in app.js before routes |

### Services — `server/src/services/`

| File | Exports | Notes |
|------|---------|-------|
| `auth.service.js` | `{ generateTokens, register, login, refreshTokens, logout, getMe }` | All auth business logic + JWT rotation |
| `routes.service.js` ⚠️ | `{ searchRoutes, getStations, getRouteById, saveRoute, unsaveRoute }` | **Fixed:** single `Route.find`, `isActive: true` on save/unsave |
| `rating.service.js` | `{ submitRating, getRatingStats }` | Upsert pattern; delegates stats to `Route.getAccuracyStats` |
| `admin.service.js` | `{ getAllRoutes, createRoute, updateRoute, softDeleteRoute, getStats }` | Soft-delete only; parallel `Promise.all` for stats |
| `ai.service.js` ⚠️ | `{ streamTransitAdvice }` | **Fixed:** OpenAI client instantiated inside try block |

### Controllers — `server/src/controllers/`

| File | Exports | Notes |
|------|---------|-------|
| `auth.controller.js` | `{ register, login, refresh, logout, getMe, googleCallback }` | Thin wrappers; all async/try/catch/next(err) |
| `routes.controller.js` | `{ search, getStations, getRouteById, saveRoute, unsaveRoute }` | Reads `req.user?.userId` (optional auth on search) |

### Routes — `server/src/routes/`

| File | Mount point in app.js | Notes |
|------|-----------------------|-------|
| `auth.routes.js` | `app.use('/api/auth', authRouter)` | Schemas inline; Google OAuth endpoints included |
| `routes.routes.js` | `app.use('/api/routes', routesRouter)` | `optionalProtect` defined inline; `/search` before `/:routeId` |
| `rating.routes.js` | `app.use('/api/ratings', ratingRouter)` | Controller + router in one file |
| `admin.routes.js` | `app.use('/api/admin', adminRouter)` | Controller + router in one file; `router.use(protect, requireAdmin)` at top |
| `ai.routes.js` | `app.use('/api/ai', aiRouter)` | Controller inline; validation before SSE headers |

### AI — `server/src/ai/`

| File | Exports | Notes |
|------|---------|-------|
| `promptBuilder.js` | `{ buildSystemPrompt }` | Pure string builder; no DB imports; persona text verbatim |

### Tests — `server/src/tests/`

| File | Coverage |
|------|----------|
| `auth.test.js` | register (5), login (3), refresh (2), me (2), logout (1) = 13 tests |
| `routes.test.js` | search (4), stations (2), getById (2), save/unsave (3) = 11 tests |
| `ai.test.js` | auth guard, validation, SSE headers, DB spy, prompt spy = 6 tests |
| `rating.test.js` | submit (4), stats thresholds (4) = 8 tests |
| `admin.test.js` | list (3), create (2), update (2), delete (1), stats (1) = 9 tests |

### Docs — `server/`

| File | Contents |
|------|----------|
| `README.md` | Architecture diagram, full 19-endpoint API table, middleware stack, RAG pipeline, persona rules, auth flow, rate limits table, env vars, test commands, integration contracts |

---

## 3. Bug Fixes Applied (B-FIX)

Two bugs were caught and corrected before final extraction. Both services were re-verified after the fix.

### Fix 1 — `routes.service.js`

**Problem:** `searchRoutes()` contained a dead first `Route.find` call using a broken `$or/$elemMatch` query that was never cleaned up. The variable `results` was assigned but never used. The function effectively ran two DB queries, discarding the first one's output.

**Fix:** Deleted the entire dead block. The function now contains exactly **one** `Route.find` call using the correct `$and` + `$elemMatch` pattern.

**Problem 2:** `saveRoute` and `unsaveRoute` both called `Route.findOne({ routeId })` — meaning a soft-deleted route (where `isActive: false`) could still be saved to a user's list.

**Fix:** Both now call `Route.findOne({ routeId, isActive: true })`.

### Fix 2 — `ai.service.js`

**Problem:** `const openai = new OpenAI(...)` was instantiated at module load time (top of file). This means if `OPENAI_API_KEY` is missing or invalid, the module throws on `require()` — crashing the entire server before any request is handled. It also makes mocking in tests harder.

**Fix:** Removed the module-level instantiation. `const openai = new OpenAI(...)` is now the first line inside the `try` block of `streamTransitAdvice()`. Any instantiation error is caught by the existing catch block and returned as an SSE error event.

### B-FIX Verification Checklist Results

```
[✅]  routes.service.js — only ONE Route.find call in searchRoutes()
[✅]  routes.service.js — saveRoute uses Route.findOne({ routeId, isActive: true })
[✅]  routes.service.js — unsaveRoute uses Route.findOne({ routeId, isActive: true })
[✅]  ai.service.js — NO const openai = ... at module level
[✅]  ai.service.js — const openai = new OpenAI(...) inside try block (line 26)
[✅]  ai.service.js — SSE headers set before try block
[✅]  ai.service.js — for-await stream loop inside try block
[✅]  ai.service.js — catch sends SSE error event, not next(err)
[✅]  All functions exported correctly
[✅]  No placeholder code introduced

Result: 10/10 passed
```

---

## 4. Integration Guide for Account C (AI Engineer)

Account C owns the AI route and persona. Account B has already built the full pipeline — C's job is to tune it, not rebuild it.

**What's already done:**

- `POST /api/ai/ask` is live and protected by `protect` + `aiLimiter`
- RAG pipeline: regex DB query → Arabic context string → prompt injection → OpenAI stream → SSE to client
- Am Ghareeb system prompt is in `server/src/ai/promptBuilder.js` — edit persona rules there
- OpenAI model is `gpt-4o-mini`, `max_tokens: 600`, `temperature: 0.7` — tune in `ai.service.js`

**SSE contract (do not change the wire format):**

```
data: {"text": "<chunk>"}\n\n
data: [DONE]\n\n
data: {"error": "حدث خطأ، حاول مرة تانية"}\n\n   ← on failure
```

**Validation rules (enforced before SSE headers):**

- `origin` — required string, non-empty
- `destination` — required string, non-empty
- `message` — required string, non-empty, max 500 chars
- Validation failures return `Content-Type: application/json` with HTTP 400 — not an SSE event

**Rate limit:** 20 requests per hour per `userId` (falls back to IP for unauthenticated — but the route requires auth, so it will always key by `userId`).

**To extend conversation history:** add a `history` array field to the request body and pass previous turns as the `messages` array to OpenAI before the current user message. The current implementation is single-turn.

---

## 5. Integration Guide for Account D (Frontend Engineer)

### Base URL

```
Development:  http://localhost:5000/api
Production:   proxied via Vite /api → :5000
```

### Auth Flow

1. **Register** `POST /api/auth/register` → receive `{ accessToken, refreshToken, user }`
2. **Store** `accessToken` in memory (not localStorage); `refreshToken` in httpOnly cookie or secure storage
3. **Attach** to every protected request: `Authorization: Bearer <accessToken>`
4. **Refresh** when you get a 401: `POST /api/auth/refresh` with `{ refreshToken }` → new pair
5. **Logout** `POST /api/auth/logout` — nullifies server-side refresh token

### Token shapes

```js
// Access token payload (decoded)
{ userId: "...", role: "user" | "admin", iat: ..., exp: ... }

// Auth response shape
{
  success: true,
  user: { _id, name, email, role },
  accessToken: "<JWT, 15m>",
  refreshToken: "<JWT, 7d>"
}
```

### Route search

```
GET /api/routes/search?origin=المندرة&destination=محطة+مصر
Authorization: Bearer <token>   ← optional; omit if not logged in

Response:
{
  "success": true,
  "results": [
    {
      "route": { routeId, nameAr, nameEn, stations[], fare, peakHours, tips, ... },
      "accuracyStats": { total, accurate, percentage, label }
    }
  ]
}
```

Arabic accuracy labels for display:

| `label` value | When shown |
|---------------|-----------|
| `غير مقيّم بعد` | Fewer than 3 ratings |
| `دقيق جداً` | 80%+ accurate |
| `دقيق نسبياً` | 60–79% accurate |
| `غير موثوق` | Below 60% accurate |

### AI chat (SSE)

```js
const res = await fetch('/api/ai/ask', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`,
  },
  body: JSON.stringify({ origin, destination, message }),
})

const reader = res.body.getReader()
const decoder = new TextDecoder()

while (true) {
  const { done, value } = await reader.read()
  if (done) break
  const lines = decoder.decode(value).split('\n\n')
  for (const line of lines) {
    if (!line.startsWith('data: ')) continue
    const payload = line.slice(6)
    if (payload === '[DONE]') break
    const { text, error } = JSON.parse(payload)
    if (error) { /* show error to user */ }
    if (text) { /* append to chat bubble */ }
  }
}
```

### Key error codes

| HTTP Status | Meaning | Typical action |
|-------------|---------|----------------|
| 400 | Validation failure — `errors[]` array in body | Show field errors |
| 401 | No token / expired / invalid | Redirect to login or refresh |
| 403 | Logged in but not admin | Show "غير مصرح" |
| 404 | Route/resource not found | Show empty state |
| 409 | Duplicate (email already registered) | Show inline error |
| 429 | Rate limit hit — `message` in body | Show cooldown message |
| 500 | Server error | Show generic Arabic error |

### Optional auth on search

The search endpoint accepts an optional `Authorization` header. If a valid token is present, the search is logged to `SearchHistory` (used for `GET /api/admin/stats` top searches). If omitted, the search still works — no history is saved.

---

## 6. What Account B Does NOT Own

The following are explicitly out of scope for Account B. Do not raise issues against B for these:

| Item | Owner |
|------|-------|
| `server/app.js` — mounting all routers | Account A (scaffold, already done) |
| `server/server.js` — DB bootstrap + listen | Account A (scaffold, already done) |
| `server/src/models/*` — all four Mongoose models | Account A (scaffold, already done) |
| `server/src/scripts/seed.js` — DB seeding script | Account A (scaffold, already done) |
| OpenAI model selection / prompt tuning | Account C |
| Multi-turn conversation history | Account C |
| All React components and UI | Account D |
| Vite proxy config / CORS headers on client | Account D |

---

## 7. Environment Variables Required by B's Code

All must be present in `server/.env` before `npm run dev`.

```env
MONGODB_URI=                  # MongoDB Atlas URI
JWT_SECRET=                   # Random string, min 32 chars
JWT_REFRESH_SECRET=           # Different random string, min 32 chars
OPENAI_API_KEY=               # sk-...
GOOGLE_CLIENT_ID=             # From Google Cloud Console
GOOGLE_CLIENT_SECRET=         # From Google Cloud Console
GOOGLE_CALLBACK_URL=          # http://localhost:5000/api/auth/google/callback
CLIENT_URL=                   # http://localhost:5173
NODE_ENV=development          # Enables stack traces in error responses
PORT=5000                     # Optional; defaults to 5000
```

---

## 8. Running the Test Suite

```bash
# From server/
npm test

# Single file
npx jest src/tests/auth.test.js --verbose

# With coverage
npx jest --coverage
```

Required devDependencies (should already be in `package.json` from Account A's scaffold):

```
mongodb-memory-server
jest
babel-jest
@babel/core
@babel/preset-env
supertest
```

Tests use `mongodb-memory-server` exclusively — no live MongoDB connection needed.
The OpenAI SDK is fully mocked in `ai.test.js` via `jest.mock('openai')`.

---

## 9. Known Constraints & Decisions to Preserve

| Decision | Reason | Do not change without coordinating |
|----------|--------|------------------------------------|
| `rating.routes.js` uses upsert, not create | Prevents 11000 duplicate-key errors on re-rating | C, D |
| `GET /api/routes/search` registered before `GET /api/routes/:routeId` | Prevents Express matching the string `"search"` as a routeId param | D |
| `errorMiddleware` must be the last `app.use()` in `app.js` | Express only treats 4-arg functions as error handlers when last | A |
| `passport.js` exported as `(passport) => {}` factory | Must be called as `configurePassport(passport)` in `app.js` | A |
| `generateTokens` is exported from `auth.service.js` | Used directly by `auth.controller.js` for the Google OAuth callback | — |
| SSE validation errors are JSON 400, not SSE events | Client cannot parse SSE before `EventSource` is open | C, D |
| Soft-delete on `DELETE /api/admin/routes/:id` | Preserves data for analytics; route disappears from all public queries via `isActive: true` filters | A, D |

---

*Account B — Backend Engineer · Chunks B1 ✅ B2 ✅ B3 ✅ B-FIX ✅ · All 23 files verified*

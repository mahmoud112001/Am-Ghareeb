# Account C — Frontend Engineer Handoff
## Project: عم غريب (Am Ghareeb) — Alexandria Microbus Transit Guide
## Status: COMPLETE ✅ | Audited ✅ | All Fixes Applied ✅

---
<!-- PHASE 1 OF 2 — File Manifest · Architecture · Routing · Design Tokens · API Map -->
---

## 1. File Manifest (21 Files · 4,046 Lines)

All files are final. No TODOs. No placeholders. Paths are relative to `client/`.

| # | File | Destination Path | Lines | Notes |
|---|------|-----------------|-------|-------|
| 1 | `axios.js` | `src/lib/axios.js` | 83 | ✅ Fix: baseURL → `''` for Vite proxy |
| 2 | `AuthContext.jsx` | `src/context/AuthContext.jsx` | 111 | ✅ Fix: OAuth finally-block added |
| 3 | `App.jsx` | `src/App.jsx` | 104 | Lazy routes, QueryClient, AuthProvider |
| 4 | `AmGhareebAvatar.jsx` | `src/components/AmGhareebAvatar.jsx` | 148 | Pure inline SVG, no external assets |
| 5 | `ProtectedRoute.jsx` | `src/components/ProtectedRoute.jsx` | 48 | Auth + admin role guard |
| 6 | `Navbar.jsx` | `src/components/layout/Navbar.jsx` | 235 | RTL, mobile drawer, auth state |
| 7 | `LoginPage.jsx` | `src/pages/LoginPage.jsx` | 225 | Email/password + Google OAuth |
| 8 | `RegisterPage.jsx` | `src/pages/RegisterPage.jsx` | 242 | Real-time field validation |
| 9 | `HomePage.jsx` | `src/pages/HomePage.jsx` | 201 | Hero, stats row, features, CTA |
| 10 | `SearchPage.jsx` | `src/pages/SearchPage.jsx` | 304 | Autocomplete, swap, skeleton, empty state |
| 11 | `RouteCard.jsx` | `src/components/RouteCard.jsx` | 217 | Stepper, fare, peak hours, accuracy badges |
| 12 | `RatingModal.jsx` | `src/components/RatingModal.jsx` | 174 | YES/NO, char counter, mutation |
| 13 | `useAIChat.js` | `src/hooks/useAIChat.js` | 152 | SSE fetch, stream parser, clearMessages |
| 14 | `MapPage.jsx` | `src/pages/MapPage.jsx` | 286 | Leaflet, CircleMarker, FitBounds, zero-coord filter |
| 15 | `AIChatPage.jsx` | `src/pages/AIChatPage.jsx` | 349 | Streaming UI, RTL bubbles, typing dots |
| 16 | `DashboardPage.jsx` | `src/pages/DashboardPage.jsx` | 238 | Tabs: history + saved routes |
| 17 | `AdminPage.jsx` | `src/pages/AdminPage.jsx` | 478 | ✅ Fix: route pairs + stats nesting + pages key |
| 18 | `AmGhareebAvatar.test.jsx` | `src/components/__tests__/` | 58 | 8 tests |
| 19 | `RouteCard.test.jsx` | `src/components/__tests__/` | 95 | 10 tests |
| 20 | `RatingModal.test.jsx` | `src/components/__tests__/` | 114 | 10 tests |
| 21 | `useAIChat.test.js` | `src/hooks/__tests__/` | 184 | 9 tests |

---

## 2. Directory Structure

```
client/
├── index.html                            ← from Account A (lang="ar" dir="rtl", Cairo font)
├── vite.config.js                        ← from Account A (/api → localhost:5000 proxy)
├── tailwind.config.js                    ← from Account A (navy + amber tokens)
├── postcss.config.js                     ← from Account A
├── package.json                          ← from Account A
└── src/
    ├── App.jsx
    ├── lib/
    │   └── axios.js
    ├── context/
    │   └── AuthContext.jsx
    ├── hooks/
    │   ├── useAIChat.js
    │   └── __tests__/
    │       └── useAIChat.test.js
    ├── components/
    │   ├── AmGhareebAvatar.jsx
    │   ├── ProtectedRoute.jsx
    │   ├── RouteCard.jsx
    │   ├── RatingModal.jsx
    │   ├── layout/
    │   │   └── Navbar.jsx
    │   └── __tests__/
    │       ├── AmGhareebAvatar.test.jsx
    │       ├── RouteCard.test.jsx
    │       └── RatingModal.test.jsx
    └── pages/
        ├── HomePage.jsx
        ├── LoginPage.jsx
        ├── RegisterPage.jsx
        ├── SearchPage.jsx
        ├── MapPage.jsx
        ├── AIChatPage.jsx
        ├── DashboardPage.jsx
        └── AdminPage.jsx
```

---

## 3. Component Architecture

```
App.jsx
├── QueryClientProvider          (react-query — staleTime 5min default)
├── AuthProvider                 (AuthContext: user, isLoading, login, logout,
│                                 register, loginWithGoogle, updateUser)
└── BrowserRouter  [dir="rtl", font: Cairo]
    │
    ├── Navbar
    │   └── AmGhareebAvatar (size=44)
    │
    └── Suspense (Arabic loading fallback spinner)
        │
        ├── /                  → HomePage
        │                          └── AmGhareebAvatar (size=120, amber halo)
        │
        ├── /search            → SearchPage
        │                          ├── StationAutocomplete (inline, kbd nav)
        │                          ├── RouteCard × N
        │                          │   ├── AccuracyBadge   (inline)
        │                          │   └── StationsStepper (inline, RTL scroll)
        │                          └── RatingModal
        │
        ├── /map               → MapPage
        │                          ├── MapContainer (react-leaflet)
        │                          ├── TileLayer (OpenStreetMap)
        │                          ├── FitBounds (auto-fit helper)
        │                          ├── Polyline  (validStations only)
        │                          └── CircleMarker × N (stations + user loc)
        │
        ├── /login             → LoginPage
        │                          └── AmGhareebAvatar (size=80)
        │
        ├── /register          → RegisterPage
        │                          └── AmGhareebAvatar (size=80)
        │
        ├── /chat              → ProtectedRoute
        │                          └── AIChatPage
        │                              ├── StationAutocomplete (inline, compact)
        │                              └── AmGhareebAvatar (size=32, per message)
        │
        ├── /dashboard         → ProtectedRoute
        │                          └── DashboardPage
        │                              ├── AmGhareebAvatar (size=56)
        │                              ├── SearchHistoryTab  ⚠️ needs B endpoint
        │                              └── SavedRoutesTab    ⚠️ needs B endpoint
        │                                  └── RouteCard (compact=true)
        │
        └── /admin             → ProtectedRoute (requireAdmin=true)
                                   └── AdminPage
                                       ├── StatCard      (inline × 4)
                                       ├── RouteFormModal (inline, shared add/edit)
                                       └── DeleteDialog  (inline)
```

---

## 4. Routing Map

| URL | Page | Auth | Admin | Key Local State |
|-----|------|------|-------|----------------|
| `/` | HomePage | No | No | none |
| `/search` | SearchPage | No | No | `origin`, `destination`, `searched`, `ratingRouteId` |
| `/map` | MapPage | No | No | `?routeId` (URL param), `userLocation` |
| `/login` | LoginPage | No | No | `email`, `password`, `showPassword`, `apiError` |
| `/register` | RegisterPage | No | No | `name`, `email`, `password`, `touched{}`, `apiError` |
| `/chat` | AIChatPage | **Yes** | No | `origin`, `destination`, `inputText` + hook state |
| `/dashboard` | DashboardPage | **Yes** | No | `activeTab` (0 or 1) |
| `/admin` | AdminPage | **Yes** | **Yes** | `page`, `addOpen`, `editRoute`, `deleteRoute` |
| `*` | → redirect `/` | — | — | — |

**ProtectedRoute behaviour (in order):**
1. `isLoading === true` → render centered amber spinner + "جاري التحميل..."
2. `!user` → `<Navigate to="/login" replace />`
3. `requireAdmin && user.role !== 'admin'` → `<Navigate to="/" replace />`
4. All checks pass → render `children`

---

## 5. Design Token Reference

### Primary Tokens (defined in `tailwind.config.js` — Account A)

| Token | Hex | Primary Usage |
|-------|-----|--------------|
| **Navy** | `#1B2A4A` | Navbar bg, page headings, primary action buttons, route card left-border accent, user chat bubble bg, Leaflet polyline color |
| **Amber** | `#F4A833` | CTA buttons, active nav underline, focus rings, origin station dot, send button, AIChatPage top-bar bottom border, stat card values, RatingModal submit |
| **Cream** | `#FDF6EC` | All page backgrounds, assistant chat bubble bg, SearchPage/Dashboard bg, autocomplete hover row highlight |
| **White** | `#FFFFFF` | Card surfaces, modal backgrounds, all input fields, Navbar link text |

### Semantic Status Colours (intentional, not design-system tokens)

| Context | Background | Text | Usage |
|---------|-----------|------|-------|
| Accuracy ≥ 80% | `#D1FAE5` | `#065F46` | "دقيق جداً" badge in RouteCard |
| Accuracy 60–79% | `#FEF3C7` | `#92400E` | "دقيق نسبياً" badge |
| Accuracy < 60% | `#FEE2E2` | `#991B1B` | "غير موثوق" badge |
| Accuracy null | `#F3F4F6` | `#6B7280` | "غير مقيّم بعد" badge |
| Route active | `#D1FAE5` | `#065F46` | Admin table status badge |
| Route inactive | `#FEE2E2` | `#991B1B` | Admin table status badge |
| Form/API error | `#FEE2E2` | `#DC2626` | All error messages |
| Type: microbus | `#FEF3C7` | `#92400E` | RouteCard + AdminPage type badge |
| Type: bus | `#DBEAFE` | `#1E40AF` | RouteCard + AdminPage type badge |
| Type: tram | `#D1FAE5` | `#065F46` | RouteCard + AdminPage type badge |
| Type: shuttle | `#EDE9FE` | `#5B21B6` | RouteCard + AdminPage type badge |

### Avatar-Specific Colours (SVG only — not UI tokens)

`#D4956A` face · `#C0392B` tarboush · `#A93226` brim · `#3D2B1F` eyes · `#8D9091` beard/brows · `#C8845A` ears/neck

---

## 6. API Integration Map

Every API call the frontend makes. Ordered by component, then HTTP method.

| Component / Hook | Method | Endpoint | React Query Key | Response Fields Read |
|-----------------|--------|----------|-----------------|---------------------|
| `AuthContext` (mount — OAuth) | GET | `/api/auth/me` | — (imperative) | `data.user` |
| `axios.js` (401 interceptor) | POST | `/api/auth/refresh` | — (imperative) | `data.accessToken`, `data.refreshToken` |
| `LoginPage` | POST | `/api/auth/login` | — (mutation) | `data.accessToken`, `data.refreshToken`, `data.user` |
| `RegisterPage` | POST | `/api/auth/register` | — (mutation) | `data.accessToken`, `data.refreshToken`, `data.user` |
| `AuthContext.logout` | POST | `/api/auth/logout` | — (fire & forget) | — |
| `SearchPage` | GET | `/api/routes/stations` | `['stations']` | `data.stations` → `string[]` |
| `AIChatPage` | GET | `/api/routes/stations` | `['stations']` | `data.stations` → `string[]` |
| `SearchPage` | GET | `/api/routes/search?origin=X&destination=Y` | `['search', origin, destination]` | `data.results` → `[{ route, accuracyStats }]` |
| `MapPage` | GET | `/api/routes/:routeId` | `['route', routeId]` | `data.route` |
| `useAIChat` | POST | `/api/ai/ask` | — (raw fetch SSE) | SSE stream chunks |
| `RatingModal` | POST | `/api/ratings` | — (mutation) | `data.success` |
| `DashboardPage` (Tab 1) | GET | `/api/routes/history` | `['route-history']` | `data.history[]` ⚠️ |
| `DashboardPage` (Tab 2) | GET | `/api/routes/saved` | `['saved-routes']` | `data.routes[]` ⚠️ |
| `AdminPage` | GET | `/api/admin/stats` | `['admin-stats']` | `data.stats.totalRoutes`, `.totalUsers`, `.totalRatings`, `.topSearched[]` |
| `AdminPage` | GET | `/api/admin/routes?page=N&limit=10` | `['admin-routes', page]` | `data.routes[]` (pairs), `data.pages` |
| `AdminPage` | POST | `/api/admin/routes` | — (mutation, invalidates admin) | — |
| `AdminPage` | PUT | `/api/admin/routes/:id` | — (mutation) | — |
| `AdminPage` | DELETE | `/api/admin/routes/:id` | — (mutation) | — |

⚠️ = Account B must add this endpoint. See Phase 2, Section 11.

---
<!-- END OF PHASE 1 -->

---
<!-- PHASE 2 OF 2 — Token Strategy · SSE Contract · RTL Notes · Fixes · Missing Endpoints · Tests · Checklist -->
---

## 7. In-Memory Token Strategy

### Design Decision

Tokens are **never written to `localStorage`, `sessionStorage`, or cookies**. They live exclusively inside the JavaScript module closure of `src/lib/axios.js` as two `let` variables. This means tokens are lost on every page reload — users authenticate once per browser session. This is a deliberate security trade-off: no persistent storage means no XSS attack surface from stored tokens.

### Token Storage Location

```
src/lib/axios.js
  let accessTokenRef  = null   ← private, not exported
  let refreshTokenRef = null   ← private, not exported
```

### Exported Functions

| Function | Signature | Called By | Purpose |
|----------|-----------|-----------|---------|
| `setTokens` | `(access, refresh) → void` | `AuthContext.login`, `.register`, `.logout`, OAuth mount handler, refresh interceptor | Sets both refs atomically. Pass `null, null` to clear session. |
| `getAccessToken` | `() → string\|null` | `useAIChat.js` only | Returns current access token for raw `fetch` SSE calls that bypass the axios interceptor. |

### Refresh Interceptor Flow

```
Any axios request → 401 response received
  └── Guard checks:
        • error.response.status === 401       ✓
        • !originalConfig._retry              ✓  (prevent loop)
        • refreshTokenRef !== null            ✓  (have refresh token)

  → Set originalConfig._retry = true
  → POST /api/auth/refresh  { refreshToken: refreshTokenRef }
      (uses bare axios instance, not the api instance, to avoid re-triggering interceptor)

      ├── 200 OK
      │     → setTokens(data.accessToken, data.refreshToken)
      │     → originalConfig.headers.Authorization = 'Bearer ' + data.accessToken
      │     → return api(originalConfig)   ← retry original request

      └── Error
            → setTokens(null, null)
            → window.location.href = '/login'
            → Promise.reject(refreshError)
```

### Google OAuth Token Flow

```
User clicks "الدخول بحساب جوجل"
  → window.location.href = `${BASE_URL}/api/auth/google`

Backend handles OAuth exchange, then redirects to:
  → CLIENT_URL/dashboard?token=ACCESS_TOKEN

AuthProvider.useEffect fires on /dashboard mount:
  → new URLSearchParams(window.location.search).get('token')
  → setTokens(oauthToken, null)       ← access token only, no refresh token
  try:
    → GET /api/auth/me                ← fetch user object with new token
    → setUser(data.user)
  finally:                            ← always runs, even if /me fails
    → window.history.replaceState('', '', '/dashboard')   ← clean ?token= from URL
    → setIsLoading(false)
```

**Why `finally`:** The original code set `isLoading=false` only on the success path and returned early, meaning a failed `/api/auth/me` call left `isLoading` stuck at `true` forever, blocking the entire UI. The `finally` block guarantees it always resolves.

---

## 8. SSE Streaming Contract

### Request Setup (`useAIChat.js → sendMessage`)

```
fetch(`${API_BASE}/api/ai/ask`, {
  method:  'POST',
  headers: {
    'Content-Type':  'application/json',
    'Authorization': `Bearer ${getAccessToken()}`   ← token read at call time
  },
  body: JSON.stringify({
    origin:      string,    ← from AIChatPage state (may be empty string)
    destination: string,    ← from AIChatPage state (may be empty string)
    message:     string     ← user input, trimmed, max 500 chars enforced by backend
  })
})
```

Raw `fetch` is used instead of axios because axios does not expose `response.body` as a `ReadableStream`. The axios request interceptor does not apply here — the token is attached manually via `getAccessToken()`.

### Stream Parsing Logic

```
reader  = response.body.getReader()
decoder = new TextDecoder()
buffer  = ''

loop:
  { done, value } = reader.read()
  if done → break

  buffer += decoder.decode(value, { stream: true })
  lines   = buffer.split('\n')
  buffer  = lines.pop()          ← keep last incomplete line for next iteration

  for line of lines:
    if not line.startsWith('data: ') → skip

    payload = line.slice(6).trim()

    ── [DONE] CHECK FIRST ────────────────────────────────────────────
    if payload === '[DONE]':          ← string compare, NOT JSON.parse
      setIsStreaming(false)
      update message: isStreaming → false
      continue                        ← skip JSON.parse block entirely

    ── JSON PARSE ────────────────────────────────────────────────────
    try:
      parsed = JSON.parse(payload)

      if parsed.text:
        setMessages(prev → map message by id, append parsed.text to content)

      if parsed.error:
        setError(parsed.error)
        update message: content → parsed.error, isStreaming → false
        setIsStreaming(false)

    catch:
      skip (non-JSON line)
```

**Why `[DONE]` is checked before `JSON.parse`:** `JSON.parse('[DONE]')` throws a SyntaxError. The `===` string check uses `continue` to skip the parse block entirely, so the exception never occurs. This exactly matches the backend contract: `data: [DONE]\n\n` is a raw sentinel string, not JSON.

### Message State Machine

| Phase | `messages[-1].isStreaming` | `messages[-1].content` | UI Rendered |
|-------|--------------------------|----------------------|-------------|
| Just added | `true` | `''` | Three amber bouncing dots |
| First chunk received | `true` | `'chunk...'` | Text + amber blinking cursor `\|` |
| Streaming in progress | `true` | `'growing...'` | Text + cursor |
| `[DONE]` received | `false` | `'full text'` | Final text, no cursor |
| SSE error event | `false` | `'error text'` | Error text in bubble |
| Fetch/network error | `false` | `'error text'` | Error text + red card below |

### AIChatPage UI Mapping

```
messages.map(msg):

  msg.role === 'user':
    flex justify-start (= visual RIGHT in RTL)
    bubble: navy #1B2A4A bg, white text
    border-radius: 16px 16px 4px 16px   (sharp bottom-right → points to speaker)

  msg.role === 'assistant':
    flex justify-end (= visual LEFT in RTL)
    AmGhareebAvatar(32) with order:2    (sits visually right of bubble in RTL)
    bubble: white bg, navy border, navy text
    border-radius: 16px 16px 16px 4px   (sharp bottom-left → points to avatar)

  msg.isStreaming && !msg.content  → <TypingDots />   (3 amber bouncing dots)
  msg.isStreaming && msg.content   → text + blinking amber cursor
  !msg.isStreaming                 → plain text
```

---

## 9. RTL Implementation Notes

The entire app is RTL-first. No top-level LTR overrides exist.

### Root Setup

- `<html lang="ar" dir="rtl">` in `index.html` (Account A)
- `<div dir="rtl">` on root element in `App.jsx` — cascades to all children
- `fontFamily: 'Cairo, sans-serif'` applied at root level

### Tailwind Behaviour Under `dir="rtl"`

- `flex-row` reverses visual order — first DOM element appears on the right
- `justify-between` works correctly at both visual ends
- `border-l` / `border-r` render on the correct visual sides
- `text-right` / `text-left` work as expected
- No Tailwind RTL plugin required — native HTML `dir` attribute is sufficient

### Per-Component RTL Decisions

| Component | Decision | Reason |
|-----------|----------|--------|
| `Navbar` | Logo first in DOM (visual right), auth buttons last (visual left) | Natural RTL flex order |
| `StationsStepper` (RouteCard) | Inner container uses `direction: ltr` | Transit routes read left→right as a journey sequence. Outer RTL container positions the block correctly. |
| `AIChatPage` bubbles | User: `justify-start` (visual right). Assistant: `justify-end` (visual left). Avatar: `order: 2` | In RTL, `flex-start` = right edge. `order:2` pushes avatar visually right of bubble without DOM reorder. |
| `MapPage` sidebar | `border-left` on `<aside>` | In RTL, left border renders on the correct visual edge between sidebar and map. |
| `AdminPage` table | All `text-right` headers, RTL-aware horizontal scroll | Table content is Arabic-primary. |
| `AIChatPage` top bar | `direction` inherits RTL, inputs flow right-to-left | Cairo font renders Arabic naturally. |

---

## 10. Fixes Applied (Post-Audit)

All issues were found during a formal 8-point contract audit against Account B's confirmed backend response shapes.

| # | Issue | File | Root Cause | Fix Applied |
|---|-------|------|------------|-------------|
| 1 | `isLoading` never resolved on successful Google OAuth login | `AuthContext.jsx` | `setIsLoading(false)` was only on the error path. Success path returned early, leaving `isLoading` stuck at `true` and blocking the entire UI. | Wrapped OAuth branch in `try/finally`. `setIsLoading(false)` now unconditionally runs in the `finally` block regardless of whether `GET /api/auth/me` succeeds or fails. |
| 2 | Admin routes table read `route.nameAr` from pair objects | `AdminPage.jsx` | `GET /api/admin/routes` returns `[{ route, accuracyStats }]` pairs. Table loop used `routes.map(route =>` treating each pair object as a flat route — all fields read `undefined`. | Changed to `routePairs.map(({ route, accuracyStats: pairStats }, i) =>`. All route fields now correctly read from the destructured inner `route` object. |
| 3 | Admin stats read from response root instead of `data.stats` | `AdminPage.jsx` | `GET /api/admin/stats` returns `{ success, stats: { totalRoutes, ... } }`. Code read `statsData.totalRoutes` (undefined) instead of `statsData.stats.totalRoutes`. | Added `const s = statsData?.stats \|\| {}`. All four `StatCard` value props updated to read from `s`. |
| 4 | Pagination key `totalPages` — contract uses `pages` | `AdminPage.jsx` | `GET /api/admin/routes` response uses key `pages`, not `totalPages`. Pagination was always stuck showing 1 page. | Changed `routesData?.totalPages` to `routesData?.pages`. |
| 5 | `topSearched` stat displayed `nameAr` (route field, doesn't exist on topSearched shape) | `AdminPage.jsx` | Contract's `topSearched[]` items contain `{ origin, destination }` strings. Code attempted `.nameAr` on them. | Changed to template literal: `` `${s.topSearched[0].origin} ← ${s.topSearched[0].destination}` `` with null guard. |
| 6 | axios `baseURL: BASE_URL` bypassed Vite dev proxy | `axios.js` | Setting a full origin as `baseURL` caused axios to send requests directly to `localhost:5000`, skipping the Vite `/api` proxy entirely — causing CORS errors in development. | Changed `baseURL` to `''`. All `/api/*` requests now go through the Vite proxy. `BASE_URL` is kept and still used by: (a) the refresh interceptor's bare `axios.post` call, and (b) the `loginWithGoogle()` redirect URL. |

---

## 11. Missing Backend Endpoints (Account B Must Add)

`DashboardPage` calls two endpoints that do not exist in Account B's output. Both tabs show their empty state until these are implemented. No frontend changes are required — the query keys and response shapes are already wired.

---

### Endpoint A — `GET /api/routes/history`

**Purpose:** Return the authenticated user's recent search history from the `SearchHistory` collection.

| Property | Value |
|----------|-------|
| Method | `GET` |
| Path | `/api/routes/history` |
| Auth | Bearer token required (`authenticate` middleware) |
| Query params | `limit` (number, optional, default `10`) |
| Mongoose model | `SearchHistory` (Account D) |

**Expected response shape:**
```json
{
  "success": true,
  "history": [
    {
      "_id": "65f1a2b3c4d5e6f7a8b9c0d1",
      "originQuery": "محطة مصر",
      "destinationQuery": "سيدي بشر",
      "routesFound": 2,
      "createdAt": "2024-03-01T10:30:00.000Z"
    }
  ]
}
```

**Implementation spec:**
```js
// routes.service.js
async getUserHistory(userId, limit = 10) {
  return SearchHistory
    .find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(parseInt(limit))
    .select('originQuery destinationQuery routesFound createdAt')
}

// routes.routes.js
router.get('/history', authenticate, routesController.getHistory)
```

**Frontend reads:** `data.history` → array. Renders `originQuery`, `destinationQuery`, `createdAt` (formatted as Arabic relative time).

---

### Endpoint B — `GET /api/routes/saved`

**Purpose:** Return the authenticated user's saved routes as fully populated route objects.

| Property | Value |
|----------|-------|
| Method | `GET` |
| Path | `/api/routes/saved` |
| Auth | Bearer token required (`authenticate` middleware) |
| Query params | None |
| Mongoose model | `User.savedRoutes` → populated `Route` (Account D) |

**Expected response shape:**
```json
{
  "success": true,
  "routes": [
    {
      "_id": "65f1a2b3c4d5e6f7a8b9c0d2",
      "routeId": "ALEX-MICRO-01",
      "nameAr": "محطة مصر ← سيدي بشر",
      "nameEn": "Misr Station → Sidi Bishr",
      "type": "microbus",
      "localName": "مشروع",
      "fare": { "min": 8, "max": 12, "currency": "EGP" },
      "stations": [],
      "isActive": true,
      "verified": true
    }
  ]
}
```

**Implementation spec:**
```js
// routes.service.js
async getUserSavedRoutes(userId) {
  const user = await User
    .findById(userId)
    .populate('savedRoutes')
    .select('savedRoutes')
  return user.savedRoutes
}

// routes.routes.js
router.get('/saved', authenticate, routesController.getSaved)
```

**Frontend reads:** `data.routes` → array of route objects. Passed directly to `RouteCard` with `compact={true}`.

**Note:** `User.savedRoutes` is already defined as `[{ type: ObjectId, ref: 'Route' }]` in the User model (Account D). No schema changes required — only the controller + service + route registration.

---

## 12. Test Coverage

### Run Tests

```bash
cd client
npm test                                        # all tests
npx jest src/components/__tests__/RouteCard     # single file
npm test -- --coverage                          # with coverage report
```

### Test Files and Coverage

| File | Tests | What Is Covered |
|------|-------|----------------|
| `AmGhareebAvatar.test.jsx` | 8 | Renders without crash · SVG element present · `width`/`height` attributes equal `size` prop · default `size=48` · custom `size=120` · custom `className` applied · correct `viewBox="0 0 100 100"` · collar rect present at `size>60` · collar absent at `size≤60` |
| `RouteCard.test.jsx` | 10 | Renders `nameAr` · renders fare range string · "غير مقيّم بعد" badge when `percentage===null` · green badge + colour at `percentage≥80` · amber badge at 60–79 · red badge below 60 · `onRateClick` called with `routeId` · all station `nameAr` values in DOM · total ratings count displayed · microbus type badge label "مشروع" |
| `RatingModal.test.jsx` | 10 | Title and subtitle render · submit disabled with no selection · enabled after "نعم" · enabled after "لأ" · textarea `maxLength=280` · char counter updates on input · initial counter "0 / 280" · `onClose` called on X button click · mutation fires `POST /api/ratings` with correct body · success message "شكراً على تقييمك!" shown after submit |
| `useAIChat.test.js` | 9 | Initial `messages` contains welcome message with `id='welcome'` · `sendMessage` appends user message immediately · assistant placeholder message added (empty content, `isStreaming:true`) · SSE text chunks append to assistant message content · `[DONE]` sets hook `isStreaming=false` · `[DONE]` sets message `isStreaming=false` · SSE `{"error":"..."}` sets hook `error` state · non-ok HTTP response sets `error` state · `clearMessages` resets to welcome only and clears `error` and `isStreaming` · whitespace-only input does not call `fetch` |
| **Total** | **37** | |

### Test Infrastructure

Tests use `mongodb-memory-server` is **not** required on the client — that is server-side only (Account D). Client tests use:
- `@testing-library/react` — component rendering and interaction
- `@testing-library/jest-dom` — DOM assertion matchers
- `jest` — test runner (configured in `server/jest.config.js` with `babel.config.js` from Account A)
- `ReadableStream` with `TextEncoder` — real stream mock for SSE tests (no third-party SSE mock library)

---

## 13. Integration Checklist

Work through these in order. Each item maps to a specific file or API contract.

### Environment Setup

- [ ] Copy `server/.env.example` → `server/.env`, fill in `MONGODB_URI`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `OPENAI_API_KEY`, `CLIENT_URL=http://localhost:5173`
- [ ] Create `client/.env.local` with `VITE_API_URL=http://localhost:5000`
- [ ] `cd server && npm install` — no errors
- [ ] `cd client && npm install` — no errors
- [ ] `cd server && npm run seed` — seeds 10 routes + admin user

### Server Startup

- [ ] `cd server && npm run dev` → Express running on `:5000`, MongoDB connected
- [ ] `cd client && npm run dev` → Vite running on `:5173`
- [ ] Browser Network tab: requests to `/api/*` show origin `localhost:5173` with no CORS errors — confirms Vite proxy is active

### Foundation Layer (Chunk 1)

- [ ] **Navbar:** عم غريب avatar visible right side, links centered, auth buttons left side, RTL layout correct
- [ ] **Mobile Navbar:** hamburger button visible, tap opens drawer, links stack vertically, tap any link closes drawer
- [ ] **ProtectedRoute:** visiting `/chat` without login redirects to `/login`
- [ ] **ProtectedRoute:** visiting `/admin` as non-admin user redirects to `/`

### Auth Flow

- [ ] **LoginPage:** email + password → `POST /api/auth/login` → redirect to `/dashboard` → user name appears in Navbar
- [ ] **LoginPage:** wrong credentials → Arabic error message appears below inputs
- [ ] **RegisterPage:** real-time validation — name < 2 chars shows error, invalid email shows error, password without uppercase/number shows error
- [ ] **RegisterPage:** valid form → `POST /api/auth/register` → redirect to `/dashboard`
- [ ] **Google OAuth:** "الدخول بحساب جوجل" button redirects to `/api/auth/google` → completes OAuth → lands on `/dashboard?token=...` → user logged in → URL cleaned to `/dashboard`
- [ ] **Logout:** clicking "خروج" in Navbar clears user, redirects to `/login`
- [ ] **Token refresh:** let access token expire (or manually test 401 response) → interceptor auto-refreshes → original request retried transparently

### Search Flow

- [ ] **SearchPage autocomplete:** typing in "من أين؟" field shows dropdown with matching stations from `GET /api/routes/stations`
- [ ] **SearchPage autocomplete:** keyboard nav — ↓ highlights next, ↑ previous, Enter selects, Escape closes
- [ ] **SearchPage swap:** arrow swap button exchanges origin and destination values
- [ ] **SearchPage search:** clicking "ابحث" fires `GET /api/routes/search` → RouteCard results appear
- [ ] **SearchPage loading:** skeleton pulse cards appear during fetch
- [ ] **SearchPage empty:** no results shows عم غريب avatar + "اسأل عم غريب!" button → navigates to `/chat?origin=X&destination=Y`
- [ ] **RouteCard:** displays `nameAr`, type badge, station stepper, fare, accuracy badge
- [ ] **RouteCard peak hours:** if current time matches a `peakHours` range → "⚠️ وقت الزحمة دلوقتي" badge appears
- [ ] **RatingModal:** "قيّم الخط" opens modal → select "نعم" or "لأ" → enables submit → submit shows "شكراً على تقييمك! ✓" for 2 seconds → modal closes

### Map

- [ ] **MapPage no route:** centered card "ابحث عن خط وشوفه على الخريطة" with search button
- [ ] **MapPage with route:** visiting `/map?routeId=ALEX-MICRO-01` → fetches route → map auto-fits to station bounds → navy polyline drawn → amber CircleMarkers on valid stations
- [ ] **MapPage zero-coord stations:** stations with `lat:0, lng:0` appear in sidebar list with "إحداثيات غير محددة" badge but no marker on map
- [ ] **MapPage sidebar:** all stations listed with numbered badges, origin amber, destination navy
- [ ] **MapPage user location:** "📍 موقعي الحالي" button → browser requests geolocation → blue CircleMarker appears

### AI Chat

- [ ] **AIChatPage:** welcome message from عم غريب appears on load with avatar
- [ ] **AIChatPage prefill:** navigating from SearchPage empty state → origin and destination pre-filled in top bar
- [ ] **AIChatPage send:** typing message + Enter → user bubble appears right → assistant typing dots appear left → text streams in → cursor disappears on completion
- [ ] **AIChatPage streaming disabled:** input shows "عم غريب بيكتب..." and send button disabled while streaming
- [ ] **AIChatPage clear:** "مسح" button resets conversation to welcome message only
- [ ] **AIChatPage error:** if SSE stream fails → red error card appears below last message

### Dashboard

- [ ] **DashboardPage:** user name appears in header greeting
- [ ] **Tab 1 — بحثاتي الأخيرة:** shows search history table (requires Account B `GET /api/routes/history`)
- [ ] **Tab 1 empty:** shows عم غريب avatar + "لسه معملتش أي بحث" + search button
- [ ] **Tab 1 "ابحث تاني":** button navigates to `/search?origin=X&destination=Y` pre-filled
- [ ] **Tab 2 — خطوطي المحفوظة:** shows saved RouteCards (requires Account B `GET /api/routes/saved`)
- [ ] **Tab 2 empty:** shows عم غريب avatar + "مفيش خطوط محفوظة" message

### Admin Panel

- [ ] **AdminPage blocked:** non-admin user → redirect to `/`
- [ ] **AdminPage stats:** four stat cards populated from `GET /api/admin/stats` (`data.stats.totalRoutes` etc.)
- [ ] **AdminPage table:** routes listed with correct `nameAr`, type badge, fare, active status — data from `[{ route, accuracyStats }]` pairs
- [ ] **AdminPage pagination:** "التالي" / "السابق" buttons work; page number updates
- [ ] **AdminPage add:** "إضافة خط جديد ＋" → modal opens → fill form → submit → new row appears in table
- [ ] **AdminPage edit:** pencil icon → modal pre-filled with route data → submit → row updates
- [ ] **AdminPage delete:** trash icon → Arabic confirmation dialog → confirm → row removed

### Tests

- [ ] `cd client && npm test` → all 37 tests pass, 0 failures

---

*Account C — Frontend Engineer*
*21 files · 4,046 lines · 37 tests · 6 fixes applied · 2 backend endpoints flagged for Account B*

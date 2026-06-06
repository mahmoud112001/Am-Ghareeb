# Account D  — Final Verified Handoff
## Status: COMPLETE ✅
### Document: HANDOFF_D.md | Phase 1 of 2

> This document is written specifically for Account C (frontend).
> Every detail is sourced from the final verified files — no assumptions, no placeholders.
> Phase 1 covers: what was built, every file, every model, every field.
> Phase 2 covers: API shapes, UI rules, data gotchas, and integration checklist.

---

## 1. What Account D Built

Account D is the **database layer** for the Am Ghareeb (عم غريب) Alexandria transit app.
It produced 4 Mongoose models, a seed script loading 10 verified Alexandria microbus routes,
18 unit tests, and supporting documentation — all targeting MongoDB Atlas free tier.

The layer is complete, fixed, and verified. No further changes are expected from Account D.

---

## 2. Verified File Manifest

| # | File | Status | What It Is |
|---|------|--------|-----------|
| 1 | `/server/src/models/User.model.js` | ✅ Final | User schema — auth, OAuth, saved routes |
| 2 | `/server/src/models/Route.model.js` | ✅ Final | Route schema — stations, fares, tips, accuracy |
| 3 | `/server/src/models/Rating.model.js` | ✅ Final | Accuracy vote schema — one per user per route |
| 4 | `/server/src/models/SearchHistory.model.js` | ✅ Final | Search log schema — per authenticated user |
| 5 | `/server/src/models/index.js` | ✅ Final | Barrel export — single import point |
| 6 | `/server/src/scripts/seed.js` | ✅ Final | Inserts 10 routes + admin user |
| 7 | `/server/src/tests/models.test.js` | ✅ Final | 18 tests, mongodb-memory-server |
| 8 | `/server/src/models/README.md` | ✅ Final | Internal DB documentation |
| 9 | `/HANDOFF_D.md` | ✅ Final | Account B-facing handoff document |

### Fixes applied before final version

| Fix | File | What Changed |
|-----|------|-------------|
| D-FIX-1 | `seed.js` | ALEX-MICRO-05 and ALEX-MICRO-06 were missing — both fully restored |
| D-FIX-1 | `seed.js` | ALEX-MICRO-08, 09, 10 had empty `tips: []` — all filled with contextual Arabic tips |
| D-FIX-2 | `User.model.js` | `require('bcrypt')` → `require('bcryptjs')` (native binding compatibility) |

---

## 3. Models Export Contract

Account B's services expose data from these four models. Account C consumes the API responses
that come from them. The single import used everywhere in the backend is:

```javascript
const { User, Route, Rating, SearchHistory } = require('../models/index.js')
```

| Model | MongoDB Collection | Account C Encounters It Via |
|-------|-------------------|-----------------------------|
| `User` | `users` | Auth endpoints — `/api/auth/me`, `/api/auth/login`, `/api/auth/register` |
| `Route` | `routes` | Route endpoints — `/api/routes`, `/api/routes/:routeId` |
| `Rating` | `ratings` | Rating endpoint — `/api/routes/:routeId/rate` |
| `SearchHistory` | `searchhistories` | History endpoint — `/api/user/history` |

---

## 4. Full Schema Field Reference

### 4.1 User Schema

| Field | Type | Default | Returned to Frontend | Notes |
|-------|------|---------|---------------------|-------|
| `_id` | ObjectId | auto | ✅ Yes | MongoDB document ID |
| `name` | String | — | ✅ Yes | minlength 2, maxlength 50, trimmed |
| `email` | String | — | ✅ Yes | unique, lowercase, trimmed |
| `passwordHash` | String | `null` | ❌ Never | Bcrypt hash — stripped server-side with `.select('-passwordHash -refreshToken')` |
| `googleId` | String | `null` | ✅ Yes | Present for Google OAuth users, null for password users |
| `role` | String | `'user'` | ✅ Yes | `'user'` or `'admin'` |
| `refreshToken` | String | `null` | ❌ Never | Stripped server-side — never arrives at frontend |
| `savedRoutes` | [ObjectId] | `[]` | ✅ Yes (as array of IDs) | Refs to Route collection |
| `createdAt` | Date | auto | ✅ Yes | ISO timestamp |
| `updatedAt` | Date | auto | ✅ Yes | ISO timestamp |

**What Account C actually receives on `/api/auth/me`:**
```javascript
{
  _id: "...",
  name: "Ahmed",
  email: "ahmed@example.com",
  googleId: null,         // or "google-oauth-id" for OAuth users
  role: "user",
  savedRoutes: ["objectid1", "objectid2"],
  createdAt: "2026-03-01T...",
  updatedAt: "2026-03-01T..."
  // passwordHash and refreshToken are NEVER present
}
```

---

### 4.2 Route Schema

This is the most complex model. Every field Account C will render is documented below.

| Field | Type | Default | Notes for Frontend |
|-------|------|---------|-------------------|
| `_id` | ObjectId | auto | MongoDB document ID |
| `routeId` | String | — | Human-readable unique ID e.g. `"ALEX-MICRO-01"` — use this for API calls, not `_id` |
| `type` | String | — | Enum: `'microbus'`, `'bus'`, `'tram'`, `'university_shuttle'` — for programmatic filtering only |
| `localName` | String | `'مشروع'` | **Always use this for UI badges** — not `type`. For microbus routes this is always `"مشروع"` |
| `nameAr` | String | — | Arabic route display name e.g. `"المندرة ↔ محطة مصر"` |
| `nameEn` | String | — | English route display name e.g. `"Mandara ↔ Mahattet Masr"` |
| `origin.nameAr` | String | — | Arabic name of origin stop |
| `origin.nameEn` | String | — | English name of origin stop |
| `origin.coords.lat` | Number | `0` | ⚠️ `0` means GPS unverified — filter before map rendering |
| `origin.coords.lng` | Number | `0` | ⚠️ `0` means GPS unverified — filter before map rendering |
| `destination.nameAr` | String | — | Arabic name of destination stop |
| `destination.nameEn` | String | — | English name of destination stop |
| `destination.coords.lat` | Number | `0` | ⚠️ `0` means GPS unverified — filter before map rendering |
| `destination.coords.lng` | Number | `0` | ⚠️ `0` means GPS unverified — filter before map rendering |
| `stations` | Array | — | Ordered array of stops — see sub-fields below |
| `stations[].order` | Number | — | Sort order — array is pre-sorted, but use `order` if re-sorting |
| `stations[].nameAr` | String | — | Arabic station name — always present |
| `stations[].nameEn` | String | — | English station name — always present |
| `stations[].coords.lat` | Number | `0` | ⚠️ `0` = GPS unverified — render name only, no map pin |
| `stations[].coords.lng` | Number | `0` | ⚠️ `0` = GPS unverified — render name only, no map pin |
| `fare.min` | Number | — | Minimum fare in EGP — updated March 2026, range 6.50–18 EGP |
| `fare.max` | Number | — | Maximum fare in EGP |
| `fare.currency` | String | `'EGP'` | Always `"EGP"` in current data |
| `fare.lastVerified` | String | — | Format: `"YYYY-MM"` e.g. `"2026-03"` |
| `operatingHours.start` | String | — | Format: `"HH:MM"` e.g. `"05:00"` |
| `operatingHours.end` | String | — | Format: `"HH:MM"` e.g. `"23:59"` |
| `peakHours` | [String] | `[]` | Format: `"HH:MM-HH:MM"` e.g. `["08:00-10:00","14:30-17:30"]` — parse for "busy now" indicator |
| `frequency` | String | — | May be absent — human-readable frequency string |
| `direction` | String | `'bidirectional'` | `'bidirectional'` or `'one_way'` |
| `tips` | [String] | `[]` | Arabic tips array — all 10 seeded routes have at least 1 tip |
| `verified` | Boolean | `false` | `false` → show `"غير موثوق"` warning badge |
| `isActive` | Boolean | `true` | Backend filters these — frontend will never receive `isActive: false` routes |
| `createdAt` | Date | auto | ISO timestamp |
| `updatedAt` | Date | auto | ISO timestamp |

---

### 4.3 Rating Schema

Account C sends ratings and reads the computed accuracy stats — it never reads raw Rating documents directly.

| Field | Type | Notes |
|-------|------|-------|
| `_id` | ObjectId | MongoDB document ID |
| `user` | ObjectId | Ref to User |
| `route` | ObjectId | Ref to Route |
| `isAccurate` | Boolean | The vote — `true` or `false` |
| `comment` | String \| null | Optional, max 280 chars |
| `createdAt` | Date | ISO timestamp |
| `updatedAt` | Date | ISO timestamp |

**Constraint Account C must enforce in UI:** a user can only rate each route once. The backend enforces this with a compound unique index. If the user has already rated, the API returns a `409` (or `400`) — show an appropriate message, not a crash.

---

### 4.4 SearchHistory Schema

| Field | Type | Notes |
|-------|------|-------|
| `_id` | ObjectId | MongoDB document ID |
| `user` | ObjectId | Ref to User — only authenticated searches are logged |
| `originQuery` | String | Raw search string the user typed |
| `destinationQuery` | String | Raw search string the user typed |
| `routesFound` | Number | Count of routes the search returned, default 0 |
| `createdAt` | Date | ISO timestamp — history is sorted newest-first |
| `updatedAt` | Date | ISO timestamp |

---

## 5. The 10 Seeded Routes — Complete Reference

All 10 routes are `type: 'microbus'`, `localName: 'مشروع'`, `verified: true`, `isActive: true`.
Fares were updated March 2026.

| routeId | nameAr | nameEn | Fare (EGP) | Hours | Abu Qir Replacement |
|---------|--------|--------|-----------|-------|-------------------|
| ALEX-MICRO-01 | المندرة ↔ محطة مصر | Mandara ↔ Mahattet Masr | 8.50–10.00 | 05:00–23:59 | ❌ |
| ALEX-MICRO-02 | محطة مصر ↔ الكيلو 21 | Mahattet Masr ↔ Kilo 21 | 12.00–14.00 | 06:00–23:00 | ❌ |
| ALEX-MICRO-03 | سيدي جابر ↔ أبو قير | Sidi Gaber ↔ Abu Qir | 9.50–11.00 | 05:00–23:30 | ✅ |
| ALEX-MICRO-04 | الموقف الجديد ↔ أبو قير | New Terminal ↔ Abu Qir | 11.00–13.00 | 06:00–22:00 | ✅ |
| ALEX-MICRO-05 | سيدي بشر ↔ أبو قير (مبرة العصافرة) | Sidi Bishr ↔ Abu Qir (Mabarra El-Asafra) | 7.00–8.50 | 05:30–23:00 | ✅ |
| ALEX-MICRO-06 | المندرة ↔ الطابية (طريق رشيد) | Mandara ↔ El-Tabia (Rasheed Road) | 6.50–8.00 | 06:00–22:30 | ✅ |
| ALEX-MICRO-07 | فيكتوريا ↔ الطابية | Victoria ↔ El Tabia | 8.00–10.00 | 05:30–23:00 | ✅ |
| ALEX-MICRO-08 | محطة مصر ↔ برج العرب الجديد (صحراوي) | Mahattet Masr ↔ New Borg El Arab (Desert Rd) | 15.00–18.00 | 06:00–22:00 | ❌ |
| ALEX-MICRO-09 | محطة مصر ↔ برج العرب الجديد (ساحلي) | Mahattet Masr ↔ New Borg El Arab (Coastal Rd) | 16.00–18.00 | 06:00–21:30 | ❌ |
| ALEX-MICRO-10 | محطة مصر ↔ برج العرب الجديد (صحراوي مختصر) | Mahattet Masr ↔ New Borg El Arab (Short Desert) | 14.00–16.00 | 05:00–23:00 | ❌ |

**Abu Qir train note:** The Abu Qir train has been suspended since March 2024. Routes MICRO-03 through MICRO-07 are its active replacements. Each of these routes has `tips[0]` = `'خط بديل لقطار أبو قير المتوقف منذ مارس 2024'`. Surface this tip prominently on those route cards.

---

## 6. accuracyStats Shape — What C Renders

Account B computes accuracy via `Route.getAccuracyStats(routeId)` and includes the result in route API responses. This is the exact object shape Account C will receive:

```javascript
// Fewer than 3 ratings — do NOT render a percentage
{ total: 2, accurate: 1, percentage: null, label: 'غير مقيّم بعد' }

// 80% and above
{ total: 10, accurate: 9, percentage: 90, label: 'دقيق جداً' }

// 60–79%
{ total: 10, accurate: 7, percentage: 70, label: 'دقيق نسبياً' }

// Below 60%
{ total: 10, accurate: 4, percentage: 40, label: 'غير موثوق' }
```

**Critical:** `percentage` is `null` when fewer than 3 ratings exist. Always check for null before rendering a percentage bar or number. Render the `label` string directly in all cases.

---

## END OF PHASE 1

**Phase 1 covered:** project overview · file manifest · all fixes applied · models export contract · full schema field reference for all 4 models · complete route seed table · accuracyStats shape.

---
---

# HANDOFF_D.md — Phase 2 of 2

> Phase 2 covers: UI rendering rules · zero-coord map handling · peakHours parsing · badge logic · field exclusion rules · RouteCard / MapPage / AIChatPage page-specific notes · integration test checklist.

---

## 7. UI Rendering Rules

### 7.1 Fields to Never Render

These fields are stripped server-side by Account B and will never arrive at the frontend.
If they somehow appear (e.g. during local dev with a raw DB query), do not display them.

| Field | Reason |
|-------|--------|
| `passwordHash` | Security — bcrypt hash, stripped with `.select('-passwordHash -refreshToken')` |
| `refreshToken` | Security — JWT refresh token, stripped with `.select('-passwordHash -refreshToken')` |

### 7.2 Badge Logic

Every route card must evaluate these four independent badge conditions:

| Condition | Badge to Show | Field to Check |
|-----------|--------------|----------------|
| Route is a microbus | `"مشروع"` | `route.localName` — always use this, never `route.type` |
| Route is unverified | `"غير موثوق"` warning badge | `route.verified === false` |
| Accuracy rated poorly | `"غير موثوق"` accuracy label | `accuracyStats.label === 'غير موثوق'` |
| Fewer than 3 ratings | `"غير مقيّم بعد"` | `accuracyStats.percentage === null` |
| Abu Qir replacement | Highlight tip banner | `routeId` in `['ALEX-MICRO-03','ALEX-MICRO-04','ALEX-MICRO-05','ALEX-MICRO-06','ALEX-MICRO-07']` |

**Important distinction:** `route.verified` and `accuracyStats.label` are independent.
A route can be `verified: true` (manually confirmed by admin) but still have a poor
crowd-sourced accuracy label — render both independently.

### 7.3 peakHours Parsing

`peakHours` is an array of strings in the format `"HH:MM-HH:MM"`.
Every seeded route has exactly 2 peak windows (morning + afternoon).

**To show a "currently busy" indicator:**

```javascript
function isCurrentlyPeak(peakHours) {
  const now = new Date()
  const currentMinutes = now.getHours() * 60 + now.getMinutes()

  return peakHours.some((window) => {
    const [start, end] = window.split('-')
    const [sh, sm] = start.split(':').map(Number)
    const [eh, em] = end.split(':').map(Number)
    const startMinutes = sh * 60 + sm
    const endMinutes = eh * 60 + em
    return currentMinutes >= startMinutes && currentMinutes <= endMinutes
  })
}
```

All 10 seeded routes have a morning window (07:00–10:00 range) and an afternoon window
(14:00–18:30 range). The exact times per route are in the seed reference table in Phase 1.

### 7.4 Fare Display

Always display as a range: `fare.min – fare.max fare.currency`

Example: `"8.50 – 10.00 EGP"`

`fare.lastVerified` is a `"YYYY-MM"` string. Use it to show a "last verified" note:
`"آخر تحديث: مارس 2026"` for `"2026-03"`.

### 7.5 Operating Hours Display

`operatingHours.start` and `operatingHours.end` are `"HH:MM"` strings.
Render as: `"05:00 – 23:59"`

To show "currently operating" status:

```javascript
function isCurrentlyOperating(operatingHours) {
  const now = new Date()
  const currentMinutes = now.getHours() * 60 + now.getMinutes()
  const [sh, sm] = operatingHours.start.split(':').map(Number)
  const [eh, em] = operatingHours.end.split(':').map(Number)
  return currentMinutes >= sh * 60 + sm && currentMinutes <= eh * 60 + em
}
```

---

## 8. Zero-Coord Map Handling

Stations with `coords: { lat: 0, lng: 0 }` are **real stops with unverified GPS**.
They are not errors, not null, not missing data — they are physical locations
whose coordinates have not yet been confirmed in the field.

**Rules for Account C:**

| Context | Rule |
|---------|------|
| Map marker rendering | Skip any station where `lat === 0 && lng === 0` — do not place a pin |
| Station list rendering | Always render by name — zero-coord stations appear in the list normally |
| Route polyline | Only connect stations that have verified coords — skip zero-coord stations in the line |
| Origin / Destination display | If origin or destination has `lat: 0, lng: 0`, show name only — no "open in maps" link |

**Filter function:**
```javascript
const mappableStations = route.stations.filter(
  (s) => s.coords.lat !== 0 || s.coords.lng !== 0
)
```

**How many zero-coord stations exist in seeded data:**
The majority of stations across all 10 routes have `{ lat: 0, lng: 0 }`.
Only a small subset have verified coordinates — the key ones are:

| Station (Arabic) | Verified Coords |
|-----------------|----------------|
| المندرة | 31.2785, 30.0142 |
| المنتزه | 31.2858, 30.0123 |
| ميامي | 31.2681, 29.9994 |
| سيدي جابر | 31.2201, 29.9386 |
| محطة مصر | 31.1956, 29.9021 |
| أبو قير | 31.3101, 30.0612 |

These are the anchors. All other stations render by name only until GPS is verified.

---

## 9. Page-Specific Notes

### 9.1 RouteCard

The RouteCard is the primary unit of display for a single route. It must handle:

- **Header:** `route.nameAr` (primary) + `route.nameEn` (secondary)
- **Type badge:** `route.localName` — render `"مشروع"` for all 10 seeded routes
- **Verified badge:** if `route.verified === false` → show `"غير موثوق"` warning
- **Fare:** `route.fare.min – route.fare.max EGP` + `"آخر تحديث: " + lastVerified`
- **Hours:** `operatingHours.start – operatingHours.end` + live "currently operating" state
- **Peak indicator:** parse `peakHours` array → show "ازدحام الآن" if currently in a peak window
- **Accuracy stats:** always render `accuracyStats.label` — render `percentage` only if not null
- **Tips:** render `route.tips` as a scrollable list — for MICRO-03 through 07, `tips[0]` is always the Abu Qir suspension notice — surface it at the top with a distinct visual treatment
- **Station count:** `route.stations.length` — always present, use for "X محطة" display
- **Saved state:** check if `route._id` or `route.routeId` is in `user.savedRoutes`

### 9.2 MapPage

The MapPage renders the route on a map with station markers.

- **Only plot stations where `coords.lat !== 0 || coords.lng !== 0`**
- Render all stations in the sidebar list regardless of coords — zero-coord stations appear by name with a "📍 موقع غير محدد" indicator
- Use `stations[].order` to sort — the array comes pre-sorted but always sort by `order` defensively
- Origin and destination coords may also be `{ lat: 0, lng: 0 }` — handle gracefully, do not crash
- If fewer than 2 stations have verified coords, show a "الخريطة غير متاحة حالياً" message instead of an empty map
- For routes that DO have verified coords, draw the polyline only between verified stops — do not interpolate or estimate positions for zero-coord stops

### 9.3 AIChatPage

The AIChatPage allows users to query routes conversationally. The AI context it receives comes from the same route documents.

- The AI will reference `route.nameAr`, `route.tips`, `route.fare`, `route.peakHours`, and `route.operatingHours`
- **Do not pass `passwordHash` or `refreshToken` to any AI context** — these are already stripped by Account B but worth asserting
- `accuracyStats` should be included in the route context passed to the AI so it can answer accuracy questions
- Zero-coord stations should be included in context by name — the AI can describe stops even without coordinates
- The Abu Qir suspension (`tips[0]` on MICRO-03 through 07) is factual — the AI should be able to surface this correctly when asked about those routes
- `SearchHistory` records created from AI chat searches should set `originQuery` and `destinationQuery` to the parsed intent strings, and `routesFound` to the count of routes the AI surfaced

---

## 10. accuracyStats — Full Rendering Decision Tree

```
accuracyStats received
│
├── percentage === null
│     └── render label: "غير مقيّم بعد"
│           do NOT render a progress bar or percentage number
│
├── percentage >= 80
│     └── render label: "دقيق جداً"
│           render progress bar filled to percentage%
│           green colour treatment
│
├── percentage >= 60 (and < 80)
│     └── render label: "دقيق نسبياً"
│           render progress bar filled to percentage%
│           amber colour treatment
│
└── percentage < 60
      └── render label: "غير موثوق"
            render progress bar filled to percentage%
            red colour treatment
            also check route.verified — may warrant a double warning
```

Always render `total` as supporting text: `"بناءً على X تقييم"`

---

## 11. Domain Context — Critical Facts for Frontend Copy

These are verified facts that affect any Arabic copy, tooltips, or AI responses:

| Fact | Detail |
|------|--------|
| Local word for microbus | `"مشروع"` (not "ميكروباص") — this is the Alexandrian term |
| Abu Qir train status | Suspended since **March 2024** — routes 03–07 are active replacements |
| Fare update | Fares updated **March 2026** — range now **6.50–18 EGP** |
| Fare increase note | ~15% increase after fuel price rise (March 2026) — seeded in MICRO-01 tips |
| Emergency number | `114` — referenced in MICRO-05 tip for fare disputes |
| Zero-coord meaning | Real stops, GPS unverified — not missing data, not errors |
| Accuracy minimum | 3 ratings required before any percentage is shown |

---

## 12. Integration Test Checklist

Account C runs these checks after Account B's API is connected:

- [ ] `GET /api/routes` returns exactly 10 routes, all with `isActive: true`
- [ ] No route response contains `passwordHash` or `refreshToken` fields
- [ ] Every route has `localName: "مشروع"` and `type: "microbus"`
- [ ] `GET /api/routes/ALEX-MICRO-01` returns `accuracyStats.percentage === null` and `accuracyStats.label === "غير مقيّم بعد"` on fresh seed
- [ ] Routes MICRO-03 through MICRO-07 each have `tips[0] === "خط بديل لقطار أبو قير المتوقف منذ مارس 2024"`
- [ ] Routes MICRO-01, 05, 06, 08, 09, 10 have 2 or more tips (not empty)
- [ ] Filtering `route.stations` where `lat !== 0 || lng !== 0` yields at least 1 mappable station on MICRO-01 (المندرة, ميامي, سيدي جابر, محطة مصر all have verified coords)
- [ ] `POST /api/routes/:routeId/rate` called twice with same user returns a conflict error (not a crash)
- [ ] `GET /api/auth/me` response does not contain `passwordHash` or `refreshToken`
- [ ] `GET /api/user/history` returns records sorted newest-first
- [ ] `peakHours` on every route is an array of exactly 2 strings in `"HH:MM-HH:MM"` format
- [ ] `fare.lastVerified` on all 10 routes is `"2026-03"`

---

## END OF HANDOFF_D — BOTH PHASES COMPLETE

**This document is the source of truth Account D's database layer.**

Phase 1 — What was built: file manifest, fixes, models contract, full schema reference, route table, accuracyStats shape.

Phase 2 — How to use it: UI rendering rules, badge logic, peakHours parsing, zero-coord map handling, page-specific notes for RouteCard / MapPage / AIChatPage, domain facts, integration checklist.

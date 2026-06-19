# Watchpost

Centralised security audit suite — 5 tools, one interface.

![Watchpost home](docs/screenshot-home.png)

## Tools

| Module | Input | What it checks |
|---|---|---|
| **Header Scanner** | URL | CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy |
| **Password Strength** | Password | Entropy, brute-force crack time, HaveIBeenPwned (k-anonymity) |
| **Email Breach Check** | Email | Known data breaches via XposedOrNot (no API key required) |
| **SSL/TLS Checker** | Domain | Certificate validity, expiry, issuer, signature algorithm |
| **DNS / WHOIS** | Domain | A/MX/TXT/NS records + RDAP registration info |

## Architecture

```
watchpost/                        # npm workspaces monorepo
├── packages/
│   └── shared-types/             # TypeScript interfaces shared by front + back
│       └── src/index.ts          # Grade, SecurityScore, ScoreDetail, 5 result types
├── apps/
│   ├── api/                      # Node.js + Express + TypeScript
│   │   └── src/
│   │       ├── routes/           # one file per module
│   │       ├── services/         # business logic per module
│   │       ├── scoring/          # shared buildScore() → SecurityScore
│   │       └── http/             # fetch wrapper with 10s timeout
│   └── web/                      # React + Vite + TypeScript
│       └── src/
│           ├── api/client.ts     # typed API client (mirrors shared-types)
│           ├── components/       # ScoreBadge, ResultPanel, ModuleLayout
│           └── modules/          # Home + 5 module pages
```

### Why full TypeScript with shared types?

The `@watchpost/shared-types` package is consumed by both the Express API and the React frontend. This means:
- A backend change to a response shape immediately surfaces as a TypeScript error in the frontend — no runtime surprises.
- The `SecurityScore` / `ScoreDetail` interfaces let all 5 modules reuse the same `<ScoreBadge>` and `<ResultPanel>` components with zero casting.

## Getting started

```bash
npm install        # installs all workspaces from the root
npm run dev        # API on :3001, frontend on :5173
```

The Vite dev server proxies `/api/*` to `localhost:3001`, so no CORS config is needed in development.

## Privacy

- **Password module**: the password is never logged or stored. Only the first 5 characters of its SHA-1 hash are sent to [HaveIBeenPwned](https://haveibeenpwned.com/API/v3#SearchingPwnedPasswordsByRange) (k-anonymity model). The full hash never leaves your server.
- **Email module**: email addresses are sent to [XposedOrNot](https://xposedornot.com/) for breach lookup. No data is persisted by Watchpost.
- The API is fully stateless — no database, no sessions.

## Deployment

| Part | Target | Config |
|---|---|---|
| Frontend | Vercel | `apps/web/vercel.json` — update the API URL before deploying |
| API | Railway / Render | `apps/api/Dockerfile` |

## Stack

- **Frontend**: React 18, Vite 5, React Router 6, TypeScript 5
- **Backend**: Node.js 20, Express 4, TypeScript 5
- **Shared**: `@watchpost/shared-types` (npm workspace)
- **External APIs**: HaveIBeenPwned (k-anonymity), XposedOrNot, RDAP (rdap.org)
- **Native Node modules**: `tls` (SSL checker), `dns/promises` (DNS lookup), `crypto` (SHA-1 for HIBP)

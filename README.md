# Watchpost

Centralised security audit suite — 4 tools, one interface.

![Watchpost home](docs/screenshot-home.png)

## Tools

| Module | Input | What it does |
|---|---|---|
| **Full Site Audit** | URL | Headers, 50+ vulnerability checks, SSL/TLS, DNS/WHOIS — one weighted score. Crawls up to 6 pages. Detects tech stack (WordPress, Next.js, Laravel…) and runs targeted checks. |
| **Password Strength** | Password | Entropy, realistic crack time via [zxcvbn](https://github.com/dropbox/zxcvbn), HaveIBeenPwned k-anonymity check, improvement suggestions, built-in password generator. |
| **Email Breach Check** | Email | Known data breaches via XposedOrNot (free, no API key). Risk score, breach timeline, contextual recommendations. Supports checking multiple emails at once. |
| **Monitoring** | Domain | Scheduled rescans (daily/weekly), score history sparkline, diff between scans, webhook + email alerts when score drops below threshold. CI/CD gate endpoint included. |

## Architecture

```
watchpost/                        # npm workspaces monorepo
├── packages/
│   └── shared-types/             # TypeScript interfaces shared by front + back
│       └── src/index.ts          # Grade, SecurityScore, all result types
├── apps/
│   ├── api/                      # Node.js + Express + TypeScript
│   │   └── src/
│   │       ├── routes/           # one file per module + /ci + /monitor
│   │       ├── services/         # business logic per module
│   │       ├── scoring/          # shared buildScore() → SecurityScore
│   │       └── http/             # fetch wrapper with 10s timeout
│   └── web/                      # React + Vite + TypeScript
│       └── src/
│           ├── api/client.ts     # typed API client (mirrors shared-types)
│           ├── components/       # ScoreBadge, ResultPanel, ModuleLayout
│           └── modules/          # Home + 4 module pages
```

## Getting started

```bash
npm install        # installs all workspaces from the root
npm run dev        # API on :3001, frontend on :5173
```

The `predev` script auto-builds `shared-types` before the dev servers start.

## CI/CD gate

Add a security gate to any pipeline with a single HTTP call:

```bash
# Returns HTTP 200 if score ≥ threshold, 412 if below
curl --fail-with-body \
  "http://localhost:3001/api/ci?domain=example.com&threshold=80"

# Response: { "pass": true, "score": 91, "grade": "A", "threshold": 80 }
```

**GitHub Actions example:**

```yaml
- name: Security gate
  run: |
    curl --fail-with-body \
      "${{ secrets.WATCHPOST_URL }}/api/ci?domain=${{ vars.DOMAIN }}&threshold=80"
```

## Email alerts (optional)

Copy `apps/api/.env.example` to `apps/api/.env` and fill in your SMTP credentials to enable email alerts from the Monitor module. Works with Gmail, Outlook, Brevo (free tier), Resend, Mailgun.

Webhook alerts (Slack, Discord, ntfy.sh, any JSON POST endpoint) work out of the box with no configuration.

## Privacy

- **Password module**: the password never leaves your server. Only the first 5 characters of its SHA-1 hash are sent to [HaveIBeenPwned](https://haveibeenpwned.com/API/v3#SearchingPwnedPasswordsByRange) (k-anonymity).
- **Email module**: addresses are sent to [XposedOrNot](https://xposedornot.com/) for breach lookup. Nothing is persisted by Watchpost.
- **Monitor module**: scan results are stored locally in `apps/api/data/monitors.json`.
- The API has no database and no user sessions.

## Stack

- **Frontend**: React 18, Vite 5, React Router 6, TypeScript 5
- **Backend**: Node.js 20, Express 4, TypeScript 5, zxcvbn, nodemailer
- **Shared**: `@watchpost/shared-types` (npm workspace)
- **External APIs**: HaveIBeenPwned (k-anonymity), XposedOrNot, RDAP (rdap.org)
- **Native Node modules**: `tls`, `dns/promises`, `net`, `crypto`

## Deployment

| Part | Target | Notes |
|---|---|---|
| Frontend | Vercel | Update `VITE_API_URL` env var to point to your API |
| API | Railway / Render / VPS | Set SMTP env vars for email alerts |

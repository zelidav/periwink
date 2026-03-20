# Periwink

A calm, intelligent community platform for women navigating perimenopause and menopause.

## Features

- **Community Rooms** — Topic-based threaded discussions with pseudonymous or anonymous posting
- **Symptom Tracker** — Daily logging with severity ratings across vasomotor, sleep, mood, and physical categories
- **Citizen Science** — Opt-in anonymous data contribution to generate community insights
- **Community Insights** — Aggregated patterns from contributing members (symptom prevalence, treatment effectiveness, correlations)
- **Privacy-first Identity** — Pseudonyms by default, full anonymity per-post, granular consent controls

## Tech Stack

- **Framework**: Next.js 15 (App Router) + TypeScript
- **Styling**: Tailwind CSS v4
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Auth**: NextAuth.js v5
- **Deployment**: Railway

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your DATABASE_URL and NEXTAUTH_SECRET

# Push database schema
npx prisma db push

# Seed default rooms
npm run db:seed

# Run dev server
npm run dev
```

## Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Random secret for session encryption |
| `NEXTAUTH_URL` | Your app URL (e.g., `http://localhost:3000`) |

## Railway Deployment

1. Connect this repo to a new Railway project
2. Add a PostgreSQL plugin (auto-sets `DATABASE_URL`)
3. Set `NEXTAUTH_SECRET` and `NEXTAUTH_URL` environment variables
4. Deploy — `railway.toml` handles build and start commands

## License

Private — All rights reserved.

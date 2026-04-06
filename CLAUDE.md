# CLAUDE.md — Periwink

## Project Overview

**Periwink** is a privacy-first community platform for women navigating perimenopause and menopause. It combines community discussion, symptom tracking, and citizen science in a space designed to feel calm, intelligent, and emotionally real.

**Live URLs:**
- Landing page: https://www.yourperiwink.com (GitHub Pages from `docs/`)
- App: https://periwink-production-a893.up.railway.app
- App demo: https://periwink-production-a893.up.railway.app/app
- Repo: https://github.com/zelidav/periwink

---

## Tech Stack

- **Framework**: Next.js 15 (App Router) + TypeScript
- **Styling**: Tailwind CSS v4 + CSS custom properties in `globals.css`
- **ORM**: Prisma with PostgreSQL (hosted on Railway)
- **Auth**: NextAuth.js v5 (beta) with JWT strategy, credentials provider
- **Email**: Resend (`hello@yourperiwink.com`), notifications to `adrian@yourperiwink.com`
- **Deployment**: Railway (nixpacks builder, standalone output)
- **Landing Page**: Static HTML in `docs/` served via GitHub Pages + custom domain
- **Node**: >=20

---

## Project Structure

```
periwink/
  docs/
    index.html                       — Landing page (GitHub Pages / yourperiwink.com)
    CNAME                            — Custom domain config
    feather.png                      — Brand image: soft dandelion texture
    waves.png                        — Brand image: flowing wave patterns
    silhouette.png                   — Brand image: feminine line art
    floral.png                       — Brand image: macro petal imagery
    hero-botanical.png               — Legacy brand image
    hero-watercolor.png              — Legacy brand image
  prisma/
    schema.prisma                    — Full database schema (source of truth)
    seed.ts                          — Rich demo data (12 users, 51 posts, 145 comments, 275 reactions)
  src/
    app/
      page.tsx                       — Root route, renders LandingPage component
      layout.tsx                     — Root layout with ambient glows
      globals.css                    — Design tokens as CSS variables + Tailwind
      app/
        layout.tsx                   — App shell (header + bottom nav)
        page.tsx                     — Home feed (Server Component, fetches from DB)
        rooms/
          page.tsx                   — Room list (Server Component)
          [slug]/
            page.tsx                 — Room detail with posts + comments (Server Component)
        stories/
          page.tsx                   — Featured/pinned posts (Server Component)
        checkin/
          page.tsx                   — Guided check-in form (Client Component)
        circles/
          page.tsx                   — Live circles coming-soon page
        profile/
          page.tsx                   — Profile placeholder with locked states
        onboarding/
          page.tsx                   — 3-step reflective onboarding (Client Component)
      api/
        auth/[...nextauth]/route.ts  — NextAuth handler
        auth/signup/route.ts         — User registration
        signup/route.ts              — Quick email capture + Resend notification
        signup/community/route.ts    — Community signup + Resend notification
        signup/founding/route.ts     — Founding member application + Resend notification
        posts/route.ts               — GET/POST community posts
        rooms/route.ts               — GET rooms
        symptoms/route.ts            — GET/POST symptom logs
        insights/route.ts            — GET citizen science aggregates
    components/
      LandingPage.tsx                — React landing page (at /)
      AppShell.tsx                   — Legacy single-component app shell (mock data)
      AppHeader.tsx                  — Sticky frosted-glass header with locked auth buttons
      AppNav.tsx                     — Fixed bottom nav (Home, Rooms, Check-in, Stories, Profile)
      GrowingMessage.tsx             — Graceful lock modal + LockedButton wrapper
      PostCard.tsx                   — Post display with author, time, reactions, comments
      ReactionBar.tsx                — Reaction display, triggers GrowingMessage on click
      Avatar.tsx                     — Deterministic gradient avatar from pseudonym
    lib/
      auth.ts                        — NextAuth config (credentials + JWT)
      prisma.ts                      — Prisma singleton client
      queries.ts                     — Centralized Prisma queries for Server Components
      demo-helpers.ts                — timeAgo, avatarHue, avatarGradient utilities
      design.ts                      — Design system constants (colors, fonts, gradients)
      email.ts                       — Resend email templates (welcome, founding confirmation)
```

---

## Key Commands

```bash
npm install              # Install dependencies
npm run dev              # Start dev server
npm run build            # prisma generate && next build
npm run db:push          # Push schema to database
npm run db:seed          # Seed demo data (12 users, 51 posts, etc.)
```

---

## Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string (Railway) |
| `NEXTAUTH_SECRET` | Random secret for session encryption |
| `NEXTAUTH_URL` | App URL (e.g., `http://localhost:3000`) |
| `RESEND_API_KEY` | Resend API key for transactional email |

---

## Database Schema Overview

The Prisma schema (`prisma/schema.prisma`) is the source of truth:

- **Auth & Identity**: User, Account, Session, VerificationToken
- **Profile & Privacy**: Profile (pseudonym-first, optional demographics), PrivacySettings
- **Community**: Room (8 seeded), Post, Comment (threaded), Reaction (HEART/HUG/SAME/HELPFUL/BOOKMARK), RoomFollow
- **Moderation**: RoomModerator, RoomBan, ModerationAction, Report
- **Symptom Tracking**: SymptomLog (25 symptom types, severity 1-5), TreatmentLog, UserMedication, UserSupplement
- **Citizen Science**: CitizenScienceConsent (granular opt-ins), ConsentRecord (immutable audit trail)
- **Pre-launch**: CommunitySignup, FoundingMemberApplication
- **Post-launch**: FounderApplication (linked to user accounts)
- **Notifications**: polymorphic notification system

All IDs use `cuid()`. Soft deletes via `deletedAt`. Tables use `@@map` for snake_case names.

---

## Seed Data

`prisma/seed.ts` populates the database with realistic demo content:

- **12 users**: MoonlitSage, DesertRose, QuietStorm42, WildSage, TidalGrace, NightOwl3am, GoldenThread, SteadyRain, WinterBloom, CopperMoon, SilverLining, VelvetDusk
- **51 posts** across 8 rooms (7 pinned as featured stories)
- **145 comments** with threading
- **275 reactions** (weighted: SAME 40%, HEART 25%, HUG 20%, HELPFUL 15%)
- **68 symptom logs** across 6 users
- **57 room follows**
- Idempotent: cleans `@periwink-demo.com` records before re-seeding

---

## Architecture Patterns

### App Pages (Server Components)
Pages under `/app/*` use Server Components that query Prisma directly via `src/lib/queries.ts`. No API routes needed for page rendering — the existing API routes serve the landing page forms and future client-side features.

### Graceful Lock Pattern
Every interactive element (post, react, follow, sign in, comment, save check-in) triggers a `GrowingMessage` modal with warm, on-brand copy:
- "Periwink is still growing"
- Context-specific messages per action
- "You are not early. You are exactly on time."
- Uses `LockedButton` wrapper component

### Landing Page (GitHub Pages)
`docs/index.html` is a self-contained static page with:
- Hero with quick email signup + scroll-to-form buttons
- Brand story ("You are not breaking down. You are becoming.")
- Community voice cards (4 realistic quotes)
- Inline community signup form (name, email, pseudonym)
- Inline founding member form (name, email, role, bio)
- All forms POST to Railway production API
- Custom domain via `docs/CNAME` → yourperiwink.com

### Signup Flow
Three signup endpoints, all notify `adrian@yourperiwink.com` via Resend:
- `/api/signup` — email only (quick capture)
- `/api/signup/community` — name, email, pseudonym
- `/api/signup/founding` — name, email, role, bio (maps to schema fields with defaults)

---

## Design System

### Colors (CSS variables in globals.css + TypeScript in design.ts)
- **Primary**: dusty plum `#6E5A7E` (buttons, active states, logo)
- **Secondary**: lavender `#B7A8C9`, periwinkle `#8C92FF`
- **Backgrounds**: warm ivory `#F7F3EE`, card `#FDFBF8`
- **Accents**: muted rose `#C99AA5`, soft glow `#D7CCFF`
- **Text**: ink `#2B2433`, secondary `#6B6575`, tertiary `#9B94A3`
- **Borders**: warm `#DDD7CE`, lavender `#E2DDE8`

### Typography
- **Headings**: Cormorant Garamond (weight 300-400, elegant serif)
- **Body**: DM Sans (weight 300, clean sans-serif)

### Brand Images (in docs/)
- `silhouette.png` — feminine line art on lavender, hero background
- `waves.png` — flowing wave patterns
- `feather.png` — soft dandelion/feather texture
- `floral.png` — macro petal imagery
- All lavender/periwinkle toned with "PERIWINK" wordmark overlay

---

## Brand Voice

- Warm, empathetic, validating
- Second-person ("you're not alone")
- Narrative, emotionally specific — not generic wellness copy
- Privacy-focused messaging
- No medical claims — peer support framing
- Key phrases: "A wiser way forward — together", "More truth. Deeper alignment. More you.", "From symptoms to sovereignty", "Held in change. Changed in community."

---

## Deployment

### Railway (App)
- Auto-deploys from `main` branch
- `railway.toml`: runs `prisma db push --skip-generate` before `npm start`
- Standalone Next.js output
- PostgreSQL plugin provides `DATABASE_URL`

### GitHub Pages (Landing Page)
- Serves from `docs/` folder on `main` branch
- Custom domain: `www.yourperiwink.com` via `docs/CNAME`
- DNS: CNAME `www` → `zelidav.github.io` (configured in GoDaddy)

---

## Development Notes

- Path aliases: `@/*` maps to `./src/*`
- Build config: TypeScript and ESLint errors ignored during builds (`next.config.ts`)
- Prisma client: singleton pattern in `src/lib/prisma.ts`
- Dynamic pages use `export const dynamic = "force-dynamic"` to avoid build-time DB queries
- Next.js 15 dynamic params are Promises: `const { slug } = await params;`

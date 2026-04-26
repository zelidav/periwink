# Periwink — Handoff

This document is a one-shot brief for the next Claude session picking up Periwink. Pair it with `CLAUDE.md` (architectural reference) — this file covers **state**, **what's pending**, and **what only the previous owner knew**.

Handoff date: 2026-04-26
Previous owner: David Z (`zelidav@gmail.com`)
New owner: Dr. Adrian Tubero (founder) — GitHub: `drtubero03`
New repo URL: https://github.com/drtubero03/periwink

---

## 0. Adrian — Start Here (read this first)

These steps get Claude Code installed and pointed at the Periwink project. You only do this once. Total time: about 10 minutes.

### Step 1 — Install Claude Code

**On a Mac:** Open the Terminal app (press `Cmd + Space`, type "Terminal", press Enter). Paste this and press Enter:

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

**On Windows:** Open PowerShell (press the Windows key, type "PowerShell", press Enter). Paste this and press Enter:

```powershell
irm https://claude.ai/install.ps1 | iex
```

The installer bundles everything Claude Code needs — you do NOT need to install Node.js separately.

When it finishes, **close the terminal window and open a new one** so it picks up the new `claude` command.

### Step 2 — Install Git (the tool that talks to GitHub)

**On a Mac:** In a terminal, type `git --version` and press Enter. If it asks you to install developer tools, click "Install" and wait. If it prints a version number (e.g. `git version 2.x`), you're done.

**On Windows:** Download and run the installer from https://git-scm.com/download/win — accept all the default options. After it installs, close PowerShell and open a new PowerShell window.

### Step 3 — Clone the project from GitHub

In your terminal, navigate to where you want the project to live (your Documents folder is fine), then clone the repo:

**Mac:**
```bash
cd ~/Documents
git clone https://github.com/drtubero03/periwink.git
cd periwink
```

**Windows (PowerShell):**
```powershell
cd ~\Documents
git clone https://github.com/drtubero03/periwink.git
cd periwink
```

If git asks you to sign in to GitHub, use your `drtubero03` account. (It may open a browser window — just follow the prompts.)

### Step 4 — Open Claude Code on the project

You're now in the project folder. Start Claude Code:

```
claude
```

The first time you run it, it will open a browser window asking you to sign in. Sign in with your Anthropic account (the same one you use for Claude.ai). Once signed in, Claude Code will be ready in the terminal.

### Step 5 — Give Claude its first instruction

Inside the Claude Code session (you'll see a prompt where you can type), paste this exact message and press Enter:

```
Read HANDOFF.md and CLAUDE.md, then brief me on the current state of the Periwink project. After that, walk me through Section 3 ("Repo state at handoff") — there is uncommitted work from the previous owner that needs to be reviewed, committed, and pushed to my new GitHub repo. Help me do that step by step.
```

Claude will read both documents, summarize the project for you, and then guide you through committing the pending GCP migration work to your new repo. Just answer its questions as it goes.

### What if something goes wrong?

- **`claude: command not found`** — close and reopen your terminal. If still broken, re-run the install command from Step 1.
- **`git: command not found`** (Windows) — Git for Windows didn't install correctly; redo Step 2.
- **GitHub asks for a password** — modern GitHub uses a "Personal Access Token" instead of your account password. The simplest fix: install the **GitHub CLI** (`brew install gh` on Mac, or download from https://cli.github.com/ on Windows), run `gh auth login`, follow the prompts, then retry the `git clone`.
- **Anything else** — open Claude Code (`claude` in any terminal) and describe what went wrong; it can troubleshoot.

---

## 1. What Periwink is

Privacy-first community platform for women navigating perimenopause / menopause. Combines community discussion, symptom tracking, and citizen science. Founder is Adrian Tubero (clinical psychologist). See `CLAUDE.md` for full architecture, schema, and design system.

---

## 2. Live URLs

| Surface | URL | Hosting |
|---|---|---|
| Landing page | https://www.yourperiwink.com | GitHub Pages from `docs/` on `main` |
| App | https://periwink-hvwa5fgo5q-ue.a.run.app | GCP Cloud Run (`periwink-prod`, `us-east1`) |
| Admin dashboard | `<app-url>/admin` | Same Cloud Run service, password-gated |
| Legacy (deprecated) | https://periwink-production-a893.up.railway.app | Railway — can be shut down |

DNS for `yourperiwink.com` is at **GoDaddy**. CNAME `www` → `zelidav.github.io` → Adrian will need to either keep this pointed at zelidav's GitHub Pages, or fork `docs/` and repoint.

---

## 3. Repo state at handoff — IMPORTANT

The repo was transferred to Adrian's GitHub. Local clone at `~/Documents/GitHub/periwink` still has the old remote pointing at `github.com/zelidav/periwink.git`. **First action for the new owner's Claude:**

```bash
git remote set-url origin https://github.com/drtubero03/periwink.git
git remote -v   # verify
```

(If the new owner cloned fresh from `drtubero03/periwink` per §0, the remote is already correct — this step is only for the previous owner's local clone.)

**There is uncommitted work in the local tree that has not been pushed yet.** This is the GCP migration — Periwink was on Railway until 2026-04-19 and the Cloud Run cutover code never made it back to GitHub. Files with pending changes:

Modified:
- `.env.example` — added GCP-era variables
- `.gitignore` — added GCP/build artifacts
- `CLAUDE.md` — rewritten for GCP stack (was Railway-focused)
- `docs/index.html` — landing page form `POST` URL repointed at the Cloud Run URL
- `src/app/admin/page.tsx` — admin dashboard now sends `X-Admin-Token` header
- `src/middleware.ts` — restrictive CORS allowlist + admin-route token gate

Untracked (new files):
- `Dockerfile` — multi-stage build for Cloud Run (see quirks in §6)
- `.dockerignore`
- `cloudbuild.yaml` — Cloud Build pipeline
- `infra/setup-gcp.sh` — one-time provisioning script
- `src/lib/admin-auth.ts` — admin token verification helper
- `package-lock.json`

**Recommended first commit:** `feat: GCP Cloud Run migration (Dockerfile, Cloud Build, admin auth, restrictive CORS)`. After committing, `git push origin main` to populate the new repo.

Until that push happens, the Cloud Run service is running from a manually-deployed image that is **not represented in the GitHub repo**. Anyone reading the repo will see Railway-era code.

---

## 4. GCP infrastructure inventory

Everything below was provisioned under David's Google account. Adrian needs to be granted Owner (or appropriate roles) on the `periwink-prod` project — David should add him via IAM in the GCP console.

| Resource | Name / ID |
|---|---|
| GCP project | `periwink-prod` |
| Region | `us-east1` |
| Cloud SQL instance | `periwink-prod:us-east1:periwink-db` (PostgreSQL 15, db-f1-micro) |
| Database / user | `periwink` / `periwink` |
| Cloud Run service | `periwink` (1 GiB RAM, 1 CPU, min 0 / max 3) |
| Artifact Registry | `us-east1-docker.pkg.dev/periwink-prod/periwink` |
| VPC connector | `periwink-connector` (Cloud Run → Cloud SQL private path) |
| Billing account | `01DE45-3C37E9-1C55D8` ("My Billing Account" — David's) |

**Billing transfer:** Adrian likely wants the project moved to his own billing account. In GCP Console → Billing → Account Management → link `periwink-prod` to Adrian's billing account, then David can unlink his.

**Secrets in Secret Manager:**
- `periwink-database-url`
- `periwink-nextauth-secret`
- `periwink-resend-api-key` — value is `re_bsrsdFuG_5gegWqVmx8aBxtytQfYAFH6t` (this is shared with another David project called jbd-glass; Adrian should rotate it to his own Resend key once he has one)
- `periwink-admin-secret` — the password gating `/admin`

Rotate any secret with:
```bash
echo -n 'new-value' | gcloud secrets versions add periwink-<name> --data-file=-
```

**No Cloud Build GitHub trigger is configured yet.** Deploys are manual via:
```bash
gcloud builds submit --config=cloudbuild.yaml --substitutions=SHORT_SHA=manual
```
Wiring an auto-deploy trigger on push to `main` is a TODO — see §7.

---

## 5. Local development

```bash
cd ~/Documents/GitHub/periwink   # (Adrian's path may differ)
npm install                      # runs prisma generate via postinstall
cp .env.example .env             # then fill DATABASE_URL, NEXTAUTH_SECRET, ADMIN_SECRET, RESEND_API_KEY
npm run db:push                  # apply schema to local Postgres
npm run db:seed                  # rich demo data (12 users, 51 posts, 145 comments, 275 reactions)
npm run dev                      # http://localhost:3000
```

Node 20+. PostgreSQL required locally. The seed script lives at `prisma/seed.ts`.

---

## 6. Dockerfile / Cloud Run quirks (learned the hard way)

These are non-obvious and easy to break — preserve them.

1. **Runner stage copies the FULL `node_modules` from builder**, not just the Prisma subdirs. Next.js standalone trims dependencies, but `prisma` CLI needs transitive deps like `effect` at boot. Without the full tree the container crashes on startup.
2. **CMD invokes Prisma directly**, not via `npx`:
   ```
   node node_modules/prisma/build/index.js db push --skip-generate --accept-data-loss && node server.js
   ```
   `npx prisma` tries to download at runtime, which OOMs Cloud Run.
3. **Memory must be ≥ 1 GiB.** 512 MiB OOMs during Prisma startup.
4. **`--allow-unauthenticated` on the cloudbuild deploy step sometimes silently fails** to set the IAM binding. If the service returns 403 to public traffic after a fresh deploy, run:
   ```bash
   gcloud run services add-iam-policy-binding periwink \
     --member=allUsers --role=roles/run.invoker --region=us-east1
   ```
5. **Schema changes go via `db push`, not migrations.** Edit `prisma/schema.prisma`, redeploy — the Dockerfile CMD applies it on boot. No `prisma migrate` workflow set up.

---

## 7. Outstanding TODOs

- [ ] Update local `git remote` to Adrian's repo URL, commit pending GCP work, push to `main`
- [ ] Update GitHub Pages source if Adrian wants the landing page served from his repo (currently served from `zelidav/periwink`'s `docs/`). Either keep zelidav as the GH Pages owner, or repoint `docs/CNAME` and DNS at Adrian's GH Pages.
- [ ] Add Adrian as Owner on `periwink-prod` GCP project; transfer billing
- [ ] Create Cloud Build GitHub trigger so push-to-main auto-deploys (see comment block at the bottom of `infra/setup-gcp.sh` for the exact steps)
- [ ] Rotate `periwink-resend-api-key` to Adrian's own Resend key (current key is shared with another project)
- [ ] Custom domain mapping for the app (e.g. `app.yourperiwink.com` → Cloud Run service) — not yet configured
- [ ] Shut down the Railway deployment once the new owner verifies Cloud Run is doing everything Railway was

---

## 8. Brand voice & design

See `CLAUDE.md` §"Design System" and §"Brand Voice". TL;DR: warm, empathetic, second-person, no medical claims, peer-support framing. Colors are dusty plum / lavender / periwinkle on warm ivory. Headings in Cormorant Garamond, body in DM Sans.

---

## 9. Where to look first

| If you're trying to… | Start at |
|---|---|
| Understand the data model | `prisma/schema.prisma` |
| Add or change a feature page | `src/app/app/*` (Server Components query Prisma via `src/lib/queries.ts`) |
| Add an admin tool | `src/app/admin/page.tsx` + `src/app/api/admin/*` (gated by `X-Admin-Token`) |
| Change landing page copy | `docs/index.html` (single static file) |
| Modify deploy pipeline | `cloudbuild.yaml` + `Dockerfile` |
| Re-provision infra in a fresh GCP project | `infra/setup-gcp.sh` |

---

## 10. Contact

If anything in this handoff is wrong or missing, the previous owner (`zelidav@gmail.com`) has the full mental model and can answer questions.

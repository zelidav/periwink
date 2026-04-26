# Periwink — Handoff

This document is a one-shot brief for the next Claude session picking up Periwink. Pair it with `CLAUDE.md` (architectural reference) — this file covers **state**, **what's pending**, and **what only the previous owner knew**.

- Handoff date: 2026-04-26
- Previous owner: David Z (`zelidav@gmail.com`)
- New owner: Dr. Adrian Tubero (founder) — GitHub: `drtubero03`
- Repo: https://github.com/drtubero03/periwink

---

## 0. Adrian — Start Here (read this first)

These steps install Claude Code on your Mac and point it at this project. You only do this once. Total time: about 10 minutes.

**Before you start:** You only need ONE Terminal window open. Claude Code will run every other command for you inside its own session — you will not need to manage multiple terminals. If a long-running command ever needs to be stopped, press `Control + C`.

### Step 1 — Install Claude Code

Open the **Terminal** app on your Mac (press `Cmd + Space`, type "Terminal", press Enter). Paste this and press Enter:

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

The installer bundles everything Claude Code needs — you do NOT need to install Node.js or anything else first.

When it finishes, **quit Terminal completely** (press `Cmd + Q`) and re-open it. This is required so the new `claude` command becomes available.

### Step 2 — Install Git (if you don't already have it)

In the new Terminal window, type this and press Enter:

```bash
git --version
```

- If a popup appears asking to install developer tools, click **Install** and wait (~5 min).
- If it prints `git version 2.x.x` instead, you already have Git — skip to Step 3.

### Step 3 — Clone the project from GitHub

Paste these commands one at a time, pressing Enter after each:

```bash
cd ~/Documents
git clone https://github.com/drtubero03/periwink.git
cd periwink
```

If git asks you to sign in, use your `drtubero03` GitHub account. It may open a browser window — just follow the prompts. If it asks for a password and rejects your normal GitHub password, see **Troubleshooting** below.

### Step 4 — Open Claude Code on the project

You're now inside the project folder. Start Claude Code:

```
claude
```

The first time you run it, a browser window will open asking you to sign in to your Anthropic account. Sign in, return to Terminal, and you'll see a prompt at the bottom where you can type messages to Claude.

### Step 5 — Give Claude its first instruction

Inside Claude Code, paste this entire block as your first message and press Enter:

```
I'm Dr. Adrian Tubero, the founder of Periwink. The project was just transferred to me from David Z. I am NOT a developer — please explain what you're doing as you go, and never run a command that costs money or makes a permanent change without asking me first. I am working in a single Terminal window with you and I cannot open additional terminals, so please run all commands inside this Claude Code session.

My starting state:
- Claude Code is installed (you're running it now)
- The repo is cloned and you're inside it
- I have a Google Cloud account with billing enabled, ready to use
- I do NOT yet have: a Resend account, the gcloud CLI, or Homebrew (probably)

Please do this in order:
1. Read HANDOFF.md and CLAUDE.md, then give me a plain-language summary of what Periwink is and where things stand.
2. Walk me through Section 4 of HANDOFF.md — provision MY OWN Google Cloud project. Install gcloud and any other missing tools as you go. Stop before any step that costs money or creates a permanent resource and explain what's about to happen.
3. After my GCP is up and the app is deployed to my Cloud Run, help me update docs/index.html so the landing-page form posts to MY Cloud Run URL (not David's), then commit and push the change.
4. After everything is verified working, give me a checklist of what to ask David to shut down on his side.
```

Claude will read the docs, brief you, then guide you step by step.

### Troubleshooting

- **`claude: command not found`** — Quit Terminal (`Cmd + Q`) and reopen. If still broken, re-run Step 1.
- **`git: command not found`** — Redo Step 2.
- **GitHub rejects your password** — modern GitHub uses a "Personal Access Token" instead of your account password. Easiest fix from inside Claude Code: ask Claude to install the GitHub CLI for you (it'll run `brew install gh`, then `gh auth login`, and walk you through the browser sign-in). After that, retry the `git clone`.
- **Anything else** — describe what went wrong to Claude in the same session; it can troubleshoot.

---

## 1. What Periwink is

Privacy-first community platform for women navigating perimenopause / menopause. Combines community discussion, symptom tracking, and citizen science. Founder is Adrian Tubero (clinical psychologist). See `CLAUDE.md` for full architecture, data model, and design system.

---

## 2. Live URLs (David's deployment, being decommissioned)

| Surface | URL | Status |
|---|---|---|
| Landing page | https://www.yourperiwink.com | Live (GitHub Pages from `docs/` on `main`) |
| App (David's Cloud Run) | https://periwink-hvwa5fgo5q-ue.a.run.app | **To be shut down** once Adrian's Cloud Run is verified working |
| Legacy Railway | https://periwink-production-a893.up.railway.app | Already deprecated |

DNS for `yourperiwink.com` is at **GoDaddy**. CNAME `www` → `zelidav.github.io`. Once Adrian has her own GitHub Pages set up under `drtubero03`, this CNAME should be repointed.

---

## 3. Repo state at handoff

The full GCP-migration code (Dockerfile, Cloud Build config, `infra/setup-gcp.sh`, admin auth, CORS hardening) was committed and pushed to `drtubero03/periwink` on 2026-04-26 in commit `1457963` — **the repo on GitHub is in sync with David's running deployment.** Nothing pending to chase down.

One small carve-out: a local edit to `docs/index.html` (David's clone only — never pushed) repoints the landing-page form at David's Cloud Run URL. It was intentionally **not** pushed, because Adrian's Cloud Run URL will be different. Adrian's first Claude session will update `docs/index.html` with her own URL once she's deployed (Step 3 of the §0 starter prompt).

---

## 4. Provisioning YOUR OWN GCP infrastructure

This is the main task for Adrian's first Claude session. The repo includes everything needed to spin up an identical GCP setup under Adrian's own Google account.

### Prerequisites

- A **Google Cloud account with billing enabled**. New GCP accounts get **$300 in free credit** that lasts 90 days. After that, Periwink at the smallest tier will run roughly **$15–25/month** (mostly Cloud SQL).
- The `gcloud` command-line tool. Adrian's Claude can install this for her: `brew install --cask google-cloud-sdk`.
- A **Resend account** (https://resend.com — free tier is plenty) for sending emails. Get an API key after signing up.

### What `infra/setup-gcp.sh` creates

The provisioning script creates everything in one shot:

| Resource | Name | Approx. cost |
|---|---|---|
| GCP project | Adrian picks (e.g. `periwink-adrian`) | n/a |
| Region | `us-east1` (default) | n/a |
| Cloud SQL | `periwink-db` (PostgreSQL 15, db-f1-micro) | ~$10/month |
| Cloud Run service | `periwink` (1 GiB RAM, 1 CPU, scales to 0) | $0–10/month |
| Artifact Registry | Docker image storage | Free tier covers this |
| VPC connector | `periwink-connector` (Cloud Run → Cloud SQL) | ~$5/month |
| Secret Manager entries | DATABASE_URL, NEXTAUTH_SECRET, RESEND_API_KEY, ADMIN_SECRET | Free tier |

### Post-provisioning checklist (Adrian's Claude will walk through these)

- [ ] Save Resend API key into the `periwink-resend-api-key` secret
- [ ] First deploy: `gcloud builds submit --config=cloudbuild.yaml --substitutions=SHORT_SHA=initial`
- [ ] Note the new Cloud Run URL printed at the end of the deploy
- [ ] Update `docs/index.html` to POST signup forms to the new URL; commit and push
- [ ] (Optional) Wire a Cloud Build GitHub trigger so push-to-main auto-deploys
- [ ] (Optional) Custom domain: `gcloud run domain-mappings create --service=periwink --domain=app.yourperiwink.com --region=us-east1`

---

## 5. Local development (optional — only needed if Adrian wants to run the app on her laptop)

```bash
npm install                # auto-runs prisma generate
cp .env.example .env       # then fill DATABASE_URL, NEXTAUTH_SECRET, ADMIN_SECRET, RESEND_API_KEY
npm run db:push            # apply schema to a local Postgres
npm run db:seed            # rich demo data (12 users, 51 posts, 145 comments, 275 reactions)
npm run dev                # http://localhost:3000
```

Node 20+ and a local PostgreSQL install are required. **Adrian doesn't need to do any of this for the GCP migration** — she only needs it if she wants to preview changes on her own laptop before deploying.

---

## 6. Dockerfile / Cloud Run quirks (do not change without reading)

These are non-obvious and easy to break. Preserve them when editing `Dockerfile` or `cloudbuild.yaml`:

1. **Runner stage copies the FULL `node_modules`** from the builder, not just the Prisma subdirs. Next.js standalone trims dependencies, but `prisma` CLI needs transitive deps like `effect` at boot. Without the full tree the container crashes on startup.
2. **CMD invokes Prisma directly**, not via `npx`:
   ```
   node node_modules/prisma/build/index.js db push --skip-generate --accept-data-loss && node server.js
   ```
   `npx prisma` tries to download at runtime and OOMs Cloud Run.
3. **Memory must be ≥ 1 GiB.** 512 MiB OOMs during Prisma startup.
4. **`--allow-unauthenticated` in cloudbuild sometimes silently fails** to set the public-access IAM binding. If the service returns 403 to the public after a fresh deploy, run:
   ```
   gcloud run services add-iam-policy-binding periwink \
     --member=allUsers --role=roles/run.invoker --region=us-east1
   ```
5. **Schema changes use `db push`, not migrations.** Edit `prisma/schema.prisma`, redeploy — the Dockerfile CMD applies it on boot. There is no `prisma migrate` workflow.

---

## 7. Outstanding TODOs after Adrian's GCP is up

- [ ] Update `docs/index.html` API URL to Adrian's Cloud Run URL (commit + push)
- [ ] Optional: Cloud Build GitHub trigger for auto-deploy on push to main
- [ ] Optional: custom domain mapping (`app.yourperiwink.com` → Cloud Run)
- [ ] Once Cloud Run is verified working, ask David to shut down: his `periwink-prod` GCP project, his Cloud Run service, his Cloud SQL instance, and the Railway deployment
- [ ] Rotate the Resend API key — the one in David's secret was shared with another project; Adrian should use her own from day one

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
| Modify the deploy pipeline | `cloudbuild.yaml` + `Dockerfile` |
| Re-provision infra in a fresh GCP project | `infra/setup-gcp.sh` |

---

## 10. Contact

If anything in this handoff is wrong or missing, the previous owner (`zelidav@gmail.com`) has the full mental model and can answer questions.

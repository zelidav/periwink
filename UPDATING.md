# Adrian's Cheat Sheet — How to Update Either Project

You have two projects you may want to update over time:

1. **Periwink** — the community app + landing page (this repo, `drtubero03/periwink`)
2. **Empowered Mind** — your clinical practice site (`empowered-mind` repo)

This doc is your reference for both. Same general workflow, slightly different deploy pipelines. **Always work through Claude Code** — you do not need to write code or run git commands yourself.

---

## The basic loop (works for both projects)

1. **Open Terminal**, navigate into the project folder, start Claude:
   ```
   cd ~/Documents/periwink        # or ~/Documents/empowered-mind
   claude
   ```
2. **Tell Claude what you want changed**, in plain English. Examples below.
3. **Review what Claude shows you.** It will print a summary of edits before saving them.
4. **When you're happy, say:** `commit and push`. Claude will save the change and send it to GitHub.
5. **Wait for the deploy** (timing depends on which project — see below). Refresh the live site to see your change.

If you don't like what Claude did before pushing, just say `undo that` or `try a different approach`.

If you already pushed and the live site is broken, say `the live site is broken, please roll back the last commit`. Claude will revert and re-push.

---

## Project 1 — Periwink (`drtubero03/periwink`)

### What lives where

| If you change… | Lives at… | Goes live in… |
|---|---|---|
| `docs/index.html` (the landing page at yourperiwink.com) | www.yourperiwink.com | ~1–2 min (GitHub Pages) |
| Anything else (the actual app pages, the database, emails…) | your Cloud Run URL | ~3–5 min (Cloud Build → Cloud Run) |

If you wired the Cloud Build GitHub trigger during your initial setup, app deploys are **automatic** on push. If not, Claude will run the manual deploy command for you (`gcloud builds submit ...`) — just tell Claude to deploy after pushing.

### Useful prompts to copy (Periwink)

**Landing page changes:**
> Change the hero headline on the landing page to: "Your new headline here"

> Add a new FAQ to the landing page: question is "...", answer is "..."

> The founding member section copy feels too clinical — make it warmer and more inviting.

**App changes:**
> On the home feed, add a new resource card linking to https://example.com about [topic].

> Change the welcome email subject line to "Welcome to Periwink — you're not alone"

> Add a new symptom type called "[name]" with description "[description]" — make sure it shows up in the check-in form.

**Operational:**
> Show me the last 5 signups from the database.

> Reset the admin dashboard password — generate a new strong one and update the secret.

> Show me how many people have signed up this week.

### One thing to know
Schema changes (new database tables, new fields) are applied **automatically** when the app boots after deploy. You don't run migrations. Just ask Claude to add the field; it will edit `prisma/schema.prisma` and the next deploy will apply it.

---

## Project 2 — Empowered Mind (`drtubero03/empowered-mind`)

To work on this one, open a fresh Terminal and clone it the same way you cloned Periwink:

```
cd ~/Documents
git clone https://github.com/drtubero03/empowered-mind.git
cd empowered-mind
claude
```

### What lives where

| If you change… | Lives at… | Goes live in… |
|---|---|---|
| Any `.html`, `styles.css`, or `script.js` | https://drtubero03.github.io/empowered-mind/ (or your custom domain once wired) | ~1 min (GitHub Pages) |

> **GitHub Pages note:** because the repo just transferred, the live URL changed from `zelidav.github.io/empowered-mind/` to `drtubero03.github.io/empowered-mind/`. GitHub usually redirects automatically, but if the live site is broken after the transfer, ask Claude to: "go into the repo's Settings → Pages on github.com and confirm Pages is enabled on the main branch." Claude can walk you through the click path.

This site is **pure static HTML** — no database, no build step, no server. Every page is a single editable HTML file in the repo root. That's why deploys are fast and there's nothing to break.

### Useful prompts to copy (Empowered Mind)

**Copy / content edits:**
> On the about page, change the bio paragraph that starts with "Dr. Tubero..." to: "[new text]"

> Add a new blog post titled "[title]". Use blog-disorientation.html as the template.

> Update the CSRT package price from $5,000 to $[new price] everywhere it appears (csrt-package.html and the FAQ on index.html).

**Group / scheduling updates:**
> The Spring 2026 group is filling up — add an "Almost Full" badge next to the "Apply" button on group-therapy.html.

> Move the next group cohort to Fall 2026, dates September 10 – October 22, 2026, Thursdays 4:30–6:00 PM EST. Update everywhere it's mentioned.

**Visual tweaks:**
> The hero headline on the home page feels too small on mobile — make it larger.

> Swap the headshot on the about page (I'll give you the new file).

### One thing to know
The site uses a strict palette: **sand + turquoise** (warm, calm tones). Pinks, coral, and slate were intentionally removed earlier. If you ask Claude to "make this more colorful" or similar, it may stray — better to be specific: "use the existing turquoise accent" or "match the styling of the cards on the about page."

---

## When to ask Claude vs. ask David

**Ask Claude (most things):**
- Copy edits, color tweaks, new pages, new blog posts
- Adding/changing form fields, email templates
- Updating database content (signups, symptoms, posts)
- Rolling back a broken deploy
- Adding a new feature you can describe in a sentence or two

**Ask David (or escalate):**
- Anything billing-related on Google Cloud
- Domain transfers, DNS changes at GoDaddy
- If Cloud Run goes down and Claude can't bring it back
- If you accidentally pushed something sensitive (passwords, keys) — David can scrub it

---

## Two safety habits

1. **Before saying "push"**, glance at what Claude says it changed. If it's editing files you didn't ask about, stop and ask why.
2. **For any spending change** (upgrading a Cloud Run tier, adding a paid service), ask Claude to estimate the monthly cost first. You decide before the change is made.

---

## When things go sideways

- **The site looks weird / broken right after a push:** `roll back the last commit and re-deploy`
- **Claude is suggesting something I don't understand:** `explain that to me like I'm not a developer, and tell me the risk`
- **A command is asking for my password / approval and I'm not sure:** screenshot it, send to David before clicking yes
- **Anything else:** describe it to Claude in plain English; it can usually figure it out

# Periwink — Admin Guide
### For Adrian and team

---

## Getting Into Admin

1. Go to **yourperiwink.com/admin** (or the Railway app URL + `/admin`)
2. Enter the password: `PERIADMIN`
3. You're in! The password is remembered for your browser session.

---

## Dashboard (Home Tab)

This is your at-a-glance view of everything happening with Periwink.

**What you'll see:**

- **Community Signups** — how many people have signed up from the landing page
- **Applications** — total founding member applications received
- **Pending Review** — applications waiting for your review (highlighted in gold when there are any)
- **Users** — registered app users
- **Posts / Comments / Reactions** — community engagement numbers
- **Rooms** — how many discussion rooms are active
- **Symptom Logs** — how many check-ins people have logged

**Signup Chart** — a simple bar chart showing signups over the last 30 days so you can see momentum.

**Recent Activity** — the latest signups and newest users, with how long ago they joined.

---

## Signups Tab

Everyone who entered their info on the landing page shows up here.

- **Search** — type a name, email, or pseudonym to find someone
- **Email links** — click any email to open a new message to that person
- Sorted newest first

These are people who expressed interest but haven't necessarily created an app account yet.

---

## Applications Tab

Founding member applications — people who want to help shape Periwink.

**Filtering:** Use the buttons at the top to see just Pending, Reviewing, Approved, or Declined applications.

**Reviewing an application:**
1. Click any row to expand it and see the full details (what draws them, what they'd bring, their organization, website)
2. Use the dropdown on the right to change their status:
   - **Pending** — just came in, hasn't been looked at
   - **Reviewing** — you've seen it, thinking about it
   - **Approved** — welcome aboard!
   - **Declined** — not the right fit

The status updates instantly.

---

## Users Tab

Everyone who has created an account in the Periwink app.

- **Search** by email or display name
- See their **menopause stage** (if they shared it during onboarding)
- See when they **joined**

---

## Posts Tab

All community posts across every room. This is your content moderation view.

**Search** across titles, content, authors, and room names.

**What each column means:**
- **Title** — the post title
- **Author** — who wrote it (shows "Anonymous" for anonymous posts)
- **Room** — which discussion room it's in
- **Comments / Reactions / Views** — engagement numbers
- **Status** — badges show if a post is Pinned, Locked, or Hidden

**Actions you can take on any post:**
- **Pin / Unpin** — pinned posts appear in the Stories/Featured section
- **Hide / Show** — hidden posts are invisible to users but not deleted
- **Lock / Unlock** — locked posts can't receive new comments
- **Delete** — soft-deletes the post (it's not gone forever, just hidden from everything)

---

## Rooms Tab

The discussion rooms that make up the community.

**Current rooms** are listed with their emoji icon, post count, follower count, and whether they're a default room (meaning new users auto-follow them).

**Creating a new room:**
1. Scroll down to "Create Room"
2. Fill in:
   - **Room name** — what users see (e.g. "Brain Fog & Memory")
   - **Slug** — the URL-friendly version, lowercase with dashes (e.g. "brain-fog")
   - **Description** — a sentence about what the room is for
   - **Icon** — paste an emoji
   - **Sort order** — lower numbers appear first in the list
   - **Default room** — check this if new users should auto-follow it
3. Click **Create Room**

---

## Moderators Tab

People who have moderation powers in specific rooms.

**Adding a moderator:**
1. Scroll down to "Add Moderator"
2. Select the **user** from the dropdown
3. Select which **room** they'll moderate
4. Choose their **role**:
   - **Moderator** — can hide/lock posts and comments in that room
   - **Owner** — full control over that room
5. Click **Add**

**Removing a moderator:** Click the red "Remove" button next to their name.

---

## Quick Reference

| What you want to do | Where to go |
|---|---|
| See how the community is growing | Dashboard tab |
| Find a specific person who signed up | Signups tab > search |
| Review a founding member application | Applications tab > click to expand > change status |
| Hide an inappropriate post | Posts tab > find the post > click "Hide" |
| Feature a great post | Posts tab > find the post > click "Pin" |
| Create a new discussion room | Rooms tab > scroll to Create Room |
| Give someone moderator access | Moderators tab > scroll to Add Moderator |

---

## The Landing Page

The public landing page lives at **www.yourperiwink.com**.

- The **Join** button (top nav and hero) plays the butterfly welcome video
- Scrolling down shows the brand story, community voices, your bio, and signup forms
- **Community Signup** and **Founding Member** forms send data to the app and notify you by email at adrian@yourperiwink.com
- The "Add App" button in the nav lets visitors save Periwink to their phone home screen (opens full-screen, like a real app)

The landing page is a static file — changes to it require updating `docs/index.html` in the code.

---

## Emails

When someone signs up or applies, you automatically get an email at **adrian@yourperiwink.com** with their details. These are sent via Resend from hello@yourperiwink.com.

- Quick signups (email only) — short notification
- Community signups — includes name, email, pseudonym
- Founding member applications — includes full application with a personal email sent to the applicant from you

---

## If Something Looks Wrong

- **Refresh button** — top right of the admin tab bar, click it to reload all data
- **Data not showing** — the app needs the database to be running (Railway). If everything is blank, Railway may need attention.
- **Need help** — reach out to David

---

*Last updated: April 2026*

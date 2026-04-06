export default function CirclesPage() {
  const upcomingCircles = [
    { title: "First Year of Perimenopause", facilitator: "TidalGrace", members: 8, day: "Thursdays", time: "7pm ET" },
    { title: "HRT Decision-Making", facilitator: "SilverLining", members: 6, day: "Tuesdays", time: "8pm ET" },
    { title: "Rage, Grief & Joy", facilitator: "MoonlitSage", members: 8, day: "Wednesdays", time: "6pm ET" },
    { title: "Sleep & Restoration", facilitator: "NightOwl3am", members: 6, day: "Mondays", time: "9pm ET" },
  ];

  return (
    <>
      <section style={{ marginBottom: 32 }}>
        <h1 style={{
          fontFamily: "var(--font-heading)", fontSize: 30, fontWeight: 300,
          color: "var(--color-ink)", marginBottom: 8,
        }}>
          Live Circles
        </h1>
        <p style={{ fontSize: 15, color: "var(--color-text-2)", lineHeight: 1.7 }}>
          Small-group gatherings where women come together in real time.
          Eight women, one facilitator, and the kind of conversation that changes how you feel about everything.
        </p>
      </section>

      {/* Coming soon card */}
      <div style={{
        background: "linear-gradient(135deg, var(--color-soft-mist), rgba(215,204,255,0.12))",
        border: "1px solid var(--color-lavender)",
        borderRadius: 20, padding: "32px 28px", marginBottom: 28,
        textAlign: "center",
      }}>
        <div style={{ fontSize: 32, marginBottom: 16 }}>🌱</div>
        <h2 style={{
          fontFamily: "var(--font-heading)", fontSize: 22, fontWeight: 400,
          color: "var(--color-dusty-plum)", marginBottom: 10,
        }}>
          Circles are being cultivated
        </h2>
        <p style={{ fontSize: 14, color: "var(--color-text-2)", lineHeight: 1.7, maxWidth: 420, margin: "0 auto" }}>
          We're building this experience with the intimacy and care it deserves.
          Live circles will be a place where transformation is witnessed —
          not just discussed.
        </p>
        <p style={{
          fontSize: 14, fontStyle: "italic", marginTop: 16,
          color: "var(--color-muted-rose)",
        }}>
          Held in change. Changed in community.
        </p>
      </div>

      {/* Preview of what's coming */}
      <h2 style={{
        fontFamily: "var(--font-heading)", fontSize: 20, fontWeight: 400,
        color: "var(--color-ink)", marginBottom: 14,
      }}>
        What circles will look like
      </h2>
      <div style={{ display: "grid", gap: 12 }}>
        {upcomingCircles.map((circle) => (
          <div
            key={circle.title}
            style={{
              background: "var(--color-card)",
              border: "1px solid var(--color-border-warm)",
              borderRadius: 14, padding: "18px 22px",
            }}
          >
            <h3 style={{
              fontFamily: "var(--font-heading)", fontSize: 18, fontWeight: 400,
              color: "var(--color-ink)", marginBottom: 6,
            }}>
              {circle.title}
            </h3>
            <p style={{ fontSize: 13, color: "var(--color-text-3)" }}>
              Facilitated by {circle.facilitator} · {circle.members} women · {circle.day} at {circle.time}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}

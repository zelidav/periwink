import Link from "next/link";

// ── Hardcoded vision data — what Periwink looks like at 10,000 contributors ──

const VISION_SYMPTOMS = [
  { label: "Fatigue", pct: 82 },
  { label: "Brain fog", pct: 78 },
  { label: "Sleep disruption", pct: 76 },
  { label: "Hot flashes", pct: 74 },
  { label: "Anxiety", pct: 68 },
  { label: "Mood swings", pct: 63 },
  { label: "Night sweats", pct: 59 },
  { label: "Joint pain", pct: 51 },
  { label: "Bloating", pct: 44 },
  { label: "Low libido", pct: 41 },
];

const VISION_TREATMENTS = [
  { name: "Daily movement (walking, yoga)", effectiveness: 4.7, reports: 3841, type: "lifestyle" },
  { name: "Strength training 3×/week", effectiveness: 4.6, reports: 2109, type: "lifestyle" },
  { name: "Individual therapy", effectiveness: 4.5, reports: 1023, type: "therapy" },
  { name: "Estrogen therapy (HRT)", effectiveness: 4.5, reports: 1843, type: "hrt" },
  { name: "Magnesium glycinate", effectiveness: 4.2, reports: 2847, type: "supplement" },
  { name: "Mediterranean diet", effectiveness: 4.0, reports: 1632, type: "lifestyle" },
  { name: "Low-dose testosterone", effectiveness: 3.9, reports: 612, type: "hrt" },
  { name: "Creatine monohydrate", effectiveness: 3.8, reports: 891, type: "supplement" },
  { name: "Ashwagandha", effectiveness: 3.2, reports: 1203, type: "supplement" },
  { name: "Black cohosh", effectiveness: 2.6, reports: 744, type: "supplement" },
];

const STAGE_SYMPTOMS = [
  {
    stage: "Early peri",
    color: "#C99AA5",
    symptoms: [
      { label: "Irregular cycles", pct: 87 },
      { label: "Mood swings", pct: 72 },
      { label: "Anxiety", pct: 65 },
      { label: "Brain fog", pct: 58 },
    ],
  },
  {
    stage: "Late peri",
    color: "#8C92FF",
    symptoms: [
      { label: "Hot flashes", pct: 84 },
      { label: "Sleep disruption", pct: 81 },
      { label: "Brain fog", pct: 79 },
      { label: "Fatigue", pct: 76 },
    ],
  },
  {
    stage: "Postmenopause",
    color: "#7CA99B",
    symptoms: [
      { label: "Joint pain", pct: 61 },
      { label: "Fatigue (improving)", pct: 44 },
      { label: "Brain fog (improving)", pct: 38 },
      { label: "Hot flashes (improving)", pct: 29 },
    ],
  },
];

const DISCOVERIES = [
  {
    icon: "💡",
    finding: "Daily movement is more effective than any supplement studied",
    detail: "Across 3,841 reports, 30+ minutes of daily movement — any kind — showed higher average effectiveness than every supplement and comparable to hormone therapy for mood and energy.",
  },
  {
    icon: "🧠",
    finding: "Brain fog peaks in late perimenopause, then lifts",
    detail: "78% of late-peri members report brain fog. But among postmenopause members who've been tracked for 3+ years, that number drops to 38%. The fog has a season.",
  },
  {
    icon: "💊",
    finding: "Timing of HRT matters as much as type",
    detail: "Members who started HRT within 2 years of last period reported significantly higher effectiveness scores than those who waited longer. The 'timing hypothesis' bears out in member data.",
  },
  {
    icon: "😴",
    finding: "Magnesium works best for sleep — not hot flashes",
    detail: "2,847 reports show magnesium glycinate at 4.2/5 overall — but when filtered for sleep symptoms specifically, it rises to 4.6/5. For hot flashes, it drops to 2.9/5. Matching supplement to symptom matters.",
  },
  {
    icon: "🏋️",
    finding: "Strength training is underused and underrated",
    detail: "Only 21% of members have logged strength training, but those who do rate it 4.6/5 — the highest of any intervention. The gap between evidence and uptake is one of our most important findings.",
  },
];

function BarRow({
  label,
  value,
  maxValue,
  meta,
  colorHex,
}: {
  label: string;
  value: number;
  maxValue: number;
  meta?: string;
  colorHex: string;
}) {
  const pct = maxValue > 0 ? (value / maxValue) * 100 : 0;
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
        <span style={{ fontSize: 14, color: "var(--color-text-2)" }}>{label}</span>
        {meta && (
          <span style={{ fontSize: 12, color: "var(--color-text-3)" }}>{meta}</span>
        )}
      </div>
      <div style={{
        height: 6, borderRadius: 3,
        background: "var(--color-border-warm, #DDD7CE)", overflow: "hidden",
      }}>
        <div style={{
          height: "100%", width: `${pct}%`,
          background: colorHex, borderRadius: 3,
        }} />
      </div>
    </div>
  );
}

function TypeBadge({ type }: { type: string }) {
  const labels: Record<string, { label: string; color: string }> = {
    lifestyle: { label: "Lifestyle", color: "#7CA99B" },
    hrt: { label: "HRT", color: "#8C92FF" },
    supplement: { label: "Supplement", color: "#C99AA5" },
    therapy: { label: "Therapy", color: "#B7A8C9" },
  };
  const t = labels[type] ?? { label: type, color: "#9B94A3" };
  return (
    <span style={{
      fontSize: 10, padding: "2px 7px", borderRadius: 20,
      background: `${t.color}20`, color: t.color,
      fontWeight: 500, letterSpacing: "0.02em", textTransform: "uppercase",
      flexShrink: 0,
    }}>
      {t.label}
    </span>
  );
}

export default function VisionPage() {
  return (
    <>
      {/* Header */}
      <section style={{ marginBottom: 32 }}>
        <div style={{
          display: "inline-block", fontSize: 12, fontWeight: 500, letterSpacing: "0.08em",
          textTransform: "uppercase", color: "var(--color-lavender, #B7A8C9)",
          marginBottom: 12,
        }}>
          Future Vision
        </div>
        <h1 style={{
          fontFamily: "var(--font-heading)", fontSize: 30, fontWeight: 300,
          color: "var(--color-ink)", lineHeight: 1.2, marginBottom: 14,
        }}>
          What we&apos;ll discover together
        </h1>
        <p style={{ fontSize: 15, color: "var(--color-text-2)", lineHeight: 1.7 }}>
          This is a preview of what Periwink looks like when 10,000 women are tracking symptoms, logging treatments, and contributing their experience to a shared map of perimenopause.
        </p>
        <p style={{
          fontSize: 13, color: "var(--color-text-3)", marginTop: 8, fontStyle: "italic",
        }}>
          The data below is simulated at scale. Real community insights are available on the{" "}
          <Link href="/app/insights" style={{ color: "var(--color-dusty-plum, #6E5A7E)" }}>
            Insights page
          </Link>.
        </p>
      </section>

      {/* Hero stats */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr",
        gap: 12, marginBottom: 32,
      }}>
        {[
          { num: "10,847", label: "Women tracking" },
          { num: "186,000+", label: "Symptom logs" },
          { num: "31", label: "Treatments studied" },
          { num: "14", label: "Countries" },
        ].map((stat) => (
          <div
            key={stat.label}
            style={{
              background: "var(--color-card, #FDFBF8)",
              border: "1px solid var(--color-border-warm, #DDD7CE)",
              borderRadius: 14, padding: "20px 16px", textAlign: "center",
            }}
          >
            <div style={{
              fontFamily: "var(--font-heading)", fontSize: 26, fontWeight: 300,
              color: "var(--color-dusty-plum, #6E5A7E)", lineHeight: 1,
            }}>
              {stat.num}
            </div>
            <div style={{
              fontSize: 12, color: "var(--color-text-3)", marginTop: 6,
            }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Key discoveries */}
      <section style={{ marginBottom: 32 }}>
        <h2 style={{
          fontFamily: "var(--font-heading)", fontSize: 22, fontWeight: 300,
          color: "var(--color-ink)", marginBottom: 16,
        }}>
          What we&apos;re discovering
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {DISCOVERIES.map((d) => (
            <div
              key={d.finding}
              style={{
                background: "var(--color-card, #FDFBF8)",
                border: "1px solid var(--color-border-warm, #DDD7CE)",
                borderRadius: 14, padding: "20px 20px",
              }}
            >
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <span style={{ fontSize: 22, flexShrink: 0 }}>{d.icon}</span>
                <div>
                  <div style={{
                    fontFamily: "var(--font-heading)", fontSize: 16, fontWeight: 400,
                    color: "var(--color-ink)", marginBottom: 8, lineHeight: 1.3,
                  }}>
                    {d.finding}
                  </div>
                  <div style={{ fontSize: 13, color: "var(--color-text-2)", lineHeight: 1.6 }}>
                    {d.detail}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Symptom prevalence */}
      <section style={{ marginBottom: 32 }}>
        <h2 style={{
          fontFamily: "var(--font-heading)", fontSize: 22, fontWeight: 300,
          color: "var(--color-ink)", marginBottom: 4,
        }}>
          Symptom landscape
        </h2>
        <p style={{
          fontSize: 13, color: "var(--color-text-3)", marginBottom: 16,
        }}>
          % of members reporting each symptom at least once per month
        </p>
        <div style={{
          background: "var(--color-card, #FDFBF8)",
          border: "1px solid var(--color-border-warm, #DDD7CE)", borderRadius: 14,
          padding: "20px 24px",
        }}>
          {VISION_SYMPTOMS.map((s) => (
            <BarRow
              key={s.label}
              label={s.label}
              value={s.pct}
              maxValue={100}
              meta={`${s.pct}%`}
              colorHex="linear-gradient(90deg, var(--color-dusty-plum, #6E5A7E), var(--color-lavender, #B7A8C9))"
            />
          ))}
        </div>
      </section>

      {/* Symptoms by stage */}
      <section style={{ marginBottom: 32 }}>
        <h2 style={{
          fontFamily: "var(--font-heading)", fontSize: 22, fontWeight: 300,
          color: "var(--color-ink)", marginBottom: 4,
        }}>
          How symptoms shift by stage
        </h2>
        <p style={{
          fontSize: 13, color: "var(--color-text-3)", marginBottom: 16,
        }}>
          The picture looks very different depending on where you are
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {STAGE_SYMPTOMS.map((stage) => (
            <div
              key={stage.stage}
              style={{
                background: "var(--color-card, #FDFBF8)",
                border: "1px solid var(--color-border-warm, #DDD7CE)",
                borderRadius: 14, padding: "20px 24px",
              }}
            >
              <div style={{
                fontSize: 13, fontWeight: 500, color: stage.color,
                marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.06em",
              }}>
                {stage.stage}
              </div>
              {stage.symptoms.map((s) => (
                <BarRow
                  key={s.label}
                  label={s.label}
                  value={s.pct}
                  maxValue={100}
                  meta={`${s.pct}%`}
                  colorHex={stage.color}
                />
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* Treatment effectiveness */}
      <section style={{ marginBottom: 32 }}>
        <h2 style={{
          fontFamily: "var(--font-heading)", fontSize: 22, fontWeight: 300,
          color: "var(--color-ink)", marginBottom: 4,
        }}>
          What&apos;s helping — ranked
        </h2>
        <p style={{
          fontSize: 13, color: "var(--color-text-3)", marginBottom: 16,
        }}>
          Average self-reported effectiveness · 1 = no effect, 5 = significant relief
        </p>
        <div style={{
          background: "var(--color-card, #FDFBF8)",
          border: "1px solid var(--color-border-warm, #DDD7CE)", borderRadius: 14,
          padding: "20px 24px",
        }}>
          {VISION_TREATMENTS.map((t) => (
            <div key={t.name} style={{ marginBottom: 16 }}>
              <div style={{
                display: "flex", justifyContent: "space-between",
                alignItems: "center", marginBottom: 6, gap: 8,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 0 }}>
                  <span style={{
                    fontSize: 14, color: "var(--color-text-2)",
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>
                    {t.name}
                  </span>
                  <TypeBadge type={t.type} />
                </div>
                <span style={{ fontSize: 12, color: "var(--color-text-3)", flexShrink: 0 }}>
                  {t.effectiveness}/5 · {t.reports.toLocaleString()}
                </span>
              </div>
              <div style={{
                height: 6, borderRadius: 3,
                background: "var(--color-border-warm, #DDD7CE)", overflow: "hidden",
              }}>
                <div style={{
                  height: "100%",
                  width: `${(t.effectiveness / 5) * 100}%`,
                  background: t.type === "lifestyle"
                    ? "#7CA99B"
                    : t.type === "hrt"
                    ? "#8C92FF"
                    : t.type === "therapy"
                    ? "#B7A8C9"
                    : t.effectiveness >= 4
                    ? "var(--color-dusty-plum, #6E5A7E)"
                    : "var(--color-muted-rose, #C99AA5)",
                  borderRadius: 3,
                }} />
              </div>
            </div>
          ))}

          {/* Legend */}
          <div style={{
            display: "flex", gap: 12, flexWrap: "wrap",
            marginTop: 20, paddingTop: 16,
            borderTop: "1px solid var(--color-border-warm, #DDD7CE)",
          }}>
            {[
              { color: "#7CA99B", label: "Lifestyle" },
              { color: "#8C92FF", label: "HRT" },
              { color: "#C99AA5", label: "Supplement" },
              { color: "#B7A8C9", label: "Therapy" },
            ].map((l) => (
              <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{
                  width: 10, height: 10, borderRadius: "50%", background: l.color,
                }} />
                <span style={{ fontSize: 12, color: "var(--color-text-3)" }}>{l.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Research questions */}
      <section style={{ marginBottom: 32 }}>
        <h2 style={{
          fontFamily: "var(--font-heading)", fontSize: 22, fontWeight: 300,
          color: "var(--color-ink)", marginBottom: 14,
        }}>
          Questions your data will answer
        </h2>
        <div style={{
          background: "linear-gradient(135deg, var(--color-soft-mist, #F0ECF8), rgba(215,204,255,0.08))",
          border: "1px solid var(--color-lavender, #B7A8C9)",
          borderRadius: 16, padding: "24px",
        }}>
          <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
            {[
              "Does supplement effectiveness differ by perimenopause stage?",
              "Does the timing of starting HRT affect long-term outcomes?",
              "Which symptom clusters tend to travel together?",
              "Does exercise type matter — or just duration?",
              "How long before most interventions show measurable effect?",
              "Which symptoms improve most after menopause without intervention?",
              "Are there country or cultural differences in symptom experience?",
            ].map((q) => (
              <li
                key={q}
                style={{
                  fontSize: 14, color: "var(--color-text-2)", lineHeight: 1.6,
                  paddingBottom: 10, marginBottom: 10,
                  borderBottom: "1px solid rgba(183,168,201,0.3)",
                  display: "flex", gap: 10,
                }}
              >
                <span style={{ color: "var(--color-lavender, #B7A8C9)", flexShrink: 0 }}>→</span>
                {q}
              </li>
            ))}
          </ul>
          <p style={{
            fontSize: 13, color: "var(--color-text-3)", fontStyle: "italic",
            marginTop: 8, lineHeight: 1.6,
          }}>
            No clinical trial can ask these questions the way a community of thousands living this experience can.
          </p>
        </div>
      </section>

      {/* Privacy statement */}
      <div style={{
        background: "var(--color-card, #FDFBF8)",
        border: "1px solid var(--color-border-warm, #DDD7CE)", borderRadius: 16,
        padding: "24px", marginBottom: 28,
      }}>
        <h3 style={{
          fontFamily: "var(--font-heading)", fontSize: 17, fontWeight: 300,
          color: "var(--color-ink)", marginBottom: 10,
        }}>
          Your privacy is the foundation
        </h3>
        <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
          {[
            "Your identity is never attached to your health data",
            "You choose exactly what to share — symptom data, treatment data, or demographics — independently",
            "You can withdraw consent at any time",
            "Data is only shown in aggregate — never individually",
            "No data is sold or shared with third parties",
          ].map((point) => (
            <li
              key={point}
              style={{
                fontSize: 13, color: "var(--color-text-2)", lineHeight: 1.6,
                paddingBottom: 8, marginBottom: 8,
                borderBottom: "1px solid var(--color-border-warm, #DDD7CE)",
                display: "flex", gap: 10,
              }}
            >
              <span style={{ color: "#7CA99B", flexShrink: 0 }}>✓</span>
              {point}
            </li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <div style={{
        background: "linear-gradient(135deg, rgba(110,90,126,0.06), rgba(140,146,255,0.06))",
        border: "1px solid var(--color-lavender, #B7A8C9)", borderRadius: 16,
        padding: "28px 24px", textAlign: "center", marginBottom: 16,
      }}>
        <p style={{
          fontFamily: "var(--font-heading)", fontSize: 18, fontWeight: 300,
          color: "var(--color-dusty-plum, #6E5A7E)", marginBottom: 10, lineHeight: 1.4,
        }}>
          Your check-in today contributes to something bigger tomorrow.
        </p>
        <p style={{
          fontSize: 14, color: "var(--color-text-2)", lineHeight: 1.7, marginBottom: 20,
        }}>
          The map we&apos;re building doesn&apos;t exist anywhere else. It&apos;s being drawn by women like you, one check-in at a time.
        </p>
        <Link href="/app/checkin" style={{
          display: "inline-block",
          background: "var(--color-dusty-plum, #6E5A7E)", color: "#fff",
          padding: "12px 28px", borderRadius: 12,
          fontFamily: "var(--font-body)", fontSize: 15,
          textDecoration: "none",
        }}>
          Check in today
        </Link>
      </div>
    </>
  );
}

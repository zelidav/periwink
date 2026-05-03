import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

const SYMPTOM_LABELS: Record<string, string> = {
  HOT_FLASHES: "Hot flashes",
  NIGHT_SWEATS: "Night sweats",
  INSOMNIA: "Insomnia",
  SLEEP_DISRUPTION: "Sleep disruption",
  FATIGUE: "Fatigue",
  ANXIETY: "Anxiety",
  IRRITABILITY: "Irritability",
  MOOD_SWINGS: "Mood swings",
  BRAIN_FOG: "Brain fog",
  DEPRESSION: "Low mood",
  JOINT_PAIN: "Joint pain",
  HEADACHES: "Headaches",
  WEIGHT_CHANGES: "Weight changes",
  BLOATING: "Bloating",
  HEART_PALPITATIONS: "Heart palpitations",
  LOW_LIBIDO: "Low libido",
  CHILLS: "Chills",
  VAGINAL_DRYNESS: "Vaginal dryness",
};

function BarRow({
  label,
  value,
  maxValue,
  meta,
  color = "plum",
}: {
  label: string;
  value: number;
  maxValue: number;
  meta: string;
  color?: "plum" | "teal" | "rose";
}) {
  const pct = maxValue > 0 ? (value / maxValue) * 100 : 0;
  const gradient =
    color === "teal"
      ? "linear-gradient(90deg, #7CA99B, #A8C5BC)"
      : color === "rose"
      ? "linear-gradient(90deg, var(--color-muted-rose, #C99AA5), #D4A5AE)"
      : "linear-gradient(90deg, var(--color-dusty-plum, #6E5A7E), var(--color-lavender, #B7A8C9))";

  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 14, color: "var(--color-text-2)" }}>{label}</span>
        <span style={{ fontSize: 12, color: "var(--color-text-3)" }}>{meta}</span>
      </div>
      <div style={{
        height: 6, borderRadius: 3,
        background: "var(--color-border-warm, #DDD7CE)",
        overflow: "hidden",
      }}>
        <div style={{
          height: "100%", width: `${pct}%`,
          background: gradient, borderRadius: 3,
          transition: "width 0.5s ease",
        }} />
      </div>
    </div>
  );
}

export default async function InsightsPage() {
  const [symptomCounts, treatmentStats, totalContributors] = await Promise.all([
    prisma.symptomLog.groupBy({
      by: ["symptom"],
      where: { contributedToInsights: true },
      _count: { symptom: true },
      _avg: { severity: true },
      orderBy: { _count: { symptom: "desc" } },
      take: 8,
    }),
    prisma.treatmentLog.groupBy({
      by: ["name"],
      where: { contributedToInsights: true, effectiveness: { not: null } },
      _avg: { effectiveness: true },
      _count: { name: true },
      orderBy: { _avg: { effectiveness: "desc" } },
      take: 8,
    }),
    prisma.citizenScienceConsent.count({
      where: { shareSymptomData: true },
    }),
  ]);

  const maxSymptomCount = symptomCounts[0]?._count.symptom ?? 1;
  const hasData = symptomCounts.length > 0 || treatmentStats.length > 0;

  return (
    <>
      <section style={{ marginBottom: 28 }}>
        <h1 style={{
          fontFamily: "var(--font-heading)", fontSize: 28, fontWeight: 300,
          color: "var(--color-ink)", marginBottom: 6,
        }}>
          Community Insights
        </h1>
        <p style={{
          fontSize: 15, color: "var(--color-text-2)", lineHeight: 1.7, marginTop: 10,
        }}>
          Real patterns from women who&apos;ve chosen to share — anonymized, aggregated, and always consensual.
        </p>
      </section>

      {/* Contributor count */}
      <div style={{
        background: "linear-gradient(135deg, var(--color-soft-mist, #F0ECF8), rgba(215,204,255,0.15))",
        border: "1px solid var(--color-lavender, #B7A8C9)", borderRadius: 16,
        padding: "24px", marginBottom: 28, textAlign: "center",
      }}>
        <div style={{
          fontFamily: "var(--font-heading)", fontSize: 52, fontWeight: 300,
          color: "var(--color-dusty-plum, #6E5A7E)", lineHeight: 1,
        }}>
          {totalContributors}
        </div>
        <div style={{ fontSize: 14, color: "var(--color-text-2)", marginTop: 8 }}>
          {totalContributors === 1 ? "woman" : "women"} contributing anonymized data
        </div>
        {totalContributors < 20 && (
          <div style={{
            fontSize: 13, color: "var(--color-text-3)", marginTop: 8, fontStyle: "italic",
          }}>
            We&apos;re just beginning to gather. Every check-in matters.
          </div>
        )}
      </div>

      {/* Symptom frequency */}
      {symptomCounts.length > 0 && (
        <section style={{ marginBottom: 32 }}>
          <h2 style={{
            fontFamily: "var(--font-heading)", fontSize: 20, fontWeight: 300,
            color: "var(--color-ink)", marginBottom: 4,
          }}>
            Most reported symptoms
          </h2>
          <p style={{ fontSize: 13, color: "var(--color-text-3)", marginBottom: 16 }}>
            From opted-in members — ranked by report frequency
          </p>
          <div style={{
            background: "var(--color-card, #FDFBF8)",
            border: "1px solid var(--color-border-warm, #DDD7CE)", borderRadius: 14,
            padding: "20px 24px",
          }}>
            {symptomCounts.map((s) => {
              const label = SYMPTOM_LABELS[s.symptom as string] ?? (s.symptom as string);
              const avgSev = Math.round((s._avg.severity ?? 0) * 10) / 10;
              return (
                <BarRow
                  key={s.symptom as string}
                  label={label}
                  value={s._count.symptom}
                  maxValue={maxSymptomCount}
                  meta={`${s._count.symptom} ${s._count.symptom === 1 ? "report" : "reports"} · avg ${avgSev}/5`}
                />
              );
            })}
          </div>
        </section>
      )}

      {/* Treatment effectiveness */}
      {treatmentStats.length > 0 && (
        <section style={{ marginBottom: 32 }}>
          <h2 style={{
            fontFamily: "var(--font-heading)", fontSize: 20, fontWeight: 300,
            color: "var(--color-ink)", marginBottom: 4,
          }}>
            What&apos;s helping
          </h2>
          <p style={{ fontSize: 13, color: "var(--color-text-3)", marginBottom: 16 }}>
            Ranked by average self-reported effectiveness · 1 = no effect, 5 = significant relief
          </p>
          <div style={{
            background: "var(--color-card, #FDFBF8)",
            border: "1px solid var(--color-border-warm, #DDD7CE)", borderRadius: 14,
            padding: "20px 24px",
          }}>
            {treatmentStats.map((t) => {
              const eff = Math.round((t._avg.effectiveness ?? 0) * 10) / 10;
              const color = eff >= 4.2 ? "teal" : eff >= 3.0 ? "plum" : "rose";
              return (
                <BarRow
                  key={t.name as string}
                  label={t.name as string}
                  value={eff}
                  maxValue={5}
                  meta={`${eff}/5 · ${t._count.name} ${t._count.name === 1 ? "report" : "reports"}`}
                  color={color}
                />
              );
            })}
          </div>
        </section>
      )}

      {/* Empty state */}
      {!hasData && (
        <div style={{
          background: "var(--color-card, #FDFBF8)",
          border: "1px solid var(--color-border-warm, #DDD7CE)", borderRadius: 16,
          padding: "32px 24px", textAlign: "center", marginBottom: 28,
        }}>
          <p style={{
            fontFamily: "var(--font-heading)", fontSize: 20, fontWeight: 300,
            color: "var(--color-dusty-plum, #6E5A7E)", marginBottom: 12,
          }}>
            The data is just beginning to gather.
          </p>
          <p style={{ fontSize: 14, color: "var(--color-text-2)", lineHeight: 1.7 }}>
            When you opt in to sharing from your daily check-in, it becomes part of a map of what perimenopause really looks like — built by women, for women.
          </p>
        </div>
      )}

      {/* Vision teaser */}
      <Link href="/app/vision" style={{ textDecoration: "none", display: "block", marginBottom: 24 }}>
        <div style={{
          background: "linear-gradient(135deg, rgba(110,90,126,0.06), rgba(140,146,255,0.06))",
          border: "1px solid var(--color-lavender, #B7A8C9)", borderRadius: 16,
          padding: "20px 24px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <div>
            <div style={{
              fontFamily: "var(--font-heading)", fontSize: 16, fontWeight: 400,
              color: "var(--color-dusty-plum, #6E5A7E)", marginBottom: 4,
            }}>
              See the future vision →
            </div>
            <div style={{ fontSize: 13, color: "var(--color-text-2)" }}>
              What 10,000 women tracking together could reveal
            </div>
          </div>
          <span style={{ fontSize: 24 }}>🔭</span>
        </div>
      </Link>

      {/* Privacy note */}
      <div style={{
        border: "1px solid var(--color-border-warm, #DDD7CE)", borderRadius: 12,
        padding: "16px 20px",
      }}>
        <p style={{
          fontSize: 13, color: "var(--color-text-3)", lineHeight: 1.6, margin: 0,
        }}>
          All data shown here is fully anonymized. Individual entries are never shared — only aggregated patterns across the community. You control what you contribute from your daily check-in.
        </p>
      </div>
    </>
  );
}

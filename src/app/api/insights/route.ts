import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Top symptoms by frequency (only from opted-in contributions)
    const symptomCounts = await prisma.symptomLog.groupBy({
      by: ["symptom"],
      where: { contributedToInsights: true },
      _count: { symptom: true },
      _avg: { severity: true },
      orderBy: { _count: { symptom: "desc" } },
      take: 10,
    });

    const totalContributors = await prisma.citizenScienceConsent.count({
      where: { shareSymptomData: true },
    });

    // Top treatments by effectiveness
    const treatmentStats = await prisma.treatmentLog.groupBy({
      by: ["name"],
      where: {
        contributedToInsights: true,
        effectiveness: { not: null },
      },
      _avg: { effectiveness: true },
      _count: { name: true },
      orderBy: { _count: { name: "desc" } },
      take: 10,
    });

    return NextResponse.json({
      symptoms: symptomCounts.map((s) => ({
        symptom: s.symptom,
        count: s._count.symptom,
        avgSeverity: Math.round((s._avg.severity || 0) * 10) / 10,
      })),
      treatments: treatmentStats.map((t) => ({
        name: t.name,
        avgEffectiveness: Math.round((t._avg.effectiveness || 0) * 10) / 10,
        reportCount: t._count.name,
      })),
      totalContributors: totalContributors || 0,
    });
  } catch (error) {
    console.error("Insights error:", error);
    return NextResponse.json(
      { error: "Failed to load insights" },
      { status: 500 }
    );
  }
}

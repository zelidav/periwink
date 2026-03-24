import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const logs = await prisma.symptomLog.findMany({
      where: { userId: session.user.id },
      orderBy: { logDate: "desc" },
      take: 90,
    });

    return NextResponse.json(logs);
  } catch (error) {
    console.error("Symptom log fetch error:", error);
    return NextResponse.json({ error: "Failed to load logs" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { entries, contribute } = await req.json();

    if (!Array.isArray(entries) || entries.length === 0) {
      return NextResponse.json(
        { error: "At least one symptom entry is required" },
        { status: 400 }
      );
    }

    const logs = await prisma.symptomLog.createMany({
      data: entries.map(
   (entry: { symptom: any; severity: number; notes?: string }) => ({
          userId: session.user.id as string,
          logDate: new Date(),
          symptom: entry.symptom,
          severity: entry.severity,
          notes: entry.notes || null,
          contributedToInsights: contribute || false,
        })
      ),
    });

    return NextResponse.json({ created: logs.count }, { status: 201 });
  } catch (error) {
    console.error("Symptom log error:", error);
    return NextResponse.json(
      { error: "Failed to save log" },
      { status: 500 }
    );
  }
}

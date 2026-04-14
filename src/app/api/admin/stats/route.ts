import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const [
      totalUsers,
      totalSignups,
      totalApplications,
      pendingApplications,
      totalPosts,
      totalComments,
      totalReactions,
      totalRooms,
      totalSymptomLogs,
      recentSignups,
      recentUsers,
      signupsByDay,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.communitySignup.count(),
      prisma.foundingMemberApplication.count(),
      prisma.foundingMemberApplication.count({ where: { status: "PENDING" } }),
      prisma.post.count({ where: { deletedAt: null } }),
      prisma.comment.count({ where: { deletedAt: null } }),
      prisma.reaction.count(),
      prisma.room.count({ where: { isArchived: false } }),
      prisma.symptomLog.count(),
      prisma.communitySignup.findMany({
        orderBy: { createdAt: "desc" },
        take: 7,
        select: { id: true, name: true, email: true, createdAt: true },
      }),
      prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        take: 7,
        include: { profile: { select: { displayName: true } } },
      }),
      // Signups in last 30 days grouped
      prisma.communitySignup.findMany({
        where: { createdAt: { gte: new Date(Date.now() - 30 * 86400000) } },
        select: { createdAt: true },
        orderBy: { createdAt: "asc" },
      }),
    ]);

    // Group signups by day
    const dailySignups: Record<string, number> = {};
    for (const s of signupsByDay) {
      const day = s.createdAt.toISOString().slice(0, 10);
      dailySignups[day] = (dailySignups[day] || 0) + 1;
    }

    return NextResponse.json({
      totalUsers,
      totalSignups,
      totalApplications,
      pendingApplications,
      totalPosts,
      totalComments,
      totalReactions,
      totalRooms,
      totalSymptomLogs,
      recentSignups,
      recentUsers,
      dailySignups,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}

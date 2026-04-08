import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const signups = await prisma.communitySignup.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(signups);
  } catch (error) {
    console.error("Error fetching signups:", error);
    return NextResponse.json({ error: "Failed to fetch signups" }, { status: 500 });
  }
}

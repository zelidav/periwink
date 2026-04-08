import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const VALID_STATUSES = ["PENDING", "REVIEWING", "APPROVED", "DECLINED"] as const;

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { status } = await request.json();

    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status. Must be PENDING, REVIEWING, APPROVED, or DECLINED." },
        { status: 400 }
      );
    }

    const updated = await prisma.foundingMemberApplication.update({
      where: { id },
      data: { status, reviewedAt: new Date() },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating application:", error);
    return NextResponse.json({ error: "Failed to update application" }, { status: 500 });
  }
}

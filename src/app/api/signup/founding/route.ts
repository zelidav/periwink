import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendFoundingMemberConfirmation } from "@/lib/email";

const VALID_ROLE_TYPES = [
  "PRACTITIONER",
  "RESEARCHER",
  "BRAND_PARTNER",
  "CONTENT_CREATOR",
  "COMMUNITY_BUILDER",
] as const;

type RoleType = (typeof VALID_ROLE_TYPES)[number];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      roleType,
      whatDrawsYou,
      whatYouOffer,
      currentApproach,
      holdingSpace,
      wantToBuild,
      anythingElse,
      organization,
      website,
      source,
    } = body;

    // Validate required fields
    if (!name || !email || !roleType || !whatDrawsYou || !whatYouOffer || !currentApproach || !holdingSpace) {
      return NextResponse.json(
        { error: "Please complete all required fields" },
        { status: 400 }
      );
    }

    // Validate role type
    if (!VALID_ROLE_TYPES.includes(roleType as RoleType)) {
      return NextResponse.json(
        { error: "Please select a valid role type" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existing = await prisma.foundingMemberApplication.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existing) {
      return NextResponse.json(
        { error: "An application with this email already exists" },
        { status: 409 }
      );
    }

    // Create application
    const application = await prisma.foundingMemberApplication.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        roleType: roleType as RoleType,
        whatDrawsYou: whatDrawsYou.trim(),
        whatYouOffer: whatYouOffer.trim(),
        currentApproach: currentApproach.trim(),
        holdingSpace: holdingSpace.trim(),
        wantToBuild: wantToBuild?.trim() || null,
        anythingElse: anythingElse?.trim() || null,
        organization: organization?.trim() || null,
        website: website?.trim() || null,
        source: source || null,
      },
    });

    // Send confirmation email
    await sendFoundingMemberConfirmation({
      to: application.email,
      name: application.name,
      roleType: application.roleType,
    });

    return NextResponse.json(
      { success: true, id: application.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Founding member application error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

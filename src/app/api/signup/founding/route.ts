import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

let resend: Resend | null = null;
function getResend() {
  if (!resend) resend = new Resend(process.env.RESEND_API_KEY);
  return resend;
}

const VALID_ROLE_TYPES = [
  "PRACTITIONER",
  "RESEARCHER",
  "BRAND_PARTNER",
  "CONTENT_CREATOR",
  "COMMUNITY_BUILDER",
] as const;

type RoleType = (typeof VALID_ROLE_TYPES)[number];

const ROLE_LABELS: Record<string, string> = {
  PRACTITIONER: "Healthcare Practitioner",
  RESEARCHER: "Researcher",
  BRAND_PARTNER: "Brand Partner",
  CONTENT_CREATOR: "Content Creator",
  COMMUNITY_BUILDER: "Community Builder",
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name, email, roleType,
      whatDrawsYou, whatYouOffer, currentApproach, holdingSpace,
      wantToBuild, anythingElse, organization, website, source,
    } = body;

    // For the simple form, bio maps to whatDrawsYou and we provide defaults
    const draws = whatDrawsYou || body.bio || "";
    const offer = whatYouOffer || "Shared during application";
    const approach = currentApproach || "Shared during application";
    const holding = holdingSpace || "Shared during application";

    if (!name || !email || !roleType) {
      return NextResponse.json(
        { error: "Name, email, and role are required" },
        { status: 400 }
      );
    }

    if (!VALID_ROLE_TYPES.includes(roleType as RoleType)) {
      return NextResponse.json(
        { error: "Please select a valid role type" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    const existing = await prisma.foundingMemberApplication.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existing) {
      return NextResponse.json(
        { error: "An application with this email already exists" },
        { status: 409 }
      );
    }

    const application = await prisma.foundingMemberApplication.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        roleType: roleType as RoleType,
        whatDrawsYou: draws.trim(),
        whatYouOffer: offer.trim(),
        currentApproach: approach.trim(),
        holdingSpace: holding.trim(),
        wantToBuild: wantToBuild?.trim() || null,
        anythingElse: anythingElse?.trim() || null,
        organization: organization?.trim() || null,
        website: website?.trim() || null,
        source: source || null,
      },
    });

    // Notify adrian
    try {
      await getResend().emails.send({
        from: "Periwink <hello@yourperiwink.com>",
        to: "adrian@yourperiwink.com",
        subject: "New Founding Member Application — " + name.trim(),
        html: `
          <div style="font-family:-apple-system,sans-serif;max-width:480px;margin:0 auto;padding:32px;">
            <h2 style="color:#6E5A7E;font-size:20px;margin-bottom:16px;">New Founding Member Application</h2>
            <p><strong>Name:</strong> ${name.trim()}</p>
            <p><strong>Email:</strong> ${email.toLowerCase().trim()}</p>
            <p><strong>Role:</strong> ${ROLE_LABELS[roleType] || roleType}</p>
            ${organization ? `<p><strong>Organization:</strong> ${organization.trim()}</p>` : ""}
            ${draws ? `<p><strong>What draws them:</strong> ${draws.trim()}</p>` : ""}
            ${website ? `<p><strong>Website:</strong> ${website.trim()}</p>` : ""}
            <p style="color:#9B94A3;font-size:13px;margin-top:16px;">
              ${new Date().toLocaleString("en-US", { timeZone: "America/New_York" })} ET
            </p>
          </div>
        `,
      });
    } catch (emailErr) {
      console.error("Failed to send founding notification:", emailErr);
    }

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

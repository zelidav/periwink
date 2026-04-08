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

    const r = getResend();

    // Personal email from Adrian to the applicant
    try {
      await r.emails.send({
        from: "Adrian Tubero — Periwink <hello@yourperiwink.com>",
        replyTo: "adrian@yourperiwink.com",
        to: email.toLowerCase().trim(),
        subject: "Thank you for applying, " + name.trim(),
        html: `
<div style="font-family:'DM Sans',-apple-system,sans-serif;max-width:520px;margin:0 auto;padding:48px 24px;background:#F7F3EE;">
  <div style="text-align:center;margin-bottom:32px;">
    <h1 style="font-family:Georgia,serif;font-size:28px;font-weight:300;color:#6E5A7E;margin:0;letter-spacing:.5px">periwink</h1>
  </div>
  <div style="background:#FDFBF8;border-radius:20px;padding:36px 32px;border:1px solid #E8E3EA;">
    <p style="font-size:16px;color:#2B2433;line-height:1.7;margin:0 0 20px;">
      Dear ${name.trim()},
    </p>
    <p style="font-size:16px;color:#2B2433;line-height:1.7;margin:0 0 20px;">
      Thank you for your interest in becoming a Founding Member of Periwink as a <strong style="color:#6E5A7E">${ROLE_LABELS[roleType] || roleType}</strong>. I read every application personally, and I'm grateful you took the time.
    </p>
    <p style="font-size:16px;color:#2B2433;line-height:1.7;margin:0 0 20px;">
      Periwink is being built carefully and intentionally. I'm looking for founding members who share a genuine commitment to supporting women through one of life's most profound and least understood chapters \u2014 not with quick fixes, but with depth, honesty, and real connection.
    </p>
    <p style="font-size:16px;color:#2B2433;line-height:1.7;margin:0 0 20px;">
      I'd love to find a time to connect and hear more about what you'd bring to this community. Would you be open to a brief conversation? You can reply directly to this email, and we'll find a time that works.
    </p>
    <p style="font-size:16px;color:#2B2433;line-height:1.7;margin:0 0 20px;">
      In the meantime, I want you to know: the fact that you're here, that this resonated with you \u2014 that matters. We're building something meaningful, and I'd love for you to be part of it.
    </p>
    <p style="font-size:16px;color:#6B6575;line-height:1.7;margin:24px 0 0;font-style:italic;">
      With warmth,<br>
      Adrian Tubero, Psy.D.<br>
      Founder, Periwink
    </p>
  </div>
  <p style="text-align:center;font-size:12px;color:#9B94A3;margin-top:32px;">
    &copy; ${new Date().getFullYear()} Periwink &middot; yourperiwink.com
  </p>
</div>
        `,
      });
    } catch (emailErr) {
      console.error("Failed to send founding welcome email:", emailErr);
    }

    // Notify adrian with full details
    try {
      await r.emails.send({
        from: "Periwink <hello@yourperiwink.com>",
        to: "adrian@yourperiwink.com",
        subject: "New Founding Member Application \u2014 " + name.trim() + " (" + (ROLE_LABELS[roleType] || roleType) + ")",
        html: `
<div style="font-family:-apple-system,sans-serif;max-width:520px;margin:0 auto;padding:32px;">
  <h2 style="color:#6E5A7E;font-size:20px;margin-bottom:16px;">New Founding Member Application</h2>
  <p><strong>Name:</strong> ${name.trim()}</p>
  <p><strong>Email:</strong> <a href="mailto:${email.toLowerCase().trim()}">${email.toLowerCase().trim()}</a></p>
  <p><strong>Role:</strong> ${ROLE_LABELS[roleType] || roleType}</p>
  ${organization ? `<p><strong>Organization:</strong> ${organization.trim()}</p>` : ""}
  ${draws ? `<p style="margin-top:12px"><strong>What draws them:</strong></p><p style="color:#6B6575;white-space:pre-wrap">${draws.trim()}</p>` : ""}
  ${website ? `<p><strong>Website:</strong> <a href="${website.trim()}">${website.trim()}</a></p>` : ""}
  <p style="color:#9B94A3;font-size:13px;margin-top:20px;">
    ${new Date().toLocaleString("en-US", { timeZone: "America/New_York" })} ET
  </p>
  <p style="margin-top:16px"><a href="mailto:${email.toLowerCase().trim()}?subject=Re: Your Periwink Founding Member Application" style="color:#6E5A7E;font-weight:500">Reply to ${name.trim()}</a></p>
</div>
        `,
      });
    } catch (emailErr) {
      console.error("Failed to send admin notification:", emailErr);
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

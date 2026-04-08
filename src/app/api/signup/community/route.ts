import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

let resend: Resend | null = null;
function getResend() {
  if (!resend) resend = new Resend(process.env.RESEND_API_KEY);
  return resend;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, pseudonym, source } = body;

    if (!name || !email || !pseudonym) {
      return NextResponse.json(
        { error: "Name, email, and pseudonym are required" },
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

    const existing = await prisma.communitySignup.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existing) {
      return NextResponse.json(
        { error: "This email is already registered" },
        { status: 409 }
      );
    }

    const signup = await prisma.communitySignup.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        pseudonym: pseudonym.trim(),
        source: source || null,
      },
    });

    const r = getResend();

    // Welcome email to the user
    try {
      await r.emails.send({
        from: "Periwink <hello@yourperiwink.com>",
        to: email.toLowerCase().trim(),
        subject: "Welcome to Periwink, " + name.trim() + " \uD83D\uDC9C",
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
      Welcome to Periwink. You've just joined a community of women who believe that navigating this chapter doesn't have to feel isolating, confusing, or lonely.
    </p>
    <p style="font-size:16px;color:#2B2433;line-height:1.7;margin:0 0 20px;">
      Your pseudonym: <strong style="color:#6E5A7E">${pseudonym.trim()}</strong>
    </p>
    <p style="font-size:16px;color:#2B2433;line-height:1.7;margin:0 0 24px;">
      Here are some spaces we think you'll love:
    </p>
    <div style="margin:0 0 24px;">
      <div style="padding:12px 16px;border-radius:10px;background:#F7F3EE;margin-bottom:8px;">
        <strong style="color:#2B2433">\uD83D\uDD25 Hot Flashes & Night Sweats</strong>
        <span style="color:#6B6575;font-size:14px"> — Share strategies and power-surge stories</span>
      </div>
      <div style="padding:12px 16px;border-radius:10px;background:#F7F3EE;margin-bottom:8px;">
        <strong style="color:#2B2433">\uD83C\uDF19 Sleep & Fatigue</strong>
        <span style="color:#6B6575;font-size:14px"> — The 3am club is real, and you're welcome</span>
      </div>
      <div style="padding:12px 16px;border-radius:10px;background:#F7F3EE;margin-bottom:8px;">
        <strong style="color:#2B2433">\uD83E\uDDE0 Mind & Mood</strong>
        <span style="color:#6B6575;font-size:14px"> — Brain fog, anxiety, rage, breakthroughs</span>
      </div>
      <div style="padding:12px 16px;border-radius:10px;background:#F7F3EE;margin-bottom:8px;">
        <strong style="color:#2B2433">\uD83D\uDC8A HRT & Hormone Therapy</strong>
        <span style="color:#6B6575;font-size:14px"> — Real experiences navigating treatment options</span>
      </div>
      <div style="padding:12px 16px;border-radius:10px;background:#F7F3EE;">
        <strong style="color:#2B2433">\uD83C\uDF3F Supplements & Nutrition</strong>
        <span style="color:#6B6575;font-size:14px"> — What's working, what's not, and the science</span>
      </div>
    </div>
    <p style="font-size:16px;color:#2B2433;line-height:1.7;margin:0 0 20px;">
      We're still building Periwink with care, and we'll let you know as soon as the community is ready for you to explore. Until then, know that you're already part of something meaningful.
    </p>
    <p style="font-size:16px;color:#6B6575;line-height:1.7;margin:24px 0 0;font-style:italic;">
      You are not alone in this.<br>
      With warmth,<br>
      The Periwink Team
    </p>
  </div>
  <p style="text-align:center;font-size:12px;color:#9B94A3;margin-top:32px;">
    &copy; ${new Date().getFullYear()} Periwink &middot; yourperiwink.com
  </p>
</div>
        `,
      });
    } catch (emailErr) {
      console.error("Failed to send welcome email:", emailErr);
    }

    // Notify adrian
    try {
      await r.emails.send({
        from: "Periwink <hello@yourperiwink.com>",
        to: "adrian@yourperiwink.com",
        subject: "New Community Signup \u2014 " + name.trim(),
        html: `
<div style="font-family:-apple-system,sans-serif;max-width:480px;margin:0 auto;padding:32px;">
  <h2 style="color:#6E5A7E;font-size:20px;margin-bottom:16px;">New Community Signup</h2>
  <p><strong>Name:</strong> ${name.trim()}</p>
  <p><strong>Email:</strong> ${email.toLowerCase().trim()}</p>
  <p><strong>Pseudonym:</strong> ${pseudonym.trim()}</p>
  <p style="color:#9B94A3;font-size:13px;margin-top:16px;">
    ${new Date().toLocaleString("en-US", { timeZone: "America/New_York" })} ET
  </p>
</div>
        `,
      });
    } catch (emailErr) {
      console.error("Failed to send admin notification:", emailErr);
    }

    return NextResponse.json(
      { success: true, id: signup.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Community signup error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

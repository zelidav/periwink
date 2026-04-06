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

    // Notify adrian
    try {
      await getResend().emails.send({
        from: "Periwink <hello@yourperiwink.com>",
        to: "adrian@yourperiwink.com",
        subject: "New Community Signup — " + name.trim(),
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
      console.error("Failed to send signup notification:", emailErr);
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

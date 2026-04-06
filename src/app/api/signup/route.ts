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
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
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

    const normalizedEmail = email.toLowerCase().trim();

    const existing = await prisma.communitySignup.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      return NextResponse.json(
        { error: "You're already on the list!" },
        { status: 409 }
      );
    }

    const signup = await prisma.communitySignup.create({
      data: {
        name: "",
        email: normalizedEmail,
        pseudonym: "Member",
      },
    });

    // Notify admin
    try {
      await getResend().emails.send({
        from: "Periwink <hello@yourperiwink.com>",
        to: "adrian@yourperiwink.com",
        subject: "New Periwink Signup",
        html: `
          <div style="font-family: -apple-system, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
            <h2 style="color: #6E5A7E; font-size: 20px; margin-bottom: 16px;">New Signup</h2>
            <p style="color: #2D2438; font-size: 16px; margin-bottom: 8px;">
              <strong>Email:</strong> ${normalizedEmail}
            </p>
            <p style="color: #8B7D98; font-size: 14px;">
              Signed up at ${new Date().toLocaleString("en-US", { timeZone: "America/New_York" })} ET
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
    console.error("Email signup error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

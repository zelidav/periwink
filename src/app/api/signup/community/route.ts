import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendCommunityWelcome } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, pseudonym, source } = body;

    // Validate required fields
    if (!name || !email || !pseudonym) {
      return NextResponse.json(
        { error: "Name, email, and pseudonym are required" },
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
    const existing = await prisma.communitySignup.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existing) {
      return NextResponse.json(
        { error: "This email is already registered" },
        { status: 409 }
      );
    }

    // Create signup
    const signup = await prisma.communitySignup.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        pseudonym: pseudonym.trim(),
        source: source || null,
      },
    });

    // Send welcome email
    await sendCommunityWelcome({
      to: signup.email,
      name: signup.name,
      pseudonym: signup.pseudonym,
    });

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

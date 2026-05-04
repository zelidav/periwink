import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { name, email, interest, message } = await req.json();

    if (!name || !email || !interest) {
      return NextResponse.json({ error: "Name, email, and interest are required." }, { status: 400 });
    }

    // Notify Adrian
    await resend.emails.send({
      from: "Periwink <hello@yourperiwink.com>",
      to: "adrian@yourperiwink.com",
      subject: `New group application — ${interest}`,
      html: `
        <div style="font-family: -apple-system, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px 24px; background: #F7F3EE;">
          <h2 style="font-family: Georgia, serif; font-weight: 400; color: #6E5A7E; margin: 0 0 24px;">New Group Application</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #6B6575; font-size: 14px; width: 120px;">Name</td><td style="padding: 8px 0; color: #2B2433; font-size: 14px;">${name}</td></tr>
            <tr><td style="padding: 8px 0; color: #6B6575; font-size: 14px;">Email</td><td style="padding: 8px 0; color: #2B2433; font-size: 14px;">${email}</td></tr>
            <tr><td style="padding: 8px 0; color: #6B6575; font-size: 14px;">Interest</td><td style="padding: 8px 0; color: #2B2433; font-size: 14px;">${interest}</td></tr>
            ${message ? `<tr><td style="padding: 8px 0; color: #6B6575; font-size: 14px; vertical-align: top;">Message</td><td style="padding: 8px 0; color: #2B2433; font-size: 14px; line-height: 1.6;">${message}</td></tr>` : ""}
          </table>
        </div>
      `,
    });

    // Confirmation to applicant
    await resend.emails.send({
      from: "Periwink <hello@yourperiwink.com>",
      to: email,
      subject: "Your application — Periwink Groups",
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
        <body style="margin: 0; padding: 0; background-color: #F7F3EE; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <div style="max-width: 520px; margin: 0 auto; padding: 48px 24px;">
            <div style="text-align: center; margin-bottom: 36px;">
              <h1 style="font-family: Georgia, serif; font-size: 28px; font-weight: 300; color: #6E5A7E; margin: 0; letter-spacing: 0.5px;">periwink</h1>
            </div>
            <div style="background: #FDFBF8; border-radius: 20px; padding: 36px 32px; border: 1px solid #E8E3EA;">
              <p style="font-size: 16px; color: #2B2433; line-height: 1.7; margin: 0 0 20px;">Dear ${name},</p>
              <p style="font-size: 16px; color: #2B2433; line-height: 1.7; margin: 0 0 20px;">
                Thank you for applying to <strong style="color: #6E5A7E;">${interest}</strong>. We've received your application and Dr. Tubero will be in touch within a few days.
              </p>
              <p style="font-size: 16px; color: #2B2433; line-height: 1.7; margin: 0 0 20px;">
                In the meantime, you're warmly welcome to join the Periwink community — it's free, always open, and entirely separate from the groups. Many women find it a valuable space on its own.
              </p>
              <div style="text-align: center; margin: 32px 0;">
                <a href="https://periwink-rjmcuborrq-ue.a.run.app/auth/signup" style="display: inline-block; background: #6E5A7E; color: #fff; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-size: 15px;">
                  Join the community →
                </a>
              </div>
              <p style="font-size: 16px; color: #6B6575; line-height: 1.7; margin: 24px 0 0; font-style: italic;">
                With warmth,<br>The Periwink Team
              </p>
            </div>
            <p style="text-align: center; font-size: 12px; color: #9B94A3; margin-top: 32px;">
              © ${new Date().getFullYear()} Periwink
            </p>
          </div>
        </body>
        </html>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Group application error:", error);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}

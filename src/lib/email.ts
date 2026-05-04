import { Resend } from "resend";

let resendInstance: Resend | null = null;

function getResend() {
    if (!resendInstance) {
          resendInstance = new Resend(process.env.RESEND_API_KEY);
    }
    return resendInstance;
}

const FROM_EMAIL = "Periwink <hello@yourperiwink.com>";

export async function sendVerificationEmail({
  to,
  token,
}: {
  to: string;
  token: string;
}) {
  const appUrl = process.env.NEXTAUTH_URL || "https://periwink-hvwa5fgo5q-ue.a.run.app";
  const verifyUrl = `${appUrl}/api/auth/verify-email?token=${token}`;

  try {
    await getResend().emails.send({
      from: FROM_EMAIL,
      to,
      subject: "Verify your email — Periwink",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #F7F3EE; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <div style="max-width: 520px; margin: 0 auto; padding: 48px 24px;">
            <div style="text-align: center; margin-bottom: 36px;">
              <h1 style="font-family: Georgia, serif; font-size: 28px; font-weight: 300; color: #6E5A7E; margin: 0; letter-spacing: 0.5px;">periwink</h1>
            </div>
            <div style="background: #FDFBF8; border-radius: 20px; padding: 36px 32px; border: 1px solid #E8E3EA;">
              <p style="font-size: 16px; color: #2B2433; line-height: 1.7; margin: 0 0 20px;">
                Welcome to Periwink. One small step before you join — please verify your email address.
              </p>
              <div style="text-align: center; margin: 32px 0;">
                <a href="${verifyUrl}" style="display: inline-block; background: #6E5A7E; color: #fff; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-size: 15px; font-family: -apple-system, sans-serif;">
                  Verify my email
                </a>
              </div>
              <p style="font-size: 14px; color: #9B94A3; line-height: 1.6; margin: 0;">
                This link expires in 24 hours. If you didn't create a Periwink account, you can safely ignore this email.
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
    return { success: true };
  } catch (error) {
    console.error("Failed to send verification email:", error);
    return { success: false, error };
  }
}

export async function sendCommunityWelcome({
    to,
    name,
    pseudonym,
}: {
    to: string;
    name: string;
    pseudonym: string;
}) {
    try {
          await getResend().emails.send({
                  from: FROM_EMAIL,
                  to,
                  subject: "Welcome to Periwink 💜",
                  html: `
                  <!DOCTYPE html>
                  <html>
                  <head>
                    <meta charset="utf-8">
                      <meta name="viewport" content="width=device-width, initial-scale=1.0">
                      </head>
                      <body style="margin: 0; padding: 0; background-color: #F7F3EE; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                        <div style="max-width: 520px; margin: 0 auto; padding: 48px 24px;">
                            <div style="text-align: center; margin-bottom: 36px;">
                                  <h1 style="font-family: Georgia, serif; font-size: 28px; font-weight: 300; color: #6E5A7E; margin: 0; letter-spacing: 0.5px;">periwink</h1>
                                      </div>

                                              <div style="background: #FDFBF8; border-radius: 20px; padding: 36px 32px; border: 1px solid #E8E3EA;">
                                                    <p style="font-size: 16px; color: #2B2433; line-height: 1.7; margin: 0 0 20px;">
                                                            Dear ${name},
                                                                  </p>

                                                                              <p style="font-size: 16px; color: #2B2433; line-height: 1.7; margin: 0 0 20px;">
                                                                                      Thank you for joining Periwink. You're now part of something we're building together — a space where women navigating this transition can find each other, share what they're noticing, and feel held.
                                                                                            </p>

                                                                                                        <p style="font-size: 16px; color: #2B2433; line-height: 1.7; margin: 0 0 20px;">
                                                                                                                Your pseudonym: <strong style="color: #6E5A7E;">${pseudonym}</strong>
                                                                                                                      </p>
                                                                                                                            
                                                                                                                                  <p style="font-size: 16px; color: #2B2433; line-height: 1.7; margin: 0 0 20px;">
                                                                                                                                          We'll be in touch soon as we prepare to open the community. Until then, know that you're not carrying this alone.
                                                                                                                                                </p>
                                                                                                                                                      
                                                                                                                                                            <p style="font-size: 16px; color: #6B6575; line-height: 1.7; margin: 24px 0 0; font-style: italic;">
                                                                                                                                                                    With warmth,<br>
                                                                                                                                                                            The Periwink Team
                                                                                                                                                                                  </p>
                                                                                                                                                                                      </div>
                                                                                                                                                                                          
                                                                                                                                                                                              <p style="text-align: center; font-size: 12px; color: #9B94A3; margin-top: 32px;">
                                                                                                                                                                                                    © ${new Date().getFullYear()} Periwink · You're receiving this because you signed up at yourperiwink.com
                                                                                                                                                                                                        </p>
                                                                                                                                                                                                          </div>
                                                                                                                                                                                                          </body>
                                                                                                                                                                                                          </html>
                                                                                                                                                                                                                `,
          });
          return { success: true };
    } catch (error) {
          console.error("Failed to send community welcome email:", error);
          return { success: false, error };
    }
}

export async function sendModerationAlert({
  postId,
  postTitle,
  postBody,
  authorName,
  roomName,
  reason,
  severity,
}: {
  postId: string;
  postTitle: string;
  postBody: string;
  authorName: string;
  roomName: string;
  reason: string;
  severity: string;
}) {
  const adminUrl = `${process.env.NEXTAUTH_URL || "https://periwink-hvwa5fgo5q-ue.a.run.app"}/admin`;
  const severityColor = severity === "HIGH" ? "#C62828" : severity === "MEDIUM" ? "#F57F17" : "#1565C0";
  const severityBg = severity === "HIGH" ? "#FFEBEE" : severity === "MEDIUM" ? "#FFF8E1" : "#E3F2FD";

  try {
    await getResend().emails.send({
      from: FROM_EMAIL,
      to: "adrian@yourperiwink.com",
      subject: `[${severity}] Content flagged for review — Periwink`,
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
        <body style="margin: 0; padding: 0; background-color: #F7F3EE; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <div style="max-width: 580px; margin: 0 auto; padding: 48px 24px;">
            <div style="text-align: center; margin-bottom: 28px;">
              <h1 style="font-family: Georgia, serif; font-size: 24px; font-weight: 300; color: #6E5A7E; margin: 0;">periwink</h1>
              <p style="font-size: 12px; color: #9B94A3; margin: 4px 0 0;">Community moderation alert</p>
            </div>
            <div style="background: #FDFBF8; border-radius: 16px; padding: 28px 28px; border: 1px solid #E8E3EA;">
              <div style="display: inline-block; padding: 4px 14px; border-radius: 999px; font-size: 12px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; background: ${severityBg}; color: ${severityColor}; margin-bottom: 16px;">
                ${severity} severity
              </div>
              <h2 style="font-family: Georgia, serif; font-size: 18px; font-weight: 400; color: #2B2433; margin: 0 0 8px;">${postTitle}</h2>
              <p style="font-size: 13px; color: #9B94A3; margin: 0 0 16px;">by ${authorName} · in ${roomName}</p>
              <div style="background: #F7F3EE; border-radius: 10px; padding: 14px 16px; margin-bottom: 20px;">
                <p style="font-size: 14px; color: #6B6575; line-height: 1.6; margin: 0; white-space: pre-wrap;">${postBody.slice(0, 400)}${postBody.length > 400 ? "..." : ""}</p>
              </div>
              <div style="border-left: 3px solid ${severityColor}; padding-left: 14px; margin-bottom: 24px;">
                <p style="font-size: 13px; font-weight: 600; color: #2B2433; margin: 0 0 4px;">AI moderation note</p>
                <p style="font-size: 13px; color: #6B6575; line-height: 1.6; margin: 0;">${reason}</p>
              </div>
              <a href="${adminUrl}?tab=flags" style="display: inline-block; background: #6E5A7E; color: #fff; text-decoration: none; padding: 12px 28px; border-radius: 10px; font-size: 14px;">
                Review in Admin
              </a>
            </div>
            <p style="text-align: center; font-size: 12px; color: #9B94A3; margin-top: 24px;">Post ID: ${postId}</p>
          </div>
        </body>
        </html>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to send moderation alert:", error);
    return { success: false, error };
  }
}

export async function sendFoundingMemberConfirmation({
    to,
    name,
    roleType,
}: {
    to: string;
    name: string;
    roleType: string;
}) {
    const roleLabels: Record<string, string> = {
          PRACTITIONER: "Healthcare Practitioner",
          RESEARCHER: "Researcher",
          BRAND_PARTNER: "Brand Partner",
          CONTENT_CREATOR: "Content Creator",
          COMMUNITY_BUILDER: "Community Builder",
    };

  try {
        await getResend().emails.send({
                from: FROM_EMAIL,
                to,
                subject: "Your Founding Member Application — Periwink",
                html: `
                <!DOCTYPE html>
                <html>
                <head>
                  <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    </head>
                    <body style="margin: 0; padding: 0; background-color: #F7F3EE; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                      <div style="max-width: 520px; margin: 0 auto; padding: 48px 24px;">
                          <div style="text-align: center; margin-bottom: 36px;">
                                <h1 style="font-family: Georgia, serif; font-size: 28px; font-weight: 300; color: #6E5A7E; margin: 0; letter-spacing: 0.5px;">periwink</h1>
                                    </div>

                                            <div style="background: #FDFBF8; border-radius: 20px; padding: 36px 32px; border: 1px solid #E8E3EA;">
                                                  <p style="font-size: 16px; color: #2B2433; line-height: 1.7; margin: 0 0 20px;">
                                                          Dear ${name},
                                                                </p>

                                                                            <p style="font-size: 16px; color: #2B2433; line-height: 1.7; margin: 0 0 20px;">
                                                                                    Thank you for applying to become a Founding Member of Periwink as a <strong style="color: #6E5A7E;">${roleLabels[roleType] || roleType}</strong>.
                                                                                          </p>

                                                                                                      <p style="font-size: 16px; color: #2B2433; line-height: 1.7; margin: 0 0 20px;">
                                                                                                              We've received your application and are grateful for your interest in helping build this space. We're carefully reviewing each application to ensure alignment with our philosophy — one rooted in relational care, not intervention.
                                                                                                                    </p>
                                                                                                                          
                                                                                                                                <p style="font-size: 16px; color: #2B2433; line-height: 1.7; margin: 0 0 20px;">
                                                                                                                                        We'll be in touch within the next two weeks to share next steps.
                                                                                                                                              </p>
                                                                                                                                                    
                                                                                                                                                          <p style="font-size: 16px; color: #6B6575; line-height: 1.7; margin: 24px 0 0; font-style: italic;">
                                                                                                                                                                  With warmth,<br>
                                                                                                                                                                          The Periwink Team
                                                                                                                                                                                </p>
                                                                                                                                                                                    </div>
                                                                                                                                                                                        
                                                                                                                                                                                            <p style="text-align: center; font-size: 12px; color: #9B94A3; margin-top: 32px;">
                                                                                                                                                                                                  © ${new Date().getFullYear()} Periwink · You're receiving this because you applied at yourperiwink.com
                                                                                                                                                                                                      </p>
                                                                                                                                                                                                        </div>
                                                                                                                                                                                                        </body>
                                                                                                                                                                                                        </html>
                                                                                                                                                                                                              `,
        });
        return { success: true };
  } catch (error) {
        console.error("Failed to send founding member confirmation:", error);
        return { success: false, error };
  }
}

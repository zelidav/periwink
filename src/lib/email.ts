import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = "Periwink <hello@yourperiwink.com>";

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
    await resend.emails.send({
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
    await resend.emails.send({
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

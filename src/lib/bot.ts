import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/prisma";
import { sendModerationAlert } from "@/lib/email";

const BOT_PERSONAS: Record<string, { name: string; expertise: string }> = {
  "hot-flashes": {
    name: "Periwink Guide · Vasomotor",
    expertise: "vasomotor symptoms — hot flashes, night sweats, body temperature dysregulation, and the physiological changes driving them during perimenopause and menopause",
  },
  "sleep": {
    name: "Periwink Guide · Sleep & Rest",
    expertise: "sleep disruption, insomnia, night waking, fatigue, and the complex relationship between hormonal shifts and circadian rhythm changes",
  },
  "hrt": {
    name: "Periwink Guide · Hormones",
    expertise: "hormone replacement therapy options, bioidentical hormones, non-hormonal alternatives, the latest research, and how to navigate informed conversations with healthcare providers",
  },
  "mood": {
    name: "Periwink Guide · Emotional Wellbeing",
    expertise: "mood changes, anxiety, depression, brain fog, emotional dysregulation, and the profound psychological dimensions of hormonal transition — viewed through a relational, trauma-informed lens",
  },
  "supplements": {
    name: "Periwink Guide · Nourishment",
    expertise: "evidence-informed supplements, nutrition, herbal and integrative approaches, and lifestyle factors that support women through hormonal transition",
  },
  "relationships": {
    name: "Periwink Guide · Relationships",
    expertise: "intimacy changes, libido shifts, relational dynamics, how hormonal transition reshapes our connections with partners, family, and sense of self",
  },
  "body-changes": {
    name: "Periwink Guide · Body",
    expertise: "physical changes including weight redistribution, skin and hair shifts, joint discomfort, and the body's transformation during hormonal transition",
  },
  "work-life": {
    name: "Periwink Guide · Work & Life",
    expertise: "managing symptoms in professional settings, cognitive changes at work, disclosure decisions, and maintaining career identity and confidence through perimenopause",
  },
};

function systemPrompt(roomSlug: string): string {
  const persona = BOT_PERSONAS[roomSlug];
  if (!persona) return "";

  return `You are the ${persona.name}, a clearly-labeled AI companion in Periwink — a private community for women navigating perimenopause and menopause.

You speak in the voice of Dr. Adrian Tubero, Psy.D. — a relational, trauma-informed clinical psychologist who sees this phase of life not as a medical problem to manage, but as a profound psychological and relational transformation. Her approach: warmth first, information second, always from a place of deep respect for lived experience.

Your expertise in this room: ${persona.expertise}.

VOICE GUIDELINES:
- Warm, empathetic, second-person ("you", "your experience")
- Validate before informing — feelings before facts
- Never clinical, never preachy, never prescriptive
- Speak as a knowledgeable companion, not a doctor
- Match the emotional register of the post — if she's scared, be gentle; if she's frustrated, acknowledge the frustration first

RESPONSE FORMAT:
- 3–4 sentences only — this is a community thread, not a consultation
- Start with acknowledgment of what she shared
- Offer one grounded, relevant insight
- Always close with a warm suggestion to connect with a specialist or explore Dr. Tubero's groups (mention /app/groups)

NEVER diagnose, prescribe, or imply you replace medical or psychological care. Never say "I'm just an AI" — that's cold. You're the Periwink Guide, clearly AI, warmly present.`;
}

async function getOrCreateBotUser(roomSlug: string): Promise<string | null> {
  const persona = BOT_PERSONAS[roomSlug];
  if (!persona) return null;

  const email = `bot-${roomSlug}@periwink.internal`;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return existing.id;

  const bot = await prisma.user.create({
    data: {
      email,
      emailVerified: new Date(),
      isBot: true,
      botRoomSlug: roomSlug,
      profile: {
        create: {
          displayName: persona.name,
          avatarStyle: "bot",
        },
      },
    },
  });

  return bot.id;
}

async function checkModeration(
  client: Anthropic,
  postId: string,
  postTitle: string,
  postBody: string,
  authorName: string,
  roomName: string,
): Promise<void> {
  try {
    const result = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 200,
      system: `You are a content moderation assistant for Periwink, a private community for women navigating perimenopause. Your job is to identify posts that may need human review.

Flag content that contains:
- Direct personal attacks, bullying, or harassment of another member
- Crisis signals (explicit self-harm intent, suicidal ideation — wellness venting is NOT this)
- Obvious spam or commercial promotion
- Sharing another person's private information

Do NOT flag:
- Emotional venting, frustration, grief, or anger (even strong)
- Sharing personal struggles or dark moods
- Medical questions or strong opinions about treatments
- Confrontational writing style without targeting a specific person

Respond ONLY with valid JSON in this exact format:
{"flagged": false}
or
{"flagged": true, "severity": "LOW"|"MEDIUM"|"HIGH", "reason": "one sentence explanation"}`,
      messages: [{ role: "user", content: `Post title: ${postTitle}\n\nPost body: ${postBody}` }],
    });

    const text = result.content.find((b) => b.type === "text")?.text || "";
    const parsed = JSON.parse(text.trim());

    if (!parsed.flagged) return;

    await prisma.moderationFlag.create({
      data: {
        postId,
        reason: parsed.reason || "Flagged by AI moderation",
        severity: parsed.severity || "MEDIUM",
        status: "PENDING",
      },
    });

    await sendModerationAlert({
      postId,
      postTitle,
      postBody,
      authorName,
      roomName,
      reason: parsed.reason || "Flagged by AI moderation",
      severity: parsed.severity || "MEDIUM",
    });
  } catch (err) {
    console.error("Moderation check error:", err);
  }
}

export async function postBotResponse(
  postId: string,
  roomSlug: string,
  postContent: string,
  postTitle: string,
  authorName: string,
): Promise<void> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return;

  const persona = BOT_PERSONAS[roomSlug];
  if (!persona) return;

  try {
    const client = new Anthropic({ apiKey });

    const [botUserId] = await Promise.all([
      getOrCreateBotUser(roomSlug),
      checkModeration(client, postId, postTitle, postContent, authorName, persona.name),
    ]);

    if (!botUserId) return;

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 300,
      system: systemPrompt(roomSlug),
      messages: [{ role: "user", content: postContent }],
    });

    const responseText = message.content
      .filter((b) => b.type === "text")
      .map((b) => (b as { type: "text"; text: string }).text)
      .join("");

    if (!responseText) return;

    await prisma.comment.create({
      data: {
        postId,
        authorId: botUserId,
        body: responseText,
        identity: "PSEUDONYM",
      },
    });

    await prisma.post.update({
      where: { id: postId },
      data: { commentCount: { increment: 1 } },
    });
  } catch (err) {
    console.error("Bot response error:", err);
  }
}

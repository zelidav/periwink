import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const ROOMS = [
  { slug: "hot-flashes", name: "Hot Flashes & Night Sweats", description: "Share experiences and strategies for managing vasomotor symptoms", icon: "🔥", sortOrder: 1, isDefault: true },
  { slug: "sleep", name: "Sleep & Fatigue", description: "Finding rest when your body won't cooperate", icon: "🌙", sortOrder: 2, isDefault: true },
  { slug: "hrt", name: "HRT & Hormone Therapy", description: "Navigating hormone replacement options together", icon: "💊", sortOrder: 3, isDefault: true },
  { slug: "mood", name: "Mood & Mental Health", description: "Anxiety, brain fog, mood swings — you're not alone", icon: "🧠", sortOrder: 4, isDefault: true },
  { slug: "relationships", name: "Relationships & Intimacy", description: "Honest conversations about changing dynamics", icon: "💜", sortOrder: 5, isDefault: false },
  { slug: "supplements", name: "Supplements & Nutrition", description: "What's working, what's not, and the science behind it", icon: "🌿", sortOrder: 6, isDefault: true },
  { slug: "body-changes", name: "Body Changes", description: "Weight, skin, hair, and everything in between", icon: "🦋", sortOrder: 7, isDefault: false },
  { slug: "work-life", name: "Work & Career", description: "Managing symptoms at work, disclosure decisions, and professional impact", icon: "💼", sortOrder: 8, isDefault: false },
];

async function main() {
  console.log("Seeding rooms...");

  for (const room of ROOMS) {
    await prisma.room.upsert({
      where: { slug: room.slug },
      update: room,
      create: room,
    });
  }

  console.log(`Seeded ${ROOMS.length} rooms`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

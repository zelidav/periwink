import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// ============================================================================
// ROOMS
// ============================================================================

const ROOMS = [
  { slug: "hot-flashes", name: "Hot Flashes & Night Sweats", description: "Share experiences and strategies for managing vasomotor symptoms", icon: "🔥", sortOrder: 1, isDefault: true },
  { slug: "sleep", name: "Sleep & Fatigue", description: "Finding rest when your body won't cooperate", icon: "🌙", sortOrder: 2, isDefault: true },
  { slug: "hrt", name: "HRT & Hormone Therapy", description: "Navigating hormone replacement options together", icon: "💊", sortOrder: 3, isDefault: true },
  { slug: "mood", name: "Mood & Mental Health", description: "Anxiety, brain fog, mood swings — you're not alone", icon: "🧠", sortOrder: 4, isDefault: true },
  { slug: "supplements", name: "Supplements & Nutrition", description: "What's working, what's not, and the science behind it", icon: "🌿", sortOrder: 5, isDefault: true },
  { slug: "relationships", name: "Relationships & Intimacy", description: "Honest conversations about changing dynamics", icon: "💜", sortOrder: 6, isDefault: false },
  { slug: "body-changes", name: "Body Changes", description: "Weight, skin, hair, and everything in between", icon: "🦋", sortOrder: 7, isDefault: false },
  { slug: "work-life", name: "Work & Career", description: "Managing symptoms at work, disclosure decisions, and professional impact", icon: "💼", sortOrder: 8, isDefault: false },
];

// ============================================================================
// DEMO USERS
// ============================================================================

interface DemoUser {
  pseudonym: string;
  bio: string;
  menopauseStage: "EARLY_PERIMENOPAUSE" | "LATE_PERIMENOPAUSE" | "MENOPAUSE" | "POSTMENOPAUSE" | "UNSURE" | "PREFER_NOT_TO_SAY";
  birthYear: number;
  country: string;
  avatarStyle: string;
  yearsInStage: number;
}

const DEMO_USERS: DemoUser[] = [
  { pseudonym: "MoonlitSage", bio: "Former ER nurse. Now I'm the one navigating without a map.", menopauseStage: "LATE_PERIMENOPAUSE", birthYear: 1975, country: "US", avatarStyle: "dicebear:avataaars", yearsInStage: 3 },
  { pseudonym: "DesertRose", bio: "Yoga teacher who can't hold tree pose when the hot flash hits.", menopauseStage: "EARLY_PERIMENOPAUSE", birthYear: 1978, country: "US", avatarStyle: "dicebear:adventurer", yearsInStage: 1 },
  { pseudonym: "QuietStorm42", bio: "Software engineer. My code compiles but my brain doesn't.", menopauseStage: "MENOPAUSE", birthYear: 1974, country: "CA", avatarStyle: "dicebear:lorelei", yearsInStage: 2 },
  { pseudonym: "WildSage", bio: "Naturopath-curious. Trying everything, judging nothing.", menopauseStage: "UNSURE", birthYear: 1980, country: "AU", avatarStyle: "gradient", yearsInStage: 1 },
  { pseudonym: "TidalGrace", bio: "Through the other side. Here to hold space.", menopauseStage: "POSTMENOPAUSE", birthYear: 1968, country: "UK", avatarStyle: "dicebear:open-peeps", yearsInStage: 5 },
  { pseudonym: "NightOwl3am", bio: "Founding member of the 3am club. Accepting new members nightly.", menopauseStage: "LATE_PERIMENOPAUSE", birthYear: 1976, country: "US", avatarStyle: "dicebear:notionists", yearsInStage: 2 },
  { pseudonym: "GoldenThread", bio: "Writer. This chapter is the hardest to put into words.", menopauseStage: "EARLY_PERIMENOPAUSE", birthYear: 1979, country: "IE", avatarStyle: "dicebear:fun-emoji", yearsInStage: 1 },
  { pseudonym: "SteadyRain", bio: "Teacher, mother, finding my rhythm again at 52.", menopauseStage: "MENOPAUSE", birthYear: 1974, country: "US", avatarStyle: "gradient", yearsInStage: 3 },
  { pseudonym: "WinterBloom", bio: "Gardener. Learning to bloom in unexpected seasons.", menopauseStage: "LATE_PERIMENOPAUSE", birthYear: 1977, country: "NZ", avatarStyle: "dicebear:thumbs", yearsInStage: 2 },
  { pseudonym: "CopperMoon", bio: "Fitness instructor. My body rewrote the rules.", menopauseStage: "EARLY_PERIMENOPAUSE", birthYear: 1981, country: "US", avatarStyle: "dicebear:personas", yearsInStage: 1 },
  { pseudonym: "SilverLining", bio: "10 years post. It gets so much better. I promise.", menopauseStage: "POSTMENOPAUSE", birthYear: 1964, country: "US", avatarStyle: "gradient", yearsInStage: 10 },
  { pseudonym: "VelvetDusk", bio: "Just starting to notice. Is this... it?", menopauseStage: "UNSURE", birthYear: 1983, country: "UK", avatarStyle: "dicebear:big-ears", yearsInStage: 0 },
];

// ============================================================================
// POSTS — distributed across rooms
// ============================================================================

interface SeedPost {
  roomSlug: string;
  authorPseudonym: string;
  title: string;
  body: string;
  identity: "PSEUDONYM" | "ANONYMOUS";
  isPinned: boolean;
  daysAgo: number;
  hoursAgo: number;
}

const POSTS: SeedPost[] = [
  // ── hot-flashes (7 posts) ──────────────────────────────────────────────
  {
    roomSlug: "hot-flashes",
    authorPseudonym: "DesertRose",
    title: "The CEO noticed. I didn't die.",
    body: "I was mid-presentation and my face went full crimson. Neck, chest, everything. Instead of dying inside, I just said 'power surge' and kept going. Three women messaged me after the meeting. Three. We're everywhere and we're all pretending it's not happening.",
    identity: "PSEUDONYM",
    isPinned: true,
    daysAgo: 28,
    hoursAgo: 14,
  },
  {
    roomSlug: "hot-flashes",
    authorPseudonym: "CopperMoon",
    title: "Hot flash tracker — patterns I've noticed after 3 months",
    body: "I started logging every flash with time, trigger, and duration. Here's what I found: alcohol (even one glass of wine) triggers one within 2 hours. Spicy food is a maybe. Stress is guaranteed. The biggest surprise? They cluster between 2-4pm for me. Sharing in case tracking helps anyone else see their own patterns.",
    identity: "PSEUDONYM",
    isPinned: false,
    daysAgo: 22,
    hoursAgo: 9,
  },
  {
    roomSlug: "hot-flashes",
    authorPseudonym: "MoonlitSage",
    title: "Night sweats destroyed my favorite sheets",
    body: "I know this sounds trivial but I loved those sheets. Egyptian cotton, a wedding gift. Woke up soaked through for the third time this week and something about having to strip the bed at 3am just broke me. My husband asked if I was okay and I said 'the sheets are ruined' and he knew I wasn't talking about the sheets.",
    identity: "PSEUDONYM",
    isPinned: false,
    daysAgo: 18,
    hoursAgo: 3,
  },
  {
    roomSlug: "hot-flashes",
    authorPseudonym: "WinterBloom",
    title: "Layering system that actually works",
    body: "After a year of trial and error: bamboo base layer, loose cotton or linen over that, cardigan or blazer on top. The bamboo wicks when a flash hits, the outer layers come off fast. I keep a small fan in my purse. It's not glamorous but I stopped dreading leaving the house. Also: cooling towels. The ones runners use. Life changing.",
    identity: "PSEUDONYM",
    isPinned: false,
    daysAgo: 15,
    hoursAgo: 11,
  },
  {
    roomSlug: "hot-flashes",
    authorPseudonym: "NightOwl3am",
    title: "Does anyone else get the chill after the flash?",
    body: "The hot flash itself lasts maybe 3 minutes. But then I get this intense chill that lasts longer. Shivering, goosebumps, the works. It's like my thermostat is completely broken. Please tell me I'm not the only one doing the hot-cold-hot-cold dance all day.",
    identity: "PSEUDONYM",
    isPinned: false,
    daysAgo: 10,
    hoursAgo: 16,
  },
  {
    roomSlug: "hot-flashes",
    authorPseudonym: "SteadyRain",
    title: "My students think I'm nervous. I'm not nervous.",
    body: "I teach eighth grade. Standing in front of 30 thirteen-year-olds when a hot flash hits is its own special kind of challenge. One of my students asked if I was blushing. I said 'no, I'm having a power surge.' They looked confused. I looked like a tomato. We moved on. Teaching through this is honestly one of the hardest things I've done.",
    identity: "PSEUDONYM",
    isPinned: false,
    daysAgo: 5,
    hoursAgo: 8,
  },
  {
    roomSlug: "hot-flashes",
    authorPseudonym: "VelvetDusk",
    title: "Is this a hot flash or am I just warm?",
    body: "Genuine question. I'm 41 and I keep having these moments where I suddenly feel like I'm standing next to a radiator. It lasts a couple of minutes and then it's gone. Is that a hot flash? It's not the dramatic thing I expected from movies. It's subtle but unmistakable once I started paying attention.",
    identity: "PSEUDONYM",
    isPinned: false,
    daysAgo: 2,
    hoursAgo: 19,
  },

  // ── sleep (7 posts) ───────────────────────────────────────────────────
  {
    roomSlug: "sleep",
    authorPseudonym: "NightOwl3am",
    title: "4:17am again",
    body: "I've memorized the pattern of light on my ceiling. My husband sleeps like he's being paid for it. I've started keeping a journal by the bed — if I can't sleep, at least I can write. Last night I wrote three pages about nothing. Tonight I'm writing this instead. Hello to anyone else who's up right now.",
    identity: "PSEUDONYM",
    isPinned: true,
    daysAgo: 27,
    hoursAgo: 4,
  },
  {
    roomSlug: "sleep",
    authorPseudonym: "QuietStorm42",
    title: "Sleep hygiene tips that actually worked (from a skeptic)",
    body: "I rolled my eyes at every 'sleep hygiene' article for months. Then desperation set in. What actually helped: keeping the bedroom at 65F, blackout curtains, no screens after 9pm (this was the hardest), and magnesium glycinate 400mg before bed. I'm not sleeping like I did at 30, but I'm sleeping. Five to six hours most nights instead of three. Progress.",
    identity: "PSEUDONYM",
    isPinned: true,
    daysAgo: 25,
    hoursAgo: 10,
  },
  {
    roomSlug: "sleep",
    authorPseudonym: "MoonlitSage",
    title: "The anxiety-insomnia loop is real",
    body: "Can't sleep because I'm anxious. Anxious because I can't sleep. The ER nurse in me knows this is a feedback loop. The woman lying awake at 2am doesn't care about feedback loops. She just wants to sleep. Has anyone found a way to break the cycle that doesn't involve medication? I'm not against meds, I just want to try other things first.",
    identity: "PSEUDONYM",
    isPinned: false,
    daysAgo: 20,
    hoursAgo: 2,
  },
  {
    roomSlug: "sleep",
    authorPseudonym: "WinterBloom",
    title: "Separate bedrooms saved my marriage",
    body: "There. I said it. The night sweats, the tossing, the getting up at 3am — my husband was becoming a zombie too. We moved me into the guest room 'temporarily' six months ago. Best decision we've made. We still have our evenings together. But when it's time to sleep, I go to my room with my cooling pillow and my fan and I don't have to feel guilty about waking anyone up.",
    identity: "PSEUDONYM",
    isPinned: false,
    daysAgo: 16,
    hoursAgo: 7,
  },
  {
    roomSlug: "sleep",
    authorPseudonym: "GoldenThread",
    title: "I wrote a poem at 3am and it's not terrible",
    body: "Something about the stillness of insomnia unlocks a different part of my brain. I've been writing at night — poems, fragments, half-finished essays. Last night I wrote something about the space between sleep and waking. It might be the best thing I've ever written. Maybe there's a gift hiding in this somewhere. Or maybe I'm just delirious.",
    identity: "PSEUDONYM",
    isPinned: false,
    daysAgo: 12,
    hoursAgo: 3,
  },
  {
    roomSlug: "sleep",
    authorPseudonym: "SteadyRain",
    title: "Waking up drenched — when does this part end?",
    body: "Two sets of pajamas a night. Towel on the pillow. I'm so tired of being tired. I teach all day, come home exhausted, fall asleep fine, and then 1am hits and I'm awake and soaked. The fatigue is affecting my work. I forgot a parent's name during conferences last week. I've known her for three years.",
    identity: "PSEUDONYM",
    isPinned: false,
    daysAgo: 8,
    hoursAgo: 22,
  },
  {
    roomSlug: "sleep",
    authorPseudonym: "TidalGrace",
    title: "It does get better. Here's my sleep timeline.",
    body: "For those in the thick of it: my worst sleep years were 49-52. By 54, the night sweats had mostly stopped. By 56, I was sleeping through most nights. I'm 58 now and I sleep better than I did in my 40s. I wish someone had told me there was an end point. So I'm telling you. It's not forever. Hang in there.",
    identity: "PSEUDONYM",
    isPinned: true,
    daysAgo: 4,
    hoursAgo: 15,
  },

  // ── hrt (6 posts) ─────────────────────────────────────────────────────
  {
    roomSlug: "hrt",
    authorPseudonym: "QuietStorm42",
    title: "Three months on estradiol patches — a full report",
    body: "The brain fog lifted first — like someone cleaned a window I didn't know was dirty. Then the sleep came back. By week six, the hot flashes dropped from 8-10 a day to maybe 2. I cried in my doctor's office at my follow-up. Not from sadness. From relief. I'd forgotten what it felt like to feel like myself. If you're on the fence, I'm not going to tell you what to do, but I will tell you what it did for me.",
    identity: "PSEUDONYM",
    isPinned: true,
    daysAgo: 26,
    hoursAgo: 11,
  },
  {
    roomSlug: "hrt",
    authorPseudonym: "MoonlitSage",
    title: "Navigating HRT as a nurse — the research vs. the reality",
    body: "I spent 20 years in medicine. I know how to read studies. And I still struggled with the HRT decision because the Women's Health Initiative study from 2002 scared an entire generation of women and doctors. The nuance got lost. Here's what I've learned: the risks depend heavily on your age, when you start, your personal history, and the type of HRT. Talk to your doctor, but also know that the science has evolved enormously since 2002.",
    identity: "PSEUDONYM",
    isPinned: false,
    daysAgo: 23,
    hoursAgo: 6,
  },
  {
    roomSlug: "hrt",
    authorPseudonym: "SteadyRain",
    title: "My doctor dismissed me three times before I found someone who listened",
    body: "First doctor: 'You're too young for menopause.' Second doctor: 'Try yoga and deep breathing.' Third doctor: 'Here's an antidepressant.' Fourth doctor: the one who actually ran my hormone levels, listened to my symptoms, and said 'Let's talk about your options.' It took me a year and a half. If your doctor isn't listening, find another one. You deserve to be heard.",
    identity: "PSEUDONYM",
    isPinned: true,
    daysAgo: 19,
    hoursAgo: 13,
  },
  {
    roomSlug: "hrt",
    authorPseudonym: "NightOwl3am",
    title: "Patches vs. pills — my experience with both",
    body: "Started with oral estradiol. It helped, but I had nausea and headaches the first month. Switched to patches at my doctor's suggestion. The patches are better for me — steadier levels, no stomach issues. The downside: they sometimes peel off in the shower and I've found them stuck to my sheets. Small price to pay for sleeping again.",
    identity: "PSEUDONYM",
    isPinned: false,
    daysAgo: 14,
    hoursAgo: 9,
  },
  {
    roomSlug: "hrt",
    authorPseudonym: "TidalGrace",
    title: "Coming off HRT after 7 years — what to expect",
    body: "My doctor and I decided it was time to taper off. I was nervous. Tapered over three months, reducing the dose gradually. Some hot flashes came back, milder than before. Sleep disruption for about six weeks. Then it settled. My body found its new normal. Not everyone's experience will be like mine, but I wanted to share because I couldn't find many accounts of the 'coming off' part.",
    identity: "PSEUDONYM",
    isPinned: false,
    daysAgo: 9,
    hoursAgo: 17,
  },
  {
    roomSlug: "hrt",
    authorPseudonym: "CopperMoon",
    title: "Testosterone — the hormone no one talks about for women",
    body: "My libido vanished. Not decreased — vanished. Like a switch flipped off. My doctor suggested low-dose testosterone cream in addition to estrogen. It's been two months. The libido is coming back, but the bigger surprise is my energy. I feel like myself at the gym again. I can push through a workout without wanting to cry halfway through. Why aren't more doctors talking about this?",
    identity: "PSEUDONYM",
    isPinned: false,
    daysAgo: 3,
    hoursAgo: 12,
  },

  // ── mood (7 posts) ────────────────────────────────────────────────────
  {
    roomSlug: "mood",
    authorPseudonym: "GoldenThread",
    title: "I snapped at my daughter today over nothing",
    body: "She left her shoes in the hallway. That's it. That's what made me lose it. She looked at me like I was a stranger. I am, a little. The rage comes from nowhere and I don't know how to explain to a 15-year-old that her mother's hormones are rewriting her personality. I apologized. She said it was fine. It wasn't fine. I could see it wasn't fine.",
    identity: "PSEUDONYM",
    isPinned: true,
    daysAgo: 29,
    hoursAgo: 18,
  },
  {
    roomSlug: "mood",
    authorPseudonym: "QuietStorm42",
    title: "Brain fog made me feel like I was losing my mind",
    body: "I'm a software engineer. My job is literally thinking. And for about six months, I couldn't hold a thought for more than 30 seconds. I'd open a file and forget why. I'd start a sentence in a meeting and lose the thread. I genuinely worried I had early-onset dementia. My doctor said it was perimenopause. The relief was enormous. The fog was still there, but at least I knew it had a name.",
    identity: "PSEUDONYM",
    isPinned: false,
    daysAgo: 24,
    hoursAgo: 8,
  },
  {
    roomSlug: "mood",
    authorPseudonym: "MoonlitSage",
    title: "The grief nobody warns you about",
    body: "It's not just the symptoms. It's grieving the body you knew. The mind you trusted. The predictability of your own moods. I sat in my car in the grocery store parking lot last week and cried for twenty minutes. Not because anything happened. Because everything is changing and nobody prepared me for the emotional weight of that.",
    identity: "PSEUDONYM",
    isPinned: true,
    daysAgo: 21,
    hoursAgo: 5,
  },
  {
    roomSlug: "mood",
    authorPseudonym: "WinterBloom",
    title: "Anxiety at 48 when I've never been anxious before",
    body: "I was always the calm one. The steady one. The friend everyone called in a crisis. Now I wake up with my heart racing for no reason. I check the locks three times. I catastrophize about my kids. This isn't me. Or maybe this is the new me and I haven't accepted that yet. Either way, I'd like my nervous system back please.",
    identity: "PSEUDONYM",
    isPinned: false,
    daysAgo: 17,
    hoursAgo: 14,
  },
  {
    roomSlug: "mood",
    authorPseudonym: "VelvetDusk",
    title: "Am I depressed or is this perimenopause?",
    body: "Genuinely asking. I've been low for months. Not the dramatic kind of depression. The grey kind. Everything is fine but nothing feels good. Food doesn't taste as interesting. Music doesn't hit the same. I go through the motions. My therapist says it could be hormonal. My GP wants to put me on an SSRI. I just want to know which thing I'm treating.",
    identity: "PSEUDONYM",
    isPinned: false,
    daysAgo: 13,
    hoursAgo: 20,
  },
  {
    roomSlug: "mood",
    authorPseudonym: "SilverLining",
    title: "On the other side of the mood storms",
    body: "The rage, the sadness, the anxiety — I had them all. Badly. For about four years. HRT helped. Therapy helped. Time helped. I'm 62 now and I feel more emotionally stable than I have in decades. Not numb — alive. The mood storms pass. They really do. I know that doesn't help at 3am when you're crying for no reason, but I wanted you to hear it from someone who's been there.",
    identity: "PSEUDONYM",
    isPinned: false,
    daysAgo: 7,
    hoursAgo: 10,
  },
  {
    roomSlug: "mood",
    authorPseudonym: "NightOwl3am",
    title: "The rage is the part I wasn't prepared for",
    body: "Sadness I expected. Anxiety, sure. But this incandescent rage that rises from my chest like lava? Nobody mentioned that. I threw a remote control at the wall last Tuesday because the streaming service asked if I was still watching. Yes, Netflix, I'm still watching. I'm also still seething about something my coworker said six hours ago. Everything is fuel right now.",
    identity: "ANONYMOUS",
    isPinned: false,
    daysAgo: 1,
    hoursAgo: 6,
  },

  // ── supplements (6 posts) ─────────────────────────────────────────────
  {
    roomSlug: "supplements",
    authorPseudonym: "WildSage",
    title: "My supplement stack after 8 months of experimentation",
    body: "After trying just about everything: magnesium glycinate (400mg before bed) — helps sleep and muscle cramps. Vitamin D3+K2 — my levels were low, most women our age are. Black cohosh — jury's still out, but my hot flashes might be slightly less intense. Ashwagandha — helps with the anxiety edge. Omega-3 — for brain fog and joint pain. I know supplements aren't a replacement for HRT if you need it, but this combo has made a noticeable difference for me.",
    identity: "PSEUDONYM",
    isPinned: true,
    daysAgo: 26,
    hoursAgo: 7,
  },
  {
    roomSlug: "supplements",
    authorPseudonym: "DesertRose",
    title: "Adaptogens — what worked, what was snake oil",
    body: "I'm a yoga teacher, so I was already in the 'natural remedy' world. Here's my honest take: ashwagandha genuinely calms my nervous system. Maca did nothing for me despite the hype. Rhodiola helped with energy but made my anxiety worse. Shatavari — too early to tell. The biggest lesson: what works for one person may not work for another. Keep a symptom journal so you actually know what's helping vs. placebo.",
    identity: "PSEUDONYM",
    isPinned: false,
    daysAgo: 21,
    hoursAgo: 12,
  },
  {
    roomSlug: "supplements",
    authorPseudonym: "CopperMoon",
    title: "Creatine for perimenopause — anyone else trying this?",
    body: "My trainer suggested creatine monohydrate for muscle preservation and brain fog. I was skeptical — isn't that for bodybuilders? But I've been taking 5g daily for six weeks and my workout recovery is noticeably better. The brain fog might be slightly improved too, though it's hard to separate from other changes. Any other active women experimenting with this?",
    identity: "PSEUDONYM",
    isPinned: false,
    daysAgo: 15,
    hoursAgo: 16,
  },
  {
    roomSlug: "supplements",
    authorPseudonym: "TidalGrace",
    title: "The supplements I still take at 58",
    body: "Post-menopause, my priorities shifted. Calcium + D3 for bones. Magnesium because it helps with everything. Collagen peptides — I know the science is mixed but my joints feel better. Probiotics for gut health. And fish oil because my cardiologist recommended it. The hot flash supplements I dropped years ago. Your supplement needs change with your stage. Don't be afraid to reassess.",
    identity: "PSEUDONYM",
    isPinned: false,
    daysAgo: 11,
    hoursAgo: 9,
  },
  {
    roomSlug: "supplements",
    authorPseudonym: "QuietStorm42",
    title: "PSA: check for interactions before stacking supplements",
    body: "I was taking St. John's Wort for mood, black cohosh for hot flashes, and evening primrose oil for breast tenderness. Turns out St. John's Wort interacts with a LOT of medications and can reduce the effectiveness of hormonal treatments. My pharmacist caught it. Please, please run your supplement list by a pharmacist or doctor. 'Natural' doesn't mean 'no interactions.'",
    identity: "PSEUDONYM",
    isPinned: false,
    daysAgo: 6,
    hoursAgo: 14,
  },
  {
    roomSlug: "supplements",
    authorPseudonym: "WildSage",
    title: "Seed cycling — placebo or real?",
    body: "Okay, I know this one is controversial. Flax and pumpkin seeds during the first half of your cycle, sunflower and sesame during the second. I've been doing it for three months. My cycles have been slightly more regular, but I also started magnesium around the same time so who knows. Has anyone else tried this? I want to believe but the scientist in me needs more data points.",
    identity: "PSEUDONYM",
    isPinned: false,
    daysAgo: 1,
    hoursAgo: 11,
  },

  // ── relationships (6 posts) ───────────────────────────────────────────
  {
    roomSlug: "relationships",
    authorPseudonym: "WinterBloom",
    title: "My husband thinks I'm pushing him away",
    body: "He's not wrong. I don't want to be touched some days. My skin feels like it belongs to someone else. He tries to hug me and I stiffen. It's not about him. It's this overwhelming sensory thing I can't explain. We had a long talk last night. He cried. I cried. We're figuring it out but it's harder than either of us expected.",
    identity: "PSEUDONYM",
    isPinned: false,
    daysAgo: 25,
    hoursAgo: 20,
  },
  {
    roomSlug: "relationships",
    authorPseudonym: "GoldenThread",
    title: "Telling my partner what I need when I don't know what I need",
    body: "He keeps asking 'what can I do?' and I keep saying 'I don't know' and we're both frustrated. How do you communicate needs you can't even identify? Some days I need space. Some days I need to be held. Some days both at the same time. I've started writing him notes when I can't say it out loud. It helps a little.",
    identity: "PSEUDONYM",
    isPinned: false,
    daysAgo: 20,
    hoursAgo: 15,
  },
  {
    roomSlug: "relationships",
    authorPseudonym: "SteadyRain",
    title: "The libido conversation we need to normalize",
    body: "My desire didn't decrease gradually. It vanished. Like someone turned off a faucet. I felt broken. My partner felt rejected. Neither of us knew how to talk about it without someone getting hurt. I finally said: 'This isn't about you. Something is physically different.' That conversation changed everything. Not the libido — the relationship. We're working with it instead of around it now.",
    identity: "ANONYMOUS",
    isPinned: false,
    daysAgo: 16,
    hoursAgo: 3,
  },
  {
    roomSlug: "relationships",
    authorPseudonym: "SilverLining",
    title: "Friendships changed too — and that's okay",
    body: "Some friendships deepened during menopause. The friends who could sit with me in the hard stuff became closer than ever. Others faded. The ones who said 'just think positive' or 'have you tried yoga' when I was drowning — I don't have the energy for them anymore. Menopause is a filter. What survives it is real.",
    identity: "PSEUDONYM",
    isPinned: false,
    daysAgo: 11,
    hoursAgo: 8,
  },
  {
    roomSlug: "relationships",
    authorPseudonym: "MoonlitSage",
    title: "Single and going through this alone",
    body: "There's so much content about 'helping your partner understand menopause.' What about those of us who don't have a partner? I'm navigating this alone and some nights it's really lonely. The 3am wake-ups with nobody to talk to. The hot flashes with nobody to laugh about them with. This community has helped more than I can say. But I wanted to name the loneliness for anyone else feeling it.",
    identity: "PSEUDONYM",
    isPinned: false,
    daysAgo: 6,
    hoursAgo: 21,
  },
  {
    roomSlug: "relationships",
    authorPseudonym: "NightOwl3am",
    title: "My teenager doesn't understand and I can't expect her to",
    body: "She's 16 and going through her own hormonal chaos. The irony of us both being at the mercy of our hormones is not lost on me. She slams doors, I slam doors. My husband just stands in the hallway looking bewildered. I try to remember that she's not giving me a hard time — she's having a hard time. I try. I don't always succeed.",
    identity: "PSEUDONYM",
    isPinned: false,
    daysAgo: 2,
    hoursAgo: 7,
  },

  // ── body-changes (6 posts) ────────────────────────────────────────────
  {
    roomSlug: "body-changes",
    authorPseudonym: "CopperMoon",
    title: "I'm a fitness instructor and I gained 15 pounds in 6 months",
    body: "Same diet. Same exercise routine — more than most people do. And the weight came anyway. All around my middle, where I've never carried weight before. I had to buy new pants. I had to stand in front of my classes feeling like a fraud. It took me months to realize I'm not a fraud. My body changed the rules and I need to learn the new ones instead of fighting the old ones harder.",
    identity: "PSEUDONYM",
    isPinned: false,
    daysAgo: 27,
    hoursAgo: 13,
  },
  {
    roomSlug: "body-changes",
    authorPseudonym: "DesertRose",
    title: "My hair is thinning and nobody talks about this",
    body: "The hot flashes get all the press. But pulling clumps of hair out of the shower drain every morning? That's the symptom that makes me cry. My ponytail is half what it used to be. I've started using volumizing products and being gentler with heat styling. But honestly, the hardest part is the mirror. I don't look like me anymore.",
    identity: "PSEUDONYM",
    isPinned: false,
    daysAgo: 22,
    hoursAgo: 6,
  },
  {
    roomSlug: "body-changes",
    authorPseudonym: "WildSage",
    title: "Joint pain — the symptom I never connected to perimenopause",
    body: "My knees started aching at 44. Then my hands in the morning. Then my hips. I went to a rheumatologist thinking I had arthritis. Blood work was fine. He shrugged. It was my naturopath who said 'estrogen is anti-inflammatory — when it drops, joints feel it.' Why did nobody tell me this? Why isn't this in any of the brochures?",
    identity: "PSEUDONYM",
    isPinned: false,
    daysAgo: 17,
    hoursAgo: 10,
  },
  {
    roomSlug: "body-changes",
    authorPseudonym: "SteadyRain",
    title: "My skin changed overnight",
    body: "Dry. Itchy. Thin. I got a paper cut that took two weeks to heal. My elbows look like they belong to someone twenty years older. I've had to completely overhaul my skincare — heavier moisturizers, hyaluronic acid, retinol. The dermatologist said estrogen loss affects collagen production. Another thing to mourn and then adapt to.",
    identity: "PSEUDONYM",
    isPinned: false,
    daysAgo: 12,
    hoursAgo: 15,
  },
  {
    roomSlug: "body-changes",
    authorPseudonym: "QuietStorm42",
    title: "The bloating is unreal",
    body: "I look six months pregnant by the end of every day. I've eliminated dairy, gluten, and most of the joy from my diet. The bloating persists. My doctor says fluctuating hormones affect gut motility and water retention. Cool. Cool cool cool. I've started wearing stretchy waistbands exclusively. My work wardrobe is now 90% elastic.",
    identity: "PSEUDONYM",
    isPinned: false,
    daysAgo: 7,
    hoursAgo: 18,
  },
  {
    roomSlug: "body-changes",
    authorPseudonym: "TidalGrace",
    title: "Learning to love my postmenopausal body",
    body: "This took years. I'm not going to pretend it happened overnight. But at 58, I've made peace with the belly that appeared at 50, the thinner hair, the softer skin. This body carried me through the hardest transition of my life. It deserves gratitude, not criticism. I'm stronger than I was, not weaker. Just different. And different is not less.",
    identity: "PSEUDONYM",
    isPinned: false,
    daysAgo: 3,
    hoursAgo: 9,
  },

  // ── work-life (6 posts) ───────────────────────────────────────────────
  {
    roomSlug: "work-life",
    authorPseudonym: "QuietStorm42",
    title: "Brain fog in standup meetings is humiliating",
    body: "I'm a senior engineer. I've been doing this for 18 years. Yesterday in our daily standup I forgot the name of the project I'm leading. Just gone. I stood there for what felt like an eternity while my brain buffered. A junior dev filled in the blank for me. He was kind about it. I went to the bathroom and cried. I'm terrified my team thinks I'm losing it.",
    identity: "PSEUDONYM",
    isPinned: false,
    daysAgo: 24,
    hoursAgo: 7,
  },
  {
    roomSlug: "work-life",
    authorPseudonym: "GoldenThread",
    title: "Should I tell my boss? The disclosure dilemma.",
    body: "I'm a freelance writer. My deadlines are slipping because my brain won't cooperate. My biggest client asked if everything was okay. I almost told her. But then I imagined the mental calculation: 'She's unreliable now.' So I said I was dealing with a health issue and left it vague. I hate that I have to strategize around my own biology. I hate that telling the truth might cost me work.",
    identity: "PSEUDONYM",
    isPinned: false,
    daysAgo: 19,
    hoursAgo: 11,
  },
  {
    roomSlug: "work-life",
    authorPseudonym: "SteadyRain",
    title: "Teaching through the fog — tips from 3 years in",
    body: "I've developed systems. Everything gets written down immediately — if it's not on paper, it doesn't exist. I prep the night before, never the morning of. I keep a water bottle and a fan at my desk. I told my teaching partner what's going on and she covers for me when I need a minute. The biggest shift was accepting that I need systems now, not willpower. Systems don't have hot flashes.",
    identity: "PSEUDONYM",
    isPinned: false,
    daysAgo: 14,
    hoursAgo: 5,
  },
  {
    roomSlug: "work-life",
    authorPseudonym: "MoonlitSage",
    title: "I left my nursing career. I don't regret it.",
    body: "After 22 years in the ER, the night shifts became impossible with insomnia. The brain fog made me worry about patient safety. The fatigue was bone-deep. I transitioned to telehealth nursing — regular hours, working from home, no overnight shifts. My income dropped. My quality of life skyrocketed. Sometimes the bravest thing is admitting the old way isn't working anymore.",
    identity: "PSEUDONYM",
    isPinned: false,
    daysAgo: 10,
    hoursAgo: 16,
  },
  {
    roomSlug: "work-life",
    authorPseudonym: "CopperMoon",
    title: "Hot flash during a group fitness class I was TEACHING",
    body: "Face bright red. Sweat pouring down. In front of twenty people who are looking to me for energy and motivation. I just said 'That one was free — I wasn't even trying' and everyone laughed. Humor is my coping mechanism. But afterwards in the locker room I thought: how long can I keep performing wellness while my body is doing... this?",
    identity: "PSEUDONYM",
    isPinned: false,
    daysAgo: 5,
    hoursAgo: 13,
  },
  {
    roomSlug: "work-life",
    authorPseudonym: "NightOwl3am",
    title: "Requesting workplace accommodations — what are our rights?",
    body: "I finally asked HR for a desk fan and the ability to step out for five minutes when a flash hits. They said yes, but they looked at me like I was being dramatic. I'm in the UK where menopause is starting to be recognized as a workplace issue. But in practice? It still feels like asking for permission to be human. What have others asked for? What was granted? I want to know what's possible.",
    identity: "PSEUDONYM",
    isPinned: false,
    daysAgo: 1,
    hoursAgo: 14,
  },
];

// ============================================================================
// COMMENTS
// ============================================================================

interface SeedComment {
  postIndex: number; // index into POSTS array
  authorPseudonym: string;
  body: string;
  identity: "PSEUDONYM" | "ANONYMOUS";
  hoursAfterPost: number;
  parentCommentOffset?: number; // if set, this is a reply to the Nth comment on the same post (0-indexed)
}

const COMMENTS: SeedComment[] = [
  // ── Post 0: "The CEO noticed" (hot-flashes) ───────────────────────────
  { postIndex: 0, authorPseudonym: "NightOwl3am", body: "'Power surge' — I'm stealing this. I usually just stand there turning into a beet while pretending nothing is happening.", identity: "PSEUDONYM", hoursAfterPost: 2 },
  { postIndex: 0, authorPseudonym: "TidalGrace", body: "Three women messaging you afterwards is the most Periwink thing I've ever heard. We really are everywhere, just waiting for someone to go first.", identity: "PSEUDONYM", hoursAfterPost: 5 },
  { postIndex: 0, authorPseudonym: "QuietStorm42", body: "I had this happen during a code review. My face was on fire and my colleague asked if I was okay. I said 'yeah, I'm just really passionate about this pull request.' He believed me.", identity: "PSEUDONYM", hoursAfterPost: 8 },
  { postIndex: 0, authorPseudonym: "SteadyRain", body: "The fact that we have to develop cover stories for a normal biological process is... something.", identity: "PSEUDONYM", hoursAfterPost: 12 },
  { postIndex: 0, authorPseudonym: "WildSage", body: "I read once that Japanese women have far fewer hot flashes and one theory is diet. High soy intake. I started adding tofu and edamame and mine decreased slightly. Could be placebo. Could be soy. Worth trying.", identity: "PSEUDONYM", hoursAfterPost: 24 },

  // ── Post 1: "Hot flash tracker" (hot-flashes) ─────────────────────────
  { postIndex: 1, authorPseudonym: "MoonlitSage", body: "The 2-4pm cluster is so real. Mine are worst in the afternoon too. I wonder if cortisol plays a role since it peaks in the morning and drops in the afternoon.", identity: "PSEUDONYM", hoursAfterPost: 3 },
  { postIndex: 1, authorPseudonym: "NightOwl3am", body: "Alcohol is my biggest trigger too. Even half a glass of wine. It's cruel because wine used to be how I unwound. Now it just winds me up in a different way.", identity: "PSEUDONYM", hoursAfterPost: 6 },
  { postIndex: 1, authorPseudonym: "WildSage", body: "What app are you using to track? I've been using a spreadsheet but I'd love something more purpose-built.", identity: "PSEUDONYM", hoursAfterPost: 10 },
  { postIndex: 1, authorPseudonym: "CopperMoon", body: "I started tracking mine after reading this post. One week in and I can already see that sugar is a trigger. Why does everything good have to be a trigger?", identity: "PSEUDONYM", hoursAfterPost: 48 },

  // ── Post 2: "Night sweats destroyed my sheets" (hot-flashes) ──────────
  { postIndex: 2, authorPseudonym: "NightOwl3am", body: "The sheets are never just about the sheets. Sending you a hug.", identity: "PSEUDONYM", hoursAfterPost: 1 },
  { postIndex: 2, authorPseudonym: "SilverLining", body: "Bamboo sheets, love. They changed my life. They wick moisture and they feel like sleeping in a cloud. Your next sheets don't have to suffer like the last ones.", identity: "PSEUDONYM", hoursAfterPost: 4 },
  { postIndex: 2, authorPseudonym: "SteadyRain", body: "I keep a towel on my side of the bed now. It's not romantic but it saves the mattress. The glamour of perimenopause.", identity: "PSEUDONYM", hoursAfterPost: 7 },

  // ── Post 3: "Layering system" (hot-flashes) ───────────────────────────
  { postIndex: 3, authorPseudonym: "DesertRose", body: "The cooling towels tip is gold. I bought a pack of them for my yoga bag and they are a lifesaver between classes.", identity: "PSEUDONYM", hoursAfterPost: 2 },
  { postIndex: 3, authorPseudonym: "CopperMoon", body: "Bamboo base layer is the way. I also found some workout tops made of merino wool that regulate temperature surprisingly well.", identity: "PSEUDONYM", hoursAfterPost: 6 },
  { postIndex: 3, authorPseudonym: "GoldenThread", body: "I love that you've turned this into a system. Taking the chaos and making it manageable. That's a skill.", identity: "PSEUDONYM", hoursAfterPost: 14 },

  // ── Post 4: "Chill after the flash" (hot-flashes) ─────────────────────
  { postIndex: 4, authorPseudonym: "MoonlitSage", body: "You are absolutely not the only one. The flash is bad but the shivering after is worse. I carry a cardigan AND a fan. Prepared for all weather events on my own personal forecast.", identity: "PSEUDONYM", hoursAfterPost: 1 },
  { postIndex: 4, authorPseudonym: "DesertRose", body: "Yes! The chill is like your body overcorrects. Flash: volcano. Then immediately: arctic. I layer on, layer off, layer on. My husband calls it my costume changes.", identity: "PSEUDONYM", hoursAfterPost: 5 },
  { postIndex: 4, authorPseudonym: "WinterBloom", body: "Same here. I read that it's because the blood vessels dilate during the flash and then constrict rapidly after, which causes the chill. Your body is basically having a thermostat malfunction.", identity: "PSEUDONYM", hoursAfterPost: 9 },

  // ── Post 5: "My students think I'm nervous" (hot-flashes) ─────────────
  { postIndex: 5, authorPseudonym: "GoldenThread", body: "Teaching through it is heroic. Genuinely. You're doing this on hard mode every single day.", identity: "PSEUDONYM", hoursAfterPost: 2 },
  { postIndex: 5, authorPseudonym: "TidalGrace", body: "I was a teacher too. The performance aspect — having to be 'on' while your body does its own thing — is exhausting. You're doing amazing.", identity: "PSEUDONYM", hoursAfterPost: 7 },
  { postIndex: 5, authorPseudonym: "MoonlitSage", body: "'Power surge' is becoming the official Periwink term and I love it. Claiming our experience instead of hiding it.", identity: "PSEUDONYM", hoursAfterPost: 12 },

  // ── Post 6: "Is this a hot flash" (hot-flashes) ──────────────────────
  { postIndex: 6, authorPseudonym: "SilverLining", body: "That sounds exactly like how mine started. Subtle warmth, not the dramatic drenching kind. It builds over time for many of us. Welcome to the club nobody wanted to join.", identity: "PSEUDONYM", hoursAfterPost: 1 },
  { postIndex: 6, authorPseudonym: "CopperMoon", body: "Mine started exactly like that at 42. Internal radiator is a perfect description. Two years later they're more intense, but they started subtle.", identity: "PSEUDONYM", hoursAfterPost: 4 },

  // ── Post 7: "4:17am again" (sleep) ────────────────────────────────────
  { postIndex: 7, authorPseudonym: "MoonlitSage", body: "I'm up right now reading this. 3:42am. The solidarity of insomnia. Knowing someone else is awake too actually helps more than I expected.", identity: "PSEUDONYM", hoursAfterPost: 1 },
  { postIndex: 7, authorPseudonym: "GoldenThread", body: "'My husband sleeps like he's being paid for it.' I just laughed so hard I might have woken up mine. The journal is a beautiful idea. Turn the wreckage into writing.", identity: "PSEUDONYM", hoursAfterPost: 3 },
  { postIndex: 7, authorPseudonym: "SteadyRain", body: "Same time for me — somewhere between 3 and 4am. Every single night. My body has decided this is the new schedule and nobody consulted me.", identity: "PSEUDONYM", hoursAfterPost: 8 },
  { postIndex: 7, authorPseudonym: "WinterBloom", body: "Hello from 2am in New Zealand. We should start a global insomnia relay. Someone is always up somewhere.", identity: "PSEUDONYM", hoursAfterPost: 14 },
  { postIndex: 7, authorPseudonym: "TidalGrace", body: "The journal is a wonderful idea. Some of my best self-knowledge came from those sleepless nights. Not a silver lining exactly, but a thread of something.", identity: "PSEUDONYM", hoursAfterPost: 20 },

  // ── Post 8: "Sleep hygiene tips" (sleep) ──────────────────────────────
  { postIndex: 8, authorPseudonym: "NightOwl3am", body: "Magnesium glycinate is the one that finally made a difference for me too. The form matters — oxide did nothing. Glycinate is the one for sleep.", identity: "PSEUDONYM", hoursAfterPost: 2 },
  { postIndex: 8, authorPseudonym: "WildSage", body: "No screens after 9pm is SO hard but it works. I started reading actual paper books and my sleep onset improved within a week.", identity: "PSEUDONYM", hoursAfterPost: 5 },
  { postIndex: 8, authorPseudonym: "DesertRose", body: "65F is the magic number for me too. My husband thinks we live in an igloo. I tell him to put on a sweater. I'm not turning that thermostat up.", identity: "PSEUDONYM", hoursAfterPost: 11 },
  { postIndex: 8, authorPseudonym: "VelvetDusk", body: "How long did it take to notice a difference with the magnesium? I've been taking it for a week and nothing yet.", identity: "PSEUDONYM", hoursAfterPost: 24 },
  { postIndex: 8, authorPseudonym: "QuietStorm42", body: "Took about two weeks for me. Give it time. And make sure you're taking glycinate, not oxide or citrate. The form really matters.", identity: "PSEUDONYM", hoursAfterPost: 26, parentCommentOffset: 3 },

  // ── Post 9: "Anxiety-insomnia loop" (sleep) ───────────────────────────
  { postIndex: 9, authorPseudonym: "WinterBloom", body: "CBT-I (cognitive behavioral therapy for insomnia) helped me break this cycle. It's specifically designed for the anxiety-insomnia loop. Ask your doctor for a referral — it's more effective than sleeping pills long-term.", identity: "PSEUDONYM", hoursAfterPost: 3 },
  { postIndex: 9, authorPseudonym: "SilverLining", body: "The nurse in you describing the feedback loop while the woman in you just wants to sleep — that duality is so perfectly put. You're allowed to just be the woman sometimes.", identity: "PSEUDONYM", hoursAfterPost: 8 },
  { postIndex: 9, authorPseudonym: "GoldenThread", body: "Body scan meditations. They don't always work but when they do, it's like a gentle off switch. The Yoga Nidra ones are especially good.", identity: "PSEUDONYM", hoursAfterPost: 15 },

  // ── Post 10: "Separate bedrooms" (sleep) ──────────────────────────────
  { postIndex: 10, authorPseudonym: "SteadyRain", body: "I've been thinking about this but felt too guilty to suggest it. Thank you for normalizing it. The guilt of waking them up is its own stress layer.", identity: "PSEUDONYM", hoursAfterPost: 2 },
  { postIndex: 10, authorPseudonym: "MoonlitSage", body: "This is genuinely one of the best things a couple can do. Sleep deprivation makes everything worse — mood, patience, intimacy. Getting good sleep separately is better than bad sleep together.", identity: "PSEUDONYM", hoursAfterPost: 6 },
  { postIndex: 10, authorPseudonym: "NightOwl3am", body: "We did this three months ago and my husband actually thanked me. He was suffering too and neither of us wanted to say it. Best. Decision. Ever.", identity: "PSEUDONYM", hoursAfterPost: 12 },

  // ── Post 11: "Poem at 3am" (sleep) ────────────────────────────────────
  { postIndex: 11, authorPseudonym: "MoonlitSage", body: "Post the poem. Please. I want to read it.", identity: "PSEUDONYM", hoursAfterPost: 2 },
  { postIndex: 11, authorPseudonym: "TidalGrace", body: "There IS a gift in it. I know that sounds maddening. But some of my deepest personal growth happened in those quiet hours. The stillness forced me to listen to myself.", identity: "PSEUDONYM", hoursAfterPost: 7 },
  { postIndex: 11, authorPseudonym: "VelvetDusk", body: "Or maybe I'm just delirious — this made me laugh out loud. The honesty in your writing, even here, is beautiful. You're not delirious. You're awake in more ways than one.", identity: "PSEUDONYM", hoursAfterPost: 14 },

  // ── Post 12: "Waking up drenched" (sleep) ─────────────────────────────
  { postIndex: 12, authorPseudonym: "NightOwl3am", body: "Two sets of pajamas. I feel this in my bones. I keep a clean set on the nightstand like a firefighter keeps their gear ready. Quick change in the dark.", identity: "PSEUDONYM", hoursAfterPost: 1 },
  { postIndex: 12, authorPseudonym: "WinterBloom", body: "Forgetting the parent's name — that's the fatigue talking. Be gentle with yourself. You're running on fumes and still showing up. That counts for so much.", identity: "PSEUDONYM", hoursAfterPost: 5 },

  // ── Post 13: "It does get better" (sleep) ─────────────────────────────
  { postIndex: 13, authorPseudonym: "NightOwl3am", body: "I needed to hear this today. 49-52 being the worst years and you're sleeping well at 58. I'm going to bookmark this and read it at 3am.", identity: "PSEUDONYM", hoursAfterPost: 2 },
  { postIndex: 13, authorPseudonym: "MoonlitSage", body: "Thank you for coming back to tell us. So many people get through it and move on. The fact that you stayed to hold the flashlight for the rest of us means everything.", identity: "PSEUDONYM", hoursAfterPost: 6 },
  { postIndex: 13, authorPseudonym: "SteadyRain", body: "Crying reading this. Not sad crying. The other kind. Thank you.", identity: "PSEUDONYM", hoursAfterPost: 10 },
  { postIndex: 13, authorPseudonym: "GoldenThread", body: "This is why this community matters. Not just the commiseration — the hope. We need both.", identity: "PSEUDONYM", hoursAfterPost: 18 },

  // ── Post 14: "Three months on estradiol" (hrt) ────────────────────────
  { postIndex: 14, authorPseudonym: "MoonlitSage", body: "'Like someone cleaned a window I didn't know was dirty.' That is the most perfect description of brain fog lifting I have ever read. I'm saving this.", identity: "PSEUDONYM", hoursAfterPost: 1 },
  { postIndex: 14, authorPseudonym: "NightOwl3am", body: "This is making me seriously reconsider my resistance to HRT. The sleep coming back alone would be worth it. How long before the sleep improved?", identity: "PSEUDONYM", hoursAfterPost: 4 },
  { postIndex: 14, authorPseudonym: "QuietStorm42", body: "About two to three weeks for sleep. The brain fog took the full six weeks. Every body is different but for me, it was like watching someone slowly turn the lights back on.", identity: "PSEUDONYM", hoursAfterPost: 5, parentCommentOffset: 1 },
  { postIndex: 14, authorPseudonym: "SilverLining", body: "I was on estradiol for seven years and it gave me my life back. The relief you're feeling? That's not a side effect. That's you getting yourself back.", identity: "PSEUDONYM", hoursAfterPost: 12 },
  { postIndex: 14, authorPseudonym: "DesertRose", body: "The crying from relief, not sadness. I know that cry. It's the sound of someone finally being heard by their own body.", identity: "PSEUDONYM", hoursAfterPost: 20 },

  // ── Post 15: "HRT as a nurse" (hrt) ───────────────────────────────────
  { postIndex: 15, authorPseudonym: "QuietStorm42", body: "The 2002 study did so much damage. An entire generation of women suffered because of how it was reported. Thank you for putting the nuance back.", identity: "PSEUDONYM", hoursAfterPost: 3 },
  { postIndex: 15, authorPseudonym: "TidalGrace", body: "I delayed HRT by three years because of that study. Three years of unnecessary suffering because I was scared. The updated research changed my mind. Better late than never.", identity: "PSEUDONYM", hoursAfterPost: 8 },
  { postIndex: 15, authorPseudonym: "WildSage", body: "This is exactly the kind of informed, balanced perspective we need more of. Not 'HRT is bad' or 'HRT fixes everything' — just honest information.", identity: "PSEUDONYM", hoursAfterPost: 14 },

  // ── Post 16: "Doctor dismissed me" (hrt) ──────────────────────────────
  { postIndex: 16, authorPseudonym: "CopperMoon", body: "Three dismissals before being heard. This makes me furious on your behalf. 'Try yoga' — as if downward dog cures hormone depletion.", identity: "PSEUDONYM", hoursAfterPost: 2 },
  { postIndex: 16, authorPseudonym: "DesertRose", body: "I actually AM a yoga teacher and even I know yoga doesn't fix this. The dismissal of women's symptoms by the medical establishment is a systemic failure, not a personal one.", identity: "PSEUDONYM", hoursAfterPost: 5, parentCommentOffset: 0 },
  { postIndex: 16, authorPseudonym: "GoldenThread", body: "If your doctor isn't listening, find another one. You deserve to be heard. I'm putting this on a sticky note on my bathroom mirror.", identity: "PSEUDONYM", hoursAfterPost: 9 },
  { postIndex: 16, authorPseudonym: "SilverLining", body: "I went through FIVE doctors. Five. The fifth one was a menopause specialist and she changed my life in one appointment. Seek out specialists — they exist and they believe you.", identity: "PSEUDONYM", hoursAfterPost: 18 },

  // ── Post 17: "Patches vs pills" (hrt) ─────────────────────────────────
  { postIndex: 17, authorPseudonym: "QuietStorm42", body: "Patches peeling off in the shower is my weekly comedy routine. I put mine on my lower abdomen and it stays better there than my hip. Also: Tegaderm over the patch. Waterproof and it keeps it in place.", identity: "PSEUDONYM", hoursAfterPost: 3 },
  { postIndex: 17, authorPseudonym: "MoonlitSage", body: "Patches bypass the liver, which is why there's less nausea and lower blood clot risk compared to oral. The delivery method matters more than people realize.", identity: "PSEUDONYM", hoursAfterPost: 7 },
  { postIndex: 17, authorPseudonym: "WildSage", body: "Good to know about the steadier levels. I've been curious about patches vs. pills. This is really helpful.", identity: "PSEUDONYM", hoursAfterPost: 15 },

  // ── Post 18: "Coming off HRT" (hrt) ───────────────────────────────────
  { postIndex: 18, authorPseudonym: "MoonlitSage", body: "Thank you for documenting the coming-off experience. You're right — there's almost no information about this part. Everyone talks about starting, nobody talks about stopping.", identity: "PSEUDONYM", hoursAfterPost: 4 },
  { postIndex: 18, authorPseudonym: "SilverLining", body: "I tapered over six months and had a very smooth transition. Slow and steady is key. Don't let anyone tell you to stop cold turkey.", identity: "PSEUDONYM", hoursAfterPost: 10 },

  // ── Post 19: "Testosterone" (hrt) ─────────────────────────────────────
  { postIndex: 19, authorPseudonym: "SteadyRain", body: "The vanishing libido switch — that's exactly how it happened for me too. One day it was there, the next... nothing. I didn't know testosterone was an option for women. Asking my doctor at my next appointment.", identity: "PSEUDONYM", hoursAfterPost: 2 },
  { postIndex: 19, authorPseudonym: "WildSage", body: "The energy improvement is something I keep hearing about from women on low-dose T. Why ISN'T this discussed more? Because it's a 'male' hormone? The stigma is holding back treatment.", identity: "PSEUDONYM", hoursAfterPost: 6 },
  { postIndex: 19, authorPseudonym: "NightOwl3am", body: "Crying halfway through a workout — I've been there. Glad you found something that helps. The gym is supposed to give us energy, not take the last of it.", identity: "PSEUDONYM", hoursAfterPost: 12 },

  // ── Post 20: "Snapped at my daughter" (mood) ──────────────────────────
  { postIndex: 20, authorPseudonym: "SteadyRain", body: "The shoes. It's always something tiny that breaks the dam. I lost it over a cabinet left open last week. My son looked at me the same way. The guilt afterward is almost worse than the rage.", identity: "PSEUDONYM", hoursAfterPost: 2 },
  { postIndex: 20, authorPseudonym: "NightOwl3am", body: "You apologized. That matters more than you know. Kids remember the repair more than the rupture. You're a good mom having a hard time.", identity: "PSEUDONYM", hoursAfterPost: 5 },
  { postIndex: 20, authorPseudonym: "SilverLining", body: "I went through this with my daughter too. She's 25 now and she told me recently that she understood, even then. Not fully, but enough. Your daughter sees more than you think.", identity: "PSEUDONYM", hoursAfterPost: 10 },
  { postIndex: 20, authorPseudonym: "TidalGrace", body: "The honesty in this post — 'I am, a little' — is the bravest kind of self-awareness. You're not a stranger to her. You're her mom going through something. The love is still there.", identity: "PSEUDONYM", hoursAfterPost: 18 },
  { postIndex: 20, authorPseudonym: "VelvetDusk", body: "I've been lurking for weeks and this is the first post that made me cry. In a good way. Thank you for saying what I couldn't.", identity: "ANONYMOUS", hoursAfterPost: 30 },

  // ── Post 21: "Brain fog losing my mind" (mood) ────────────────────────
  { postIndex: 21, authorPseudonym: "MoonlitSage", body: "The dementia worry is real and it's terrifying. I had the same fear. Getting it named — perimenopause, not dementia — was one of the most relieving moments of my life.", identity: "PSEUDONYM", hoursAfterPost: 3 },
  { postIndex: 21, authorPseudonym: "GoldenThread", body: "Opening a file and forgetting why — I do this with browser tabs. I'll have 30 open and not know what any of them are for. My brain is chrome and it's run out of RAM.", identity: "PSEUDONYM", hoursAfterPost: 7 },
  { postIndex: 21, authorPseudonym: "NightOwl3am", body: "Same. Just... same.", identity: "PSEUDONYM", hoursAfterPost: 12 },

  // ── Post 22: "The grief nobody warns you about" (mood) ────────────────
  { postIndex: 22, authorPseudonym: "GoldenThread", body: "The grocery store parking lot cry. I've had that cry. The cry that isn't about anything and everything at the same time. You put words to something I couldn't.", identity: "PSEUDONYM", hoursAfterPost: 2 },
  { postIndex: 22, authorPseudonym: "TidalGrace", body: "It IS grief. And it deserves to be honored as such. You're mourning a version of yourself. That's not weak — that's human.", identity: "PSEUDONYM", hoursAfterPost: 6 },
  { postIndex: 22, authorPseudonym: "WinterBloom", body: "Nobody prepared me for the emotional weight. That's the exact phrase. It's not just physical symptoms — it's an existential shift and we're supposed to just carry on like normal.", identity: "PSEUDONYM", hoursAfterPost: 12 },
  { postIndex: 22, authorPseudonym: "DesertRose", body: "I cried reading this and I'm not even sure why. Maybe because someone finally named the thing I've been feeling. The grief underneath all the symptoms.", identity: "PSEUDONYM", hoursAfterPost: 24 },

  // ── Post 23: "Anxiety at 48" (mood) ───────────────────────────────────
  { postIndex: 23, authorPseudonym: "QuietStorm42", body: "I was the calm one too. Rock solid. Now I check that I turned off the stove five times before leaving the house. The identity shift is almost harder than the anxiety itself.", identity: "PSEUDONYM", hoursAfterPost: 3 },
  { postIndex: 23, authorPseudonym: "MoonlitSage", body: "Estrogen helps regulate serotonin and GABA — both anti-anxiety neurotransmitters. When estrogen drops, anxiety can spike even if you've never experienced it before. It's not psychological — it's biochemical.", identity: "PSEUDONYM", hoursAfterPost: 8 },
  { postIndex: 23, authorPseudonym: "SilverLining", body: "This was my worst symptom. Worse than the hot flashes, worse than the insomnia. New-onset anxiety at 50 felt like betrayal by my own nervous system. HRT helped me enormously. So did therapy.", identity: "PSEUDONYM", hoursAfterPost: 16 },

  // ── Post 24: "Depressed or perimenopause" (mood) ──────────────────────
  { postIndex: 24, authorPseudonym: "MoonlitSage", body: "It can be both, and treating the hormonal piece often helps the mood piece. Ask about getting your hormone levels checked before committing to an SSRI. Not because SSRIs are bad — they're not — but because treating the root cause might be more effective.", identity: "PSEUDONYM", hoursAfterPost: 3 },
  { postIndex: 24, authorPseudonym: "SteadyRain", body: "The grey kind of depression. Not dramatic, just grey. That's exactly it. Everything is beige. I miss color.", identity: "PSEUDONYM", hoursAfterPost: 7 },
  { postIndex: 24, authorPseudonym: "WildSage", body: "I was in this exact spot six months ago. My doctor tested my hormones first, then we decided together. Having data helped me feel less lost.", identity: "PSEUDONYM", hoursAfterPost: 14 },

  // ── Post 25: "Other side of mood storms" (mood) ───────────────────────
  { postIndex: 25, authorPseudonym: "NightOwl3am", body: "The mood storms pass. I'm going to hold onto that sentence like a life raft. Thank you.", identity: "PSEUDONYM", hoursAfterPost: 2 },
  { postIndex: 25, authorPseudonym: "WinterBloom", body: "Not numb — alive. That distinction matters so much. I don't want to not feel things. I just want to feel them at a manageable volume.", identity: "PSEUDONYM", hoursAfterPost: 8 },
  { postIndex: 25, authorPseudonym: "GoldenThread", body: "More emotionally stable than in decades. This gives me so much hope. I'm saving this post for the hard days.", identity: "PSEUDONYM", hoursAfterPost: 15 },

  // ── Post 26: "The rage" (mood) ────────────────────────────────────────
  { postIndex: 26, authorPseudonym: "QuietStorm42", body: "Netflix asking if you're still watching as a rage trigger is the most relatable thing I've read this month. The audacity of that question when you're already on edge.", identity: "PSEUDONYM", hoursAfterPost: 1 },
  { postIndex: 26, authorPseudonym: "GoldenThread", body: "Incandescent rage that rises from your chest like lava. You should be a writer. Actually, are you? Because that sentence is extraordinary.", identity: "PSEUDONYM", hoursAfterPost: 4 },
  { postIndex: 26, authorPseudonym: "SteadyRain", body: "Everything is fuel right now. Yes. Everything. The way my husband breathes. The sound of my own chewing. Things that never bothered me before are suddenly intolerable.", identity: "PSEUDONYM", hoursAfterPost: 9 },
  { postIndex: 26, authorPseudonym: "DesertRose", body: "I punched a pillow so hard last week I hurt my wrist. Then I laughed because how do you explain that injury? 'The throw pillow had it coming' wasn't going to work at urgent care.", identity: "PSEUDONYM", hoursAfterPost: 14 },

  // ── Post 27: "Supplement stack" (supplements) ─────────────────────────
  { postIndex: 27, authorPseudonym: "NightOwl3am", body: "Magnesium glycinate before bed is the one supplement I recommend to everyone. It doesn't solve everything but it makes the edges softer.", identity: "PSEUDONYM", hoursAfterPost: 3 },
  { postIndex: 27, authorPseudonym: "CopperMoon", body: "How do you take ashwagandha — morning or evening? I've heard conflicting advice.", identity: "PSEUDONYM", hoursAfterPost: 7 },
  { postIndex: 27, authorPseudonym: "WildSage", body: "I take it in the evening because it helps with my anxiety and sleep. Some people take it morning for energy. You might need to experiment.", identity: "PSEUDONYM", hoursAfterPost: 9, parentCommentOffset: 1 },
  { postIndex: 27, authorPseudonym: "TidalGrace", body: "Vitamin D was a game changer for me too. So many women are deficient and don't know it. Get your levels tested — you might be surprised.", identity: "PSEUDONYM", hoursAfterPost: 16 },

  // ── Post 28: "Adaptogens" (supplements) ───────────────────────────────
  { postIndex: 28, authorPseudonym: "WildSage", body: "I had the same experience with rhodiola — energy up but anxiety through the roof. Had to stop after a week.", identity: "PSEUDONYM", hoursAfterPost: 3 },
  { postIndex: 28, authorPseudonym: "MoonlitSage", body: "The symptom journal advice is so important. We convince ourselves things work when we want them to. Data doesn't lie.", identity: "PSEUDONYM", hoursAfterPost: 8 },
  { postIndex: 28, authorPseudonym: "VelvetDusk", body: "This is exactly the honest review I was looking for. Not 'everything natural is amazing' — just real experience. Thank you.", identity: "PSEUDONYM", hoursAfterPost: 16 },

  // ── Post 29: "Creatine" (supplements) ─────────────────────────────────
  { postIndex: 29, authorPseudonym: "WildSage", body: "There's actually emerging research on creatine for brain health in women. It's not just for bodybuilders anymore. I'm going to look into this.", identity: "PSEUDONYM", hoursAfterPost: 4 },
  { postIndex: 29, authorPseudonym: "QuietStorm42", body: "I started creatine two months ago. Workout recovery is definitely better. Too early to say on the cognitive stuff but I'm hopeful.", identity: "PSEUDONYM", hoursAfterPost: 10 },

  // ── Post 30: "Supplements at 58" (supplements) ────────────────────────
  { postIndex: 30, authorPseudonym: "MoonlitSage", body: "Your supplement needs change with your stage — this is so important and nobody says it. What you need at 45 is different from what you need at 55.", identity: "PSEUDONYM", hoursAfterPost: 3 },
  { postIndex: 30, authorPseudonym: "SteadyRain", body: "I forget about bone health because it's not something you feel. Thanks for the reminder to prioritize calcium and D3.", identity: "PSEUDONYM", hoursAfterPost: 8 },
  { postIndex: 30, authorPseudonym: "WildSage", body: "Collagen peptides have helped my joint pain too. The science might be mixed but my knees disagree with the skeptics.", identity: "PSEUDONYM", hoursAfterPost: 15 },

  // ── Post 31: "Check for interactions" (supplements) ───────────────────
  { postIndex: 31, authorPseudonym: "TidalGrace", body: "This should be pinned in every supplement discussion. St. John's Wort interactions are no joke — it can interfere with blood thinners, birth control, antidepressants, and more.", identity: "PSEUDONYM", hoursAfterPost: 2 },
  { postIndex: 31, authorPseudonym: "DesertRose", body: "Thank you for this PSA. I had no idea about the interaction potential. Just texted my pharmacist.", identity: "PSEUDONYM", hoursAfterPost: 6 },

  // ── Post 32: "Seed cycling" (supplements) ─────────────────────────────
  { postIndex: 32, authorPseudonym: "MoonlitSage", body: "The nurse in me says the evidence is thin. The woman in me says if it's not harmful and you feel better, does it matter if it's placebo? Placebo is still a response.", identity: "PSEUDONYM", hoursAfterPost: 3 },
  { postIndex: 32, authorPseudonym: "DesertRose", body: "I tried it for two months. Didn't notice much for cycle regularity but I was eating more seeds which is probably good for me anyway.", identity: "PSEUDONYM", hoursAfterPost: 8 },

  // ── Post 33: "Husband thinks I'm pushing him away" (relationships) ────
  { postIndex: 33, authorPseudonym: "GoldenThread", body: "My skin feels like it belongs to someone else. I've never heard anyone say that before but it's exactly right. The sensory overwhelm is real and it's not about love.", identity: "PSEUDONYM", hoursAfterPost: 2 },
  { postIndex: 33, authorPseudonym: "SteadyRain", body: "The crying together. That's not pushing away — that's moving through something together. Even when it's messy. Especially when it's messy.", identity: "PSEUDONYM", hoursAfterPost: 6 },
  { postIndex: 33, authorPseudonym: "TidalGrace", body: "I went through this with my husband. The other side of it is a deeper intimacy than we had before. Vulnerability builds connection when both people stay in the room.", identity: "PSEUDONYM", hoursAfterPost: 14 },

  // ── Post 34: "Telling my partner" (relationships) ─────────────────────
  { postIndex: 34, authorPseudonym: "NightOwl3am", body: "The notes! I do this too. Sometimes it's easier to write 'I need quiet tonight but I'm not angry at you' than to say it out loud when my nerves are fried.", identity: "PSEUDONYM", hoursAfterPost: 3 },
  { postIndex: 34, authorPseudonym: "SilverLining", body: "Some days both at the same time — needing space and closeness simultaneously. That's not confusing, that's human. Your partner doesn't need to fix it. He just needs to be there.", identity: "PSEUDONYM", hoursAfterPost: 9 },

  // ── Post 35: "The libido conversation" (relationships) ────────────────
  { postIndex: 35, authorPseudonym: "CopperMoon", body: "This isn't about you. Something is physically different. That's the sentence that changes the conversation. It takes the blame out and puts the biology in.", identity: "PSEUDONYM", hoursAfterPost: 2 },
  { postIndex: 35, authorPseudonym: "WinterBloom", body: "Working with it instead of around it — that's the goal. Thank you for posting this anonymously. These conversations are hard enough without an audience.", identity: "PSEUDONYM", hoursAfterPost: 7 },
  { postIndex: 35, authorPseudonym: "MoonlitSage", body: "From a medical perspective: vaginal estrogen is specifically for this and it's local, not systemic. If dryness is part of the issue, ask your doctor. It can make a huge difference.", identity: "PSEUDONYM", hoursAfterPost: 12 },

  // ── Post 36: "Friendships changed" (relationships) ────────────────────
  { postIndex: 36, authorPseudonym: "MoonlitSage", body: "Menopause is a filter. What survives it is real. I want this on a t-shirt.", identity: "PSEUDONYM", hoursAfterPost: 2 },
  { postIndex: 36, authorPseudonym: "GoldenThread", body: "The friends who say 'just think positive' — they mean well but they're not safe to be honest with. I've learned the difference between supportive and performatively supportive.", identity: "PSEUDONYM", hoursAfterPost: 7 },
  { postIndex: 36, authorPseudonym: "NightOwl3am", body: "My circle got smaller and deeper. I'm okay with that now. Quality over quantity hits different in your late 40s.", identity: "PSEUDONYM", hoursAfterPost: 15 },

  // ── Post 37: "Single and going through this alone" (relationships) ────
  { postIndex: 37, authorPseudonym: "TidalGrace", body: "You named something important. The loneliness of solo menopause doesn't get talked about. This community exists for exactly this. You're not alone at 3am even when you're alone at 3am.", identity: "PSEUDONYM", hoursAfterPost: 2 },
  { postIndex: 37, authorPseudonym: "SilverLining", body: "I was single through most of mine. You develop a self-reliance that becomes a superpower on the other side. But it's hard in the middle. So hard. Be gentle with yourself.", identity: "PSEUDONYM", hoursAfterPost: 8 },
  { postIndex: 37, authorPseudonym: "WinterBloom", body: "The 3am wake-ups with nobody to talk to — I feel this even with a partner in the next room. Loneliness in menopause has many faces. Yours is valid.", identity: "PSEUDONYM", hoursAfterPost: 14 },

  // ── Post 38: "Teenager doesn't understand" (relationships) ────────────
  { postIndex: 38, authorPseudonym: "GoldenThread", body: "Two people in the same house both at the mercy of their hormones. There's a memoir in here somewhere. Probably a bestseller.", identity: "PSEUDONYM", hoursAfterPost: 3 },
  { postIndex: 38, authorPseudonym: "SilverLining", body: "She's not giving me a hard time, she's having a hard time. I wish I'd had this perspective when my kids were teenagers. You're more self-aware than you think.", identity: "PSEUDONYM", hoursAfterPost: 8 },

  // ── Post 39: "Fitness instructor gained 15 pounds" (body-changes) ─────
  { postIndex: 39, authorPseudonym: "DesertRose", body: "You're not a fraud. Your body changed the rules and you're learning the new ones. That takes more strength than any workout.", identity: "PSEUDONYM", hoursAfterPost: 3 },
  { postIndex: 39, authorPseudonym: "WildSage", body: "The midsection weight gain is estrogen-related. As estrogen drops, fat distribution shifts to the abdomen. It's not about willpower or effort. It's hormones.", identity: "PSEUDONYM", hoursAfterPost: 7 },
  { postIndex: 39, authorPseudonym: "SilverLining", body: "I fought the weight for three years before accepting it. Then I shifted my focus from how I looked to how I felt. That was the turning point.", identity: "PSEUDONYM", hoursAfterPost: 14 },

  // ── Post 40: "Hair thinning" (body-changes) ──────────────────────────
  { postIndex: 40, authorPseudonym: "WinterBloom", body: "The shower drain. Every morning. I thought it was stress. Turns out estrogen is involved in hair growth too. Nobody tells you this.", identity: "PSEUDONYM", hoursAfterPost: 2 },
  { postIndex: 40, authorPseudonym: "TidalGrace", body: "Mine thinned significantly between 50 and 54, then stabilized. It didn't come back to what it was, but it stopped falling. Biotin and being gentle with it helped.", identity: "PSEUDONYM", hoursAfterPost: 8 },
  { postIndex: 40, authorPseudonym: "CopperMoon", body: "I don't look like me anymore. This hit hard. The mirror shows someone you don't recognize. It gets better as you start seeing the new you instead of mourning the old one.", identity: "PSEUDONYM", hoursAfterPost: 15 },

  // ── Post 41: "Joint pain" (body-changes) ──────────────────────────────
  { postIndex: 41, authorPseudonym: "MoonlitSage", body: "Estrogen is anti-inflammatory — this is one of the most under-discussed aspects of menopause. Joint pain, frozen shoulder, carpal tunnel — all can be perimenopause related.", identity: "PSEUDONYM", hoursAfterPost: 3 },
  { postIndex: 41, authorPseudonym: "SteadyRain", body: "My hands in the morning! I couldn't open jars. I thought I was getting arthritis. It improved significantly after starting HRT.", identity: "PSEUDONYM", hoursAfterPost: 8 },

  // ── Post 42: "Skin changed overnight" (body-changes) ─────────────────
  { postIndex: 42, authorPseudonym: "WildSage", body: "Hyaluronic acid serum before moisturizer made a noticeable difference for me. Also drinking way more water. My skin was basically begging for hydration.", identity: "PSEUDONYM", hoursAfterPost: 4 },
  { postIndex: 42, authorPseudonym: "CopperMoon", body: "Another thing to mourn and then adapt to — you keep saying the quiet part out loud and I appreciate it every time.", identity: "PSEUDONYM", hoursAfterPost: 10 },

  // ── Post 43: "Bloating is unreal" (body-changes) ─────────────────────
  { postIndex: 43, authorPseudonym: "NightOwl3am", body: "My work wardrobe is now 90% elastic. I feel seen. Elastic waistbands are not giving up — they're adapting. Like us.", identity: "PSEUDONYM", hoursAfterPost: 2 },
  { postIndex: 43, authorPseudonym: "DesertRose", body: "Peppermint tea and digestive enzymes have helped my bloating a bit. Also reducing sodium. But honestly some days nothing works and I just ride it out.", identity: "PSEUDONYM", hoursAfterPost: 7 },
  { postIndex: 43, authorPseudonym: "MoonlitSage", body: "Gut motility changes are so overlooked. Estrogen affects the GI tract too. Probiotics might help — look for strains specifically studied for bloating.", identity: "PSEUDONYM", hoursAfterPost: 13 },

  // ── Post 44: "Loving postmenopausal body" (body-changes) ──────────────
  { postIndex: 44, authorPseudonym: "NightOwl3am", body: "This body carried me through the hardest transition of my life. I'm going to sit with that sentence for a while. Thank you.", identity: "PSEUDONYM", hoursAfterPost: 2 },
  { postIndex: 44, authorPseudonym: "MoonlitSage", body: "Different is not less. Four words that reframe everything. You should write a book. Seriously.", identity: "PSEUDONYM", hoursAfterPost: 7 },
  { postIndex: 44, authorPseudonym: "WinterBloom", body: "It deserves gratitude, not criticism. I'm learning this. Slowly. Posts like yours make it easier.", identity: "PSEUDONYM", hoursAfterPost: 14 },

  // ── Post 45: "Brain fog in standup" (work-life) ──────────────────────
  { postIndex: 45, authorPseudonym: "GoldenThread", body: "A junior dev filling in the blank for you and being kind about it — that's the best of humanity. Also, you are not losing it. Your brain is temporarily under-resourced. That's different.", identity: "PSEUDONYM", hoursAfterPost: 2 },
  { postIndex: 45, authorPseudonym: "MoonlitSage", body: "Please look into whether HRT might help. Brain fog was the symptom that responded fastest for many women. You don't have to white-knuckle this.", identity: "PSEUDONYM", hoursAfterPost: 6 },
  { postIndex: 45, authorPseudonym: "NightOwl3am", body: "18 years of experience doesn't disappear because you blanked on a project name. Your team knows your value. The fog is lying to you about your competence.", identity: "PSEUDONYM", hoursAfterPost: 12 },

  // ── Post 46: "Disclosure dilemma" (work-life) ─────────────────────────
  { postIndex: 46, authorPseudonym: "QuietStorm42", body: "I strategize around my biology every single day. What to disclose, what to hide, how to compensate. The emotional labor of concealment is its own full-time job.", identity: "PSEUDONYM", hoursAfterPost: 3 },
  { postIndex: 46, authorPseudonym: "SteadyRain", body: "I told my teaching partner and it was the best decision. But she's a friend, not a client. The calculus is different for freelancers. Your instinct to protect yourself is valid.", identity: "PSEUDONYM", hoursAfterPost: 8 },
  { postIndex: 46, authorPseudonym: "TidalGrace", body: "The fact that telling the truth about a natural biological process could cost you work is the actual problem here. Not you. The system.", identity: "PSEUDONYM", hoursAfterPost: 16 },

  // ── Post 47: "Teaching through the fog" (work-life) ───────────────────
  { postIndex: 47, authorPseudonym: "QuietStorm42", body: "Systems don't have hot flashes. I'm stealing this for my engineering team's process documentation. Also, it's genuinely great advice.", identity: "PSEUDONYM", hoursAfterPost: 2 },
  { postIndex: 47, authorPseudonym: "MoonlitSage", body: "Writing everything down immediately — this is survival strategy and it works. I do the same thing. My notebook is my external brain.", identity: "PSEUDONYM", hoursAfterPost: 7 },

  // ── Post 48: "Left nursing career" (work-life) ────────────────────────
  { postIndex: 48, authorPseudonym: "SteadyRain", body: "The bravest thing is admitting the old way isn't working. This applies to so much more than careers. Thank you for sharing this.", identity: "PSEUDONYM", hoursAfterPost: 3 },
  { postIndex: 48, authorPseudonym: "SilverLining", body: "Income dropped, quality of life skyrocketed. That trade-off is real and it's valid. Not everyone can make it, but those who can shouldn't feel guilty about it.", identity: "PSEUDONYM", hoursAfterPost: 9 },
  { postIndex: 48, authorPseudonym: "WildSage", body: "Worrying about patient safety because of brain fog — that's not weakness, that's integrity. You made the right call.", identity: "PSEUDONYM", hoursAfterPost: 16 },

  // ── Post 49: "Hot flash teaching fitness" (work-life) ─────────────────
  { postIndex: 49, authorPseudonym: "DesertRose", body: "That one was free — I wasn't even trying. Humor is armor and you wear it beautifully. But the question underneath — how long can I keep performing? — that deserves a real answer.", identity: "PSEUDONYM", hoursAfterPost: 2 },
  { postIndex: 49, authorPseudonym: "NightOwl3am", body: "Performing wellness while your body is doing... this. You just described so many of us. The gap between the outside and the inside is exhausting.", identity: "PSEUDONYM", hoursAfterPost: 7 },

  // ── Post 50: "Workplace accommodations" (work-life) ───────────────────
  { postIndex: 50, authorPseudonym: "QuietStorm42", body: "I asked for the ability to work from home two days a week during my worst symptom days. My manager was understanding. I know I'm lucky. Tech is more flexible than many industries.", identity: "PSEUDONYM", hoursAfterPost: 3 },
  { postIndex: 50, authorPseudonym: "SteadyRain", body: "In education, I got an oscillating fan for my classroom and the ability to step into the hallway for a minute. Small things that made a big difference. Ask for what you need.", identity: "PSEUDONYM", hoursAfterPost: 8 },
  { postIndex: 50, authorPseudonym: "TidalGrace", body: "Asking for permission to be human. That line will stay with me. You shouldn't have to ask. But until the world catches up, advocating for yourself is an act of courage.", identity: "PSEUDONYM", hoursAfterPost: 14 },
  { postIndex: 50, authorPseudonym: "GoldenThread", body: "The UK is ahead on this — some companies now have menopause policies. For anyone in the US, check if your state has any protections. It's starting to change, slowly.", identity: "PSEUDONYM", hoursAfterPost: 22 },
];

// ============================================================================
// ROOM FOLLOWS — each user follows 4-6 rooms
// ============================================================================

const ROOM_FOLLOWS: Record<string, string[]> = {
  MoonlitSage: ["hot-flashes", "sleep", "hrt", "mood", "work-life"],
  DesertRose: ["hot-flashes", "supplements", "body-changes", "relationships"],
  QuietStorm42: ["hrt", "mood", "work-life", "body-changes", "supplements"],
  WildSage: ["supplements", "body-changes", "hot-flashes", "mood"],
  TidalGrace: ["sleep", "hrt", "mood", "relationships", "body-changes", "supplements"],
  NightOwl3am: ["sleep", "hot-flashes", "mood", "hrt", "work-life", "relationships"],
  GoldenThread: ["mood", "sleep", "relationships", "work-life"],
  SteadyRain: ["sleep", "hot-flashes", "work-life", "hrt", "relationships"],
  WinterBloom: ["hot-flashes", "mood", "relationships", "body-changes", "sleep"],
  CopperMoon: ["hot-flashes", "supplements", "body-changes", "hrt", "work-life"],
  SilverLining: ["mood", "relationships", "hrt", "body-changes"],
  VelvetDusk: ["hot-flashes", "mood", "supplements", "sleep"],
};

// ============================================================================
// SYMPTOM LOGS — 5-6 users, spread over 2-3 weeks
// ============================================================================

interface SeedSymptomLog {
  userPseudonym: string;
  daysAgo: number;
  symptom: string;
  severity: number;
  notes: string | null;
  duration: string | null;
}

const SYMPTOM_LOGS: SeedSymptomLog[] = [
  // MoonlitSage — tracking hot flashes and insomnia
  { userPseudonym: "MoonlitSage", daysAgo: 18, symptom: "HOT_FLASHES", severity: 4, notes: "8 episodes today, worst in the afternoon", duration: "all day" },
  { userPseudonym: "MoonlitSage", daysAgo: 17, symptom: "INSOMNIA", severity: 5, notes: "Woke at 2am, couldn't fall back asleep", duration: "morning" },
  { userPseudonym: "MoonlitSage", daysAgo: 17, symptom: "HOT_FLASHES", severity: 3, notes: "Only 4 today, maybe the magnesium is helping", duration: "afternoon" },
  { userPseudonym: "MoonlitSage", daysAgo: 16, symptom: "FATIGUE", severity: 4, notes: "Dragging all day after bad sleep", duration: "all day" },
  { userPseudonym: "MoonlitSage", daysAgo: 15, symptom: "HOT_FLASHES", severity: 4, notes: "Worse after wine last night", duration: "all day" },
  { userPseudonym: "MoonlitSage", daysAgo: 14, symptom: "BRAIN_FOG", severity: 3, notes: "Forgot a colleague's name mid-sentence", duration: "morning" },
  { userPseudonym: "MoonlitSage", daysAgo: 13, symptom: "ANXIETY", severity: 3, notes: "Heart racing for no reason at bedtime", duration: "evening" },
  { userPseudonym: "MoonlitSage", daysAgo: 12, symptom: "NIGHT_SWEATS", severity: 4, notes: "Changed pajamas twice", duration: "morning" },
  { userPseudonym: "MoonlitSage", daysAgo: 11, symptom: "HOT_FLASHES", severity: 2, notes: "Better day — walked for 30 minutes this morning", duration: "afternoon" },
  { userPseudonym: "MoonlitSage", daysAgo: 10, symptom: "INSOMNIA", severity: 3, notes: "Fell asleep okay but woke at 4am", duration: "morning" },
  { userPseudonym: "MoonlitSage", daysAgo: 8, symptom: "MOOD_SWINGS", severity: 3, notes: "Cried during a commercial. A car commercial.", duration: "evening" },
  { userPseudonym: "MoonlitSage", daysAgo: 6, symptom: "HOT_FLASHES", severity: 3, notes: null, duration: "all day" },

  // NightOwl3am — tracking insomnia and anxiety
  { userPseudonym: "NightOwl3am", daysAgo: 16, symptom: "INSOMNIA", severity: 5, notes: "Up from 2:30am to 5am. Third night in a row.", duration: "morning" },
  { userPseudonym: "NightOwl3am", daysAgo: 15, symptom: "FATIGUE", severity: 5, notes: "Could barely function at work", duration: "all day" },
  { userPseudonym: "NightOwl3am", daysAgo: 15, symptom: "BRAIN_FOG", severity: 4, notes: "Lost my keys twice. They were in my hand.", duration: "all day" },
  { userPseudonym: "NightOwl3am", daysAgo: 14, symptom: "INSOMNIA", severity: 4, notes: "Slept until 3:30am — progress?", duration: "morning" },
  { userPseudonym: "NightOwl3am", daysAgo: 13, symptom: "ANXIETY", severity: 4, notes: "Racing thoughts about work deadlines that don't exist yet", duration: "evening" },
  { userPseudonym: "NightOwl3am", daysAgo: 12, symptom: "NIGHT_SWEATS", severity: 3, notes: "Mild tonight, only had to flip the pillow", duration: "morning" },
  { userPseudonym: "NightOwl3am", daysAgo: 11, symptom: "INSOMNIA", severity: 3, notes: "Magnesium seems to help. Slept until 4:30am.", duration: "morning" },
  { userPseudonym: "NightOwl3am", daysAgo: 9, symptom: "MOOD_SWINGS", severity: 4, notes: "Snapped at my daughter, then cried about snapping", duration: "evening" },
  { userPseudonym: "NightOwl3am", daysAgo: 7, symptom: "INSOMNIA", severity: 4, notes: "4:17am. Journal entry instead of staring at ceiling.", duration: "morning" },
  { userPseudonym: "NightOwl3am", daysAgo: 5, symptom: "HOT_FLASHES", severity: 3, notes: "Three in one meeting. Kept my fan going.", duration: "afternoon" },

  // QuietStorm42 — tracking brain fog and mood
  { userPseudonym: "QuietStorm42", daysAgo: 14, symptom: "BRAIN_FOG", severity: 5, notes: "Forgot the project name in standup. Wanted to disappear.", duration: "morning" },
  { userPseudonym: "QuietStorm42", daysAgo: 13, symptom: "BRAIN_FOG", severity: 4, notes: "Better today but still searching for words", duration: "all day" },
  { userPseudonym: "QuietStorm42", daysAgo: 12, symptom: "ANXIETY", severity: 3, notes: "Performance review coming up. Spiraling.", duration: "evening" },
  { userPseudonym: "QuietStorm42", daysAgo: 11, symptom: "INSOMNIA", severity: 3, notes: "Woke at 3am thinking about code", duration: "morning" },
  { userPseudonym: "QuietStorm42", daysAgo: 10, symptom: "BLOATING", severity: 4, notes: "Had to change into stretchy pants at lunch", duration: "afternoon" },
  { userPseudonym: "QuietStorm42", daysAgo: 9, symptom: "BRAIN_FOG", severity: 3, notes: "Estradiol patches starting to help? Hard to tell.", duration: "morning" },
  { userPseudonym: "QuietStorm42", daysAgo: 7, symptom: "HOT_FLASHES", severity: 3, notes: "Two during code review. Played it cool.", duration: "afternoon" },
  { userPseudonym: "QuietStorm42", daysAgo: 5, symptom: "BRAIN_FOG", severity: 2, notes: "Actually a good day. Words came when I needed them.", duration: "all day" },
  { userPseudonym: "QuietStorm42", daysAgo: 3, symptom: "FATIGUE", severity: 3, notes: "Afternoon slump hit hard despite good sleep", duration: "afternoon" },

  // CopperMoon — tracking hot flashes and joint pain
  { userPseudonym: "CopperMoon", daysAgo: 13, symptom: "HOT_FLASHES", severity: 4, notes: "Mid-class flash. Used humor to cover.", duration: "morning" },
  { userPseudonym: "CopperMoon", daysAgo: 12, symptom: "JOINT_PAIN", severity: 3, notes: "Knees aching after a routine that never bothered me before", duration: "evening" },
  { userPseudonym: "CopperMoon", daysAgo: 11, symptom: "FATIGUE", severity: 4, notes: "Could barely finish my own workout. Embarrassing.", duration: "morning" },
  { userPseudonym: "CopperMoon", daysAgo: 10, symptom: "HOT_FLASHES", severity: 3, notes: "Only two today. Rest day seemed to help.", duration: "all day" },
  { userPseudonym: "CopperMoon", daysAgo: 9, symptom: "WEIGHT_CHANGES", severity: 3, notes: "Scale up again despite tracking macros perfectly", duration: null },
  { userPseudonym: "CopperMoon", daysAgo: 8, symptom: "JOINT_PAIN", severity: 4, notes: "Hands stiff this morning. Took 20 minutes to loosen up.", duration: "morning" },
  { userPseudonym: "CopperMoon", daysAgo: 6, symptom: "LOW_LIBIDO", severity: 4, notes: "Started testosterone cream. Hoping for change.", duration: null },
  { userPseudonym: "CopperMoon", daysAgo: 4, symptom: "HOT_FLASHES", severity: 3, notes: null, duration: "afternoon" },
  { userPseudonym: "CopperMoon", daysAgo: 2, symptom: "FATIGUE", severity: 2, notes: "Better energy today! Creatine kicking in?", duration: "all day" },

  // WinterBloom — tracking anxiety and night sweats
  { userPseudonym: "WinterBloom", daysAgo: 12, symptom: "ANXIETY", severity: 5, notes: "Heart racing at 6am. Checked locks three times before leaving.", duration: "morning" },
  { userPseudonym: "WinterBloom", daysAgo: 11, symptom: "NIGHT_SWEATS", severity: 4, notes: "Soaked through. Changed sheets at 2am.", duration: "morning" },
  { userPseudonym: "WinterBloom", daysAgo: 10, symptom: "ANXIETY", severity: 4, notes: "Catastrophizing about the kids all day", duration: "all day" },
  { userPseudonym: "WinterBloom", daysAgo: 9, symptom: "INSOMNIA", severity: 4, notes: "Awake 1am-4am. Anxiety wouldn't quiet.", duration: "morning" },
  { userPseudonym: "WinterBloom", daysAgo: 8, symptom: "MOOD_SWINGS", severity: 3, notes: "Happy in the morning, weeping by 3pm. No trigger.", duration: "all day" },
  { userPseudonym: "WinterBloom", daysAgo: 7, symptom: "NIGHT_SWEATS", severity: 3, notes: "Milder tonight. New bamboo sheets helping?", duration: "morning" },
  { userPseudonym: "WinterBloom", daysAgo: 5, symptom: "ANXIETY", severity: 3, notes: "Gardening helped today. Hands in the dirt, calmer mind.", duration: "afternoon" },
  { userPseudonym: "WinterBloom", daysAgo: 3, symptom: "HOT_FLASHES", severity: 3, notes: "Five today. All in the afternoon.", duration: "afternoon" },
  { userPseudonym: "WinterBloom", daysAgo: 1, symptom: "ANXIETY", severity: 2, notes: "Better day. Walk in the morning made a difference.", duration: "morning" },

  // VelvetDusk — just starting to track
  { userPseudonym: "VelvetDusk", daysAgo: 7, symptom: "HOT_FLASHES", severity: 2, notes: "Is this a hot flash? Warm wave that lasted 2 minutes.", duration: "afternoon" },
  { userPseudonym: "VelvetDusk", daysAgo: 6, symptom: "MOOD_SWINGS", severity: 3, notes: "Irritable all day for no reason", duration: "all day" },
  { userPseudonym: "VelvetDusk", daysAgo: 5, symptom: "SLEEP_DISRUPTION", severity: 2, notes: "Woke up once but fell back asleep. Maybe nothing.", duration: "morning" },
  { userPseudonym: "VelvetDusk", daysAgo: 3, symptom: "BRAIN_FOG", severity: 2, notes: "Couldn't find the word 'ubiquitous' for five minutes", duration: "morning" },
  { userPseudonym: "VelvetDusk", daysAgo: 1, symptom: "HOT_FLASHES", severity: 2, notes: "Another warm wave. Tracking to see if there's a pattern.", duration: "afternoon" },
];

// ============================================================================
// MAIN SEED FUNCTION
// ============================================================================

async function main() {
  const passwordHash = await bcrypt.hash("demo123", 12);

  // ── Step 1: Clean up existing demo data ──────────────────────────────
  console.log("Cleaning up existing demo data...");
  await prisma.reaction.deleteMany({
    where: { user: { email: { endsWith: "@periwink-demo.com" } } },
  });
  await prisma.comment.deleteMany({
    where: { author: { email: { endsWith: "@periwink-demo.com" } } },
  });
  await prisma.post.deleteMany({
    where: { author: { email: { endsWith: "@periwink-demo.com" } } },
  });
  await prisma.symptomLog.deleteMany({
    where: { user: { email: { endsWith: "@periwink-demo.com" } } },
  });
  await prisma.roomFollow.deleteMany({
    where: { user: { email: { endsWith: "@periwink-demo.com" } } },
  });
  await prisma.profile.deleteMany({
    where: { user: { email: { endsWith: "@periwink-demo.com" } } },
  });
  await prisma.user.deleteMany({
    where: { email: { endsWith: "@periwink-demo.com" } },
  });
  console.log("Cleaned up existing demo data.");

  // ── Step 2: Upsert rooms ─────────────────────────────────────────────
  console.log("Upserting rooms...");
  const roomMap: Record<string, string> = {};
  for (const room of ROOMS) {
    const created = await prisma.room.upsert({
      where: { slug: room.slug },
      update: { name: room.name, description: room.description, icon: room.icon, sortOrder: room.sortOrder, isDefault: room.isDefault },
      create: room,
    });
    roomMap[room.slug] = created.id;
  }
  console.log(`Upserted ${ROOMS.length} rooms.`);

  // ── Step 3: Create users ─────────────────────────────────────────────
  console.log("Creating demo users...");
  const userMap: Record<string, string> = {};
  for (const u of DEMO_USERS) {
    const email = `${u.pseudonym.toLowerCase()}@periwink-demo.com`;
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        createdAt: new Date(Date.now() - 45 * 86400000 - Math.floor(Math.random() * 15) * 86400000),
      },
    });
    userMap[u.pseudonym] = user.id;
  }
  console.log(`Created ${DEMO_USERS.length} users.`);

  // ── Step 4: Create profiles ──────────────────────────────────────────
  console.log("Creating profiles...");
  for (const u of DEMO_USERS) {
    await prisma.profile.create({
      data: {
        userId: userMap[u.pseudonym],
        displayName: u.pseudonym,
        bio: u.bio,
        avatarStyle: u.avatarStyle,
        birthYear: u.birthYear,
        menopauseStage: u.menopauseStage,
        yearsInStage: u.yearsInStage,
        country: u.country,
      },
    });
  }
  console.log(`Created ${DEMO_USERS.length} profiles.`);

  // ── Step 5: Create room follows ──────────────────────────────────────
  console.log("Creating room follows...");
  let followCount = 0;
  for (const [pseudonym, slugs] of Object.entries(ROOM_FOLLOWS)) {
    for (const slug of slugs) {
      await prisma.roomFollow.create({
        data: {
          userId: userMap[pseudonym],
          roomId: roomMap[slug],
        },
      });
      followCount++;
    }
  }
  console.log(`Created ${followCount} room follows.`);

  // ── Step 6: Create posts ─────────────────────────────────────────────
  console.log("Creating posts...");
  const postIds: string[] = [];
  for (const p of POSTS) {
    const createdAt = new Date(Date.now() - p.daysAgo * 86400000 - p.hoursAgo * 3600000);
    const post = await prisma.post.create({
      data: {
        roomId: roomMap[p.roomSlug],
        authorId: userMap[p.authorPseudonym],
        title: p.title,
        body: p.body,
        identity: p.identity,
        isPinned: p.isPinned,
        viewCount: Math.floor(Math.random() * 200) + 20,
        createdAt,
        updatedAt: createdAt,
      },
    });
    postIds.push(post.id);
  }
  console.log(`Created ${POSTS.length} posts.`);

  // ── Step 7: Create comments ──────────────────────────────────────────
  console.log("Creating comments...");

  // Group comments by postIndex so we can track IDs for threading
  const commentIdsByPost: Record<number, string[]> = {};
  for (const c of COMMENTS) {
    if (!commentIdsByPost[c.postIndex]) {
      commentIdsByPost[c.postIndex] = [];
    }
  }

  // We need to create comments in order so parentCommentOffset works
  // First pass: build ordered list
  const orderedComments: Array<{ comment: SeedComment; index: number }> = [];
  for (let i = 0; i < COMMENTS.length; i++) {
    orderedComments.push({ comment: COMMENTS[i], index: i });
  }

  // Track created comment IDs per post (in order)
  const createdCommentIdsByPost: Record<number, string[]> = {};

  for (const { comment: c } of orderedComments) {
    const postCreatedAt = new Date(
      Date.now() - POSTS[c.postIndex].daysAgo * 86400000 - POSTS[c.postIndex].hoursAgo * 3600000
    );
    const commentCreatedAt = new Date(postCreatedAt.getTime() + c.hoursAfterPost * 3600000);

    let parentId: string | undefined = undefined;
    if (c.parentCommentOffset !== undefined && createdCommentIdsByPost[c.postIndex]) {
      parentId = createdCommentIdsByPost[c.postIndex][c.parentCommentOffset];
    }

    const comment = await prisma.comment.create({
      data: {
        postId: postIds[c.postIndex],
        authorId: userMap[c.authorPseudonym],
        body: c.body,
        identity: c.identity,
        parentId: parentId || undefined,
        createdAt: commentCreatedAt,
        updatedAt: commentCreatedAt,
      },
    });

    if (!createdCommentIdsByPost[c.postIndex]) {
      createdCommentIdsByPost[c.postIndex] = [];
    }
    createdCommentIdsByPost[c.postIndex].push(comment.id);
  }
  console.log(`Created ${COMMENTS.length} comments.`);

  // ── Step 8: Create reactions ─────────────────────────────────────────
  console.log("Creating reactions...");

  // Weighted reaction types: SAME 40%, HEART 25%, HUG 20%, HELPFUL 15%
  const reactionPool: Array<"SAME" | "HEART" | "HUG" | "HELPFUL"> = [];
  for (let i = 0; i < 40; i++) reactionPool.push("SAME");
  for (let i = 0; i < 25; i++) reactionPool.push("HEART");
  for (let i = 0; i < 20; i++) reactionPool.push("HUG");
  for (let i = 0; i < 15; i++) reactionPool.push("HELPFUL");

  function pickReaction() {
    return reactionPool[Math.floor(Math.random() * reactionPool.length)];
  }

  const pseudonyms = DEMO_USERS.map((u) => u.pseudonym);
  const usedReactionKeys = new Set<string>();
  let reactionCount = 0;
  const targetReactions = 275;

  // Distribute reactions across posts, ensuring unique (userId, postId, type)
  while (reactionCount < targetReactions) {
    const postIndex = Math.floor(Math.random() * postIds.length);
    const userPseudonym = pseudonyms[Math.floor(Math.random() * pseudonyms.length)];
    const type = pickReaction();

    // Don't react to your own post
    if (POSTS[postIndex].authorPseudonym === userPseudonym) continue;

    const key = `${userMap[userPseudonym]}-${postIds[postIndex]}-${type}`;
    if (usedReactionKeys.has(key)) continue;
    usedReactionKeys.add(key);

    const postCreatedAt = new Date(
      Date.now() - POSTS[postIndex].daysAgo * 86400000 - POSTS[postIndex].hoursAgo * 3600000
    );
    const reactionCreatedAt = new Date(
      postCreatedAt.getTime() + Math.floor(Math.random() * 72) * 3600000
    );

    await prisma.reaction.create({
      data: {
        userId: userMap[userPseudonym],
        postId: postIds[postIndex],
        type,
        createdAt: reactionCreatedAt,
      },
    });
    reactionCount++;
  }
  console.log(`Created ${reactionCount} reactions.`);

  // ── Step 9: Create symptom logs ──────────────────────────────────────
  console.log("Creating symptom logs...");
  for (const log of SYMPTOM_LOGS) {
    const logDate = new Date(Date.now() - log.daysAgo * 86400000);
    await prisma.symptomLog.create({
      data: {
        userId: userMap[log.userPseudonym],
        logDate,
        symptom: log.symptom as any,
        severity: log.severity,
        notes: log.notes,
        duration: log.duration,
        contributedToInsights: Math.random() > 0.5,
      },
    });
  }
  console.log(`Created ${SYMPTOM_LOGS.length} symptom logs.`);

  // ── Step 10: Update denormalized counts on posts ─────────────────────
  console.log("Updating denormalized post counts...");
  for (let i = 0; i < postIds.length; i++) {
    const commentCount = await prisma.comment.count({
      where: { postId: postIds[i] },
    });
    const reactionCountForPost = await prisma.reaction.count({
      where: { postId: postIds[i] },
    });
    await prisma.post.update({
      where: { id: postIds[i] },
      data: {
        commentCount,
        reactionCount: reactionCountForPost,
      },
    });
  }
  console.log("Updated denormalized counts.");

  console.log("\nSeed complete!");
  console.log(`  ${ROOMS.length} rooms`);
  console.log(`  ${DEMO_USERS.length} users + profiles`);
  console.log(`  ${followCount} room follows`);
  console.log(`  ${POSTS.length} posts`);
  console.log(`  ${COMMENTS.length} comments`);
  console.log(`  ${reactionCount} reactions`);
  console.log(`  ${SYMPTOM_LOGS.length} symptom logs`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

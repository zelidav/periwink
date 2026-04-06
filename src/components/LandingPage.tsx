"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// — Design Tokens —
const c = {
  periwinkle: "#8B7AA8",
  periwinkleDeep: "#6E5A7E",
  periwinkleSoft: "#A799BE",
  periwinkleLight: "#C4B8D6",
  periwinkleMist: "#E8E1F0",
  periwinkleWhisper: "#F5F2F9",
  lavenderBlush: "#F8F4FC",
  cream: "#FFFCF9",
  warmWhite: "#FEFDFB",
  blush: "#F2E4E6",
  roseSoft: "#E8C4C4",
  sageSoft: "#D4DED0",
  ink: "#2D2438",
  inkSoft: "#5C4E6A",
  inkMuted: "#8B7D98",
};

// — SVG Illustrations —
function BotanicalIllustration({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 500 400" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Main stem */}
      <path d="M250 380 Q248 300 252 220 Q254 160 250 100" stroke={c.periwinkleLight} strokeWidth="2" fill="none" opacity="0.6" />
      {/* Left branch */}
      <path d="M250 280 Q200 260 160 220" stroke={c.periwinkleLight} strokeWidth="1.5" fill="none" opacity="0.5" />
      <path d="M160 220 Q140 200 150 170 Q165 185 170 210 Q175 195 160 220Z" fill={c.periwinkleMist} opacity="0.7" />
      {/* Right branch */}
      <path d="M252 240 Q300 220 340 190" stroke={c.periwinkleLight} strokeWidth="1.5" fill="none" opacity="0.5" />
      <path d="M340 190 Q360 170 350 140 Q335 160 330 180 Q325 165 340 190Z" fill={c.periwinkleMist} opacity="0.6" />
      {/* Flower top */}
      <ellipse cx="250" cy="90" rx="30" ry="25" fill={c.periwinkleLight} opacity="0.3" />
      <ellipse cx="240" cy="80" rx="20" ry="18" fill={c.periwinkleSoft} opacity="0.25" />
      <ellipse cx="260" cy="85" rx="22" ry="20" fill={c.periwinkleMist} opacity="0.35" />
      <circle cx="250" cy="88" r="8" fill={c.periwinkle} opacity="0.2" />
      {/* Small leaves */}
      <path d="M250 320 Q230 310 220 290" stroke={c.periwinkleLight} strokeWidth="1" fill="none" opacity="0.4" />
      <path d="M220 290 Q210 275 218 262 Q225 272 228 285 Q230 274 220 290Z" fill={c.periwinkleMist} opacity="0.5" />
      <path d="M252 340 Q275 330 290 312" stroke={c.periwinkleLight} strokeWidth="1" fill="none" opacity="0.4" />
      <path d="M290 312 Q305 298 298 282 Q288 295 285 308 Q280 296 290 312Z" fill={c.periwinkleMist} opacity="0.5" />
      {/* Decorative dots */}
      <circle cx="180" cy="170" r="3" fill={c.roseSoft} opacity="0.4" />
      <circle cx="320" cy="150" r="2.5" fill={c.roseSoft} opacity="0.3" />
      <circle cx="200" cy="120" r="2" fill={c.periwinkleSoft} opacity="0.35" />
      <circle cx="300" cy="110" r="2" fill={c.periwinkleSoft} opacity="0.3" />
    </svg>
  );
}

function WavesIllustration({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 500 400" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 200 Q80 160 160 200 Q240 240 320 200 Q400 160 500 200" stroke={c.periwinkleLight} strokeWidth="2" fill="none" opacity="0.5" />
      <path d="M0 230 Q80 190 160 230 Q240 270 320 230 Q400 190 500 230" stroke={c.periwinkleMist} strokeWidth="1.5" fill="none" opacity="0.4" />
      <path d="M0 260 Q80 220 160 260 Q240 300 320 260 Q400 220 500 260" stroke={c.periwinkleLight} strokeWidth="1" fill="none" opacity="0.3" />
      {/* Abstract organic shapes */}
      <circle cx="100" cy="150" r="40" fill={c.periwinkleMist} opacity="0.2" />
      <circle cx="380" cy="130" r="55" fill={c.periwinkleMist} opacity="0.15" />
      <circle cx="250" cy="280" r="35" fill={c.roseSoft} opacity="0.12" />
      <ellipse cx="200" cy="100" rx="25" ry="18" fill={c.periwinkleLight} opacity="0.15" />
      <ellipse cx="350" cy="300" rx="30" ry="20" fill={c.periwinkleSoft} opacity="0.1" />
      {/* Small floating elements */}
      <circle cx="80" cy="100" r="3" fill={c.periwinkle} opacity="0.25" />
      <circle cx="420" cy="90" r="2.5" fill={c.periwinkle} opacity="0.2" />
      <circle cx="300" cy="340" r="3" fill={c.roseSoft} opacity="0.3" />
      <circle cx="150" cy="320" r="2" fill={c.periwinkleSoft} opacity="0.25" />
    </svg>
  );
}

function HeroIllustration({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Large organic background shapes */}
      <circle cx="300" cy="300" r="200" fill={c.periwinkleMist} opacity="0.12" />
      <circle cx="340" cy="260" r="150" fill={c.periwinkleWhisper} opacity="0.2" />
      {/* Periwinkle flower - stylized */}
      <g transform="translate(300,280)">
        {[0, 72, 144, 216, 288].map((angle, i) => (
          <ellipse
            key={i}
            cx="0"
            cy="-60"
            rx="28"
            ry="55"
            fill={c.periwinkleLight}
            opacity={0.25 + i * 0.03}
            transform={`rotate(${angle})`}
          />
        ))}
        <circle cx="0" cy="0" r="15" fill={c.periwinkleSoft} opacity="0.4" />
        <circle cx="0" cy="0" r="8" fill={c.periwinkle} opacity="0.3" />
      </g>
      {/* Flowing lines */}
      <path d="M100 400 Q200 350 300 380 Q400 410 500 360" stroke={c.periwinkleLight} strokeWidth="1.5" fill="none" opacity="0.3" />
      <path d="M80 430 Q180 380 280 410 Q380 440 480 390" stroke={c.periwinkleMist} strokeWidth="1" fill="none" opacity="0.25" />
      {/* Scattered elements */}
      <circle cx="150" cy="180" r="4" fill={c.roseSoft} opacity="0.3" />
      <circle cx="450" cy="200" r="3" fill={c.roseSoft} opacity="0.25" />
      <circle cx="200" cy="450" r="3.5" fill={c.periwinkleSoft} opacity="0.2" />
      <circle cx="420" cy="420" r="2.5" fill={c.sageSoft} opacity="0.3" />
    </svg>
  );
}

// — Scroll Reveal Hook —
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
}

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, isVisible } = useScrollReveal();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

// — Modal —
function Modal({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: "rgba(45, 36, 56, 0.6)", backdropFilter: "blur(8px)", animation: "fadeIn 0.2s ease" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto relative"
        style={{ animation: "fadeInUp 0.3s ease-out" }}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full flex items-center justify-center text-xl transition-colors cursor-pointer"
          style={{ background: c.periwinkleWhisper, color: c.inkMuted }}
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}

// — Input Component —
function FormInput({
  label,
  required,
  ...props
}: { label: string; required?: boolean } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium mb-2">
        {label} {required && <span style={{ color: c.periwinkle }}>*</span>}
      </label>
      <input
        required={required}
        className="w-full px-5 py-4 rounded-xl text-base transition-all"
        style={{ border: `1px solid ${c.periwinkleMist}`, outline: "none" }}
        {...props}
      />
    </div>
  );
}

function FormTextarea({
  label,
  required,
  hint,
  ...props
}: { label: string; required?: boolean; hint?: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium mb-2">
        {label} {required && <span style={{ color: c.periwinkle }}>*</span>}
      </label>
      <textarea
        required={required}
        className="w-full px-5 py-4 rounded-xl text-base min-h-[100px] resize-y transition-all"
        style={{ border: `1px solid ${c.periwinkleMist}`, outline: "none" }}
        {...props}
      />
      {hint && <p className="text-sm mt-1.5" style={{ color: c.inkMuted }}>{hint}</p>}
    </div>
  );
}

// — Main Landing Page —
export default function LandingPage() {
  const [communityModalOpen, setCommunityModalOpen] = useState(false);
  const [foundingModalOpen, setFoundingModalOpen] = useState(false);
  const [foundingStep, setFoundingStep] = useState(1);
  const [successModal, setSuccessModal] = useState<{
    open: boolean;
    title: string;
    message: string;
  }>({ open: false, title: "", message: "" });
  const [isScrolled, setIsScrolled] = useState(false);
  const [formError, setFormError] = useState("");

  // Community form
  const [communityForm, setCommunityForm] = useState({
    name: "",
    email: "",
    pseudonym: "",
  });

  // Founding form — matches API fields
  const [foundingForm, setFoundingForm] = useState({
    name: "",
    email: "",
    roleType: "",
    whatDrawsYou: "",
    whatYouOffer: "",
    currentApproach: "",
    holdingSpace: "",
    wantToBuild: "",
    organization: "",
    website: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleCommunitySubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/signup/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(communityForm),
      });
      const data = await res.json();
      if (res.ok) {
        setCommunityModalOpen(false);
        setCommunityForm({ name: "", email: "", pseudonym: "" });
        setSuccessModal({
          open: true,
          title: "You're in.",
          message: "Check your email — we'll be in touch soon. We're glad you're here.",
        });
      } else {
        setFormError(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setFormError("Network error. Please check your connection and try again.");
    }
    setIsSubmitting(false);
  }, [communityForm]);

  const handleFoundingSubmit = useCallback(async () => {
    setFormError("");
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/signup/founding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(foundingForm),
      });
      const data = await res.json();
      if (res.ok) {
        setFoundingModalOpen(false);
        setFoundingStep(1);
        setFoundingForm({
          name: "", email: "", roleType: "",
          whatDrawsYou: "", whatYouOffer: "", currentApproach: "",
          holdingSpace: "", wantToBuild: "", organization: "", website: "",
        });
        setSuccessModal({
          open: true,
          title: "Application received.",
          message: "We'll review and be in touch within a few days. Thank you for wanting to build with us.",
        });
      } else {
        setFormError(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setFormError("Network error. Please check your connection and try again.");
    }
    setIsSubmitting(false);
  }, [foundingForm]);

  const circles = [
    { emoji: "🔥", name: "Bodies in Flux", desc: "Hot flashes, night sweats, and everything your body is doing differently.", members: "2,847" },
    { emoji: "🌙", name: "Sleep & Energy", desc: "Finding rest when your body forgot how. Real strategies that work.", members: "3,201" },
    { emoji: "🧠", name: "Mind & Mood", desc: "The emotional journey — anxiety, clarity, fog, and breakthroughs.", members: "2,956" },
    { emoji: "💊", name: "Treatment Paths", desc: "HRT, alternatives, and everything in between. What's working for whom.", members: "4,102" },
    { emoji: "💜", name: "Identity & Relationships", desc: "Who you're becoming. How your relationships are evolving.", members: "1,890" },
    { emoji: "🌿", name: "Nourishment", desc: "Food, movement, supplements. What feeds you now.", members: "2,103" },
  ];

  const features = [
    { icon: "💬", title: "Shared Circles", desc: "Intimate spaces for real conversations. Topics that matter, with women who truly understand." },
    { icon: "✨", title: "Collective Wisdom", desc: "Learn what actually works from women who've been there. Real insights from lived experience." },
    { icon: "📖", title: "Your Story, Tracked", desc: "Notice patterns in your experience. Understand your body better. Share on your terms." },
    { icon: "🤝", title: "Always Supported", desc: "Feeling understood isn't optional — it's essential. Every interaction helps you feel seen." },
    { icon: "🔒", title: "Truly Private", desc: "Your story is yours. Pseudonymous by default, with full control over what you share." },
    { icon: "🌱", title: "Always Growing", desc: "Periwink evolves with the community. Your voice shapes what we build next." },
  ];

  const roleOptions = [
    { value: "PRACTITIONER", label: "Healthcare Practitioner" },
    { value: "RESEARCHER", label: "Researcher" },
    { value: "CONTENT_CREATOR", label: "Content Creator" },
    { value: "COMMUNITY_BUILDER", label: "Community Builder" },
    { value: "BRAND_PARTNER", label: "Brand Partner" },
  ];

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Outfit:wght@300;400;500;600&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body {
          font-family: 'Outfit', -apple-system, sans-serif;
          background: ${c.cream};
          color: ${c.ink};
          -webkit-font-smoothing: antialiased;
        }

        .font-display { font-family: 'Playfair Display', Georgia, serif; }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes breathe {
          0%, 100% { transform: scale(1); opacity: 0.15; }
          50% { transform: scale(1.05); opacity: 0.25; }
        }

        .animate-fade-in-up { animation: fadeInUp 0.8s ease-out forwards; }
        .animate-fade-in { animation: fadeIn 0.6s ease-out forwards; }
        .delay-1 { animation-delay: 0.1s; opacity: 0; }
        .delay-2 { animation-delay: 0.2s; opacity: 0; }
        .delay-3 { animation-delay: 0.3s; opacity: 0; }
        .delay-4 { animation-delay: 0.4s; opacity: 0; }
        .delay-5 { animation-delay: 0.5s; opacity: 0; }

        .highlight {
          background: linear-gradient(180deg, transparent 60%, rgba(196, 184, 214, 0.4) 60%);
          padding: 0 4px;
        }

        .hero-illustration {
          animation: breathe 6s ease-in-out infinite;
        }

        input:focus, textarea:focus {
          border-color: ${c.periwinkleSoft} !important;
          box-shadow: 0 0 0 3px rgba(139, 122, 168, 0.12) !important;
        }

        ::selection { background: rgba(196, 184, 214, 0.35); }
      `}</style>

      {/* Navigation */}
      <nav
        className="fixed top-0 left-0 right-0 z-40 transition-all duration-300"
        style={{
          padding: isScrolled ? "12px 0" : "20px 0",
          background: isScrolled ? "rgba(255, 252, 249, 0.95)" : "transparent",
          backdropFilter: isScrolled ? "blur(20px)" : "none",
          boxShadow: isScrolled ? "0 2px 30px rgba(110, 90, 126, 0.08)" : "none",
        }}
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <a href="#" className="font-display text-2xl" style={{ color: c.periwinkleDeep, textDecoration: "none" }}>
            periwink
          </a>
          <div className="flex items-center gap-8">
            <a href="#about" className="hidden md:block text-sm hover:opacity-70 transition-opacity" style={{ color: c.inkSoft, textDecoration: "none" }}>
              Our Story
            </a>
            <a href="#community" className="hidden md:block text-sm hover:opacity-70 transition-opacity" style={{ color: c.inkSoft, textDecoration: "none" }}>
              Community
            </a>
            <a href="#builders" className="hidden md:block text-sm hover:opacity-70 transition-opacity" style={{ color: c.inkSoft, textDecoration: "none" }}>
              Contribute
            </a>
            <button
              onClick={() => { setFormError(""); setCommunityModalOpen(true); }}
              className="px-6 py-3 rounded-full text-sm font-medium transition-all hover:-translate-y-0.5 cursor-pointer"
              style={{
                background: c.periwinkleDeep,
                color: "#fff",
                boxShadow: "0 4px 20px rgba(110, 90, 126, 0.3)",
              }}
            >
              Join Early
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        className="min-h-screen flex items-center justify-center text-center px-6 pt-32 pb-20 relative overflow-hidden"
        style={{
          background: `linear-gradient(180deg, ${c.lavenderBlush} 0%, ${c.cream} 100%)`,
        }}
      >
        {/* Background illustration */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none hero-illustration">
          <HeroIllustration className="w-full max-w-2xl h-auto opacity-60" />
        </div>

        <div className="max-w-3xl relative z-10">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full text-sm font-medium mb-8 animate-fade-in-up"
            style={{
              background: "rgba(255,255,255,0.9)",
              border: `1px solid ${c.periwinkleLight}`,
              color: c.periwinkleDeep,
            }}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: "#7CB07F", animation: "pulse 2s ease-in-out infinite" }}
            />
            Building something meaningful
          </div>

          {/* Main Headline */}
          <h1
            className="font-display text-5xl md:text-6xl lg:text-7xl leading-tight mb-6 animate-fade-in-up delay-1"
            style={{ fontWeight: 400 }}
          >
            A wiser way forward —
            <em style={{ color: c.periwinkleDeep }}>together.</em>
          </h1>

          <p
            className="text-lg md:text-xl mb-4 animate-fade-in-up delay-2"
            style={{ color: c.inkSoft, maxWidth: "600px", margin: "0 auto", lineHeight: 1.7 }}
          >
            Growth, wisdom, and shared experience — for the women you are becoming.
          </p>

          <p
            className="text-base mb-10 animate-fade-in-up delay-3"
            style={{ color: c.inkMuted, fontStyle: "italic" }}
          >
            More truth. Deeper alignment. More you.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-4">
            <button
              onClick={() => { setFormError(""); setCommunityModalOpen(true); }}
              className="px-8 py-4 rounded-full text-base font-medium transition-all hover:-translate-y-0.5 cursor-pointer"
              style={{
                background: c.periwinkleDeep,
                color: "#fff",
                boxShadow: "0 6px 28px rgba(110, 90, 126, 0.35)",
              }}
            >
              Join the Community
            </button>
            <button
              onClick={() => { setFormError(""); setFoundingStep(1); setFoundingModalOpen(true); }}
              className="px-8 py-4 rounded-full text-base font-medium transition-all hover:-translate-y-0.5 cursor-pointer"
              style={{
                background: "#fff",
                color: c.periwinkleDeep,
                border: `2px solid ${c.periwinkleDeep}`,
              }}
            >
              Become a Founding Member
            </button>
          </div>

          {/* Social proof */}
          <div className="flex items-center justify-center gap-4 mt-12 animate-fade-in-up delay-5">
            <div className="flex -space-x-3">
              {[c.periwinkleLight, c.sageSoft, c.roseSoft, c.periwinkleMist].map((bg, i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full border-2 border-white"
                  style={{ background: `linear-gradient(135deg, ${bg}, ${c.periwinkleMist})`, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
                />
              ))}
            </div>
            <p className="text-sm" style={{ color: c.inkMuted }}>
              Join <strong style={{ color: c.inkSoft }}>2,400+ women</strong> finding their way forward
            </p>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 animate-fade-in delay-5">
          <span className="text-xs tracking-widest uppercase" style={{ color: c.inkMuted }}>
            Learn more
          </span>
          <div className="w-px h-10" style={{ background: `linear-gradient(${c.periwinkle}, transparent)` }} />
        </div>
      </section>

      {/* Why Section */}
      <section id="about" className="py-24 px-6" style={{ background: c.warmWhite }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <Reveal>
              <div
                className="aspect-[4/3] rounded-3xl flex items-center justify-center overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${c.periwinkleMist}, ${c.lavenderBlush})`,
                }}
              >
                <BotanicalIllustration className="w-4/5 h-auto" />
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <h2 className="font-display text-3xl md:text-4xl leading-tight mb-6">
                This isn't about managing symptoms. It's about{" "}
                <span className="highlight">becoming who you're meant to be.</span>
              </h2>
              <p className="text-base mb-5" style={{ color: c.inkSoft, lineHeight: 1.8 }}>
                There's a reason so many women feel unseen during this chapter. The conversations that matter most are rarely had. The questions that keep you up at night feel too personal to ask.
              </p>
              <p className="text-base" style={{ color: c.inkSoft, lineHeight: 1.8 }}>
                Periwink changes that. We're building a space where <span className="highlight">wisdom is shared</span>, where lived experience matters as much as expertise, and where you're never navigating alone.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        className="py-24 px-6"
        style={{ background: `linear-gradient(180deg, ${c.warmWhite} 0%, ${c.lavenderBlush} 100%)` }}
      >
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <p
                className="text-xs font-semibold tracking-widest uppercase mb-4"
                style={{ color: c.periwinkle }}
              >
                What we're building
              </p>
              <h2 className="font-display text-3xl md:text-4xl mb-5">
                Better outcomes through connection
              </h2>
              <p className="text-base" style={{ color: c.inkSoft }}>
                A thoughtful platform where learning happens together, and support feels like belonging.
              </p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div
                  className="p-8 rounded-3xl transition-all hover:-translate-y-1 h-full"
                  style={{
                    background: "#fff",
                    border: `1px solid ${c.periwinkleMist}`,
                    boxShadow: "0 4px 24px rgba(110, 90, 126, 0.06)",
                  }}
                >
                  <span className="text-3xl mb-5 block">{feature.icon}</span>
                  <h3 className="font-display text-xl mb-3">{feature.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: c.inkSoft }}>
                    {feature.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Circles Section */}
      <section id="community" className="py-24 px-6" style={{ background: c.cream }}>
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <p
                className="text-xs font-semibold tracking-widest uppercase mb-4"
                style={{ color: c.periwinkle }}
              >
                Active circles
              </p>
              <h2 className="font-display text-3xl md:text-4xl mb-5">
                Find your people
              </h2>
              <p className="text-base" style={{ color: c.inkSoft }}>
                Every circle is a safe space for honest conversation. Real women sharing real experiences.
              </p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {circles.map((circle, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <button
                  onClick={() => { setFormError(""); setCommunityModalOpen(true); }}
                  className="text-left p-7 rounded-3xl transition-all hover:-translate-y-1 w-full cursor-pointer"
                  style={{
                    background: `linear-gradient(165deg, #fff 0%, ${c.lavenderBlush} 100%)`,
                    border: `1px solid ${c.periwinkleMist}`,
                    boxShadow: "0 2px 16px rgba(110, 90, 126, 0.04)",
                  }}
                >
                  <span className="text-4xl mb-4 block">{circle.emoji}</span>
                  <h4 className="font-display text-lg mb-2">{circle.name}</h4>
                  <p className="text-sm mb-4" style={{ color: c.inkMuted }}>
                    {circle.desc}
                  </p>
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ background: "#7CB07F" }}
                    />
                    <span className="text-sm font-medium" style={{ color: c.periwinkleDeep }}>
                      {circle.members} sharing
                    </span>
                  </div>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <Reveal>
        <section
          className="py-24 px-6 text-center"
          style={{ background: c.periwinkleDeep }}
        >
          <div className="max-w-3xl mx-auto">
            <span className="font-display text-7xl opacity-20 text-white block mb-0">&ldquo;</span>
            <blockquote
              className="font-display text-2xl md:text-3xl italic text-white leading-relaxed mb-8 -mt-8"
            >
              I've learned more about what's happening in my body from two weeks in Periwink than from a decade of doctor visits. And I finally don't feel like I'm the only one.
            </blockquote>
            <div className="flex items-center justify-center gap-4">
              <div
                className="w-12 h-12 rounded-full"
                style={{ background: `linear-gradient(135deg, ${c.periwinkleLight}, ${c.roseSoft})` }}
              />
              <div className="text-left">
                <strong className="text-white block">Sarah M.</strong>
                <span className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
                  Member since January
                </span>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* Builders Section */}
      <section id="builders" className="py-24 px-6" style={{ background: c.warmWhite }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <Reveal>
              <h2 className="font-display text-3xl md:text-4xl leading-tight mb-6">
                Help us build something that matters.
              </h2>
              <p className="text-base mb-6" style={{ color: c.inkSoft, lineHeight: 1.8 }}>
                Periwink isn't just a product — it's a collaborative movement. We're looking for practitioners, researchers, creators, and community builders who want to shape what this becomes.
              </p>
              <div className="flex flex-wrap gap-3 mb-8">
                {roleOptions.map((role) => (
                  <span
                    key={role.value}
                    className="px-5 py-2.5 rounded-full text-sm font-medium"
                    style={{
                      background: c.lavenderBlush,
                      border: `1px solid ${c.periwinkleMist}`,
                      color: c.periwinkleDeep,
                    }}
                  >
                    {role.label}
                  </span>
                ))}
              </div>
              <button
                onClick={() => { setFormError(""); setFoundingStep(1); setFoundingModalOpen(true); }}
                className="px-8 py-4 rounded-full text-base font-medium transition-all hover:-translate-y-0.5 cursor-pointer"
                style={{
                  background: c.periwinkleDeep,
                  color: "#fff",
                  boxShadow: "0 6px 28px rgba(110, 90, 126, 0.35)",
                }}
              >
                Apply as a Founding Member
              </button>
            </Reveal>

            <Reveal delay={0.15}>
              <div
                className="aspect-[4/3] rounded-3xl flex items-center justify-center overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${c.periwinkleMist}, ${c.lavenderBlush})`,
                }}
              >
                <WavesIllustration className="w-4/5 h-auto" />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <Reveal>
        <section
          className="py-28 px-6 text-center"
          style={{ background: `linear-gradient(180deg, ${c.cream} 0%, ${c.lavenderBlush} 100%)` }}
        >
          <div className="max-w-2xl mx-auto">
            <h2 className="font-display text-4xl md:text-5xl leading-tight mb-5">
              Ready to find your{" "}
              <em style={{ color: c.periwinkleDeep }}>wiser way forward?</em>
            </h2>
            <p className="text-lg mb-10" style={{ color: c.inkSoft }}>
              Join thousands of women learning, growing, and navigating change together. Be part of building something meaningful.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => { setFormError(""); setCommunityModalOpen(true); }}
                className="px-8 py-4 rounded-full text-base font-medium transition-all hover:-translate-y-0.5 cursor-pointer"
                style={{
                  background: c.periwinkleDeep,
                  color: "#fff",
                  boxShadow: "0 6px 28px rgba(110, 90, 126, 0.35)",
                }}
              >
                Join Early Access
              </button>
              <button
                onClick={() => { setFormError(""); setFoundingStep(1); setFoundingModalOpen(true); }}
                className="px-8 py-4 rounded-full text-base font-medium transition-all hover:-translate-y-0.5 cursor-pointer"
                style={{
                  background: "transparent",
                  color: c.ink,
                  border: `2px solid ${c.inkMuted}`,
                }}
              >
                Become a Founding Member
              </button>
            </div>
          </div>
        </section>
      </Reveal>

      {/* Footer */}
      <footer className="py-12 px-6" style={{ background: c.ink }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <span className="font-display text-xl text-white">periwink</span>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>
            &copy; {new Date().getFullYear()} Periwink. All rights reserved.
          </p>
          <div className="flex gap-8">
            {["Privacy", "Terms", "Contact"].map((link) => (
              <a
                key={link}
                href="#"
                className="text-sm transition-colors hover:text-white"
                style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </footer>

      {/* ============================================================ */}
      {/* MODALS                                                       */}
      {/* ============================================================ */}

      {/* Community Signup Modal */}
      <Modal isOpen={communityModalOpen} onClose={() => setCommunityModalOpen(false)}>
        <div className="p-10 pt-12 text-center border-b" style={{ borderColor: c.periwinkleMist }}>
          <h3 className="font-display text-3xl mb-2">Join the Community</h3>
          <p style={{ color: c.inkMuted }}>You're taking the first step. We'll be in touch soon.</p>
        </div>
        <form onSubmit={handleCommunitySubmit} className="p-10">
          {formError && (
            <div className="mb-6 p-4 rounded-xl text-sm" style={{ background: "#FEF2F2", color: "#991B1B", border: "1px solid #FECACA" }}>
              {formError}
            </div>
          )}
          <FormInput
            label="Your name"
            required
            placeholder="How you'd like to be addressed"
            value={communityForm.name}
            onChange={(e) => setCommunityForm({ ...communityForm, name: e.target.value })}
          />
          <FormInput
            label="Email"
            required
            type="email"
            placeholder="you@example.com"
            value={communityForm.email}
            onChange={(e) => setCommunityForm({ ...communityForm, email: e.target.value })}
          />
          <div className="mb-8">
            <label className="block text-sm font-medium mb-2">
              Choose a pseudonym <span style={{ color: c.periwinkle }}>*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Your identity in the community"
              value={communityForm.pseudonym}
              onChange={(e) => setCommunityForm({ ...communityForm, pseudonym: e.target.value })}
              className="w-full px-5 py-4 rounded-xl text-base transition-all"
              style={{ border: `1px solid ${c.periwinkleMist}`, outline: "none" }}
            />
            <p className="text-sm mt-2" style={{ color: c.inkMuted }}>
              This is how you'll appear to others. You can stay as anonymous as you'd like.
            </p>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-xl text-base font-medium transition-all disabled:opacity-50 cursor-pointer"
            style={{ background: c.periwinkleDeep, color: "#fff" }}
          >
            {isSubmitting ? "Joining..." : "Join Periwink"}
          </button>
        </form>
      </Modal>

      {/* Founding Member Modal */}
      <Modal
        isOpen={foundingModalOpen}
        onClose={() => {
          setFoundingModalOpen(false);
          setFoundingStep(1);
        }}
      >
        <div className="p-10 pt-12 text-center border-b" style={{ borderColor: c.periwinkleMist }}>
          <h3 className="font-display text-3xl mb-2">Become a Founding Member</h3>
          <p style={{ color: c.inkMuted }}>Help shape what Periwink becomes.</p>
        </div>
        <div className="p-10">
          {/* Step indicator */}
          <div className="flex justify-center gap-3 mb-8">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className="w-3 h-3 rounded-full transition-all"
                style={{
                  background: foundingStep >= step ? c.periwinkleDeep : c.periwinkleMist,
                  transform: foundingStep === step ? "scale(1.2)" : "scale(1)",
                }}
              />
            ))}
          </div>

          {formError && (
            <div className="mb-6 p-4 rounded-xl text-sm" style={{ background: "#FEF2F2", color: "#991B1B", border: "1px solid #FECACA" }}>
              {formError}
            </div>
          )}

          {foundingStep === 1 && (
            <>
              <FormInput
                label="Your name"
                required
                placeholder="Full name"
                value={foundingForm.name}
                onChange={(e) => setFoundingForm({ ...foundingForm, name: e.target.value })}
              />
              <FormInput
                label="Email"
                required
                type="email"
                placeholder="you@example.com"
                value={foundingForm.email}
                onChange={(e) => setFoundingForm({ ...foundingForm, email: e.target.value })}
              />
              <div className="mb-6">
                <label className="block text-sm font-medium mb-3">
                  What role interests you? <span style={{ color: c.periwinkle }}>*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {roleOptions.map((role) => (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() => setFoundingForm({ ...foundingForm, roleType: role.value })}
                      className="p-4 rounded-xl text-sm font-medium transition-all text-center cursor-pointer"
                      style={{
                        border: `2px solid ${foundingForm.roleType === role.value ? c.periwinkleDeep : c.periwinkleMist}`,
                        background: foundingForm.roleType === role.value ? c.lavenderBlush : "#fff",
                        color: c.ink,
                      }}
                    >
                      {role.label}
                    </button>
                  ))}
                </div>
              </div>
              <FormInput
                label="Organization"
                placeholder="Your company or practice (optional)"
                value={foundingForm.organization}
                onChange={(e) => setFoundingForm({ ...foundingForm, organization: e.target.value })}
              />
              <button
                type="button"
                onClick={() => {
                  setFormError("");
                  if (foundingForm.name && foundingForm.email && foundingForm.roleType) {
                    setFoundingStep(2);
                  } else {
                    setFormError("Please fill in your name, email, and select a role.");
                  }
                }}
                className="w-full py-4 rounded-xl text-base font-medium cursor-pointer"
                style={{ background: c.periwinkleDeep, color: "#fff" }}
              >
                Continue
              </button>
            </>
          )}

          {foundingStep === 2 && (
            <>
              <FormTextarea
                label="What draws you to Periwink?"
                required
                placeholder="What resonates with you about what we're building?"
                value={foundingForm.whatDrawsYou}
                onChange={(e) => setFoundingForm({ ...foundingForm, whatDrawsYou: e.target.value })}
              />
              <FormTextarea
                label="What do you hope to offer this community?"
                required
                placeholder="Your expertise, perspective, or contribution..."
                value={foundingForm.whatYouOffer}
                onChange={(e) => setFoundingForm({ ...foundingForm, whatYouOffer: e.target.value })}
              />
              <FormTextarea
                label="How do you approach supporting women in your current work?"
                required
                placeholder="Tell us about your current approach..."
                value={foundingForm.currentApproach}
                onChange={(e) => setFoundingForm({ ...foundingForm, currentApproach: e.target.value })}
              />
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => { setFormError(""); setFoundingStep(1); }}
                  className="flex-1 py-4 rounded-xl text-base font-medium cursor-pointer"
                  style={{ background: c.periwinkleWhisper, color: c.ink }}
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFormError("");
                    if (foundingForm.whatDrawsYou && foundingForm.whatYouOffer && foundingForm.currentApproach) {
                      setFoundingStep(3);
                    } else {
                      setFormError("Please answer all required questions.");
                    }
                  }}
                  className="flex-[2] py-4 rounded-xl text-base font-medium cursor-pointer"
                  style={{ background: c.periwinkleDeep, color: "#fff" }}
                >
                  Continue
                </button>
              </div>
            </>
          )}

          {foundingStep === 3 && (
            <>
              <FormTextarea
                label="What does 'holding space' mean to you?"
                required
                placeholder="In your own words..."
                value={foundingForm.holdingSpace}
                onChange={(e) => setFoundingForm({ ...foundingForm, holdingSpace: e.target.value })}
              />
              <FormTextarea
                label="Anything you'd want to build, create, or contribute?"
                placeholder="Ideas, content, features... (optional)"
                value={foundingForm.wantToBuild}
                onChange={(e) => setFoundingForm({ ...foundingForm, wantToBuild: e.target.value })}
              />
              <FormInput
                label="Website or LinkedIn"
                type="url"
                placeholder="https://..."
                value={foundingForm.website}
                onChange={(e) => setFoundingForm({ ...foundingForm, website: e.target.value })}
              />
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => { setFormError(""); setFoundingStep(2); }}
                  className="flex-1 py-4 rounded-xl text-base font-medium cursor-pointer"
                  style={{ background: c.periwinkleWhisper, color: c.ink }}
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!foundingForm.holdingSpace) {
                      setFormError("Please answer the required question.");
                      return;
                    }
                    handleFoundingSubmit();
                  }}
                  disabled={isSubmitting}
                  className="flex-[2] py-4 rounded-xl text-base font-medium disabled:opacity-50 cursor-pointer"
                  style={{ background: c.periwinkleDeep, color: "#fff" }}
                >
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </button>
              </div>
            </>
          )}
        </div>
      </Modal>

      {/* Success Modal */}
      <Modal isOpen={successModal.open} onClose={() => setSuccessModal({ ...successModal, open: false })}>
        <div className="p-12 text-center">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mx-auto mb-6"
            style={{ background: c.sageSoft }}
          >
            &#10003;
          </div>
          <h4 className="font-display text-2xl mb-3">{successModal.title}</h4>
          <p className="mb-8" style={{ color: c.inkSoft }}>{successModal.message}</p>
          <button
            onClick={() => setSuccessModal({ ...successModal, open: false })}
            className="px-8 py-3 rounded-full text-sm font-medium cursor-pointer"
            style={{ background: c.periwinkleDeep, color: "#fff" }}
          >
            Close
          </button>
        </div>
      </Modal>
    </>
  );
}

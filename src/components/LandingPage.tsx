"use client";

import { useState, useEffect } from "react";

// — Design Tokens —
const colors = {
  // Primary palette
  periwinkle: "#8B7AA8",
  periwinkleDeep: "#6E5A7E",
  periwinkleSoft: "#A799BE",
  periwinkleLight: "#C4B8D6",
  periwinkleMist: "#E8E1F0",
  periwinkleWhisper: "#F5F2F9",
  lavenderBlush: "#F8F4FC",

  // Warm neutrals
  cream: "#FFFCF9",
  warmWhite: "#FEFDFB",
  blush: "#F2E4E6",
  roseSoft: "#E8C4C4",
  sageSoft: "#D4DED0",

  // Text
  ink: "#2D2438",
  inkSoft: "#5C4E6A",
  inkMuted: "#8B7D98",
};

// — Reusable Components —

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
      style={{ background: "rgba(45, 36, 56, 0.6)", backdropFilter: "blur(8px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto relative"
        style={{ animation: "fadeInUp 0.3s ease-out" }}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full flex items-center justify-center text-xl transition-colors"
          style={{ background: colors.periwinkleWhisper, color: colors.inkMuted }}
        >
          ×
        </button>
        {children}
      </div>
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

  // Form states
  const [communityForm, setCommunityForm] = useState({
    name: "",
    email: "",
    pseudonym: "",
  });
  const [foundingForm, setFoundingForm] = useState({
    name: "",
    email: "",
    role: "",
    bio: "",
    url: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleCommunitySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/signup/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(communityForm),
      });
      if (res.ok) {
        setCommunityModalOpen(false);
        setCommunityForm({ name: "", email: "", pseudonym: "" });
        setSuccessModal({
          open: true,
          title: "You're in.",
          message: "Check your email—we'll be in touch soon. We're glad you're here.",
        });
      }
    } catch (error) {
      console.error(error);
    }
    setIsSubmitting(false);
  };

  const handleFoundingSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/signup/founding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(foundingForm),
      });
      if (res.ok) {
        setFoundingModalOpen(false);
        setFoundingStep(1);
        setFoundingForm({ name: "", email: "", role: "", bio: "", url: "" });
        setSuccessModal({
          open: true,
          title: "Application received.",
          message: "We'll review and be in touch within a few days. Thank you for wanting to build with us.",
        });
      }
    } catch (error) {
      console.error(error);
    }
    setIsSubmitting(false);
  };

  const circles = [
    { emoji: "🔥", name: "Bodies in Flux", desc: "Hot flashes, night sweats, and everything your body is doing differently.", members: "2,847" },
    { emoji: "🌙", name: "Sleep & Energy", desc: "Finding rest when your body forgot how. Real strategies that work.", members: "3,201" },
    { emoji: "🧠", name: "Mind & Mood", desc: "The emotional journey—anxiety, clarity, fog, and breakthroughs.", members: "2,956" },
    { emoji: "💊", name: "Treatment Paths", desc: "HRT, alternatives, and everything in between. What's working for whom.", members: "4,102" },
    { emoji: "💜", name: "Identity & Relationships", desc: "Who you're becoming. How your relationships are evolving.", members: "1,890" },
    { emoji: "🌿", name: "Nourishment", desc: "Food, movement, supplements. What feeds you now.", members: "2,103" },
  ];

  const features = [
    { icon: "💬", title: "Shared Circles", desc: "Intimate spaces for real conversations. Topics that matter, with women who truly understand." },
    { icon: "✨", title: "Collective Wisdom", desc: "Learn what actually works from women who've been there. Real insights from lived experience." },
    { icon: "📖", title: "Your Story, Tracked", desc: "Notice patterns in your experience. Understand your body better. Share on your terms." },
    { icon: "🤝", title: "Always Supported", desc: "Feeling understood isn't optional—it's essential. Every interaction helps you feel seen." },
    { icon: "🔒", title: "Truly Private", desc: "Your story is yours. Pseudonymous by default, with full control over what you share." },
    { icon: "🌱", title: "Always Growing", desc: "Periwink evolves with the community. Your voice shapes what we build next." },
  ];

  const roles = [
    "Healthcare Practitioner",
    "Researcher",
    "Content Creator",
    "Community Builder",
  ];

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Outfit:wght@300;400;500;600&display=swap');
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { 
          font-family: 'Outfit', -apple-system, sans-serif;
          background: ${colors.cream};
          color: ${colors.ink};
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
      `}</style>

      {/* Navigation */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          padding: isScrolled ? "12px 0" : "20px 0",
          background: isScrolled ? "rgba(255, 252, 249, 0.95)" : "transparent",
          backdropFilter: isScrolled ? "blur(20px)" : "none",
          boxShadow: isScrolled ? "0 2px 30px rgba(110, 90, 126, 0.08)" : "none",
        }}
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <a href="#" className="font-display text-2xl" style={{ color: colors.periwinkleDeep }}>
            periwink
          </a>
          <div className="flex items-center gap-8">
            <a href="#about" className="hidden md:block text-sm hover:opacity-70 transition-opacity" style={{ color: colors.inkSoft }}>
              Our Story
            </a>
            <a href="#community" className="hidden md:block text-sm hover:opacity-70 transition-opacity" style={{ color: colors.inkSoft }}>
              Community
            </a>
            <a href="#builders" className="hidden md:block text-sm hover:opacity-70 transition-opacity" style={{ color: colors.inkSoft }}>
              Contribute
            </a>
            <button
              onClick={() => setCommunityModalOpen(true)}
              className="px-6 py-3 rounded-full text-sm font-medium transition-all hover:-translate-y-0.5"
              style={{
                background: colors.periwinkleDeep,
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
          background: `linear-gradient(180deg, ${colors.lavenderBlush} 0%, ${colors.cream} 100%)`,
        }}
      >
        {/* Background image - feminine figure */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url('/brand/figure.png')`,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
        
        <div className="max-w-3xl relative z-10">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full text-sm font-medium mb-8 animate-fade-in-up"
            style={{
              background: "rgba(255,255,255,0.9)",
              border: `1px solid ${colors.periwinkleLight}`,
              color: colors.periwinkleDeep,
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
            A wiser way forward—
            <em style={{ color: colors.periwinkleDeep }}>together.</em>
          </h1>

          {/* Subheadline */}
          <p
            className="text-lg md:text-xl mb-4 animate-fade-in-up delay-2"
            style={{ color: colors.inkSoft, maxWidth: "600px", margin: "0 auto", lineHeight: 1.7 }}
          >
            Growth, wisdom, and shared experience—for the women you are becoming.
          </p>
          
          {/* Secondary line */}
          <p
            className="text-base mb-10 animate-fade-in-up delay-3"
            style={{ color: colors.inkMuted, fontStyle: "italic" }}
          >
            More truth. Deeper alignment. More you.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-4">
            <button
              onClick={() => setCommunityModalOpen(true)}
              className="px-8 py-4 rounded-full text-base font-medium transition-all hover:-translate-y-0.5"
              style={{
                background: colors.periwinkleDeep,
                color: "#fff",
                boxShadow: "0 6px 28px rgba(110, 90, 126, 0.35)",
              }}
            >
              Join the Community
            </button>
            <button
              onClick={() => setFoundingModalOpen(true)}
              className="px-8 py-4 rounded-full text-base font-medium transition-all hover:-translate-y-0.5"
              style={{
                background: "#fff",
                color: colors.periwinkleDeep,
                border: `2px solid ${colors.periwinkleDeep}`,
              }}
            >
              Become a Founding Member
            </button>
          </div>

          {/* Social proof */}
          <div className="flex items-center justify-center gap-4 mt-12 animate-fade-in-up delay-5">
            <div className="flex -space-x-3">
              {[colors.periwinkleLight, colors.sageSoft, colors.roseSoft].map((bg, i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full border-2 border-white"
                  style={{ background: `linear-gradient(135deg, ${bg}, ${colors.periwinkleMist})`, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
                />
              ))}
            </div>
            <p className="text-sm" style={{ color: colors.inkMuted }}>
              Join <strong style={{ color: colors.inkSoft }}>2,400+ women</strong> finding their way forward
            </p>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 animate-fade-in delay-5">
          <span className="text-xs tracking-widest uppercase" style={{ color: colors.inkMuted }}>
            Learn more
          </span>
          <div className="w-px h-10" style={{ background: `linear-gradient(${colors.periwinkle}, transparent)` }} />
        </div>
      </section>

      {/* Why Section */}
      <section id="about" className="py-24 px-6" style={{ background: colors.warmWhite }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Image placeholder */}
            <div
              className="aspect-[4/3] rounded-3xl"
              style={{
                background: `linear-gradient(135deg, ${colors.periwinkleMist}, ${colors.lavenderBlush})`,
                backgroundImage: `url('/brand/botanical.png')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
            
            <div>
              <h2 className="font-display text-3xl md:text-4xl leading-tight mb-6">
                This isn't about managing symptoms. It's about{" "}
                <span className="highlight">becoming who you're meant to be.</span>
              </h2>
              <p className="text-base mb-5" style={{ color: colors.inkSoft, lineHeight: 1.8 }}>
                There's a reason so many women feel unseen during this chapter. The conversations that matter most are rarely had. The questions that keep you up at night feel too personal to ask.
              </p>
              <p className="text-base" style={{ color: colors.inkSoft, lineHeight: 1.8 }}>
                Periwink changes that. We're building a space where <span className="highlight">wisdom is shared</span>, where lived experience matters as much as expertise, and where you're never navigating alone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        className="py-24 px-6"
        style={{ background: `linear-gradient(180deg, ${colors.warmWhite} 0%, ${colors.lavenderBlush} 100%)` }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p
              className="text-xs font-semibold tracking-widest uppercase mb-4"
              style={{ color: colors.periwinkle }}
            >
              What we're building
            </p>
            <h2 className="font-display text-3xl md:text-4xl mb-5">
              Better outcomes through connection
            </h2>
            <p className="text-base" style={{ color: colors.inkSoft }}>
              A thoughtful platform where learning happens together, and support feels like belonging.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div
                key={i}
                className="p-8 rounded-3xl transition-all hover:-translate-y-1"
                style={{
                  background: "#fff",
                  border: `1px solid ${colors.periwinkleMist}`,
                  boxShadow: "0 4px 24px rgba(110, 90, 126, 0.06)",
                }}
              >
                <span className="text-3xl mb-5 block">{feature.icon}</span>
                <h3 className="font-display text-xl mb-3">{feature.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: colors.inkSoft }}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Circles Section */}
      <section id="community" className="py-24 px-6" style={{ background: colors.cream }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p
              className="text-xs font-semibold tracking-widest uppercase mb-4"
              style={{ color: colors.periwinkle }}
            >
              Active circles
            </p>
            <h2 className="font-display text-3xl md:text-4xl mb-5">
              Find your people
            </h2>
            <p className="text-base" style={{ color: colors.inkSoft }}>
              Every circle is a safe space for honest conversation. Real women sharing real experiences.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {circles.map((circle, i) => (
              <button
                key={i}
                onClick={() => setCommunityModalOpen(true)}
                className="text-left p-7 rounded-3xl transition-all hover:-translate-y-1 hover:shadow-lg"
                style={{
                  background: `linear-gradient(165deg, #fff 0%, ${colors.lavenderBlush} 100%)`,
                  border: `1px solid ${colors.periwinkleMist}`,
                }}
              >
                <span className="text-4xl mb-4 block">{circle.emoji}</span>
                <h4 className="font-display text-lg mb-2">{circle.name}</h4>
                <p className="text-sm mb-4" style={{ color: colors.inkMuted }}>
                  {circle.desc}
                </p>
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ background: "#7CB07F" }}
                  />
                  <span className="text-sm font-medium" style={{ color: colors.periwinkleDeep }}>
                    {circle.members} sharing
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section
        className="py-24 px-6 text-center"
        style={{ background: colors.periwinkleDeep }}
      >
        <div className="max-w-3xl mx-auto">
          <span className="font-display text-7xl opacity-20 text-white block mb-0">"</span>
          <blockquote
            className="font-display text-2xl md:text-3xl italic text-white leading-relaxed mb-8 -mt-8"
          >
            I've learned more about what's happening in my body from two weeks in Periwink than from a decade of doctor visits. And I finally don't feel like I'm the only one.
          </blockquote>
          <div className="flex items-center justify-center gap-4">
            <div
              className="w-12 h-12 rounded-full"
              style={{ background: `linear-gradient(135deg, ${colors.periwinkleLight}, ${colors.roseSoft})` }}
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

      {/* Builders Section */}
      <section id="builders" className="py-24 px-6" style={{ background: colors.warmWhite }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-display text-3xl md:text-4xl leading-tight mb-6">
                Help us build something that matters.
              </h2>
              <p className="text-base mb-6" style={{ color: colors.inkSoft, lineHeight: 1.8 }}>
                Periwink isn't just a product—it's a collaborative movement. We're looking for practitioners, researchers, creators, and community builders who want to shape what this becomes.
              </p>
              <div className="flex flex-wrap gap-3 mb-8">
                {["Healthcare Practitioners", "Researchers", "Content Creators", "Community Builders", "Brand Partners"].map(
                  (role) => (
                    <span
                      key={role}
                      className="px-5 py-2.5 rounded-full text-sm font-medium"
                      style={{
                        background: colors.lavenderBlush,
                        border: `1px solid ${colors.periwinkleMist}`,
                        color: colors.periwinkleDeep,
                      }}
                    >
                      {role}
                    </span>
                  )
                )}
              </div>
              <button
                onClick={() => setFoundingModalOpen(true)}
                className="px-8 py-4 rounded-full text-base font-medium transition-all hover:-translate-y-0.5"
                style={{
                  background: colors.periwinkleDeep,
                  color: "#fff",
                  boxShadow: "0 6px 28px rgba(110, 90, 126, 0.35)",
                }}
              >
                Apply as a Founding Member
              </button>
            </div>
            
            {/* Image placeholder */}
            <div
              className="aspect-[4/3] rounded-3xl"
              style={{
                background: `linear-gradient(135deg, ${colors.periwinkleMist}, ${colors.lavenderBlush})`,
                backgroundImage: `url('/brand/waves.png')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="py-28 px-6 text-center"
        style={{ background: `linear-gradient(180deg, ${colors.cream} 0%, ${colors.lavenderBlush} 100%)` }}
      >
        <div className="max-w-2xl mx-auto">
          <h2 className="font-display text-4xl md:text-5xl leading-tight mb-5">
            Ready to find your{" "}
            <em style={{ color: colors.periwinkleDeep }}>wiser way forward?</em>
          </h2>
          <p className="text-lg mb-10" style={{ color: colors.inkSoft }}>
            Join thousands of women learning, growing, and navigating change together. Be part of building something meaningful.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setCommunityModalOpen(true)}
              className="px-8 py-4 rounded-full text-base font-medium transition-all hover:-translate-y-0.5"
              style={{
                background: colors.periwinkleDeep,
                color: "#fff",
                boxShadow: "0 6px 28px rgba(110, 90, 126, 0.35)",
              }}
            >
              Join Early Access
            </button>
            <button
              onClick={() => setFoundingModalOpen(true)}
              className="px-8 py-4 rounded-full text-base font-medium transition-all hover:-translate-y-0.5"
              style={{
                background: "transparent",
                color: colors.ink,
                border: `2px solid ${colors.inkMuted}`,
              }}
            >
              Become a Founding Member
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6" style={{ background: colors.ink }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <span className="font-display text-xl text-white">periwink</span>
          <div className="flex gap-8">
            {["Privacy", "Terms", "Contact"].map((link) => (
              <a
                key={link}
                href="#"
                className="text-sm transition-colors hover:text-white"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </footer>

      {/* Community Modal */}
      <Modal isOpen={communityModalOpen} onClose={() => setCommunityModalOpen(false)}>
        <div className="p-10 pt-12 text-center border-b" style={{ borderColor: colors.periwinkleMist }}>
          <h3 className="font-display text-3xl mb-2">Join the Community</h3>
          <p style={{ color: colors.inkMuted }}>You're taking the first step. We'll be in touch soon.</p>
        </div>
        <form onSubmit={handleCommunitySubmit} className="p-10">
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Your name <span style={{ color: colors.periwinkle }}>*</span>
            </label>
            <input
              type="text"
              required
              placeholder="How you'd like to be addressed"
              value={communityForm.name}
              onChange={(e) => setCommunityForm({ ...communityForm, name: e.target.value })}
              className="w-full px-5 py-4 rounded-xl text-base transition-colors"
              style={{ border: `1px solid ${colors.periwinkleMist}`, outline: "none" }}
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Email <span style={{ color: colors.periwinkle }}>*</span>
            </label>
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={communityForm.email}
              onChange={(e) => setCommunityForm({ ...communityForm, email: e.target.value })}
              className="w-full px-5 py-4 rounded-xl text-base transition-colors"
              style={{ border: `1px solid ${colors.periwinkleMist}`, outline: "none" }}
            />
          </div>
          <div className="mb-8">
            <label className="block text-sm font-medium mb-2">
              Choose a pseudonym <span style={{ color: colors.periwinkle }}>*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Your identity in the community"
              value={communityForm.pseudonym}
              onChange={(e) => setCommunityForm({ ...communityForm, pseudonym: e.target.value })}
              className="w-full px-5 py-4 rounded-xl text-base transition-colors"
              style={{ border: `1px solid ${colors.periwinkleMist}`, outline: "none" }}
            />
            <p className="text-sm mt-2" style={{ color: colors.inkMuted }}>
              This is how you'll appear to others. You can stay as anonymous as you'd like.
            </p>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-xl text-base font-medium transition-all disabled:opacity-50"
            style={{ background: colors.periwinkleDeep, color: "#fff" }}
          >
            {isSubmitting ? "Joining..." : "Join Periwink"}
          </button>
        </form>
      </Modal>

      {/* Founding Modal */}
      <Modal
        isOpen={foundingModalOpen}
        onClose={() => {
          setFoundingModalOpen(false);
          setFoundingStep(1);
        }}
      >
        <div className="p-10 pt-12 text-center border-b" style={{ borderColor: colors.periwinkleMist }}>
          <h3 className="font-display text-3xl mb-2">Become a Founding Member</h3>
          <p style={{ color: colors.inkMuted }}>Help shape what Periwink becomes.</p>
        </div>
        <div className="p-10">
          {/* Step indicator */}
          <div className="flex justify-center gap-3 mb-8">
            {[1, 2].map((step) => (
              <div
                key={step}
                className="w-3 h-3 rounded-full transition-all"
                style={{
                  background: foundingStep === step ? colors.periwinkleDeep : colors.periwinkleMist,
                  transform: foundingStep === step ? "scale(1.2)" : "scale(1)",
                }}
              />
            ))}
          </div>

          {foundingStep === 1 ? (
            <>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Your name <span style={{ color: colors.periwinkle }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Full name"
                  value={foundingForm.name}
                  onChange={(e) => setFoundingForm({ ...foundingForm, name: e.target.value })}
                  className="w-full px-5 py-4 rounded-xl text-base"
                  style={{ border: `1px solid ${colors.periwinkleMist}`, outline: "none" }}
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Email <span style={{ color: colors.periwinkle }}>*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={foundingForm.email}
                  onChange={(e) => setFoundingForm({ ...foundingForm, email: e.target.value })}
                  className="w-full px-5 py-4 rounded-xl text-base"
                  style={{ border: `1px solid ${colors.periwinkleMist}`, outline: "none" }}
                />
              </div>
              <div className="mb-8">
                <label className="block text-sm font-medium mb-3">
                  What role interests you? <span style={{ color: colors.periwinkle }}>*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {roles.map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setFoundingForm({ ...foundingForm, role })}
                      className="p-4 rounded-xl text-sm font-medium transition-all text-center"
                      style={{
                        border: `2px solid ${foundingForm.role === role ? colors.periwinkleDeep : colors.periwinkleMist}`,
                        background: foundingForm.role === role ? colors.lavenderBlush : "#fff",
                        color: colors.ink,
                      }}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (foundingForm.name && foundingForm.email && foundingForm.role) {
                    setFoundingStep(2);
                  }
                }}
                className="w-full py-4 rounded-xl text-base font-medium"
                style={{ background: colors.periwinkleDeep, color: "#fff" }}
              >
                Continue
              </button>
            </>
          ) : (
            <>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Tell us about yourself <span style={{ color: colors.periwinkle }}>*</span>
                </label>
                <textarea
                  required
                  placeholder="What draws you to Periwink? What experience or expertise would you bring?"
                  value={foundingForm.bio}
                  onChange={(e) => setFoundingForm({ ...foundingForm, bio: e.target.value })}
                  className="w-full px-5 py-4 rounded-xl text-base min-h-[120px] resize-y"
                  style={{ border: `1px solid ${colors.periwinkleMist}`, outline: "none" }}
                />
              </div>
              <div className="mb-8">
                <label className="block text-sm font-medium mb-2">
                  Website or LinkedIn (optional)
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={foundingForm.url}
                  onChange={(e) => setFoundingForm({ ...foundingForm, url: e.target.value })}
                  className="w-full px-5 py-4 rounded-xl text-base"
                  style={{ border: `1px solid ${colors.periwinkleMist}`, outline: "none" }}
                />
              </div>
              <button
                type="button"
                onClick={handleFoundingSubmit}
                disabled={isSubmitting || !foundingForm.bio}
                className="w-full py-4 rounded-xl text-base font-medium disabled:opacity-50"
                style={{ background: colors.periwinkleDeep, color: "#fff" }}
              >
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </button>
            </>
          )}
        </div>
      </Modal>

      {/* Success Modal */}
      <Modal isOpen={successModal.open} onClose={() => setSuccessModal({ ...successModal, open: false })}>
        <div className="p-12 text-center">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mx-auto mb-6"
            style={{ background: colors.sageSoft }}
          >
            ✓
          </div>
          <h4 className="font-display text-2xl mb-3">{successModal.title}</h4>
          <p style={{ color: colors.inkSoft }}>{successModal.message}</p>
        </div>
      </Modal>
    </>
  );
}

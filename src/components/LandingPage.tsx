"use client";

import { useState, useEffect } from "react";

// ─── Design Tokens ───
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

// ─── Keyframes (CSS-in-JS) ───
const keyframes = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(40px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulse {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 0.8; }
  }
`;

// ─── Modal Component ───
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

function Modal({ isOpen, onClose, children }: ModalProps) {
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

// ─── Community Signup Modal Content ───
function CommunitySignupForm({ onSuccess }: { onSuccess: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", pseudonym: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/signup/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) onSuccess();
      else alert("Something went wrong. Please try again.");
    } catch {
      onSuccess(); // Show success for demo
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="px-10 pt-10 pb-6 text-center border-b" style={{ borderColor: colors.periwinkleMist }}>
        <h3 className="text-2xl font-normal mb-2" style={{ fontFamily: "'Playfair Display', serif", color: colors.ink }}>
          Join the Community
        </h3>
        <p className="text-sm" style={{ color: colors.inkMuted }}>
          You're taking the first step. We'll be in touch soon.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="p-10 pt-8">
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2" style={{ color: colors.ink }}>
            Your name <span style={{ color: colors.periwinkle }}>*</span>
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="How should we address you?"
            className="w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none"
            style={{ borderColor: colors.periwinkleMist, color: colors.ink }}
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2" style={{ color: colors.ink }}>
            Email <span style={{ color: colors.periwinkle }}>*</span>
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="your@email.com"
            className="w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none"
            style={{ borderColor: colors.periwinkleMist, color: colors.ink }}
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2" style={{ color: colors.ink }}>
            Choose a pseudonym <span style={{ color: colors.periwinkle }}>*</span>
          </label>
          <input
            type="text"
            required
            value={formData.pseudonym}
            onChange={(e) => setFormData({ ...formData, pseudonym: e.target.value })}
            placeholder="Your community name"
            className="w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none"
            style={{ borderColor: colors.periwinkleMist, color: colors.ink }}
          />
          <p className="text-xs mt-2" style={{ color: colors.inkMuted }}>
            This is how you'll appear to others. You can stay as anonymous as you'd like.
          </p>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 rounded-xl text-white font-medium transition-all disabled:opacity-60"
          style={{ background: colors.periwinkleDeep }}
        >
          {isSubmitting ? "Joining..." : "Join Periwink"}
        </button>
      </form>
    </div>
  );
}

// ─── Founding Member Modal Content ───
function FoundingMemberForm({ onSuccess }: { onSuccess: () => void }) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    roleType: "",
    bio: "",
    url: "",
  });

  const roles = [
    { value: "practitioner", label: "Healthcare Practitioner" },
    { value: "researcher", label: "Researcher" },
    { value: "creator", label: "Content Creator" },
    { value: "builder", label: "Community Builder" },
  ];

  const handleSubmit = async () => {
    if (!formData.bio) {
      alert("Please tell us about yourself.");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/signup/founding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) onSuccess();
      else alert("Something went wrong. Please try again.");
    } catch {
      onSuccess(); // Show success for demo
    } finally {
      setIsSubmitting(false);
    }
  };

  const goToStep2 = () => {
    if (!formData.name || !formData.email || !formData.roleType) {
      alert("Please fill in all required fields and select a role.");
      return;
    }
    setStep(2);
  };

  return (
    <div>
      <div className="px-10 pt-10 pb-6 text-center border-b" style={{ borderColor: colors.periwinkleMist }}>
        <h3 className="text-2xl font-normal mb-2" style={{ fontFamily: "'Playfair Display', serif", color: colors.ink }}>
          Become a Founding Member
        </h3>
        <p className="text-sm" style={{ color: colors.inkMuted }}>
          Help shape what Periwink becomes.
        </p>
      </div>
      <div className="p-10 pt-8">
        {/* Step indicator */}
        <div className="flex justify-center gap-3 mb-6">
          <span
            className="w-2.5 h-2.5 rounded-full transition-all"
            style={{
              background: step === 1 ? colors.periwinkleDeep : colors.periwinkleMist,
              transform: step === 1 ? "scale(1.2)" : "scale(1)",
            }}
          />
          <span
            className="w-2.5 h-2.5 rounded-full transition-all"
            style={{
              background: step === 2 ? colors.periwinkleDeep : colors.periwinkleMist,
              transform: step === 2 ? "scale(1.2)" : "scale(1)",
            }}
          />
        </div>

        {step === 1 ? (
          <>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2" style={{ color: colors.ink }}>
                Your name <span style={{ color: colors.periwinkle }}>*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Full name"
                className="w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none"
                style={{ borderColor: colors.periwinkleMist, color: colors.ink }}
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2" style={{ color: colors.ink }}>
                Email <span style={{ color: colors.periwinkle }}>*</span>
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your@email.com"
                className="w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none"
                style={{ borderColor: colors.periwinkleMist, color: colors.ink }}
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2" style={{ color: colors.ink }}>
                What role interests you? <span style={{ color: colors.periwinkle }}>*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                {roles.map((role) => (
                  <button
                    key={role.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, roleType: role.value })}
                    className="p-4 rounded-xl border-2 text-center text-sm font-medium transition-all"
                    style={{
                      borderColor: formData.roleType === role.value ? colors.periwinkleDeep : colors.periwinkleMist,
                      background: formData.roleType === role.value ? colors.lavenderBlush : "white",
                      color: colors.ink,
                    }}
                  >
                    {role.label}
                  </button>
                ))}
              </div>
            </div>
            <button
              type="button"
              onClick={goToStep2}
              className="w-full py-4 rounded-xl text-white font-medium transition-all"
              style={{ background: colors.periwinkleDeep }}
            >
              Continue
            </button>
          </>
        ) : (
          <>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2" style={{ color: colors.ink }}>
                Tell us about yourself <span style={{ color: colors.periwinkle }}>*</span>
              </label>
              <textarea
                required
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="What draws you to Periwink? What experience or expertise would you bring?"
                className="w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none min-h-[120px] resize-y"
                style={{ borderColor: colors.periwinkleMist, color: colors.ink }}
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2" style={{ color: colors.ink }}>
                Website or LinkedIn (optional)
              </label>
              <input
                type="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://..."
                className="w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none"
                style={{ borderColor: colors.periwinkleMist, color: colors.ink }}
              />
            </div>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full py-4 rounded-xl text-white font-medium transition-all disabled:opacity-60"
              style={{ background: colors.periwinkleDeep }}
            >
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Success Message ───
function SuccessMessage({ title, message }: { title: string; message: string }) {
  return (
    <div className="p-10 text-center">
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mx-auto mb-5"
        style={{ background: colors.sageSoft }}
      >
        ✓
      </div>
      <h4 className="text-2xl font-normal mb-3" style={{ fontFamily: "'Playfair Display', serif", color: colors.ink }}>
        {title}
      </h4>
      <p style={{ color: colors.inkSoft }}>{message}</p>
    </div>
  );
}

// ─── Main Landing Page Component ───
export default function LandingPage() {
  const [showCommunityModal, setShowCommunityModal] = useState(false);
  const [showFoundingModal, setShowFoundingModal] = useState(false);
  const [communitySuccess, setCommunitySuccess] = useState(false);
  const [foundingSuccess, setFoundingSuccess] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeCommunityModal = () => {
    setShowCommunityModal(false);
    setTimeout(() => setCommunitySuccess(false), 300);
  };

  const closeFoundingModal = () => {
    setShowFoundingModal(false);
    setTimeout(() => setFoundingSuccess(false), 300);
  };

  // Circle data
  const circles = [
    { emoji: "🔥", title: "Bodies in Flux", desc: "Hot flashes, night sweats, and everything your body is doing differently.", members: "2,847" },
    { emoji: "🌙", title: "Sleep & Energy", desc: "Finding rest when your body forgot how. Real strategies that work.", members: "3,201" },
    { emoji: "🧠", title: "Mind & Mood", desc: "The emotional journey—anxiety, clarity, fog, and breakthroughs.", members: "2,956" },
    { emoji: "💊", title: "Treatment Paths", desc: "HRT, alternatives, and everything in between. What's working for whom.", members: "4,102" },
    { emoji: "💜", title: "Identity & Relationships", desc: "Who you're becoming. How your relationships are evolving.", members: "1,890" },
    { emoji: "🌿", title: "Nourishment", desc: "Food, movement, supplements. What feeds you now.", members: "2,103" },
  ];

  // Pillar data
  const pillars = [
    { icon: "💬", title: "Shared Circles", desc: "Intimate spaces for real conversations. Topics that matter, with women who truly understand." },
    { icon: "✨", title: "Collective Wisdom", desc: "Learn what actually works from women who've been there. Real insights from lived experience." },
    { icon: "📖", title: "Your Story, Tracked", desc: "Notice patterns in your experience. Understand your body better. Share on your terms." },
    { icon: "🤝", title: "Always Supported", desc: "Feeling understood isn't optional—it's essential. Every interaction helps you feel seen." },
    { icon: "🔒", title: "Truly Private", desc: "Your story is yours. Pseudonymous by default, with full control over what you share." },
    { icon: "🌱", title: "Always Growing", desc: "Periwink evolves with the community. Your voice shapes what we build next." },
  ];

  return (
    <>
      <style>{keyframes}</style>

      {/* Navigation */}
      <nav
        className="fixed top-0 left-0 right-0 z-40 transition-all duration-300"
        style={{
          padding: scrolled ? "14px 0" : "20px 0",
          background: scrolled ? "rgba(255, 252, 249, 0.95)" : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          boxShadow: scrolled ? "0 2px 30px rgba(110, 90, 126, 0.08)" : "none",
        }}
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <a href="#" className="text-2xl font-normal" style={{ fontFamily: "'Playfair Display', serif", color: colors.periwinkleDeep }}>
            periwink
          </a>
          <div className="flex items-center gap-8">
            <a href="#about" className="text-sm hidden md:block" style={{ color: colors.inkSoft }}>Our Story</a>
            <a href="#community" className="text-sm hidden md:block" style={{ color: colors.inkSoft }}>Community</a>
            <a href="#builders" className="text-sm hidden md:block" style={{ color: colors.inkSoft }}>Contribute</a>
            <button
              onClick={() => setShowCommunityModal(true)}
              className="px-6 py-3 rounded-full text-sm font-medium text-white transition-all hover:-translate-y-0.5"
              style={{ background: colors.periwinkleDeep, boxShadow: "0 4px 20px rgba(110, 90, 126, 0.3)" }}
            >
              Join Early
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        className="min-h-screen flex items-center justify-center text-center relative overflow-hidden"
        style={{ padding: "120px 24px 80px", background: `linear-gradient(180deg, ${colors.lavenderBlush} 0%, ${colors.cream} 100%)` }}
      >
        <div className="relative z-10 max-w-2xl mx-auto">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium mb-7"
            style={{
              background: "rgba(255, 255, 255, 0.9)",
              border: `1px solid ${colors.periwinkleLight}`,
              color: colors.periwinkleDeep,
              animation: "fadeInUp 0.8s ease-out 0.2s both",
            }}
          >
            <span className="w-2 h-2 rounded-full" style={{ background: "#7CB07F", animation: "pulse 2s ease-in-out infinite" }} />
            Building something meaningful
          </div>

          {/* Headline */}
          <h1
            className="text-4xl md:text-6xl font-normal leading-tight mb-6"
            style={{ fontFamily: "'Playfair Display', serif", color: colors.ink, animation: "fadeInUp 0.8s ease-out 0.4s both" }}
          >
            A wiser way forward—<em style={{ color: colors.periwinkleDeep }}>together.</em>
          </h1>

          {/* Subtitle */}
          <p
            className="text-lg leading-relaxed mb-9 max-w-xl mx-auto"
            style={{ color: colors.inkSoft, animation: "fadeInUp 0.8s ease-out 0.6s both" }}
          >
            Growth, wisdom, and shared experience—for the women you are becoming. Where real conversations lead to real understanding.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center" style={{ animation: "fadeInUp 0.8s ease-out 0.8s both" }}>
            <button
              onClick={() => setShowCommunityModal(true)}
              className="px-9 py-4 rounded-full text-base font-medium text-white transition-all hover:-translate-y-0.5"
              style={{ background: colors.periwinkleDeep, boxShadow: "0 4px 20px rgba(110, 90, 126, 0.3)" }}
            >
              Join the Community
            </button>
            <button
              onClick={() => setShowFoundingModal(true)}
              className="px-9 py-4 rounded-full text-base font-medium transition-all hover:-translate-y-0.5"
              style={{ background: "#fff", color: colors.periwinkleDeep, border: `2px solid ${colors.periwinkleDeep}` }}
            >
              Become a Founding Member
            </button>
          </div>

          {/* Social proof */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12" style={{ animation: "fadeInUp 0.8s ease-out 1s both" }}>
            <div className="flex">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-9 h-9 rounded-full border-2 border-white"
                  style={{
                    marginLeft: i > 0 ? "-10px" : 0,
                    background: i === 0 ? `linear-gradient(135deg, ${colors.periwinkleLight}, ${colors.roseSoft})` :
                               i === 1 ? `linear-gradient(135deg, ${colors.sageSoft}, ${colors.periwinkleLight})` :
                               `linear-gradient(135deg, ${colors.roseSoft}, ${colors.blush})`,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  }}
                />
              ))}
            </div>
            <p className="text-sm" style={{ color: colors.inkMuted }}>
              Join <strong style={{ color: colors.inkSoft, fontWeight: 500 }}>2,400+ women</strong> finding their way forward
            </p>
          </div>
        </div>
      </section>

      {/* Why Section */}
      <section id="about" className="py-24 px-6" style={{ background: colors.warmWhite }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-gradient-to-br from-periwinkle-mist to-lavender-blush" style={{ background: `linear-gradient(135deg, ${colors.periwinkleMist}, ${colors.lavenderBlush})` }} />
            <div>
              <h2 className="text-3xl md:text-4xl font-normal leading-snug mb-6" style={{ fontFamily: "'Playfair Display', serif", color: colors.ink }}>
                This isn't about managing symptoms. It's about{" "}
                <span style={{ background: `linear-gradient(180deg, transparent 60%, rgba(196, 184, 214, 0.35) 60%)`, padding: "0 2px" }}>
                  becoming who you're meant to be.
                </span>
              </h2>
              <p className="text-base leading-relaxed mb-4" style={{ color: colors.inkSoft }}>
                There's a reason so many women feel unseen during this chapter. The conversations that matter most are rarely had. The questions that keep you up at night feel too personal to ask.
              </p>
              <p className="text-base leading-relaxed" style={{ color: colors.inkSoft }}>
                Periwink changes that. We're building a space where{" "}
                <span style={{ background: `linear-gradient(180deg, transparent 60%, rgba(196, 184, 214, 0.35) 60%)`, padding: "0 2px" }}>
                  wisdom is shared
                </span>
                , where lived experience matters as much as expertise, and where you're never navigating alone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pillars Section */}
      <section className="py-24 px-6" style={{ background: `linear-gradient(180deg, ${colors.warmWhite} 0%, ${colors.lavenderBlush} 100%)` }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-16">
            <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: colors.periwinkle }}>What we're building</p>
            <h2 className="text-3xl md:text-4xl font-normal leading-snug mb-4" style={{ fontFamily: "'Playfair Display', serif", color: colors.ink }}>
              Better outcomes through connection
            </h2>
            <p className="text-base" style={{ color: colors.inkSoft }}>
              A thoughtful platform where learning happens together, and support feels like belonging.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pillars.map((pillar, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-8 border transition-all hover:-translate-y-1.5"
                style={{ borderColor: colors.periwinkleMist, boxShadow: "0 4px 20px rgba(110, 90, 126, 0)" }}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 20px 50px rgba(110, 90, 126, 0.12)")}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 4px 20px rgba(110, 90, 126, 0)")}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-5"
                  style={{ background: colors.lavenderBlush }}
                >
                  {pillar.icon}
                </div>
                <h3 className="text-xl font-medium mb-3" style={{ fontFamily: "'Playfair Display', serif", color: colors.ink }}>
                  {pillar.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: colors.inkSoft }}>{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Circles Section */}
      <section id="community" className="py-24 px-6" style={{ background: colors.cream }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-16">
            <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: colors.periwinkle }}>Active circles</p>
            <h2 className="text-3xl md:text-4xl font-normal leading-snug mb-4" style={{ fontFamily: "'Playfair Display', serif", color: colors.ink }}>
              Find your people
            </h2>
            <p className="text-base" style={{ color: colors.inkSoft }}>
              Every circle is a safe space for honest conversation. Real women sharing real experiences.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {circles.map((circle, i) => (
              <button
                key={i}
                onClick={() => setShowCommunityModal(true)}
                className="text-left rounded-2xl p-8 border transition-all hover:-translate-y-1"
                style={{
                  background: `linear-gradient(165deg, #fff 0%, ${colors.lavenderBlush} 100%)`,
                  borderColor: colors.periwinkleMist,
                }}
              >
                <span className="text-4xl block mb-4">{circle.emoji}</span>
                <h4 className="text-lg font-medium mb-2" style={{ fontFamily: "'Playfair Display', serif", color: colors.ink }}>
                  {circle.title}
                </h4>
                <p className="text-sm mb-4" style={{ color: colors.inkMuted }}>{circle.desc}</p>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ background: "#7CB07F" }} />
                  <span className="text-xs font-medium" style={{ color: colors.periwinkleDeep }}>{circle.members} sharing</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-24 px-6 relative overflow-hidden" style={{ background: colors.periwinkleDeep }}>
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <p
            className="text-2xl md:text-3xl font-normal italic leading-relaxed text-white mb-8"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            <span className="text-5xl block mb-4" style={{ color: "rgba(255,255,255,0.3)" }}>"</span>
            I've learned more about what's happening in my body from two weeks in Periwink than from a decade of doctor visits. And I finally don't feel like I'm the only one.
          </p>
          <div className="flex items-center justify-center gap-4">
            <div
              className="w-12 h-12 rounded-full"
              style={{ background: `linear-gradient(135deg, ${colors.periwinkleLight}, ${colors.roseSoft})` }}
            />
            <div className="text-left">
              <p className="text-white font-medium">Sarah M.</p>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>Member since January</p>
            </div>
          </div>
        </div>
      </section>

      {/* Builders Section */}
      <section id="builders" className="py-24 px-6" style={{ background: colors.warmWhite }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-normal leading-snug mb-6" style={{ fontFamily: "'Playfair Display', serif", color: colors.ink }}>
                Help us build something that matters.
              </h2>
              <p className="text-base leading-relaxed mb-6" style={{ color: colors.inkSoft }}>
                Periwink isn't just a product—it's a collaborative movement. We're looking for practitioners, researchers, creators, and community builders who want to shape what this becomes.
              </p>
              <div className="flex flex-wrap gap-2 mb-8">
                {["Healthcare Practitioners", "Researchers", "Content Creators", "Community Builders", "Brand Partners"].map((role) => (
                  <span
                    key={role}
                    className="px-5 py-2.5 rounded-full text-sm font-medium"
                    style={{ background: colors.lavenderBlush, color: colors.periwinkleDeep, border: `1px solid ${colors.periwinkleMist}` }}
                  >
                    {role}
                  </span>
                ))}
              </div>
              <button
                onClick={() => setShowFoundingModal(true)}
                className="px-8 py-4 rounded-full text-base font-medium text-white transition-all hover:-translate-y-0.5"
                style={{ background: colors.periwinkleDeep, boxShadow: "0 4px 20px rgba(110, 90, 126, 0.3)" }}
              >
                Apply as a Founding Member
              </button>
            </div>
            <div className="aspect-[4/3] rounded-3xl overflow-hidden" style={{ background: `linear-gradient(135deg, ${colors.periwinkleMist}, ${colors.lavenderBlush})` }} />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6 text-center" style={{ background: `linear-gradient(180deg, ${colors.cream} 0%, ${colors.lavenderBlush} 100%)` }}>
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-normal leading-tight mb-6" style={{ fontFamily: "'Playfair Display', serif", color: colors.ink }}>
            Ready to find your <em style={{ color: colors.periwinkleDeep }}>wiser way forward?</em>
          </h2>
          <p className="text-lg leading-relaxed mb-10" style={{ color: colors.inkSoft }}>
            Join thousands of women learning, growing, and navigating change together. It's free to join, and you'll be part of building something meaningful.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setShowCommunityModal(true)}
              className="px-10 py-5 rounded-full text-base font-medium text-white transition-all hover:-translate-y-0.5"
              style={{ background: colors.periwinkleDeep, boxShadow: "0 4px 20px rgba(110, 90, 126, 0.3)" }}
            >
              Join Early Access
            </button>
            <button
              onClick={() => setShowFoundingModal(true)}
              className="px-10 py-5 rounded-full text-base font-medium transition-all hover:-translate-y-0.5"
              style={{ color: colors.ink, border: `2px solid ${colors.inkMuted}` }}
            >
              Become a Founding Member
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6" style={{ background: colors.ink }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <span className="text-xl" style={{ fontFamily: "'Playfair Display', serif", color: "#fff" }}>periwink</span>
          <div className="flex gap-8">
            <a href="#" className="text-sm transition-colors hover:text-white" style={{ color: "rgba(255,255,255,0.5)" }}>Privacy</a>
            <a href="#" className="text-sm transition-colors hover:text-white" style={{ color: "rgba(255,255,255,0.5)" }}>Terms</a>
            <a href="#" className="text-sm transition-colors hover:text-white" style={{ color: "rgba(255,255,255,0.5)" }}>Contact</a>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <Modal isOpen={showCommunityModal} onClose={closeCommunityModal}>
        {communitySuccess ? (
          <SuccessMessage title="You're in!" message="Check your email for next steps. We're so glad you're here." />
        ) : (
          <CommunitySignupForm onSuccess={() => setCommunitySuccess(true)} />
        )}
      </Modal>

      <Modal isOpen={showFoundingModal} onClose={closeFoundingModal}>
        {foundingSuccess ? (
          <SuccessMessage title="Application received!" message="We'll review your application and be in touch within a few days." />
        ) : (
          <FoundingMemberForm onSuccess={() => setFoundingSuccess(true)} />
        )}
      </Modal>
    </>
  );
}

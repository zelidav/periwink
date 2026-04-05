"use client";

import { useState, useEffect } from "react";

// ─── Design Tokens ───
const colors = {
  // Primary palette
  periwinkle: "#8C92FF",
  softPeriwinkle: "#A7AEFF",
  lavender: "#B7A8C9",
  dustyPlum: "#6E5A7E",
  deepPlum: "#5A4869",
  
  // Warm neutrals
  warmIvory: "#F7F3EE",
  ivory2: "#F2EDE6",
  ivory3: "#EBE5DC",
  softMist: "#E8E3EA",
  
  // Accents
  mutedRose: "#C99AA5",
  roseLight: "#D4B0B9",
  softGlow: "#D7CCFF",
  dusk: "#9B8AA8",
  
  // Text
  ink: "#2B2433",
  text2: "#6B6575",
  text3: "#9B94A3",
  
  // UI
  border: "#E2DDE8",
  borderWarm: "#DDD7CE",
  card: "#FDFBF8",
};

const fonts = {
  heading: "'Cormorant Garamond', Georgia, serif",
  body: "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif",
};

// ─── Animations ───
const fadeUpKeyframes = `
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes breathe {
    0%, 100% { opacity: 0.4; }
    50% { opacity: 0.7; }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  @keyframes draw {
    to { stroke-dashoffset: 0; }
  }
`;

// ─── Background Art ───
function BackgroundArt() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
      {/* Gradient orbs */}
      <div style={{
        position: "absolute",
        top: "10%",
        right: "5%",
        width: "40vw",
        height: "40vw",
        maxWidth: 500,
        maxHeight: 500,
        background: `radial-gradient(circle, ${colors.softGlow}20 0%, transparent 70%)`,
        borderRadius: "50%",
        animation: "float 12s ease-in-out infinite",
      }} />
      <div style={{
        position: "absolute",
        top: "50%",
        left: "-10%",
        width: "50vw",
        height: "50vw",
        maxWidth: 600,
        maxHeight: 600,
        background: `radial-gradient(circle, ${colors.lavender}15 0%, transparent 70%)`,
        borderRadius: "50%",
        animation: "float 15s ease-in-out infinite 2s",
      }} />
      <div style={{
        position: "absolute",
        bottom: "10%",
        right: "20%",
        width: "30vw",
        height: "30vw",
        maxWidth: 400,
        maxHeight: 400,
        background: `radial-gradient(circle, ${colors.mutedRose}12 0%, transparent 70%)`,
        borderRadius: "50%",
        animation: "float 10s ease-in-out infinite 4s",
      }} />
      
      {/* Subtle line art */}
      <svg style={{ position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)", width: "80vw", maxWidth: 900, height: "auto", opacity: 0.08 }} viewBox="0 0 400 300" fill="none">
        <path d="M50 250 Q100 100 200 150 T350 100" stroke={colors.dustyPlum} strokeWidth="1" fill="none" />
        <path d="M0 200 Q150 50 250 200 T400 150" stroke={colors.lavender} strokeWidth="0.8" fill="none" />
        <circle cx="200" cy="150" r="80" stroke={colors.softPeriwinkle} strokeWidth="0.5" fill="none" opacity="0.5" />
      </svg>
    </div>
  );
}

// ─── Form Components ───
function Input({ 
  label, 
  type = "text", 
  value, 
  onChange, 
  placeholder,
  required = false,
}: { 
  label: string; 
  type?: string; 
  value: string; 
  onChange: (v: string) => void; 
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ 
        display: "block", 
        fontSize: 13, 
        fontWeight: 500, 
        color: colors.ink, 
        marginBottom: 8,
        fontFamily: fonts.body,
      }}>
        {label}{required && <span style={{ color: colors.mutedRose }}> *</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        style={{
          width: "100%",
          padding: "14px 18px",
          fontSize: 15,
          fontFamily: fonts.body,
          border: `1.5px solid ${colors.borderWarm}`,
          borderRadius: 14,
          background: colors.card,
          color: colors.ink,
          outline: "none",
          transition: "border-color 0.2s, box-shadow 0.2s",
        }}
        onFocus={(e) => {
          e.target.style.borderColor = colors.lavender;
          e.target.style.boxShadow = `0 0 0 3px ${colors.softGlow}30`;
        }}
        onBlur={(e) => {
          e.target.style.borderColor = colors.borderWarm;
          e.target.style.boxShadow = "none";
        }}
      />
    </div>
  );
}

function TextArea({ 
  label, 
  value, 
  onChange, 
  placeholder,
  required = false,
  hint,
}: { 
  label: string; 
  value: string; 
  onChange: (v: string) => void; 
  placeholder?: string;
  required?: boolean;
  hint?: string;
}) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ 
        display: "block", 
        fontSize: 13, 
        fontWeight: 500, 
        color: colors.ink, 
        marginBottom: 6,
        fontFamily: fonts.body,
      }}>
        {label}{required && <span style={{ color: colors.mutedRose }}> *</span>}
      </label>
      {hint && (
        <p style={{ 
          fontSize: 12, 
          color: colors.text3, 
          margin: "0 0 8px",
          fontStyle: "italic",
          fontFamily: fonts.body,
        }}>
          {hint}
        </p>
      )}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        rows={4}
        style={{
          width: "100%",
          padding: "14px 18px",
          fontSize: 15,
          fontFamily: fonts.body,
          border: `1.5px solid ${colors.borderWarm}`,
          borderRadius: 14,
          background: colors.card,
          color: colors.ink,
          outline: "none",
          resize: "vertical",
          minHeight: 100,
          transition: "border-color 0.2s, box-shadow 0.2s",
        }}
        onFocus={(e) => {
          e.target.style.borderColor = colors.lavender;
          e.target.style.boxShadow = `0 0 0 3px ${colors.softGlow}30`;
        }}
        onBlur={(e) => {
          e.target.style.borderColor = colors.borderWarm;
          e.target.style.boxShadow = "none";
        }}
      />
    </div>
  );
}

function Select({ 
  label, 
  value, 
  onChange, 
  options,
  required = false,
}: { 
  label: string; 
  value: string; 
  onChange: (v: string) => void; 
  options: { value: string; label: string }[];
  required?: boolean;
}) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ 
        display: "block", 
        fontSize: 13, 
        fontWeight: 500, 
        color: colors.ink, 
        marginBottom: 8,
        fontFamily: fonts.body,
      }}>
        {label}{required && <span style={{ color: colors.mutedRose }}> *</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        style={{
          width: "100%",
          padding: "14px 18px",
          fontSize: 15,
          fontFamily: fonts.body,
          border: `1.5px solid ${colors.borderWarm}`,
          borderRadius: 14,
          background: colors.card,
          color: value ? colors.ink : colors.text3,
          outline: "none",
          cursor: "pointer",
          appearance: "none",
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%239B94A3' d='M6 8L2 4h8z'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 16px center",
        }}
      >
        <option value="">Select...</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

function Button({ 
  children, 
  onClick, 
  variant = "primary",
  loading = false,
  disabled = false,
  style: customStyle = {},
}: { 
  children: React.ReactNode; 
  onClick?: () => void; 
  variant?: "primary" | "secondary" | "ghost";
  loading?: boolean;
  disabled?: boolean;
  style?: React.CSSProperties;
}) {
  const baseStyle: React.CSSProperties = {
    padding: "16px 32px",
    fontSize: 15,
    fontWeight: 500,
    fontFamily: fonts.body,
    borderRadius: 28,
    cursor: disabled || loading ? "not-allowed" : "pointer",
    transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    opacity: disabled || loading ? 0.6 : 1,
  };

  const variants = {
    primary: {
      background: colors.dustyPlum,
      color: "rgba(255,255,255,0.95)",
      border: `2px solid ${colors.dustyPlum}`,
    },
    secondary: {
      background: "transparent",
      color: colors.dustyPlum,
      border: `2px solid ${colors.dustyPlum}`,
    },
    ghost: {
      background: "transparent",
      color: colors.text2,
      border: "2px solid transparent",
    },
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      style={{ ...baseStyle, ...variants[variant], ...customStyle }}
      onMouseEnter={(e) => {
        if (!disabled && !loading) {
          if (variant === "primary") {
            e.currentTarget.style.background = colors.deepPlum;
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = `0 10px 30px ${colors.dustyPlum}40`;
          } else if (variant === "secondary") {
            e.currentTarget.style.background = colors.dustyPlum;
            e.currentTarget.style.color = "rgba(255,255,255,0.95)";
          }
        }
      }}
      onMouseLeave={(e) => {
        if (variant === "primary") {
          e.currentTarget.style.background = colors.dustyPlum;
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "none";
        } else if (variant === "secondary") {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = colors.dustyPlum;
        }
      }}
    >
      {loading && (
        <span style={{
          width: 16,
          height: 16,
          border: `2px solid ${variant === "primary" ? "rgba(255,255,255,0.3)" : colors.lavender}`,
          borderTopColor: variant === "primary" ? "rgba(255,255,255,0.9)" : colors.dustyPlum,
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }} />
      )}
      {children}
    </button>
  );
}

// ─── Modal ───
function Modal({ 
  isOpen, 
  onClose, 
  children 
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

  if (!isOpen) return null;

  return (
    <div 
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
      onClick={onClose}
    >
      <div style={{
        position: "absolute",
        inset: 0,
        background: "rgba(43, 36, 51, 0.4)",
        backdropFilter: "blur(8px)",
        animation: "fadeIn 0.3s ease",
      }} />
      <div 
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 540,
          maxHeight: "90vh",
          overflow: "auto",
          background: colors.warmIvory,
          borderRadius: 28,
          boxShadow: "0 25px 80px rgba(43, 36, 51, 0.25)",
          animation: "fadeUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 20,
            right: 20,
            width: 36,
            height: 36,
            borderRadius: "50%",
            border: "none",
            background: colors.ivory2,
            color: colors.text2,
            fontSize: 20,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
          }}
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}

// ─── Community Signup Form ───
function CommunitySignupForm({ onSuccess }: { onSuccess: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pseudonym, setPseudonym] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/signup/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, pseudonym }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setLoading(false);
        return;
      }

      onSuccess();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "48px 40px" }}>
      <h2 style={{ 
        fontFamily: fonts.heading, 
        fontSize: 32, 
        fontWeight: 300, 
        color: colors.ink, 
        margin: "0 0 12px",
        textAlign: "center",
      }}>
        Join the Community
      </h2>
      <p style={{ 
        fontSize: 15, 
        color: colors.text2, 
        textAlign: "center", 
        margin: "0 0 32px",
        lineHeight: 1.6,
        fontFamily: fonts.body,
      }}>
        You&apos;re taking the first step. We&apos;ll be in touch soon.
      </p>

      <Input
        label="Your name"
        value={name}
        onChange={setName}
        placeholder="How you'd like to be addressed"
        required
      />

      <Input
        label="Email"
        type="email"
        value={email}
        onChange={setEmail}
        placeholder="you@example.com"
        required
      />

      <Input
        label="Choose a pseudonym"
        value={pseudonym}
        onChange={setPseudonym}
        placeholder="Your identity in the community"
        required
      />
      <p style={{ 
        fontSize: 12, 
        color: colors.text3, 
        margin: "-12px 0 24px",
        fontStyle: "italic",
        fontFamily: fonts.body,
      }}>
        This is how you&apos;ll appear to others. You can stay as anonymous as you&apos;d like.
      </p>

      {error && (
        <p style={{ 
          fontSize: 14, 
          color: "#c44", 
          textAlign: "center", 
          margin: "0 0 20px",
          fontFamily: fonts.body,
        }}>
          {error}
        </p>
      )}

      <Button 
        onClick={handleSubmit} 
        loading={loading}
        disabled={!name || !email || !pseudonym}
        style={{ width: "100%" }}
      >
        Join Periwink
      </Button>
    </div>
  );
}

// ─── Founding Member Form ───
function FoundingMemberForm({ onSuccess }: { onSuccess: () => void }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Basic info
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [roleType, setRoleType] = useState("");
  const [organization, setOrganization] = useState("");
  const [website, setWebsite] = useState("");

  // Questions
  const [whatDrawsYou, setWhatDrawsYou] = useState("");
  const [whatYouOffer, setWhatYouOffer] = useState("");
  const [currentApproach, setCurrentApproach] = useState("");
  const [holdingSpace, setHoldingSpace] = useState("");
  const [wantToBuild, setWantToBuild] = useState("");
  const [anythingElse, setAnythingElse] = useState("");

  const roleOptions = [
    { value: "PRACTITIONER", label: "Healthcare Practitioner" },
    { value: "RESEARCHER", label: "Researcher" },
    { value: "BRAND_PARTNER", label: "Brand / Product Partner" },
    { value: "CONTENT_CREATOR", label: "Content Creator / Educator" },
    { value: "COMMUNITY_BUILDER", label: "Community Builder / Moderator" },
  ];

  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/signup/founding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          roleType,
          organization,
          website,
          whatDrawsYou,
          whatYouOffer,
          currentApproach,
          holdingSpace,
          wantToBuild,
          anythingElse,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setLoading(false);
        return;
      }

      onSuccess();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "48px 40px" }}>
      <h2 style={{ 
        fontFamily: fonts.heading, 
        fontSize: 32, 
        fontWeight: 300, 
        color: colors.ink, 
        margin: "0 0 12px",
        textAlign: "center",
      }}>
        Become a Founding Member
      </h2>
      <p style={{ 
        fontSize: 15, 
        color: colors.text2, 
        textAlign: "center", 
        margin: "0 0 8px",
        lineHeight: 1.6,
        fontFamily: fonts.body,
      }}>
        Help us shape a space rooted in relational care.
      </p>
      
      {/* Progress indicator */}
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        gap: 8, 
        margin: "24px 0 32px" 
      }}>
        {[1, 2].map((s) => (
          <div
            key={s}
            style={{
              width: 40,
              height: 4,
              borderRadius: 2,
              background: step >= s ? colors.dustyPlum : colors.borderWarm,
              transition: "background 0.3s",
            }}
          />
        ))}
      </div>

      {step === 1 && (
        <>
          <Input
            label="Your name"
            value={name}
            onChange={setName}
            required
          />

          <Input
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            required
          />

          <Select
            label="How would you like to contribute?"
            value={roleType}
            onChange={setRoleType}
            options={roleOptions}
            required
          />

          <Input
            label="Organization (optional)"
            value={organization}
            onChange={setOrganization}
            placeholder="Practice, company, institution..."
          />

          <Input
            label="Website (optional)"
            value={website}
            onChange={setWebsite}
            placeholder="https://..."
          />

          <Button 
            onClick={() => setStep(2)}
            disabled={!name || !email || !roleType}
            style={{ width: "100%", marginTop: 12 }}
          >
            Continue
          </Button>
        </>
      )}

      {step === 2 && (
        <>
          <TextArea
            label="What draws you to Periwink?"
            value={whatDrawsYou}
            onChange={setWhatDrawsYou}
            hint="What resonates about a relational approach to supporting women in this transition?"
            required
          />

          <TextArea
            label="What do you hope to offer this community?"
            value={whatYouOffer}
            onChange={setWhatYouOffer}
            hint="Skills, perspective, presence, resources — whatever feels true."
            required
          />

          <TextArea
            label="How do you approach supporting women in your current work?"
            value={currentApproach}
            onChange={setCurrentApproach}
            hint="We're curious about your philosophy, not your credentials."
            required
          />

          <TextArea
            label="What does 'holding space' mean to you?"
            value={holdingSpace}
            onChange={setHoldingSpace}
            hint="There's no right answer — we want to understand how you think about care."
            required
          />

          <TextArea
            label="Is there anything you'd want to build, create, or contribute here?"
            value={wantToBuild}
            onChange={setWantToBuild}
            hint="A room you'd host, content you'd share, a partnership you imagine — or nothing yet, just presence."
          />

          <TextArea
            label="Anything else you'd like us to know?"
            value={anythingElse}
            onChange={setAnythingElse}
          />

          {error && (
            <p style={{ 
              fontSize: 14, 
              color: "#c44", 
              textAlign: "center", 
              margin: "0 0 20px",
              fontFamily: fonts.body,
            }}>
              {error}
            </p>
          )}

          <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
            <Button 
              onClick={() => setStep(1)}
              variant="secondary"
              style={{ flex: 1 }}
            >
              Back
            </Button>
            <Button 
              onClick={handleSubmit}
              loading={loading}
              disabled={!whatDrawsYou || !whatYouOffer || !currentApproach || !holdingSpace}
              style={{ flex: 2 }}
            >
              Submit Application
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Success View ───
function SuccessView({ type, onClose }: { type: "community" | "founding"; onClose: () => void }) {
  return (
    <div style={{ padding: "60px 40px", textAlign: "center" }}>
      <div style={{
        width: 72,
        height: 72,
        borderRadius: "50%",
        background: `linear-gradient(135deg, ${colors.lavender}, ${colors.softPeriwinkle})`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto 28px",
        fontSize: 32,
      }}>
        💜
      </div>
      
      <h2 style={{ 
        fontFamily: fonts.heading, 
        fontSize: 32, 
        fontWeight: 300, 
        color: colors.ink, 
        margin: "0 0 16px",
      }}>
        {type === "community" ? "Welcome to Periwink" : "Application Received"}
      </h2>
      
      <p style={{ 
        fontSize: 16, 
        color: colors.text2, 
        lineHeight: 1.7,
        margin: "0 0 32px",
        fontFamily: fonts.body,
      }}>
        {type === "community" 
          ? "We've sent you a confirmation email. We'll be in touch soon as we prepare to open the community."
          : "Thank you for your thoughtful application. We'll review it carefully and be in touch within two weeks."
        }
      </p>

      <p style={{ 
        fontSize: 15, 
        color: colors.dustyPlum, 
        fontStyle: "italic",
        fontFamily: fonts.heading,
        margin: "0 0 32px",
      }}>
        You&apos;re not carrying this alone.
      </p>

      <Button onClick={onClose} variant="secondary">
        Close
      </Button>
    </div>
  );
}

// ─── Main Landing Page ───
export function LandingPage() {
  const [communityModalOpen, setCommunityModalOpen] = useState(false);
  const [foundingModalOpen, setFoundingModalOpen] = useState(false);
  const [successType, setSuccessType] = useState<"community" | "founding" | null>(null);

  return (
    <>
      <style>{fadeUpKeyframes}{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
      
      <div style={{ 
        minHeight: "100vh", 
        background: colors.warmIvory,
        fontFamily: fonts.body,
        color: colors.ink,
        position: "relative",
      }}>
        <BackgroundArt />

        {/* Nav */}
        <nav style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          padding: "20px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: `${colors.warmIvory}CC`,
          backdropFilter: "blur(20px)",
          borderBottom: `1px solid ${colors.borderWarm}30`,
        }}>
          <span style={{ 
            fontFamily: fonts.heading, 
            fontSize: 26, 
            fontWeight: 300, 
            color: colors.dustyPlum,
            letterSpacing: 0.5,
          }}>
            periwink
          </span>
          <Button 
            onClick={() => setCommunityModalOpen(true)}
            style={{ padding: "10px 24px", fontSize: 14 }}
          >
            Join
          </Button>
        </nav>

        {/* Hero */}
        <section style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "120px 32px 80px",
          textAlign: "center",
          position: "relative",
          zIndex: 1,
        }}>
          <p style={{
            fontSize: 13,
            fontWeight: 500,
            letterSpacing: 2.5,
            textTransform: "uppercase",
            color: colors.lavender,
            marginBottom: 28,
            animation: "fadeUp 1s ease 0.2s both",
          }}>
            A space for women in transition
          </p>

          <h1 style={{
            fontFamily: fonts.heading,
            fontSize: "clamp(40px, 7vw, 72px)",
            fontWeight: 300,
            lineHeight: 1.15,
            color: colors.ink,
            maxWidth: 700,
            margin: "0 0 28px",
            animation: "fadeUp 1s ease 0.4s both",
          }}>
            You don&apos;t have to carry<br />
            <em style={{ color: colors.dustyPlum }}>this alone.</em>
          </h1>

          <p style={{
            fontSize: 18,
            lineHeight: 1.75,
            color: colors.text2,
            maxWidth: 520,
            margin: "0 0 48px",
            animation: "fadeUp 1s ease 0.6s both",
          }}>
            Periwink is a gentle community for women navigating perimenopause and the identity shifts that come with it. Share what you&apos;re noticing. Find others who understand. Feel held.
          </p>

          <div style={{
            display: "flex",
            gap: 16,
            flexWrap: "wrap",
            justifyContent: "center",
            animation: "fadeUp 1s ease 0.8s both",
          }}>
            <Button onClick={() => setCommunityModalOpen(true)}>
              Join the Community
            </Button>
            <Button 
              onClick={() => setFoundingModalOpen(true)}
              variant="secondary"
            >
              Become a Founding Member
            </Button>
          </div>

          {/* Scroll hint */}
          <div style={{
            position: "absolute",
            bottom: 40,
            left: "50%",
            transform: "translateX(-50%)",
            textAlign: "center",
            animation: "fadeIn 1s ease 1.5s both",
          }}>
            <p style={{ 
              fontSize: 10, 
              letterSpacing: 2, 
              textTransform: "uppercase", 
              color: colors.text3,
              marginBottom: 12,
            }}>
              Learn more
            </p>
            <div style={{
              width: 1,
              height: 40,
              background: `linear-gradient(${colors.lavender}, transparent)`,
              margin: "0 auto",
              animation: "breathe 2.5s ease-in-out infinite",
            }} />
          </div>
        </section>

        {/* What is Periwink */}
        <section style={{
          padding: "100px 32px",
          position: "relative",
          zIndex: 1,
        }}>
          <div style={{ maxWidth: 680, margin: "0 auto" }}>
            <h2 style={{
              fontFamily: fonts.heading,
              fontSize: "clamp(28px, 4vw, 40px)",
              fontWeight: 300,
              color: colors.ink,
              marginBottom: 32,
              textAlign: "center",
            }}>
              A different kind of space
            </h2>

            <p style={{
              fontSize: 17,
              lineHeight: 1.85,
              color: colors.text2,
              marginBottom: 28,
              textAlign: "center",
            }}>
              Periwink isn&apos;t a symptom tracker or a medical app. It&apos;s a place where women find each other — sharing what they&apos;re noticing, what&apos;s shifting, what helps. Not to fix anything, but to feel less alone in the transition.
            </p>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 20,
              marginTop: 48,
            }}>
              {[
                {
                  title: "Stories, not symptoms",
                  description: "Share what you're noticing in your own words. No checklists, no clinical language — just honest experience.",
                },
                {
                  title: "Patterns, not prescriptions",
                  description: "See what others are experiencing. \"Many women here notice...\" Not directives, just recognition.",
                },
                {
                  title: "Presence, not progress",
                  description: "No dashboards, no streaks, no optimization. Just a space to return to when you need it.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    background: colors.card,
                    border: `1px solid ${colors.borderWarm}`,
                    borderRadius: 24,
                    padding: "32px 28px",
                  }}
                >
                  <h3 style={{
                    fontFamily: fonts.heading,
                    fontSize: 20,
                    fontWeight: 400,
                    color: colors.ink,
                    marginBottom: 12,
                  }}>
                    {item.title}
                  </h3>
                  <p style={{
                    fontSize: 14,
                    lineHeight: 1.75,
                    color: colors.text2,
                    margin: 0,
                  }}>
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quote / Feeling */}
        <section style={{
          padding: "80px 32px",
          background: `linear-gradient(180deg, transparent, ${colors.ivory2}50, transparent)`,
          position: "relative",
          zIndex: 1,
        }}>
          <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
            <p style={{
              fontFamily: fonts.heading,
              fontSize: "clamp(24px, 4vw, 36px)",
              fontWeight: 300,
              fontStyle: "italic",
              lineHeight: 1.5,
              color: colors.dustyPlum,
              margin: 0,
            }}>
              &ldquo;For the first time, I don&apos;t feel like I&apos;m losing my mind. I&apos;m just... going through something. And I&apos;m not alone in it.&rdquo;
            </p>
          </div>
        </section>

        {/* Founding Members */}
        <section style={{
          padding: "100px 32px",
          position: "relative",
          zIndex: 1,
        }}>
          <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
            <p style={{
              fontSize: 12,
              fontWeight: 500,
              letterSpacing: 2.5,
              textTransform: "uppercase",
              color: colors.lavender,
              marginBottom: 20,
            }}>
              Help us build this
            </p>

            <h2 style={{
              fontFamily: fonts.heading,
              fontSize: "clamp(28px, 4vw, 40px)",
              fontWeight: 300,
              color: colors.ink,
              marginBottom: 24,
            }}>
              Become a Founding Member
            </h2>

            <p style={{
              fontSize: 16,
              lineHeight: 1.75,
              color: colors.text2,
              marginBottom: 36,
            }}>
              We&apos;re looking for practitioners, researchers, content creators, and community builders who share our philosophy — that healing emerges through relationship, not intervention.
            </p>

            <Button onClick={() => setFoundingModalOpen(true)} variant="secondary">
              Apply to Join
            </Button>
          </div>
        </section>

        {/* Footer CTA */}
        <section style={{
          padding: "80px 32px 100px",
          textAlign: "center",
          position: "relative",
          zIndex: 1,
        }}>
          <h2 style={{
            fontFamily: fonts.heading,
            fontSize: "clamp(28px, 5vw, 44px)",
            fontWeight: 300,
            color: colors.ink,
            marginBottom: 20,
          }}>
            Ready to exhale?
          </h2>
          <p style={{
            fontSize: 16,
            color: colors.text2,
            marginBottom: 32,
          }}>
            Join the community. We&apos;ll be here.
          </p>
          <Button onClick={() => setCommunityModalOpen(true)}>
            Join Periwink
          </Button>
        </section>

        {/* Footer */}
        <footer style={{
          padding: "32px",
          borderTop: `1px solid ${colors.borderWarm}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 16,
          position: "relative",
          zIndex: 1,
        }}>
          <span style={{ 
            fontFamily: fonts.heading, 
            fontSize: 18, 
            fontWeight: 300, 
            color: colors.dustyPlum 
          }}>
            periwink
          </span>
          <div style={{ display: "flex", gap: 24 }}>
            {["Privacy", "Terms", "Contact"].map((link) => (
              <a
                key={link}
                href="#"
                style={{
                  fontSize: 12,
                  color: colors.text3,
                  textDecoration: "none",
                }}
              >
                {link}
              </a>
            ))}
          </div>
        </footer>
      </div>

      {/* Modals */}
      <Modal 
        isOpen={communityModalOpen && !successType} 
        onClose={() => setCommunityModalOpen(false)}
      >
        <CommunitySignupForm 
          onSuccess={() => setSuccessType("community")} 
        />
      </Modal>

      <Modal 
        isOpen={foundingModalOpen && !successType} 
        onClose={() => setFoundingModalOpen(false)}
      >
        <FoundingMemberForm 
          onSuccess={() => setSuccessType("founding")} 
        />
      </Modal>

      <Modal 
        isOpen={!!successType} 
        onClose={() => {
          setSuccessType(null);
          setCommunityModalOpen(false);
          setFoundingModalOpen(false);
        }}
      >
        <SuccessView 
          type={successType!} 
          onClose={() => {
            setSuccessType(null);
            setCommunityModalOpen(false);
            setFoundingModalOpen(false);
          }} 
        />
      </Modal>
    </>
  );
}

export default LandingPage;

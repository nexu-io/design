import {
  Button,
  ConversationMessage,
  Input,
  Label,
  Stepper,
  StepperItem,
  StepperSeparator,
} from "@nexu/ui-web";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Fragment, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePageTitle } from "../../hooks/usePageTitle";

/* ------------------------------------------------------------------ */
/*  Design tokens (nexu Design System)                                 */
/* ------------------------------------------------------------------ */

const T = {
  surface0: "var(--color-surface-0)",
  surface1: "var(--color-surface-1)",
  textPrimary: "var(--color-text-primary)",
  textSecondary: "var(--color-text-secondary)",
  textPlaceholder: "var(--color-text-muted)",
  borderCard: "var(--color-border)",
  borderInput: "var(--color-border)",
  shadowCard: "var(--shadow-card)",
  radiusPill: "100px",
  radius8: "8px",
  radius24: "24px",
  fontFamily: "var(--font-sans)",
  easeOut: "cubic-bezier(0.16, 1, 0.3, 1)",
} as const;

/* ------------------------------------------------------------------ */
/*  Data & Types                                                       */
/* ------------------------------------------------------------------ */

interface OnboardingData {
  name: string;
  role: string;
  useCases: string[];
  connectedChannels: string[];
}

const STEPS = [
  { id: "profile", label: "Profile" },
  { id: "usecase", label: "Use Cases" },
  { id: "channels", label: "Channels" },
  { id: "complete", label: "Complete" },
];

const ROLE_OPTIONS = [
  "E-commerce",
  "Content Creator",
  "Designer",
  "Product Manager",
  "Ops / Marketing",
  "Developer",
  "Educator",
  "Founder",
  "Research",
  "Student",
  "Finance",
  "Other",
];

const USE_CASE_OPTIONS = [
  { value: "coding", label: "Code & Deploy", icon: "💻" },
  { value: "content", label: "Content Creation", icon: "✍️" },
  { value: "data", label: "Data Analysis", icon: "📊" },
  { value: "customer", label: "Customer Support", icon: "🎧" },
  { value: "sales", label: "Sales & Outreach", icon: "🤝" },
  { value: "ops", label: "Operations", icon: "⚙️" },
  { value: "research", label: "Research", icon: "🔍" },
  { value: "automation", label: "Automation", icon: "🤖" },
];

const STEP_GUIDANCE = [
  "Hi — I’ll tailor your workspace around your role and how you prefer to work.",
  "Pick the workflows you want help with first. You can always add more later.",
  "Start with one channel and we’ll configure the rest once you’re inside the workspace.",
  "Everything is ready. Your first workspace has been prepped for the setup you chose.",
];

const CHANNEL_OPTIONS = [
  {
    id: "slack",
    name: "Slack",
    color: "#4A154B",
    icon: (
      <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor" aria-hidden="true">
        <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zm1.271 0a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zm0 1.271a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zm10.124 2.521a2.528 2.528 0 0 1 2.52-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.52V8.834zm-1.271 0a2.528 2.528 0 0 1-2.521 2.521 2.528 2.528 0 0 1-2.521-2.521V2.522A2.528 2.528 0 0 1 15.166 0a2.528 2.528 0 0 1 2.521 2.522v6.312zm-2.521 10.124a2.528 2.528 0 0 1 2.521 2.52A2.528 2.528 0 0 1 15.166 24a2.528 2.528 0 0 1-2.521-2.522v-2.52h2.521zm0-1.271a2.528 2.528 0 0 1-2.521-2.521 2.528 2.528 0 0 1 2.521-2.521h6.312A2.528 2.528 0 0 1 24 15.166a2.528 2.528 0 0 1-2.522 2.521h-6.312z" />
      </svg>
    ),
  },
  {
    id: "discord",
    name: "Discord",
    color: "#5865F2",
    icon: (
      <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor" aria-hidden="true">
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
      </svg>
    ),
  },
  {
    id: "telegram",
    name: "Telegram",
    color: "#26A5E4",
    icon: (
      <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor" aria-hidden="true">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    ),
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    color: "#25D366",
    icon: (
      <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
      </svg>
    ),
  },
];

function RolePill({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      variant={selected ? "default" : "outline"}
      size="sm"
      onClick={onClick}
      className={
        selected ? "bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-primary)]/90" : ""
      }
    >
      {label}
    </Button>
  );
}

/* ------------------------------------------------------------------ */
/*  Step wrapper with slide animation                                  */
/* ------------------------------------------------------------------ */

function StepContainer({
  direction,
  children,
}: {
  direction: "left" | "right";
  children: React.ReactNode;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(false);
    const frame = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div
      style={{
        transform: visible
          ? "translateX(0)"
          : `translateX(${direction === "right" ? "40px" : "-40px"})`,
        opacity: visible ? 1 : 0,
        transition: `transform 0.3s ${T.easeOut}, opacity 0.3s ${T.easeOut}`,
      }}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Step 1 — Profile                                                   */
/* ------------------------------------------------------------------ */

function ProfileStep({
  data,
  onNext,
}: {
  data: Partial<OnboardingData>;
  onNext: (d: Partial<OnboardingData>) => void;
}) {
  const [name, setName] = useState(data.name || "");
  const [role, setRole] = useState(data.role || "");

  return (
    <div className="flex flex-col">
      <h2 className="text-[24px] font-semibold text-text-primary mb-1.5">Tell us about yourself</h2>
      <p className="text-[14px] text-text-secondary mb-7">
        We'll personalize nexu to fit your workflow.
      </p>

      <div className="mb-5">
        <Label>Your name</Label>
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          className="h-10 rounded-xl"
        />
      </div>

      <div className="mb-8">
        <Label className="mb-2">Your role</Label>
        <div className="flex flex-wrap gap-2">
          {ROLE_OPTIONS.map((r) => (
            <RolePill key={r} label={r} selected={role === r} onClick={() => setRole(r)} />
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={() => onNext({ name: name.trim(), role })}
          disabled={!name.trim() || !role}
        >
          Continue <ArrowRight size={14} />
        </Button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Step 2 — Use Cases                                                 */
/* ------------------------------------------------------------------ */

function UseCaseStep({
  data,
  onNext,
  onBack,
}: {
  data: Partial<OnboardingData>;
  onNext: (d: Partial<OnboardingData>) => void;
  onBack: () => void;
}) {
  const [selected, setSelected] = useState<string[]>(data.useCases || []);

  const toggle = (value: string) => {
    setSelected((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  };

  return (
    <div className="flex flex-col">
      <h2 className="text-[24px] font-semibold text-text-primary mb-1.5">
        What will you use nexu for?
      </h2>
      <p className="text-[14px] text-text-secondary mb-7">
        Select all that apply — this helps us set up your workspace.
      </p>

      <div className="grid grid-cols-2 gap-3 mb-8">
        {USE_CASE_OPTIONS.map((opt) => {
          const isSelected = selected.includes(opt.value);
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => toggle(opt.value)}
              className={`card text-left cursor-pointer transition-shadow duration-150 p-5 ${
                isSelected
                  ? "ring-2 ring-[var(--color-brand-primary)] border-[var(--color-brand-primary)]"
                  : ""
              }`}
            >
              <span className="text-2xl mb-2 block">{opt.icon}</span>
              <span className="text-[14px] font-medium text-text-primary block">{opt.label}</span>
            </button>
          );
        })}
      </div>

      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft size={14} /> Back
        </Button>
        <Button onClick={() => onNext({ useCases: selected })} disabled={selected.length === 0}>
          Continue <ArrowRight size={14} />
        </Button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Step 3 — Channels                                                  */
/* ------------------------------------------------------------------ */

function ChannelsStep({
  data,
  onNext,
  onBack,
}: {
  data: Partial<OnboardingData>;
  onNext: (d: Partial<OnboardingData>) => void;
  onBack: () => void;
}) {
  const [selected, setSelected] = useState<string[]>(data.connectedChannels || []);

  const toggle = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]));
  };

  return (
    <div className="flex flex-col">
      <h2 className="text-[24px] font-semibold text-text-primary mb-1.5">
        Connect your first channel
      </h2>
      <p className="text-[14px] text-text-secondary mb-7">
        nexu works where you work. Pick one to start.
      </p>

      <div className="grid grid-cols-2 gap-3 mb-8">
        {CHANNEL_OPTIONS.map((ch) => {
          const isSelected = selected.includes(ch.id);
          return (
            <button
              key={ch.id}
              type="button"
              onClick={() => toggle(ch.id)}
              className={`card flex flex-col items-center justify-center cursor-pointer transition-shadow duration-150 py-7 px-5 ${
                isSelected
                  ? "ring-2 ring-[var(--color-brand-primary)] border-[var(--color-brand-primary)]"
                  : ""
              }`}
              style={{ color: ch.color }}
            >
              <div className="mb-3">{ch.icon}</div>
              <span className="text-[14px] font-medium text-text-primary">{ch.name}</span>
              {isSelected && (
                <div
                  className="mt-2 flex items-center gap-1 text-[12px] font-medium"
                  style={{ color: "var(--color-brand-primary)" }}
                >
                  <Check size={12} /> Selected
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft size={14} /> Back
        </Button>
        <Button onClick={() => onNext({ connectedChannels: selected })}>
          {selected.length > 0 ? "Continue" : "Skip for now"} <ArrowRight size={14} />
        </Button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Step 4 — Complete                                                  */
/* ------------------------------------------------------------------ */

function CompleteStep({ onFinish }: { onFinish: () => void }) {
  return (
    <div className="flex flex-col items-center text-center">
      <img src="/brand/ip-nexu.svg" alt="nexu" className="w-24 h-24 mb-6" />
      <h2 className="text-[24px] font-semibold text-text-primary mb-2">You're all set!</h2>
      <p className="text-[14px] text-text-secondary mb-8 max-w-[360px]">
        Your workspace is ready. Let's get started.
      </p>
      <Button onClick={onFinish}>
        Go to workspace <ArrowRight size={14} />
      </Button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main OnboardingPage                                                */
/* ------------------------------------------------------------------ */

export default function OnboardingPage() {
  usePageTitle("Get Started");
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<Partial<OnboardingData>>({});
  const [direction, setDirection] = useState<"left" | "right">("right");

  const handleNext = useCallback((stepData?: Partial<OnboardingData>) => {
    if (stepData) setData((prev) => ({ ...prev, ...stepData }));
    setDirection("right");
    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
  }, []);

  const handleBack = useCallback(() => {
    setDirection("left");
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, []);

  const handleFinish = useCallback(() => {
    navigate("/openclaw/workspace");
  }, [navigate]);

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <ProfileStep data={data} onNext={handleNext} />;
      case 1:
        return <UseCaseStep data={data} onNext={handleNext} onBack={handleBack} />;
      case 2:
        return <ChannelsStep data={data} onNext={handleNext} onBack={handleBack} />;
      case 3:
        return <CompleteStep onFinish={handleFinish} />;
      default:
        return null;
    }
  };

  return (
    <div
      className="flex flex-col items-center min-h-screen bg-surface-0"
      style={{ fontFamily: T.fontFamily }}
    >
      {/* Top: Logo + Step indicator */}
      <div className="flex flex-col items-center pt-12 pb-6 gap-5">
        <img src="/brand/nexu logo-black1.svg" alt="nexu" style={{ height: 28 }} />
        <Stepper className="max-w-[440px]">
          {STEPS.map((step, index) => (
            <Fragment key={step.id}>
              <StepperItem
                status={
                  index < currentStep ? "completed" : index === currentStep ? "current" : "pending"
                }
                step={index + 1}
                label={step.label}
                className="max-w-[100px]"
              />
              {index < STEPS.length - 1 ? <StepperSeparator active={index < currentStep} /> : null}
            </Fragment>
          ))}
        </Stepper>
      </div>

      {/* Center: Step content */}
      <div className="flex-1 flex items-center justify-center w-full px-6 pb-16">
        <div className="space-y-4" style={{ width: "100%", maxWidth: 560 }}>
          <ConversationMessage
            variant="assistant"
            avatar={
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-accent-fg text-[11px] font-semibold">
                N
              </div>
            }
            meta="nexu onboarding"
            bubbleClassName="bg-surface-1 shadow-none"
          >
            {STEP_GUIDANCE[currentStep]}
          </ConversationMessage>
          <StepContainer key={currentStep} direction={direction}>
            {renderStep()}
          </StepContainer>
        </div>
      </div>
    </div>
  );
}

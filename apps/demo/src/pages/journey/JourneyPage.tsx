import { Button, Stepper, StepperItem, StepperSeparator } from "@nexu-design/ui-web";
import {
  ArrowLeft,
  ArrowRight,
  Crown,
  Eye,
  Globe,
  Link2,
  MessageSquare,
  Monitor,
  MoveRight,
  User,
  Users,
  X,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StepAutomation from "./StepAutomation";
import StepClone from "./StepClone";
import StepIM from "./StepIM";
import StepLanding from "./StepLanding";
import StepOnboarding from "./StepOnboarding";
import StepOpenclawMigration from "./StepOpenclawMigration";
import StepPreview from "./StepPreview";
import StepSession from "./StepSession";
import StepTeam from "./StepTeam";
import StepUpgrade from "./StepUpgrade";

const STEPS = [
  { id: "landing", label: "Landing Page", icon: Globe, desc: "龙虾的赛博办公室" },
  { id: "openclaw-migration", label: "迁移 Openclaw", icon: MoveRight, desc: "首次启动：一键关联已有 Openclaw 配置" },
  { id: "onboarding", label: "Onboarding", icon: MessageSquare, desc: "分身初始化" },
  { id: "clone", label: "分身入口", icon: User, desc: "产品主界面" },
  { id: "session", label: "Session", icon: Monitor, desc: "对话交互" },
  { id: "automation", label: "Automation & Skills", icon: Zap, desc: "自动化 + 能力" },
  { id: "team", label: "团队协作", icon: Users, desc: "人与分身共存的办公协作网络" },
  { id: "im", label: "IM 接入", icon: Link2, desc: "飞书 / Slack" },
  { id: "preview", label: "接入预览", icon: Eye, desc: "最终效果" },
  { id: "upgrade", label: "解锁超能力", icon: Crown, desc: "升级 + 邀请团队" },
] as const;

const STEP_COMPONENTS = [
  StepLanding,
  StepOpenclawMigration,
  StepOnboarding,
  StepClone,
  StepSession,
  StepAutomation,
  StepTeam,
  StepIM,
  StepPreview,
  StepUpgrade,
];

export default function JourneyPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [animating, setAnimating] = useState(false);
  const navigate = useNavigate();

  const goTo = useCallback(
    (idx: number, dir: "next" | "prev") => {
      if (animating || idx < 0 || idx >= STEPS.length) return;
      setDirection(dir);
      setAnimating(true);
      setTimeout(() => {
        setCurrentStep(idx);
        setAnimating(false);
      }, 250);
    },
    [animating],
  );

  const next = useCallback(() => goTo(currentStep + 1, "next"), [currentStep, goTo]);
  const prev = useCallback(() => goTo(currentStep - 1, "prev"), [currentStep, goTo]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") next();
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") prev();
      if (e.key === "Escape") navigate("/overview");
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [next, prev, navigate]);

  const StepComponent = STEP_COMPONENTS[currentStep];
  const isFirst = currentStep === 0;
  const isLast = currentStep === STEPS.length - 1;

  return (
    <div className="fixed inset-0 z-50 bg-surface-0 flex flex-col">
      {/* Top bar */}
      <header className="h-12 border-b border-border bg-surface-0/90 backdrop-blur-md flex items-center px-4 gap-4 shrink-0">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => navigate("/overview")}
          title="返回"
        >
          <X size={16} />
        </Button>

        <Stepper className="flex-1 items-start justify-center gap-2 overflow-x-auto px-2">
          {STEPS.map((step, i) => {
            const status =
              i < currentStep ? "completed" : i === currentStep ? "current" : "pending";

            return [
              <StepperItem
                key={step.id}
                status={status}
                step={i + 1}
                label={
                  <button type="button" onClick={() => goTo(i, i > currentStep ? "next" : "prev")}>
                    {step.label}
                  </button>
                }
                className="min-w-[84px]"
              />,
              i < STEPS.length - 1 ? (
                <StepperSeparator key={`${step.id}-sep`} active={i < currentStep} />
              ) : null,
            ];
          })}
        </Stepper>

        <div className="text-[11px] text-text-muted tabular-nums">
          {currentStep + 1} / {STEPS.length}
        </div>
      </header>

      {/* Step content */}
      <main className="flex-1 overflow-hidden relative">
        <div
          className={`absolute inset-0 transition-all duration-200 ease-out ${
            animating
              ? direction === "next"
                ? "opacity-0 -translate-x-8"
                : "opacity-0 translate-x-8"
              : "opacity-100 translate-x-0"
          }`}
        >
          <div className="h-full overflow-y-auto">
            <StepComponent />
          </div>
        </div>
      </main>

      {/* Bottom nav */}
      <footer className="h-14 border-t border-border bg-surface-0/90 backdrop-blur-md flex items-center justify-between px-6 shrink-0">
        <Button
          onClick={prev}
          disabled={isFirst}
          variant="ghost"
          size="sm"
          className={`gap-1.5 px-4 text-[13px] ${
            isFirst
              ? "text-text-muted cursor-not-allowed"
              : "text-text-secondary hover:text-text-primary hover:bg-surface-3"
          }`}
        >
          <ArrowLeft size={14} />
          上一步
        </Button>

        <div className="text-[12px] text-text-muted">{STEPS[currentStep].desc}</div>

        <Button
          onClick={isLast ? () => navigate("/overview") : next}
          size="sm"
          className={`gap-1.5 px-5 text-[13px] ${
            isLast
              ? "bg-success text-white hover:bg-success/90"
              : "bg-accent text-accent-fg hover:bg-accent-hover"
          }`}
        >
          {isLast ? "完成旅程" : "下一步"}
          <ArrowRight size={14} />
        </Button>
      </footer>
    </div>
  );
}

import { useState } from "react";
import {
  Target,
  ChevronRight,
  ChevronDown,
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  Link2,
  Users,
  BarChart3,
} from "lucide-react";
import {
  OBJECTIVES,
  SPRINT_TASKS,
  type Objective,
  type KeyResult,
} from "./teamData";

const OKR_STATUS_STYLES: Record<
  Objective["status"],
  { bg: string; text: string; label: string; icon: React.ElementType }
> = {
  on_track: {
    bg: "bg-success-subtle",
    text: "text-success",
    label: "On Track",
    icon: CheckCircle,
  },
  at_risk: {
    bg: "bg-warning-subtle",
    text: "text-warning",
    label: "At Risk",
    icon: AlertTriangle,
  },
  behind: {
    bg: "bg-danger-subtle",
    text: "text-danger",
    label: "Behind",
    icon: AlertCircle,
  },
  achieved: {
    bg: "bg-success-subtle",
    text: "text-success",
    label: "Achieved",
    icon: CheckCircle,
  },
};

function ProgressRing({
  value,
  size = 36,
  stroke = 3,
  className = "",
}: {
  value: number;
  size?: number;
  stroke?: number;
  className?: string;
}) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  const color =
    value >= 80
      ? "stroke-success"
      : value >= 50
      ? "stroke-clone"
      : value >= 30
      ? "stroke-warning"
      : "stroke-danger";

  return (
    <svg width={size} height={size} className={className}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={stroke}
        className="text-surface-3"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        strokeWidth={stroke}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className={color}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: "stroke-dashoffset 0.4s ease" }}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="central"
        className="fill-text-primary text-[9px] font-bold"
      >
        {value}%
      </text>
    </svg>
  );
}

function KRRow({
  kr,
  isSelected,
  onSelect,
}: {
  kr: KeyResult;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const linkedTasks = SPRINT_TASKS.filter((t) => kr.linkedTasks.includes(t.id));

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter") onSelect();
      }}
      className={`p-3 border rounded-lg transition-colors cursor-pointer ${
        isSelected
          ? "ring-2 ring-accent/30 border-accent/40 bg-accent/5"
          : "border-border bg-surface-1 hover:border-border-hover"
      }`}
    >
      <div className="flex items-center gap-3">
        <ProgressRing value={kr.progress} size={32} stroke={2.5} />
        <div className="flex-1 min-w-0">
          <div className="text-[12px] font-medium text-text-primary">
            {kr.title}
          </div>
          <div className="flex items-center gap-3 mt-0.5">
            <span className="text-[10px] text-text-muted">
              {kr.current} / {kr.target}
            </span>
            <span className="text-[10px] text-text-muted">· {kr.owner}</span>
          </div>
        </div>
        {linkedTasks.length > 0 && (
          <div className="flex items-center gap-1 text-[9px] text-text-muted">
            <Link2 size={9} />
            <span>{linkedTasks.length} 任务</span>
          </div>
        )}
        <ChevronRight size={12} className="text-text-muted shrink-0" />
      </div>

      {linkedTasks.length > 0 && (
        <div className="mt-2 ml-[44px] flex flex-wrap gap-1">
          {linkedTasks.map((t) => {
            const statusColor =
              t.status === "done"
                ? "bg-success/10 text-success"
                : t.status === "blocked"
                ? "bg-danger/10 text-danger"
                : "bg-clone/10 text-clone";
            return (
              <span
                key={t.id}
                className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${statusColor}`}
              >
                {t.id} {t.title}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ObjectiveCard({
  objective,
  selectedKR,
  onSelectKR,
  onSelectObjective,
  isSelected,
}: {
  objective: Objective;
  selectedKR: string | null;
  onSelectKR: (kr: KeyResult) => void;
  onSelectObjective: (o: Objective) => void;
  isSelected: boolean;
}) {
  const [expanded, setExpanded] = useState(true);
  const statusStyle = OKR_STATUS_STYLES[objective.status];
  const StatusIcon = statusStyle.icon;
  const achieved = objective.keyResults.filter(
    (kr) => kr.progress >= 100
  ).length;

  return (
    <div
      className={`border rounded-xl overflow-hidden transition-colors ${
        isSelected ? "ring-2 ring-accent/30 border-accent/40" : "border-border"
      }`}
    >
      {/* Objective header */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => onSelectObjective(objective)}
        onKeyDown={(e) => {
          if (e.key === "Enter") onSelectObjective(objective);
        }}
        className="px-4 py-3 bg-surface-1 cursor-pointer hover:bg-surface-1/80 transition-colors"
      >
        <div className="flex items-start gap-3">
          <ProgressRing
            value={objective.progress}
            size={42}
            stroke={3}
            className="shrink-0 mt-0.5"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] font-mono text-text-muted">
                {objective.id}
              </span>
              <span
                className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full inline-flex items-center gap-0.5 ${statusStyle.bg} ${statusStyle.text}`}
              >
                <StatusIcon size={9} /> {statusStyle.label}
              </span>
              <span className="text-[10px] text-text-muted">
                {objective.quarter}
              </span>
            </div>
            <div className="text-[13px] font-semibold text-text-primary leading-snug">
              {objective.title}
            </div>
            <div className="text-[11px] text-text-muted mt-1 line-clamp-1">
              {objective.description}
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
            className="p-1 rounded hover:bg-surface-3 text-text-muted shrink-0"
          >
            {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
        </div>
        <div className="flex items-center gap-3 mt-2 ml-[54px]">
          <div className="flex items-center gap-1 text-[10px] text-text-muted">
            <Users size={10} /> {objective.ownerAvatar} {objective.owner}
          </div>
          <div className="flex items-center gap-1 text-[10px] text-text-muted">
            <BarChart3 size={10} /> {achieved}/{objective.keyResults.length} KR
            达标
          </div>
          <div className="flex gap-1 ml-auto">
            {objective.tags.map((t) => (
              <span
                key={t}
                className="text-[9px] px-1.5 py-0.5 bg-surface-2 text-text-muted rounded"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Key Results */}
      {expanded && (
        <div className="p-3 space-y-2 bg-surface-0">
          <div className="text-[10px] text-text-muted font-medium uppercase tracking-wider px-1">
            Key Results ({objective.keyResults.length})
          </div>
          {objective.keyResults.map((kr) => (
            <KRRow
              key={kr.id}
              kr={kr}
              isSelected={selectedKR === kr.id}
              onSelect={() => onSelectKR(kr)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function OKRTab({
  selectedOKR,
  onSelectObjective,
  onSelectKR,
}: {
  selectedOKR: string | null;
  onSelectObjective: (o: Objective) => void;
  onSelectKR: (kr: KeyResult) => void;
}) {
  const totalProgress = Math.round(
    OBJECTIVES.reduce((s, o) => s + o.progress, 0) / OBJECTIVES.length
  );
  const atRisk = OBJECTIVES.filter(
    (o) => o.status === "at_risk" || o.status === "behind"
  ).length;

  return (
    <div className="h-full overflow-y-auto">
      <div className="px-5 py-3 border-b border-border bg-surface-1/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Target size={14} className="text-accent" />
          <span className="text-[13px] font-medium text-text-primary">
            OKR · 2026-Q1
          </span>
          <span className="text-[11px] text-text-muted">
            3 Objectives · 11 Key Results
          </span>
        </div>
        <div className="flex items-center gap-3">
          {atRisk > 0 && (
            <span className="text-[10px] px-2 py-1 bg-warning-subtle text-warning rounded-md font-medium">
              {atRisk} 需关注
            </span>
          )}
          <span className="text-[12px] font-bold text-clone tabular-nums">
            {totalProgress}%
          </span>
        </div>
      </div>

      {/* OKR summary strip */}
      <div className="px-5 py-3 border-b border-border flex items-center gap-4">
        {OBJECTIVES.map((o) => {
          const st = OKR_STATUS_STYLES[o.status];
          return (
            <div
              key={o.id}
              className="flex items-center gap-2 flex-1 p-2 bg-surface-1 rounded-lg"
            >
              <ProgressRing value={o.progress} size={28} stroke={2} />
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-mono text-text-muted">
                  {o.id}
                </div>
                <div className="text-[11px] text-text-primary font-medium truncate">
                  {o.title.slice(0, 20)}...
                </div>
              </div>
              <span
                className={`text-[8px] px-1 py-0.5 rounded ${st.bg} ${st.text}`}
              >
                {st.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Objectives list */}
      <div className="p-5 space-y-4">
        {OBJECTIVES.map((o) => (
          <ObjectiveCard
            key={o.id}
            objective={o}
            selectedKR={selectedOKR}
            onSelectKR={onSelectKR}
            onSelectObjective={onSelectObjective}
            isSelected={selectedOKR === o.id}
          />
        ))}
      </div>
    </div>
  );
}

import { ToggleGroup, ToggleGroupItem } from "@nexu/ui-web";
import {
  AlertTriangle,
  ArrowRight,
  Calendar,
  ChevronRight,
  GanttChart,
  List,
  Users,
} from "lucide-react";
import { useState } from "react";
import {
  SPRINT_META,
  SPRINT_TASKS,
  SPRINT_TASKS_GANTT,
  type SprintTask,
  TEAM_MEMBERS,
} from "./teamData";

type SprintView = "list" | "gantt";

const STATUS_STYLES: Record<SprintTask["status"], { bg: string; text: string; label: string }> = {
  done: { bg: "bg-success-subtle", text: "text-success", label: "完成" },
  in_progress: { bg: "bg-clone/10", text: "text-clone", label: "进行中" },
  blocked: { bg: "bg-danger-subtle", text: "text-danger", label: "阻塞" },
  todo: { bg: "bg-surface-3", text: "text-text-muted", label: "待开始" },
};

const STATUS_BAR_COLORS: Record<SprintTask["status"], string> = {
  done: "bg-success",
  in_progress: "bg-clone",
  blocked: "bg-danger",
  todo: "bg-surface-4",
};

function ProgressBar({ value, className = "" }: { value: number; className?: string }) {
  return (
    <div className={`h-1.5 bg-surface-3 rounded-full overflow-hidden ${className}`}>
      <div
        className={`h-full rounded-full transition-all ${value >= 100 ? "bg-success" : value >= 50 ? "bg-clone" : "bg-warning"}`}
        style={{ width: `${Math.min(value, 100)}%` }}
      />
    </div>
  );
}

// ─── List View ─────────────────────────────────────────────

function ListView({
  selectedTask,
  onSelectTask,
}: {
  selectedTask: SprintTask | null;
  onSelectTask: (t: SprintTask) => void;
}) {
  const byAssignee = TEAM_MEMBERS.map((m) => ({
    member: m,
    tasks: SPRINT_TASKS.filter((t) => t.assignee === m.name),
  })).filter((g) => g.tasks.length > 0);

  return (
    <div className="p-5 space-y-5">
      {byAssignee.map(({ member, tasks }) => (
        <div key={member.name}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm">{member.avatar}</span>
            <span className="text-[12px] font-medium text-text-primary">{member.name}</span>
            <span className="text-[10px] text-text-muted">· {member.role}</span>
          </div>
          <div className="space-y-1.5 ml-6">
            {tasks.map((task) => {
              const style = STATUS_STYLES[task.status];
              const isSelected = selectedTask?.id === task.id;
              return (
                <div
                  key={task.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => onSelectTask(task)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") onSelectTask(task);
                  }}
                  className={`flex items-center gap-2 p-2.5 bg-surface-1 border rounded-lg cursor-pointer transition-colors ${
                    isSelected
                      ? "ring-2 ring-accent/30 border-accent/40"
                      : "border-border hover:border-border-hover"
                  }`}
                >
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${style.bg} ${style.text}`}
                  >
                    {style.label}
                  </span>
                  <span className="text-[12px] text-text-primary flex-1">{task.title}</span>
                  {task.dependency && (
                    <span className="text-[9px] px-1.5 py-0.5 bg-surface-3 text-text-muted rounded">
                      依赖 {task.dependency}
                    </span>
                  )}
                  <div className="w-16">
                    <ProgressBar value={task.progress} />
                  </div>
                  <span className="text-[10px] text-text-muted tabular-nums w-8 text-right">
                    {task.progress}%
                  </span>
                  <ChevronRight size={10} className="text-text-muted shrink-0" />
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Gantt View ────────────────────────────────────────────

function dayOffset(dateStr: string, baseStr: string): number {
  const d = new Date(dateStr);
  const b = new Date(baseStr);
  return Math.round((d.getTime() - b.getTime()) / (1000 * 60 * 60 * 24));
}

function GanttView({
  selectedTask,
  onSelectTask,
}: {
  selectedTask: SprintTask | null;
  onSelectTask: (t: SprintTask) => void;
}) {
  const { startDate, totalDays } = SPRINT_META;
  const today = "2026-02-23";
  const todayOffset = dayOffset(today, startDate);

  const days = Array.from({ length: totalDays }, (_, i) => {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    return {
      date: d.toISOString().slice(0, 10),
      day: d.getDate(),
      weekday: ["日", "一", "二", "三", "四", "五", "六"][d.getDay()],
      isToday: d.toISOString().slice(0, 10) === today,
      isWeekend: d.getDay() === 0 || d.getDay() === 6,
    };
  });

  return (
    <div className="p-4 overflow-x-auto">
      <div className="min-w-[700px]">
        {/* Timeline header */}
        <div className="flex mb-1">
          <div className="w-[180px] shrink-0" />
          <div className="flex-1 flex">
            {days.map((d) => (
              <div
                key={d.date}
                className={`flex-1 text-center px-0.5 ${d.isToday ? "bg-accent/5 rounded-t" : ""} ${d.isWeekend ? "opacity-50" : ""}`}
              >
                <div
                  className={`text-[8px] ${d.isToday ? "text-accent font-bold" : "text-text-muted"}`}
                >
                  {d.weekday}
                </div>
                <div
                  className={`text-[10px] ${d.isToday ? "text-accent font-bold" : "text-text-secondary"}`}
                >
                  {d.day}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Today marker line */}
        <div className="flex relative">
          <div className="w-[180px] shrink-0" />
          <div className="flex-1 relative h-0">
            <div
              className="absolute top-0 bottom-0 w-px bg-accent z-10"
              style={{
                left: `${((todayOffset + 0.5) / totalDays) * 100}%`,
                height: `${SPRINT_TASKS_GANTT.length * 36 + 8}px`,
              }}
            />
          </div>
        </div>

        {/* Task rows */}
        <div className="space-y-1">
          {SPRINT_TASKS_GANTT.map((task) => {
            const start = dayOffset(task.startDate, startDate);
            const end = dayOffset(task.endDate, startDate);
            const duration = end - start;
            const leftPct = (start / totalDays) * 100;
            const widthPct = (duration / totalDays) * 100;
            const style = STATUS_STYLES[task.status];
            const barColor = STATUS_BAR_COLORS[task.status];
            const isSelected = selectedTask?.id === task.id;
            const dep = task.dependency
              ? SPRINT_TASKS_GANTT.find((t) => t.id === task.dependency)
              : null;

            return (
              <div
                key={task.id}
                role="button"
                tabIndex={0}
                onClick={() => onSelectTask(task)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") onSelectTask(task);
                }}
                className={`flex items-center h-[32px] cursor-pointer rounded transition-colors ${
                  isSelected ? "bg-accent/5" : "hover:bg-surface-1"
                }`}
              >
                {/* Task label */}
                <div className="w-[180px] shrink-0 flex items-center gap-1.5 px-2">
                  <span
                    className={`text-[8px] px-1 py-0.5 rounded font-bold ${style.bg} ${style.text}`}
                  >
                    {task.id}
                  </span>
                  <span className="text-[11px] text-text-primary truncate flex-1">
                    {task.title}
                  </span>
                  {task.status === "blocked" && (
                    <AlertTriangle size={10} className="text-danger shrink-0" />
                  )}
                </div>

                {/* Gantt bar area */}
                <div className="flex-1 relative h-full">
                  {/* Dependency arrow */}
                  {dep && (
                    <div
                      className="absolute top-1/2 -translate-y-1/2 z-[1]"
                      style={{ left: `${(dayOffset(dep.endDate, startDate) / totalDays) * 100}%` }}
                    >
                      <ArrowRight size={8} className="text-text-muted" />
                    </div>
                  )}

                  {/* Bar */}
                  <div
                    className={`absolute top-1/2 -translate-y-1/2 h-[18px] rounded-md ${barColor} transition-all ${
                      isSelected ? "ring-2 ring-accent/40" : ""
                    }`}
                    style={{ left: `${leftPct}%`, width: `${widthPct}%`, minWidth: "12px" }}
                  >
                    {/* Progress fill */}
                    <div
                      className="h-full rounded-md bg-white/20"
                      style={{ width: `${task.progress}%` }}
                    />
                    {/* Label on bar */}
                    {widthPct > 8 && (
                      <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-white/90">
                        {task.progress}%
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-4 px-2">
          {Object.entries(STATUS_STYLES).map(([key, st]) => (
            <div key={key} className="flex items-center gap-1">
              <div
                className={`w-3 h-2 rounded-sm ${STATUS_BAR_COLORS[key as SprintTask["status"]]}`}
              />
              <span className="text-[9px] text-text-muted">{st.label}</span>
            </div>
          ))}
          <div className="flex items-center gap-1 ml-2">
            <div className="w-3 h-px bg-accent" />
            <span className="text-[9px] text-accent">今天</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Sprint Tab (Enhanced) ─────────────────────────────────

export default function SprintTab({
  selectedTask,
  onSelectTask,
}: {
  selectedTask: SprintTask | null;
  onSelectTask: (t: SprintTask) => void;
}) {
  const [view, setView] = useState<SprintView>("list");
  const done = SPRINT_TASKS.filter((t) => t.status === "done").length;
  const total = SPRINT_TASKS.length;
  const progress = Math.round((done / total) * 100);

  return (
    <div className="h-full flex flex-col">
      {/* Sprint header with view toggle */}
      <div className="px-5 py-3 border-b border-border bg-surface-1/50 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-[13px] font-medium text-text-primary">{SPRINT_META.name}</span>
          <span className="text-[11px] text-text-muted flex items-center gap-1">
            <Calendar size={10} /> {SPRINT_META.startDate.slice(5)} → {SPRINT_META.endDate.slice(5)}
          </span>
          <span className="text-[12px] font-medium text-clone tabular-nums">{progress}%</span>
        </div>
        <ToggleGroup
          type="single"
          value={view}
          onValueChange={(value: string) => {
            if (value) setView(value as SprintView);
          }}
          variant="default"
          size="sm"
          aria-label="Sprint view"
        >
          <ToggleGroupItem value="list" className="gap-1">
            <List size={12} /> 列表
          </ToggleGroupItem>
          <ToggleGroupItem value="gantt" className="gap-1">
            <GanttChart size={12} /> 甘特图
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Progress bar */}
      <div className="px-5 py-2 border-b border-border shrink-0">
        <ProgressBar value={progress} className="h-2" />
        <div className="flex items-center justify-between mt-1.5 text-[10px] text-text-muted">
          <div className="flex items-center gap-3">
            <span>
              {done}/{total} 任务完成
            </span>
            <span className="flex items-center gap-1">
              <Users size={9} />{" "}
              {TEAM_MEMBERS.filter((m) => SPRINT_TASKS.some((t) => t.assignee === m.name)).length}{" "}
              人参与
            </span>
          </div>
          <span>剩余 7 天</span>
        </div>
      </div>

      {/* View content */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {view === "list" ? (
          <ListView selectedTask={selectedTask} onSelectTask={onSelectTask} />
        ) : (
          <GanttView selectedTask={selectedTask} onSelectTask={onSelectTask} />
        )}
      </div>
    </div>
  );
}

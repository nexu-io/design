import {
  Badge,
  Button,
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  InteractiveRow,
  InteractiveRowContent,
  InteractiveRowLeading,
  InteractiveRowTrailing,
  PageHeader,
  StatCard,
} from "@nexu-design/ui-web";
import {
  ArrowUpRight,
  Check,
  CircleCheckBig,
  Clock3,
  Copy,
  Flame,
  Gift,
  MessageCircle,
  Rocket,
  Share2,
  Star,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { SectionHeader } from "../../components/SectionHeader";
import { useBudget, type RewardTaskState } from "../../hooks/useBudget";
import { usePageTitle } from "../../hooks/usePageTitle";

type RewardGroupKey = "daily" | "community" | "social";

const rewardGroups: { key: RewardGroupKey; title: string; description: string }[] = [
  {
    key: "daily",
    title: "Daily refresh",
    description: "Small recurring credits to keep active users unblocked.",
  },
  {
    key: "community",
    title: "Open-source actions",
    description: "One-time tasks that celebrate early product advocacy.",
  },
  {
    key: "social",
    title: "Share materials",
    description: "Weekly social tasks with built-in assets for 小红书 / 即刻 / 飞书.",
  },
];

function formatCredits(value: number) {
  return value.toLocaleString();
}

function getTaskIcon(task: RewardTaskState) {
  if (task.id === "daily-check-in") return Flame;
  if (task.id === "github-star") return Star;
  if (task.group === "community") return Rocket;
  return MessageCircle;
}

function getTaskActionLabel(task: RewardTaskState) {
  if (task.status === "claimed") return task.claimedLabel ?? "Completed";
  if (task.status === "cooldown") return task.cooldownLabel ?? "On cooldown";
  if (task.status === "locked") return "Sign in to unlock";
  if (task.requiresMaterial) return "Get material";
  if (task.cadence === "daily") return "Check in";
  return "Claim reward";
}

function MaterialPreview({ task }: { task: RewardTaskState }) {
  return (
    <div className="rounded-2xl border border-border bg-surface-2 p-4">
      <div className="rounded-[20px] border border-border bg-gradient-to-br from-accent/15 via-surface-0 to-pink/10 p-5">
        <Badge variant="secondary">{task.platform?.toUpperCase() ?? "SHARE"}</Badge>
        <div className="mt-4 text-xl font-semibold text-text-primary">{task.materialTitle}</div>
        <p className="mt-2 text-sm leading-6 text-text-secondary">{task.materialBody}</p>
        <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
          <Gift size={12} /> +{formatCredits(task.credits)} credits after confirmation
        </div>
      </div>
    </div>
  );
}

export default function RewardsPage() {
  usePageTitle("Rewards");

  const budget = useBudget();
  const [materialTaskId, setMaterialTaskId] = useState<string | null>(null);
  const [confirmTaskId, setConfirmTaskId] = useState<string | null>(null);
  const [captionCopiedFor, setCaptionCopiedFor] = useState<string | null>(null);

  const groupedTasks = useMemo(() => {
    return rewardGroups.map((group) => ({
      ...group,
      tasks: budget.tasks.filter((task) => task.group === group.key),
    }));
  }, [budget.tasks]);

  const materialTask = budget.tasks.find((task) => task.id === materialTaskId) ?? null;
  const confirmTask = budget.tasks.find((task) => task.id === confirmTaskId) ?? null;

  function handleTaskAction(task: RewardTaskState) {
    if (task.status === "locked" || task.status === "cooldown" || task.status === "claimed") return;

    if (task.requiresMaterial) {
      setMaterialTaskId(task.id);
      return;
    }

    budget.claimTask(task.id);
  }

  return (
    <div className="mx-auto max-w-6xl p-4 sm:p-8">
      <PageHeader
        title="Rewards"
        description="Prototype the cloud rewards center with task states, weekly share channels, and a material → confirmation flow."
      />

      <div className="mb-6 rounded-2xl border border-border bg-surface-1 p-4 sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="text-sm font-semibold text-text-primary">Rewards controls</div>
            <div className="mt-1 text-[12px] text-text-muted">
              Switch account state and reset task history while iterating on the prototype.
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              variant={budget.isSignedIn ? "default" : "outline"}
              onClick={() => budget.setIsSignedIn(true)}
            >
              Signed in
            </Button>
            <Button
              size="sm"
              variant={!budget.isSignedIn ? "default" : "outline"}
              onClick={() => budget.setIsSignedIn(false)}
            >
              Signed out
            </Button>
            <Button size="sm" variant="ghost" onClick={budget.reset}>
              Reset demo state
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Credits earned"
          value={formatCredits(budget.totalEarned)}
          meta="Reward credits stack on top of plan credits"
          icon={Gift}
          tone="accent"
        />
        <StatCard
          label="One-time tasks"
          value={`${budget.oneTimeCompleted}/${budget.oneTimeTotal}`}
          meta="Community tasks completed"
          icon={CircleCheckBig}
          tone="success"
        />
        <StatCard
          label="Next weekly unlock"
          value={
            budget.nextWeeklyReward
              ? `+${formatCredits(budget.nextWeeklyReward.credits)}`
              : "All live"
          }
          meta={budget.nextWeeklyReward?.title ?? "Every weekly share channel is ready"}
          icon={Clock3}
          tone="info"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_0.9fr]">
        <div className="space-y-5">
          {groupedTasks.map((group) => (
            <section key={group.key} className="card p-5 sm:p-6">
              <SectionHeader
                title={
                  <div>
                    <h2 className="text-sm font-semibold text-text-primary">{group.title}</h2>
                    <p className="mt-1 text-[13px] text-text-muted">{group.description}</p>
                  </div>
                }
                action={
                  group.key === "social" ? (
                    <span className="text-[12px] font-medium text-text-muted">Once per week</span>
                  ) : undefined
                }
                className="mb-4 items-start"
              />

              <div className="space-y-3">
                {group.tasks.map((task) => {
                  const Icon = getTaskIcon(task);
                  const isCompleted = task.status === "claimed" || task.status === "cooldown";

                  return (
                    <InteractiveRow
                      key={task.id}
                      selected={isCompleted}
                      className="items-center px-4 py-4"
                      onClick={() => handleTaskAction(task)}
                    >
                      <InteractiveRowLeading>
                        <div className="flex size-10 items-center justify-center rounded-xl bg-surface-3 text-text-secondary">
                          <Icon size={18} />
                        </div>
                      </InteractiveRowLeading>
                      <InteractiveRowContent>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                          <div className="text-sm font-semibold text-text-primary">
                            {task.title}
                          </div>
                          <div
                            className={`text-sm font-medium ${isCompleted ? "text-text-muted" : "text-accent"}`}
                          >
                            {isCompleted ? (
                              <span className="inline-flex items-center gap-1">
                                <Check size={14} className="text-accent" />
                                {formatCredits(task.credits)} credits
                              </span>
                            ) : (
                              <>+{formatCredits(task.credits)} credits</>
                            )}
                          </div>
                        </div>
                        <div className="mt-1 text-[13px] text-text-muted">{task.description}</div>
                        <div className="mt-2 text-[12px] font-medium text-text-secondary">
                          {task.cooldownLabel ?? task.claimedLabel ?? task.helper}
                        </div>
                      </InteractiveRowContent>
                      <InteractiveRowTrailing className="flex flex-col items-end gap-2 sm:flex-row sm:items-center">
                        {task.platform ? <Badge variant="secondary">{task.platform}</Badge> : null}
                        <Button
                          size="sm"
                          variant={
                            task.status === "available"
                              ? "default"
                              : task.status === "locked"
                                ? "outline"
                                : "ghost"
                          }
                          onClick={(event) => {
                            event.stopPropagation();
                            handleTaskAction(task);
                          }}
                        >
                          {getTaskActionLabel(task)}
                        </Button>
                      </InteractiveRowTrailing>
                    </InteractiveRow>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        <div className="space-y-4">
          <div className="card p-5">
            <div className="flex items-center gap-2">
              <Share2 size={16} className="text-accent" />
              <h2 className="text-sm font-semibold text-text-primary">How reward sharing works</h2>
            </div>
            <ol className="mt-4 list-decimal space-y-3 pl-5 text-[13px] text-text-secondary">
              <li>Open a weekly social task and preview the prepared material.</li>
              <li>Copy the caption, post in 小红书 / 即刻 / 飞书, then return to confirm.</li>
              <li>Credits land in the same usage balance shown in Pricing / Usage.</li>
            </ol>
            <Button className="mt-4 w-full" variant="outline" asChild>
              <Link to="/openclaw/pricing">
                Back to Pricing / Usage <ArrowUpRight size={14} />
              </Link>
            </Button>
          </div>

          <div className="card p-5">
            <div className="text-sm font-semibold text-text-primary">Supported share channels</div>
            <div className="mt-3 grid gap-3">
              {["小红书", "即刻", "飞书"].map((channel) => (
                <div
                  key={channel}
                  className="rounded-xl border border-border bg-surface-2 px-4 py-3 text-[13px] text-text-secondary"
                >
                  <div className="font-medium text-text-primary">{channel}</div>
                  <div className="mt-1">
                    Includes a tailored caption, reward amount, and confirm step.
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Dialog
        open={Boolean(materialTask)}
        onOpenChange={(open) => !open && setMaterialTaskId(null)}
      >
        <DialogContent size="lg">
          {materialTask ? (
            <>
              <DialogHeader>
                <DialogTitle>{materialTask.title} material pack</DialogTitle>
                <DialogDescription>
                  Download-ready creative plus caption support before you confirm the share.
                </DialogDescription>
              </DialogHeader>
              <DialogBody>
                <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                  <MaterialPreview task={materialTask} />
                  <div className="space-y-4 rounded-2xl border border-border bg-surface-1 p-4">
                    <div>
                      <div className="text-sm font-semibold text-text-primary">
                        Suggested caption
                      </div>
                      <p className="mt-2 rounded-xl border border-border bg-surface-0 p-3 text-[13px] leading-6 text-text-secondary">
                        {materialTask.caption}
                      </p>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-text-primary">
                        Confirmation flow
                      </div>
                      <p className="mt-2 text-[13px] text-text-muted">
                        Step 1: copy the caption. Step 2: publish the card. Step 3: confirm to
                        receive +{formatCredits(materialTask.credits)} credits.
                      </p>
                    </div>
                  </div>
                </div>
              </DialogBody>
              <DialogFooter>
                <Button variant="outline" onClick={() => setMaterialTaskId(null)}>
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setCaptionCopiedFor(materialTask.id);
                    setMaterialTaskId(null);
                    setConfirmTaskId(materialTask.id);
                  }}
                >
                  <Copy size={14} /> Copy caption & continue
                </Button>
              </DialogFooter>
            </>
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(confirmTask)} onOpenChange={(open) => !open && setConfirmTaskId(null)}>
        <DialogContent size="sm">
          {confirmTask ? (
            <>
              <DialogHeader>
                <DialogTitle>Confirm {confirmTask.title}</DialogTitle>
                <DialogDescription>
                  {captionCopiedFor === confirmTask.id
                    ? "Caption prepared. Confirm the post once it is live."
                    : "Complete the share first, then confirm to claim the reward."}
                </DialogDescription>
              </DialogHeader>
              <DialogBody>
                <div className="rounded-xl border border-border bg-surface-2 p-4 text-[13px] text-text-secondary">
                  This weekly reward grants{" "}
                  <span className="font-semibold text-text-primary">
                    +{formatCredits(confirmTask.credits)} credits
                  </span>{" "}
                  and then moves into cooldown until next week.
                </div>
              </DialogBody>
              <DialogFooter>
                <Button variant="outline" onClick={() => setConfirmTaskId(null)}>
                  Not yet
                </Button>
                <Button
                  onClick={() => {
                    budget.claimTask(confirmTask.id);
                    setConfirmTaskId(null);
                  }}
                >
                  Confirm & claim credits
                </Button>
              </DialogFooter>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}

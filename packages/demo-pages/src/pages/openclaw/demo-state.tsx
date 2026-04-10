import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type DemoPlan = "free" | "plus" | "pro";
export type DemoBudgetStatus = "healthy" | "warning" | "depleted";
export type DemoCreditPack = "none" | "2000" | "5200" | "11000" | "55000";

type DemoState = {
  loggedIn: boolean;
  setLoggedIn: (value: boolean) => void;
  plan: DemoPlan;
  setPlan: (value: DemoPlan) => void;
  budgetStatus: DemoBudgetStatus;
  setBudgetStatus: (value: DemoBudgetStatus) => void;
  creditPack: DemoCreditPack;
  setCreditPack: (value: DemoCreditPack) => void;
};

type StoredDemoState = {
  loggedIn: boolean;
  plan: DemoPlan;
  budgetStatus: DemoBudgetStatus;
  creditPack: DemoCreditPack;
};

const STORAGE_KEY = "nexu_openclaw_demo_state";

const DEFAULT_STATE: StoredDemoState = {
  loggedIn: true,
  plan: "pro",
  budgetStatus: "healthy",
  creditPack: "none",
};

const CREDIT_PACK_MAP: Record<DemoCreditPack, { label: string; remaining: number }> = {
  none: { label: "无", remaining: 0 },
  "2000": { label: "2,000 积分包", remaining: 1620 },
  "5200": { label: "5,200 积分包", remaining: 3840 },
  "11000": { label: "11,000 积分包", remaining: 8200 },
  "55000": { label: "55,000 积分包", remaining: 41500 },
};

function readStoredState(): StoredDemoState {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw) as Partial<StoredDemoState>;
    return {
      loggedIn: typeof parsed.loggedIn === "boolean" ? parsed.loggedIn : DEFAULT_STATE.loggedIn,
      plan:
        parsed.plan === "free" || parsed.plan === "plus" || parsed.plan === "pro"
          ? parsed.plan
          : DEFAULT_STATE.plan,
      budgetStatus:
        parsed.budgetStatus === "healthy" ||
        parsed.budgetStatus === "warning" ||
        parsed.budgetStatus === "depleted"
          ? parsed.budgetStatus
          : DEFAULT_STATE.budgetStatus,
      creditPack:
        parsed.creditPack === "none" ||
        parsed.creditPack === "2000" ||
        parsed.creditPack === "5200" ||
        parsed.creditPack === "11000" ||
        parsed.creditPack === "55000"
          ? parsed.creditPack
          : DEFAULT_STATE.creditPack,
    };
  } catch {
    return DEFAULT_STATE;
  }
}

const OpenClawDemoStateContext = createContext<DemoState | null>(null);

export function OpenClawDemoStateProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<StoredDemoState>(readStoredState);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // noop
    }
  }, [state]);

  const value = useMemo<DemoState>(
    () => ({
      loggedIn: state.loggedIn,
      setLoggedIn: (value) => setState((prev) => ({ ...prev, loggedIn: value })),
      plan: state.plan,
      setPlan: (value) => setState((prev) => ({ ...prev, plan: value })),
      budgetStatus: state.budgetStatus,
      setBudgetStatus: (value) => setState((prev) => ({ ...prev, budgetStatus: value })),
      creditPack: state.creditPack,
      setCreditPack: (value) => setState((prev) => ({ ...prev, creditPack: value })),
    }),
    [state],
  );

  return (
    <OpenClawDemoStateContext.Provider value={value}>{children}</OpenClawDemoStateContext.Provider>
  );
}

export function useOpenClawDemoState() {
  const context = useContext(OpenClawDemoStateContext);
  if (!context) {
    throw new Error("useOpenClawDemoState must be used inside OpenClawDemoStateProvider");
  }
  return context;
}

export function getCreditPackInfo(creditPack: DemoCreditPack) {
  return CREDIT_PACK_MAP[creditPack];
}

import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";
import { BrandRail } from "@nexu-design/ui-web";

interface RailHighlight {
  icon: LucideIcon;
  text: string;
}

interface SlarkAuthRailProps {
  title: React.ReactNode;
  description: React.ReactNode;
  highlights: RailHighlight[];
}

export function SlarkAuthRail({
  title,
  description,
  highlights,
}: SlarkAuthRailProps): React.ReactElement {
  return (
    <BrandRail
      logo={<div className="text-lg font-semibold tracking-tight text-white">Slark</div>}
      logoLabel="Slark home"
      title={
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
            Managed agent workspace
          </p>
          <h1
            className="mt-4 max-w-[520px] text-[40px] leading-[0.96] tracking-tight text-white sm:text-[52px]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {title}
          </h1>
        </div>
      }
      description={description}
      background={
        <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_18%_18%,rgba(255,255,255,0.08),transparent_36%),radial-gradient(80%_80%_at_82%_22%,rgba(45,212,191,0.16),transparent_34%),linear-gradient(180deg,#10131a_0%,#090b10_100%)]" />
      }
      footer={
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/70">
          Desktop-first collaboration for humans and agents
          <ArrowUpRight className="size-4" />
        </div>
      }
    >
      <div className="space-y-3">
        {highlights.map((item) => (
          <div
            key={item.text}
            className="grid min-h-[72px] grid-cols-[40px_1fr] items-center gap-4 rounded-xl border border-white/10 bg-white/[0.025] px-5 py-4"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.06]">
              <item.icon className="size-4 text-white/70" />
            </div>
            <p className="text-base leading-[1.6] text-white/60">{item.text}</p>
          </div>
        ))}
      </div>
    </BrandRail>
  );
}

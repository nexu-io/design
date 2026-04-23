import { Github, Mail } from "lucide-react";
import type { ReactElement } from "react";

import type { ConnectorService } from "@/types";

const connectorLabels: Record<ConnectorService, string> = {
  figma: "Figma",
  linear: "Linear",
  notion: "Notion",
  slack: "Slack",
  github: "GitHub",
  gmail: "Gmail",
};

function FigmaMark(): ReactElement {
  return (
    <svg viewBox="0 0 38 57" className="h-3.5 w-3.5" aria-hidden>
      <title>Figma</title>
      <path fill="#1abcfe" d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0Z" />
      <path fill="#0acf83" d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0Z" />
      <path fill="#ff7262" d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19Z" />
      <path fill="#f24e1e" d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5Z" />
      <path fill="#a259ff" d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5Z" />
    </svg>
  );
}

function LinearMark(): ReactElement {
  return (
    <svg viewBox="0 0 100 100" className="h-3.5 w-3.5" aria-hidden>
      <title>Linear</title>
      <path
        fill="#5E6AD2"
        d="M1.223 59.426 40.574 98.78C22.393 95.09 8.01 80.705 4.32 62.524Zm-.706-11.45L51.99 99.45c2.653.357 5.359.542 8.108.542 1.667 0 3.314-.068 4.94-.2L.716 39.03c-.132 1.627-.2 3.275-.2 4.941 0 1.348.045 2.687.133 4.015Zm2.67-18.05 63.874 63.88a50.123 50.123 0 0 0 7.85-2.827L5.648 22.072a50.144 50.144 0 0 0-2.46 7.855ZM12.33 12.39c9.14-9.137 21.763-14.789 35.697-14.789 27.938 0 50.578 22.64 50.578 50.578 0 13.934-5.652 26.558-14.79 35.699L12.33 12.391Z"
      />
    </svg>
  );
}

function NotionMark(): ReactElement {
  return (
    <span className="flex h-4 w-4 items-center justify-center rounded-sm bg-foreground text-[10px] font-bold text-background">
      N
    </span>
  );
}

function SlackMark(): ReactElement {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden>
      <title>Slack</title>
      <path
        fill="#E01E5A"
        d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.312A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.523z"
      />
      <path
        fill="#36C5F0"
        d="M8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521z"
      />
      <path
        fill="#2EB67D"
        d="M18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522z"
      />
      <path
        fill="#ECB22E"
        d="M15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523z"
      />
    </svg>
  );
}

export function ConnectorBadge({ service }: { service: ConnectorService }): ReactElement {
  let icon: ReactElement;
  switch (service) {
    case "figma":
      icon = <FigmaMark />;
      break;
    case "linear":
      icon = <LinearMark />;
      break;
    case "notion":
      icon = <NotionMark />;
      break;
    case "slack":
      icon = <SlackMark />;
      break;
    case "github":
      icon = <Github className="h-3.5 w-3.5" />;
      break;
    case "gmail":
      icon = <Mail className="h-3.5 w-3.5 text-[#EA4335]" />;
      break;
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2 py-1 text-xs font-medium">
      {icon}
      {connectorLabels[service]}
    </span>
  );
}

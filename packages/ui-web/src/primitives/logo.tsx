import type * as React from "react";

import { cn } from "../lib/cn";
import {
  CANONICAL_MODEL_ICON_DATA_URIS,
  CANONICAL_PROVIDER_ICON_DATA_URIS,
  CANONICAL_RUNTIME_ICON_DATA_URIS,
} from "./logo-icon-data";

export type ProviderName =
  | "nexu"
  | "anthropic"
  | "openai"
  | "google"
  | "xai"
  | "kimi"
  | "glm"
  | "minimax"
  | "openrouter"
  | "siliconflow"
  | "ppio"
  | "xiaoxiang"
  | "deepseek"
  | "qwen";

export type PlatformName = "slack" | "feishu" | "discord" | "telegram" | "wechat" | "whatsapp";

export type BrandName = "nexu" | "github";

export type RuntimeName =
  | "claude-code"
  | "cursor"
  | "opencode"
  | "hermes"
  | "codex"
  | "gemini-cli"
  | "openclaw"
  | "pi";

export type ModelName = string;

export interface LogoProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: number;
  title?: string;
}

function LogoFrame({
  size = 16,
  className,
  title,
  children,
  ...props
}: LogoProps & { children: React.ReactNode }) {
  return (
    <span
      className={cn("inline-flex shrink-0 items-center justify-center", className)}
      style={{ width: size, height: size }}
      {...props}
    >
      <span className="sr-only">{title}</span>
      {children}
    </span>
  );
}

function SvgLogo({
  size,
  className,
  title,
  children,
  viewBox = "0 0 24 24",
  ...props
}: LogoProps & { children: React.ReactNode; viewBox?: string }) {
  return (
    <LogoFrame size={size} className={className} title={title} {...props}>
      <svg
        viewBox={viewBox}
        className="size-full"
        aria-hidden={title ? undefined : true}
        role={title ? "img" : undefined}
        focusable="false"
      >
        {title ? <title>{title}</title> : null}
        {children}
      </svg>
    </LogoFrame>
  );
}

function MonogramLogo({
  label,
  background,
  foreground = "#fff",
  size,
  className,
  title,
  ...props
}: LogoProps & {
  label: string;
  background: string;
  foreground?: string;
}) {
  return (
    <SvgLogo size={size} className={className} title={title} viewBox="0 0 24 24" {...props}>
      <rect width="24" height="24" rx="5" fill={background} />
      <text
        x="12"
        y="15.5"
        textAnchor="middle"
        fill={foreground}
        fontSize="8"
        fontWeight="700"
        fontFamily="system-ui, sans-serif"
      >
        {label}
      </text>
    </SvgLogo>
  );
}

function ImageLogo({
  src,
  alt,
  size,
  className,
  title,
  ...props
}: LogoProps & { src: string; alt: string }) {
  return (
    <LogoFrame size={size} className={className} title={title} {...props}>
      <img src={src} alt={title ?? alt} width={size} height={size} className="size-full" />
    </LogoFrame>
  );
}

function MaskLogo({
  src,
  alt,
  size,
  className,
  title,
  ...props
}: LogoProps & { src: string; alt: string }) {
  return (
    <LogoFrame size={size} className={className} title={title} {...props}>
      <span
        aria-label={title ?? alt}
        role="img"
        className="size-full"
        style={{
          backgroundColor: "currentColor",
          WebkitMaskImage: `url("${src}")`,
          maskImage: `url("${src}")`,
          WebkitMaskPosition: "center",
          maskPosition: "center",
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskSize: "contain",
          maskSize: "contain",
        }}
      />
    </LogoFrame>
  );
}

const PROVIDER_ICON_ALIASES: Record<string, string> = {
  anthropic: "anthropic",
  "amazon-bedrock": "bedrock",
  aws: "aws",
  baidu: "baidu",
  baiducloud: "baiducloud",
  deepseek: "deepseek",
  glm: "zhipu",
  google: "aistudio",
  huggingface: "huggingface",
  kimi: "moonshot",
  minimax: "minimax",
  mistral: "mistral",
  moonshot: "moonshot",
  nexu: "nexu",
  ollama: "ollama",
  openai: "openai",
  openrouter: "openrouter",
  nvidia: "nvidia",
  ppio: "ppio",
  qianfan: "baiducloud",
  qwen: "alibabacloud",
  siliconflow: "siliconcloud",
  stepfun: "stepfun",
  together: "together",
  togetherai: "together",
  vllm: "vllm",
  volcengine: "volcengine",
  xai: "xai",
  xiaoxiang: "xiaomimimo",
  xiaomi: "xiaomimimo",
  zai: "zhipu",
};

function normalizeProviderIconKey(provider: string): string | null {
  const normalized = provider.trim().toLowerCase();

  if (!normalized) {
    return null;
  }

  return PROVIDER_ICON_ALIASES[normalized] ?? normalized;
}

function getDisplayModelId(model: string): string {
  const normalized = model.trim();

  if (!normalized || !normalized.includes("/")) {
    return normalized;
  }

  return normalized.slice(normalized.lastIndexOf("/") + 1);
}

function resolveModelIconKey(model: string, provider?: string): string | null {
  const normalizedModel = model.trim().toLowerCase();
  const displayModelId = getDisplayModelId(model).toLowerCase();
  const normalizedProvider = provider?.trim().toLowerCase() ?? "";
  const lookupText = [normalizedModel, displayModelId, normalizedProvider]
    .filter(Boolean)
    .join(" ");

  if (!lookupText) {
    return null;
  }

  const rules: Array<{ key: string; patterns: string[] }> = [
    { key: "claudecode", patterns: ["claude-code", "claudecode"] },
    { key: "claude", patterns: ["claude"] },
    { key: "gemini", patterns: ["gemini"] },
    { key: "qwen", patterns: ["qwen", "tongyi"] },
    { key: "kimi", patterns: ["kimi"] },
    { key: "deepseek", patterns: ["deepseek"] },
    { key: "doubao", patterns: ["doubao"] },
    { key: "glmv", patterns: ["glmv"] },
    { key: "chatglm", patterns: ["chatglm", "glm-4", "glm4", "glm"] },
    { key: "grok", patterns: ["grok"] },
    { key: "baichuan", patterns: ["baichuan"] },
    { key: "mistral", patterns: ["mistral", "mixtral"] },
    { key: "minimax", patterns: ["minimax", "abab"] },
    { key: "openai", patterns: ["openai", "gpt", "o1", "o3", "o4"] },
    { key: "ollama", patterns: ["ollama"] },
    { key: "moonshot", patterns: ["moonshot"] },
    { key: "zhipu", patterns: ["zhipu", "bigmodel"] },
    { key: "volcengine", patterns: ["volcengine"] },
    { key: "alibabacloud", patterns: ["alibabacloud"] },
    { key: "alibaba", patterns: ["alibaba"] },
    { key: "baiducloud", patterns: ["baiducloud", "qianfan"] },
    { key: "xai", patterns: ["xai"] },
  ];

  for (const rule of rules) {
    if (rule.patterns.some((pattern) => lookupText.includes(pattern))) {
      return rule.key;
    }
  }

  return null;
}

function getRuntimeMonogramLabel(runtime: string): string {
  const normalized = runtime.trim();

  if (!normalized) {
    return "?";
  }

  return normalized
    .split(/[^a-z0-9]+/i)
    .map((part) => part[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function AnthropicIcon(props: LogoProps) {
  return (
    <SvgLogo viewBox="0 0 24 24" {...props}>
      <path
        d="M13.827 3.52h3.603L24 20.48h-3.603l-6.57-16.96zm-7.258 0h3.767L16.906 20.48h-3.674l-1.476-3.914H5.036l-1.466 3.914H0L6.569 3.52zm.658 10.418h4.543L9.548 7.04l-2.32 6.898z"
        fill="currentColor"
      />
    </SvgLogo>
  );
}

export function OpenAIIcon(props: LogoProps) {
  return (
    <SvgLogo viewBox="0 0 24 24" {...props}>
      <path
        d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.998 5.998 0 0 0-3.998 2.9 6.042 6.042 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z"
        fill="currentColor"
      />
    </SvgLogo>
  );
}

export function GoogleIcon(props: LogoProps) {
  return (
    <SvgLogo viewBox="0 0 24 24" {...props}>
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </SvgLogo>
  );
}

export function XAIIcon(props: LogoProps) {
  return (
    <SvgLogo viewBox="0 0 24 24" {...props}>
      <path
        d="M3 2l8.6 12.24L3 22h1.95l7.56-6.8L18.06 22H21L12.12 9.36 19.8 2h-1.95l-6.66 6.42L5.94 2H3zm2.76 1.4h2.46l9.96 15.2h-2.46L5.76 3.4z"
        fill="currentColor"
      />
    </SvgLogo>
  );
}

export function SlackIcon(props: LogoProps) {
  return (
    <SvgLogo viewBox="0 0 24 24" {...props}>
      <path
        d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zm1.271 0a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313z"
        fill="#E01E5A"
      />
      <path
        d="M8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zm0 1.271a2.527 2.527 0 0 1 2.521 2.521 2.527 2.527 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312z"
        fill="#36C5F0"
      />
      <path
        d="M18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zm-1.27 0a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.163 0a2.528 2.528 0 0 1 2.523 2.522v6.312z"
        fill="#2EB67D"
      />
      <path
        d="M15.163 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.163 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zm0-1.27a2.527 2.527 0 0 1-2.52-2.523 2.527 2.527 0 0 1 2.52-2.52h6.315A2.528 2.528 0 0 1 24 15.163a2.528 2.528 0 0 1-2.522 2.523h-6.315z"
        fill="#ECB22E"
      />
    </SvgLogo>
  );
}

export function FeishuIcon(props: LogoProps) {
  return (
    <SvgLogo viewBox="7 7 26 26" {...props}>
      <path
        d="M21.069 20.504l.063-.06.125-.122.085-.084.256-.254.348-.344.299-.296.281-.278.293-.289.269-.266.374-.37.218-.206.419-.359.404-.306.598-.386.617-.33.606-.265.348-.127.177-.058a14.78 14.78 0 0 0-2.793-5.603c-.252-.318-.639-.502-1.047-.502H12.221c-.196 0-.277.249-.119.364a31.49 31.49 0 0 1 8.943 10.162c.008-.007.016-.015.025-.023z"
        fill="#00D6B9"
      />
      <path
        d="M16.791 30c5.57 0 10.423-3.074 12.955-7.618.089-.159.175-.321.258-.484a6.12 6.12 0 0 1-.425.699c-.055.078-.111.155-.17.23a6.29 6.29 0 0 1-.225.274c-.062.07-.123.138-.188.206a5.61 5.61 0 0 1-.407.384 5.53 5.53 0 0 1-.24.195 7.12 7.12 0 0 1-.292.21c-.063.043-.126.084-.191.122s-.134.081-.204.119c-.14.078-.282.149-.428.215a5.53 5.53 0 0 1-.385.157 5.81 5.81 0 0 1-.43.138 5.91 5.91 0 0 1-.661.143c-.162.025-.325.044-.491.055-.173.012-.348.016-.525.014-.193-.003-.388-.015-.585-.037-.144-.015-.289-.037-.433-.062-.126-.022-.252-.049-.38-.079l-.2-.051-.555-.155-.275-.081-.41-.125-.334-.107-.317-.104-.215-.073-.26-.091-.186-.066-.367-.134-.212-.081-.284-.11-.299-.119-.193-.079-.24-.1-.185-.078-.192-.084-.166-.073-.152-.067-.153-.07-.159-.073-.2-.093-.208-.099-.222-.108-.189-.093c-3.335-1.668-6.295-3.89-8.822-6.583-.126-.134-.349-.045-.349.138l.005 9.52v.773c0 .448.222.87.595 1.118C10.946 29.092 13.762 30 16.791 30z"
        fill="#3370FF"
      />
      <path
        d="M33.151 16.582c-1.129-.556-2.399-.869-3.744-.869a8.45 8.45 0 0 0-2.303.317l-.252.075-.177.058-.348.127-.606.265-.617.33-.598.386-.404.306-.419.359-.218.206-.374.37-.269.266-.293.289-.281.278-.299.296-.348.344-.256.254-.085.084-.125.122-.063.06-.095.09-.105.099c-.924.848-1.956 1.581-3.072 2.175l.2.093.159.073.153.07.152.067.166.073.192.084.185.078.24.1.193.079.299.119.284.11.212.081.367.134.186.066.26.09.215.073.317.104.334.107.41.125.275.081.555.155.2.051.379.079.433.062.585.037.525-.014.491-.055a5.61 5.61 0 0 0 .66-.143l.43-.138.385-.158.427-.215.204-.119.191-.122.292-.21.24-.195.407-.384.188-.206.225-.274.17-.23a6.13 6.13 0 0 0 .421-.693l.144-.288 1.305-2.599-.003.006a8.07 8.07 0 0 1 1.697-2.439z"
        fill="#133C9A"
      />
    </SvgLogo>
  );
}

export function DiscordIcon(props: LogoProps) {
  return (
    <SvgLogo viewBox="0 0 24 24" {...props}>
      <path
        d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"
        fill="#5865F2"
      />
      <path
        d="M8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"
        fill="#fff"
      />
    </SvgLogo>
  );
}

export function WeChatIcon(props: LogoProps) {
  return (
    <SvgLogo viewBox="0 0 24 24" {...props}>
      <path
        d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89c-.135-.01-.27-.027-.407-.03zm-2.53 3.274c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.969-.982z"
        fill="#07C160"
      />
    </SvgLogo>
  );
}

export function TelegramIcon(props: LogoProps) {
  return (
    <SvgLogo viewBox="0 0 24 24" {...props}>
      <path
        d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"
        fill="#26A5E4"
      />
    </SvgLogo>
  );
}

export function GitHubIcon(props: LogoProps) {
  return (
    <SvgLogo viewBox="0 0 24 24" {...props}>
      <path
        d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"
        fill="currentColor"
      />
    </SvgLogo>
  );
}

export function NexuMarkIcon(props: LogoProps) {
  return (
    <SvgLogo viewBox="0 0 800 800" {...props}>
      <path
        d="M193.435 0C300.266 0 386.869 86.6036 386.869 193.435V345.42C386.869 368.312 368.311 386.87 345.419 386.87H41.4502C18.5579 386.87 0 368.311 0 345.419V193.435C0 86.6036 86.6036 0 193.435 0ZM180.539 206.328V386.867H206.331V206.328H180.539Z"
        fill="currentColor"
      />
      <path
        d="M606.095 799.53C499.264 799.53 412.661 712.926 412.661 606.095L412.661 454.11C412.661 431.217 431.219 412.659 454.111 412.659L758.08 412.659C780.972 412.659 799.53 431.218 799.53 454.111L799.53 606.095C799.53 712.926 712.926 799.53 606.095 799.53ZM618.991 593.2L618.991 412.661L593.2 412.661L593.2 593.2L618.991 593.2Z"
        fill="currentColor"
      />
      <path
        d="M799.531 193.447C799.531 193.551 799.53 193.655 799.53 193.759L799.53 193.134C799.53 193.238 799.531 193.343 799.531 193.447ZM412.662 193.447C412.662 86.6158 499.265 0.0122032 606.096 0.0121986C708.589 0.0121941 792.462 79.725 799.105 180.537L618.991 180.537L618.991 206.329L799.107 206.329C792.478 307.154 708.598 386.881 606.096 386.881C499.265 386.881 412.662 300.278 412.662 193.447Z"
        fill="currentColor"
      />
      <path
        d="M0 606.105C0 557.327 18.0554 512.768 47.8447 478.741L148.407 579.303L166.645 561.066L66.082 460.504C100.109 430.715 144.667 412.66 193.444 412.66C240.179 412.66 283.043 429.237 316.478 456.83L212.225 561.084L230.462 579.322L335.244 474.538C367.28 509.055 386.869 555.285 386.869 606.09C386.869 654.866 368.812 699.424 339.022 733.45L227.657 622.084L209.42 640.322L320.784 751.688C286.758 781.475 242.203 799.53 193.43 799.53C142.628 799.53 96.4006 779.944 61.8848 747.913L169.45 640.348L151.213 622.111L44.1758 729.148C16.5783 695.712 0 652.844 0 606.105Z"
        fill="currentColor"
      />
    </SvgLogo>
  );
}

export function NexuLogoIcon(props: LogoProps) {
  return (
    <SvgLogo viewBox="0 0 85 85" {...props}>
      <path
        d="M20.5645 0C31.9219 0 41.1289 9.20702 41.1289 20.5645V36.7227C41.1288 39.1562 39.1562 41.1287 36.7227 41.1289H21.9355V21.9355H19.1934V41.1289H4.40625C1.97279 41.1287 0.000138274 39.1561 0 36.7227V20.5645C0 9.20704 9.20704 0 20.5645 0Z"
        fill="currentColor"
      />
      <path
        d="M64.4355 85C53.0781 85 43.8711 75.793 43.8711 64.4355V48.2773C43.8712 45.8438 45.8438 43.8713 48.2773 43.8711H63.0645V63.0645H65.8066V43.8711H80.5938C83.0272 43.8713 84.9999 45.8439 85 48.2773V64.4355C85 75.793 75.793 85 64.4355 85Z"
        fill="currentColor"
      />
      <path
        d="M43.8711 20.5659C43.8711 9.20847 53.0781 0.00149496 64.4355 0.00146394C75.3319 0.00146347 84.2471 8.47613 84.9531 19.1938H65.8066V21.9351H84.9531C84.2484 32.6541 75.3329 41.1304 64.4355 41.1304C53.0781 41.1303 43.8711 31.9233 43.8711 20.5659Z"
        fill="currentColor"
      />
      <path
        d="M0 64.4365C0 59.2511 1.91919 54.5139 5.08594 50.8965L15.7773 61.5869L17.7168 59.6484L7.02539 48.958C10.6429 45.791 15.3797 43.8711 20.5654 43.8711C25.5341 43.8711 30.0909 45.6337 33.6455 48.5674L22.5625 59.6504L24.501 61.5889L35.6396 50.4512C39.0451 54.1206 41.1288 59.0337 41.1289 64.4346C41.1289 69.6203 39.2093 74.3581 36.042 77.9756L24.2031 66.1357L22.2637 68.0742L34.1025 79.9141C30.4854 83.0804 25.7492 84.9999 20.5645 85C15.1634 85 10.2486 82.9172 6.5791 79.5117L18.0146 68.0771L16.0762 66.1377L4.69629 77.5176C1.76236 73.9629 0 69.4055 0 64.4365Z"
        fill="currentColor"
      />
    </SvgLogo>
  );
}

export function ProviderLogo({
  provider,
  ...props
}: LogoProps & { provider: ProviderName | string }) {
  const normalizedProvider = provider.trim().toLowerCase();

  if (normalizedProvider === "nexu") {
    return <NexuLogoIcon {...props} />;
  }

  const iconKey = normalizeProviderIconKey(provider);
  const src = iconKey
    ? CANONICAL_PROVIDER_ICON_DATA_URIS[iconKey as keyof typeof CANONICAL_PROVIDER_ICON_DATA_URIS]
    : null;

  if (src) {
    return <ImageLogo src={src} alt={iconKey ?? provider} {...props} />;
  }

  return (
    <MonogramLogo
      label={(provider[0] ?? "?").toUpperCase()}
      background="var(--color-surface-3, #E5E7EB)"
      foreground="var(--color-text-muted, #6B7280)"
      {...props}
    />
  );
}

export function ModelLogo({
  model,
  provider,
  ...props
}: LogoProps & { model: ModelName; provider?: ProviderName | string }) {
  const displayModelId = getDisplayModelId(model);
  const iconKey = resolveModelIconKey(model, provider);
  const src = iconKey
    ? CANONICAL_MODEL_ICON_DATA_URIS[iconKey as keyof typeof CANONICAL_MODEL_ICON_DATA_URIS]
    : null;

  if (src) {
    return <ImageLogo src={src} alt={iconKey ?? displayModelId} {...props} />;
  }

  if (provider) {
    return <ProviderLogo provider={provider} {...props} />;
  }

  return (
    <MonogramLogo
      label={(displayModelId[0] ?? "?").toUpperCase()}
      background="var(--color-surface-3, #E5E7EB)"
      foreground="var(--color-text-muted, #6B7280)"
      {...props}
    />
  );
}

export function RuntimeLogo({ runtime, ...props }: LogoProps & { runtime: RuntimeName | string }) {
  const normalizedRuntime = runtime.trim().toLowerCase();

  const directIconKeyByRuntime: Partial<
    Record<string, keyof typeof CANONICAL_RUNTIME_ICON_DATA_URIS>
  > = {
    "claude-code": "claudecodecolor",
    codex: "codexcolor",
    cursor: "cursor",
    "gemini-cli": "geminiclicolor",
    hermes: "nousresearch",
    opencode: "opencode",
    openclaw: "openclawcolor",
    pi: "inflection",
  };

  const modelIconKeyByRuntime: Partial<
    Record<string, keyof typeof CANONICAL_MODEL_ICON_DATA_URIS>
  > = {};
  const monochromeRuntimeIconKeys = new Set<keyof typeof CANONICAL_RUNTIME_ICON_DATA_URIS>([
    "cursor",
    "inflection",
    "nousresearch",
    "opencode",
  ]);

  const directIconKey = directIconKeyByRuntime[normalizedRuntime];
  const modelIconKey = modelIconKeyByRuntime[normalizedRuntime];

  const src = directIconKey
    ? CANONICAL_RUNTIME_ICON_DATA_URIS[directIconKey]
    : modelIconKey
      ? CANONICAL_MODEL_ICON_DATA_URIS[modelIconKey]
      : null;

  if (src) {
    const alt = normalizedRuntime || runtime;

    if (directIconKey && monochromeRuntimeIconKeys.has(directIconKey)) {
      return <MaskLogo src={src} alt={alt} {...props} />;
    }

    return <ImageLogo src={src} alt={alt} {...props} />;
  }

  return (
    <MonogramLogo
      label={getRuntimeMonogramLabel(runtime)}
      background="var(--color-surface-3, #E5E7EB)"
      foreground="var(--color-text-muted, #6B7280)"
      {...props}
    />
  );
}

export function PlatformLogo({ platform, ...props }: LogoProps & { platform: PlatformName }) {
  switch (platform) {
    case "slack":
      return <SlackIcon {...props} />;
    case "feishu":
      return <FeishuIcon {...props} />;
    case "discord":
      return <DiscordIcon {...props} />;
    case "telegram":
      return <TelegramIcon {...props} />;
    case "wechat":
      return <WeChatIcon {...props} />;
    case "whatsapp":
      return <WeChatIcon {...props} />;
  }
}

export function BrandLogo({ brand, ...props }: LogoProps & { brand: BrandName }) {
  switch (brand) {
    case "nexu":
      return <NexuLogoIcon {...props} />;
    case "github":
      return <GitHubIcon {...props} />;
  }
}

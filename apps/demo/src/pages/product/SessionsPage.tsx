import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxTrigger,
  DataTable,
  InteractiveRow,
  InteractiveRowContent,
  InteractiveRowTrailing,
  ScrollArea,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@nexu-design/ui-web";
import {
  BarChart3,
  Bookmark,
  Clock,
  Code,
  Eye,
  File,
  FileSpreadsheet,
  FileText,
  Film,
  FolderOpen,
  Hash,
  Image,
  Mic,
  MoreHorizontal,
  Music,
  Paperclip,
  Plus,
  Presentation,
  Search,
  Send,
  Settings,
  Sparkles,
  Terminal,
  UserPlus,
  Users,
  Wrench,
  X,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ChatCardGroup from "./ChatCards";
import type { CardAction } from "./ChatCards";
import FileEditor from "./FileEditor";
import PricingModal from "./PricingModal";
import { useProductLayout } from "./ProductLayoutContext";
import {
  type Attachment,
  type AttachmentType,
  type FileOp,
  type FileOpAction,
  SESSIONS,
  SESSION_DATA,
  type SessionFileOp,
} from "./sessionsData";

const QUICK_ACTIONS = [
  { label: "帮我写一份 PRD", icon: FileText, color: "text-emerald-400" },
  { label: "随手记一下...", icon: Bookmark, color: "text-violet-400" },
  { label: "帮我问李四进度", icon: Users, color: "text-cyan-400" },
  { label: "创建一个 automation", icon: Clock, color: "text-blue-400" },
  { label: "安装一个新 skill", icon: Wrench, color: "text-amber-400" },
  { label: "分析竞品", icon: BarChart3, color: "text-clone" },
];

const CAPABILITY_DOMAINS = [
  {
    domain: "📄 文件系统",
    accent: "border-emerald-500/40",
    items: ["写 PRD / 报告 / 代码", "搜索知识库", "生成文件并自动归档"],
  },
  {
    domain: "🧠 记忆",
    accent: "border-violet-500/40",
    items: ["随手记笔记", "管理联系人", "记住偏好和决策"],
  },
  {
    domain: "🔧 技能",
    accent: "border-amber-500/40",
    items: ["调用 数千种能力", "安装社区 Skill", "创建自定义 Skill"],
  },
  {
    domain: "⏰ 自动化",
    accent: "border-blue-500/40",
    items: ["定时任务", "主动式推送", "条件触发规则"],
  },
  {
    domain: "👥 团队协作",
    accent: "border-cyan-500/40",
    items: ["代问同事进度", "发起对齐请求", "团队 Insights 分析"],
  },
  {
    domain: "💰 升级",
    accent: "border-orange-500/40",
    items: ["查看用量", "升级 Pro/Team", "邀请同事裂变"],
  },
];

const ACTIVE_SKILLS = [
  "Memory & Notes",
  "Task Manager",
  "Web Research",
  "Code Automation",
  "Daily Digest",
];

const FILE_OP_STYLES: Record<FileOpAction, { color: string; label: string }> = {
  read: { color: "text-info bg-info-subtle", label: "READ" },
  write: { color: "text-clone bg-clone/10", label: "WRITE" },
  create: { color: "text-success bg-success-subtle", label: "CREATE" },
  delete: { color: "text-danger bg-danger-subtle", label: "DELETE" },
  execute: { color: "text-warning bg-warning-subtle", label: "EXEC" },
  install: {
    color: "text-role-designer bg-role-designer/10",
    label: "INSTALL",
  },
};

function FileOpBadge({ op }: { op: FileOp }) {
  const style = FILE_OP_STYLES[op.action];
  return (
    <div className="flex items-center gap-1.5 px-2 py-1 bg-surface-3 rounded text-[11px] font-mono">
      <span className={`px-1 py-0.5 rounded text-[9px] font-bold ${style.color}`}>
        {style.label}
      </span>
      <span className="text-text-secondary truncate">{op.path}</span>
    </div>
  );
}

const ATTACHMENT_STYLES: Record<
  AttachmentType,
  { icon: typeof FileText; color: string; bg: string }
> = {
  image: {
    icon: Image,
    color: "text-role-designer",
    bg: "bg-role-designer/10",
  },
  pdf: { icon: File, color: "text-danger", bg: "bg-danger-subtle" },
  document: { icon: FileText, color: "text-info", bg: "bg-info-subtle" },
  spreadsheet: {
    icon: FileSpreadsheet,
    color: "text-success",
    bg: "bg-success-subtle",
  },
  audio: { icon: Music, color: "text-role-ops", bg: "bg-role-ops/10" },
  video: { icon: Film, color: "text-role-designer", bg: "bg-role-designer/10" },
  code: {
    icon: Code,
    color: "text-role-programmer",
    bg: "bg-role-programmer/10",
  },
  archive: { icon: File, color: "text-text-muted", bg: "bg-surface-3" },
  other: { icon: File, color: "text-text-muted", bg: "bg-surface-3" },
};

function AttachmentChip({
  attachment,
  variant = "light",
}: {
  attachment: Attachment;
  variant?: "light" | "dark";
}) {
  const style = ATTACHMENT_STYLES[attachment.type];
  const Icon = style.icon;
  const isImage = attachment.type === "image";
  const isAudio = attachment.type === "audio";
  const isVideo = attachment.type === "video";

  if (isImage && variant === "dark") {
    return (
      <div className="rounded-lg overflow-hidden border border-white/10 bg-black/20 w-[120px]">
        <div className="w-full h-[72px] bg-surface-3/30 flex items-center justify-center">
          <Image size={20} className="text-white/40" />
        </div>
        <div className="px-2 py-1.5">
          <div className="text-[10px] text-white/80 truncate">{attachment.name}</div>
          <div className="text-[9px] text-white/40">{attachment.size}</div>
        </div>
      </div>
    );
  }

  if (isImage) {
    return (
      <div className="rounded-lg overflow-hidden border border-border bg-surface-2 w-[120px]">
        <div className="w-full h-[72px] bg-surface-3 flex items-center justify-center">
          <Image size={20} className="text-text-placeholder" />
        </div>
        <div className="px-2 py-1.5">
          <div className="text-[10px] text-text-secondary truncate">{attachment.name}</div>
          <div className="text-[9px] text-text-muted">{attachment.size}</div>
        </div>
      </div>
    );
  }

  const bgClass = variant === "dark" ? "bg-white/10 border-white/10" : `${style.bg} border-border`;
  const nameClass = variant === "dark" ? "text-white/90" : "text-text-primary";
  const sizeClass = variant === "dark" ? "text-white/40" : "text-text-muted";
  const iconClass = variant === "dark" ? "text-white/60" : style.color;

  return (
    <div className={`flex items-center gap-2 px-2.5 py-2 rounded-lg border ${bgClass}`}>
      <div className="shrink-0">
        {isAudio ? (
          <div className="flex items-center gap-0.5">
            <Icon size={14} className={iconClass} />
            <div className="flex items-end gap-px h-3.5">
              {[
                { id: "b1", height: 3 },
                { id: "b2", height: 5 },
                { id: "b3", height: 8 },
                { id: "b4", height: 6 },
                { id: "b5", height: 10 },
                { id: "b6", height: 7 },
                { id: "b7", height: 4 },
                { id: "b8", height: 9 },
                { id: "b9", height: 5 },
                { id: "b10", height: 7 },
                { id: "b11", height: 3 },
              ].map((bar) => (
                <div
                  key={bar.id}
                  className={`w-[2px] rounded-full ${
                    variant === "dark" ? "bg-white/30" : "bg-role-ops/30"
                  }`}
                  style={{ height: bar.height }}
                />
              ))}
            </div>
          </div>
        ) : isVideo ? (
          <div className="w-8 h-8 rounded bg-black/10 flex items-center justify-center">
            <Icon size={14} className={iconClass} />
          </div>
        ) : (
          <Icon size={16} className={iconClass} />
        )}
      </div>
      <div className="min-w-0">
        <div className={`text-[11px] font-medium truncate ${nameClass}`}>{attachment.name}</div>
        <div className={`text-[9px] ${sizeClass}`}>{attachment.size}</div>
      </div>
    </div>
  );
}

function NewSessionView({
  onStartChat,
}: {
  onStartChat: (msg: string) => void;
}) {
  const [input, setInput] = useState("");
  const [showSkills, setShowSkills] = useState(false);

  const handleSubmit = () => {
    if (input.trim()) onStartChat(input);
  };

  return (
    <div className="flex-1 flex flex-col items-center px-8 overflow-y-auto">
      <div className="w-full max-w-xl flex flex-col items-center py-8">
        {/* Avatar + Greeting */}
        <div className="w-16 h-16 rounded-full bg-surface-3 animate-clone-breath-subtle flex items-center justify-center text-3xl mb-5">
          😊
        </div>
        <h2 className="text-xl font-semibold text-text-primary mb-1">Good evening, Tom</h2>
        <p className="text-sm text-text-secondary mb-1">
          你的主线入口 — <span className="text-accent font-medium">对话即操控一切</span>
        </p>
        <p className="text-[11px] text-text-muted mb-6 text-center max-w-sm">
          写文件、记笔记、问同事、设自动化、装技能、查 OKR — 这一个对话窗就是你的 agent
          computer。所有操作都沉淀在 <span className="text-text-secondary">分身的大脑</span>里
        </p>

        {/* Input */}
        <div className="w-full bg-surface-2 border border-border rounded-2xl overflow-hidden mb-4 focus-within:border-accent transition-colors">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder="说什么都行 — 帮我写 PRD / 帮我问李四 / 设个自动化 / 记一下..."
            rows={2}
            className="w-full px-4 pt-4 pb-2 bg-transparent text-[14px] text-text-primary placeholder:text-text-muted resize-none focus:outline-none leading-relaxed"
          />
          <div className="flex items-center justify-between px-3 pb-3">
            <div className="flex items-center gap-1">
              <button
                type="button"
                className="p-1.5 rounded-lg hover:bg-surface-3 text-text-muted transition-colors"
                title="上传文件"
              >
                <Paperclip size={15} />
              </button>
              <button
                type="button"
                className="p-1.5 rounded-lg hover:bg-surface-3 text-text-muted transition-colors"
                title="拍照/录屏"
              >
                <Image size={15} />
              </button>
              <button
                type="button"
                onClick={() => setShowSkills(!showSkills)}
                className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[12px] transition-colors ${
                  showSkills ? "bg-clone/10 text-clone" : "hover:bg-surface-3 text-text-muted"
                }`}
              >
                <Sparkles size={13} />
                Skills
              </button>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-text-muted">Claude 4.5</span>
              <button
                type="button"
                className="p-1.5 rounded-lg hover:bg-surface-3 text-text-muted transition-colors"
                title="语音输入"
              >
                <Mic size={15} />
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="p-1.5 bg-accent text-accent-fg rounded-lg hover:bg-accent-hover transition-colors"
              >
                <Send size={14} />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 pb-2 text-[10px] text-text-muted">
            <span>支持上传：</span>
            {["图片", "PDF", "文档", "表格", "代码", "音视频"].map((t) => (
              <span key={t} className="px-1.5 py-0.5 bg-surface-3 rounded">
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Skills dropdown */}
        {showSkills && (
          <div className="w-full bg-surface-2 border border-border rounded-xl p-2 mb-4 animate-fade-in-up">
            <div className="text-[10px] text-text-muted font-medium uppercase tracking-wider px-2 py-1">
              已激活的 Skills
            </div>
            {ACTIVE_SKILLS.map((s) => (
              <button
                type="button"
                key={s}
                className="w-full text-left px-3 py-2 rounded-lg text-[13px] text-text-primary hover:bg-surface-3 transition-colors"
              >
                {s}
              </button>
            ))}
            <div className="border-t border-border mt-1 pt-1">
              <Button
                size="inline"
                className="w-full text-left px-3 py-2 rounded-lg text-[12px] text-text-secondary hover:bg-surface-3 transition-colors flex items-center justify-start gap-1.5"
              >
                <Plus size={12} />
                浏览 Skills Store...
              </Button>
            </div>
          </div>
        )}

        {/* Quick action pills */}
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          {QUICK_ACTIONS.map((t) => (
            <button
              type="button"
              key={t.label}
              onClick={() => onStartChat(t.label)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-2 border border-border rounded-full text-[12px] text-text-secondary hover:text-text-primary hover:border-border-hover transition-colors"
            >
              <t.icon size={12} className={t.color} />
              {t.label}
            </button>
          ))}
        </div>

        {/* 6 Domain capability grid — maps to the 6 card types */}
        <div className="w-full mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
              从这里可以操控的一切
            </span>
            <div className="flex-1 h-px bg-border" />
          </div>
          <div className="grid grid-cols-3 gap-2">
            {CAPABILITY_DOMAINS.map((d) => (
              <button
                type="button"
                key={d.domain}
                onClick={() => onStartChat(d.items[0])}
                className={`p-3 bg-surface-2 border border-border ${d.accent} border-l-2 rounded-lg hover:border-border-hover transition-colors text-left group`}
              >
                <div className="text-[12px] font-medium text-text-primary mb-1.5">{d.domain}</div>
                <div className="space-y-0.5">
                  {d.items.map((item) => (
                    <div key={item} className="text-[10px] text-text-muted leading-relaxed">
                      · {item}
                    </div>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Scoped session hint */}
        <div className="w-full p-3 rounded-xl bg-surface-2/60 border border-border/50 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
              专属会话
            </span>
            <div className="flex-1 h-px bg-border" />
          </div>
          <p className="text-[10px] text-text-muted mb-2">
            在其他页面你会看到 scoped sessions — 它们和这里一样是 Chat，但限定了特定的 Skills
            和上下文：
          </p>
          <div className="flex flex-wrap gap-1.5">
            {[
              {
                label: "Team Insights",
                desc: "团队数据分析",
                color: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
              },
              {
                label: "Sprint 分析",
                desc: "冲刺进度跟踪",
                color: "bg-blue-500/10 text-blue-400 border-blue-500/20",
              },
              {
                label: "OKR 对齐",
                desc: "目标跟踪分析",
                color: "bg-violet-500/10 text-violet-400 border-violet-500/20",
              },
            ].map((s) => (
              <span
                key={s.label}
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-md border text-[10px] ${s.color}`}
              >
                {s.label}
                <span className="text-text-muted">· {s.desc}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Footer hint */}
        <div className="flex items-center gap-2 text-[10px] text-text-muted">
          <Terminal size={10} />
          <span>
            所有操作产出 6 种标准卡片：文件 · 记忆 · 技能 · 自动化 · 协作 · 升级 — 卡片可交互
          </span>
        </div>
      </div>
    </div>
  );
}

function FileTypeIcon({ fileType }: { fileType: SessionFileOp["fileType"] }) {
  switch (fileType) {
    case "markdown":
      return <FileText size={13} className="text-text-muted" />;
    case "yaml":
      return <Code size={13} className="text-warning" />;
    case "code":
    case "html":
    case "sql":
      return <Code size={13} className="text-info" />;
    case "jsonl":
      return <Terminal size={13} className="text-role-programmer" />;
    case "contact":
      return <UserPlus size={13} className="text-role-ops" />;
    case "skill":
      return <Sparkles size={13} className="text-role-designer" />;
    case "config":
      return <Settings size={13} className="text-text-muted" />;
    case "pdf":
      return <File size={13} className="text-danger" />;
    case "docx":
      return <FileText size={13} className="text-info" />;
    case "xlsx":
    case "csv":
      return <FileSpreadsheet size={13} className="text-success" />;
    case "pptx":
      return <Presentation size={13} className="text-role-founder" />;
    case "image":
    case "svg":
      return <Image size={13} className="text-role-designer" />;
    case "video":
      return <Film size={13} className="text-role-designer" />;
    case "audio":
      return <Music size={13} className="text-role-ops" />;
    case "figma":
      return <Presentation size={13} className="text-role-designer" />;
    default:
      return <File size={13} className="text-text-muted" />;
  }
}

function SessionFileOpsTable({
  title,
  ops,
  safeIdx,
  fileOps,
  onSelect,
}: {
  title: string;
  ops: SessionFileOp[];
  safeIdx: number;
  fileOps: SessionFileOp[];
  onSelect: (idx: number) => void;
}) {
  if (ops.length === 0) return null;

  return (
    <Collapsible defaultOpen>
      <CollapsibleTrigger className="flex w-full items-center gap-1.5 px-2 py-1 text-left">
        <span className="text-[9px] font-bold uppercase tracking-wider text-text-muted">
          {title}
        </span>
        <span className="text-[9px] text-text-muted">{ops.length}</span>
        <div className="h-px flex-1 bg-border" />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <DataTable className="rounded-lg border-border/80">
          <Table density="compact">
            <TableHeader>
              <TableRow>
                <TableHead>Op</TableHead>
                <TableHead>File</TableHead>
                <TableHead>Diff / Size</TableHead>
                <TableHead className="text-right">Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ops.map((op) => {
                const idx = fileOps.indexOf(op);
                const style = FILE_OP_STYLES[op.action];
                const fileName = op.path.split("/").pop() || op.path;

                return (
                  <TableRow
                    key={`${op.action}-${op.path}-${op.time}`}
                    selected={safeIdx === idx}
                    className="cursor-pointer"
                    onClick={() => onSelect(idx)}
                  >
                    <TableCell>
                      <span
                        className={`inline-flex rounded px-1 py-0.5 text-[8px] font-bold ${style.color}`}
                      >
                        {style.label}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex min-w-0 items-center gap-2">
                        <FileTypeIcon fileType={op.fileType} />
                        <div className="min-w-0">
                          <div className="truncate text-[11px] font-medium text-text-primary">
                            {fileName}
                          </div>
                          <div className="truncate font-mono text-[9px] text-text-muted">
                            {op.path}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-[9px]">
                        {op.diff ? (
                          <>
                            {op.diff.added > 0 ? (
                              <span className="font-mono text-success">+{op.diff.added}</span>
                            ) : null}
                            {op.diff.removed > 0 ? (
                              <span className="font-mono text-danger">-{op.diff.removed}</span>
                            ) : null}
                          </>
                        ) : null}
                        {op.size ? <span className="text-text-muted">{op.size}</span> : null}
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-[9px] text-text-muted">
                      {op.time}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </DataTable>
      </CollapsibleContent>
    </Collapsible>
  );
}

const CHANNEL_ICONS: Record<string, { icon: string; color: string }> = {
  web: { icon: "🌐", color: "text-info" },
  feishu: { icon: "🐦", color: "text-role-ops" },
  slack: { icon: "💬", color: "text-role-designer" },
  whatsapp: { icon: "📱", color: "text-success" },
  telegram: { icon: "✈️", color: "text-info" },
};

function ActiveChatView({
  sessionId,
  previewOpen,
  setPreviewOpen,
}: {
  sessionId: number;
  previewOpen: boolean;
  setPreviewOpen: (v: boolean) => void;
}) {
  const [input, setInput] = useState("");
  const [selectedFileOp, setSelectedFileOp] = useState<number>(0);
  const [pricingOpen, setPricingOpen] = useState(false);
  const navigate = useNavigate();
  const { openFile } = useProductLayout();

  const handleCardAction = (action: CardAction) => {
    switch (action.type) {
      case "openFile":
        openFile(action.payload);
        break;
      case "navigate":
        navigate(action.payload);
        break;
      case "showPricing":
        setPricingOpen(true);
        break;
    }
  };

  const session = SESSIONS.find((s) => s.id === sessionId);
  if (!session) return null;
  const data = SESSION_DATA[sessionId];
  const messages = data?.messages || [];
  const fileOps = data?.fileOps || [];
  const ch = CHANNEL_ICONS[session.channel];

  const safeIdx = selectedFileOp < fileOps.length ? selectedFileOp : 0;
  const currentOp = fileOps[safeIdx];
  const rawPathParts = currentOp ? currentOp.path.split("/") : [];
  const fileName = currentOp ? rawPathParts[rawPathParts.length - 1] || "" : "";
  const pathParts = fileName ? rawPathParts.slice(0, -1) : rawPathParts;
  const breadcrumbs = pathParts.map((part, idx, parts) => ({
    label: part,
    key: parts.slice(0, idx + 1).join("/"),
  }));

  const writeOps = fileOps.filter(
    (op) => op.action === "create" || op.action === "write" || op.action === "delete",
  );
  const readOps = fileOps.filter((op) => op.action === "read");
  const execOps = fileOps.filter((op) => op.action === "execute" || op.action === "install");

  return (
    <>
      {/* Chat thread */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="h-11 border-b border-border flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <span className="text-sm">{session.emoji}</span>
            <span className="text-[13px] font-medium text-text-primary">{session.title}</span>
            <span className="text-[10px] bg-surface-3 px-1.5 py-0.5 rounded flex items-center gap-1">
              <span>{ch?.icon}</span>
              <span className="text-text-muted">{session.channel}</span>
            </span>
            <span className="text-[10px] text-text-muted bg-surface-3 px-1.5 py-0.5 rounded font-mono">
              {fileOps.length} file ops
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setPreviewOpen(!previewOpen)}
              className={`p-1 rounded transition-colors ${
                previewOpen
                  ? "text-text-primary bg-surface-3"
                  : "text-text-muted hover:text-text-secondary"
              }`}
              title="文件预览"
            >
              <Eye size={14} />
            </button>
            <button
              type="button"
              className="p-1 rounded hover:bg-surface-3 text-text-muted transition-colors"
            >
              <MoreHorizontal size={14} />
            </button>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-3">
            {messages.map((msg, i) => (
              <div
                key={`${msg.from}-${msg.content || msg.tool?.name || i}`}
                className={`flex ${msg.from === "user" ? "justify-end" : "gap-2"}`}
              >
                {msg.from === "clone" && (
                  <div className="w-6 h-6 rounded-full bg-clone/15 flex items-center justify-center text-[11px] shrink-0 mt-0.5">
                    😊
                  </div>
                )}
                <div className="max-w-[80%] space-y-1.5">
                  {msg.attachments && msg.attachments.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 justify-end">
                      {msg.attachments.map((att) => (
                        <AttachmentChip
                          key={att.name}
                          attachment={att}
                          variant={msg.from === "user" ? "dark" : "light"}
                        />
                      ))}
                    </div>
                  )}
                  {msg.cards && msg.cards.length > 0 ? (
                    <ChatCardGroup cards={msg.cards} onCardAction={handleCardAction} interactive />
                  ) : msg.fileOps ? (
                    <div className="space-y-1">
                      {msg.fileOps.map((op) => (
                        <FileOpBadge key={`${op.action}-${op.path}`} op={op} />
                      ))}
                    </div>
                  ) : null}
                  {msg.tool && !msg.cards && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-surface-2 border border-border rounded-lg text-[12px]">
                      <msg.tool.icon size={13} className="text-clone shrink-0" />
                      <span className="text-text-secondary">{msg.tool.name}</span>
                      <span className="text-[10px] text-success ml-auto">✓</span>
                    </div>
                  )}
                  {msg.content && (
                    <div
                      className={`rounded-xl px-3 py-2.5 text-[12px] leading-relaxed whitespace-pre-line ${
                        msg.from === "user"
                          ? "bg-accent text-accent-fg rounded-br-sm"
                          : "bg-surface-2 border border-border text-text-primary rounded-bl-sm"
                      }`}
                    >
                      {msg.content}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="border-t border-border p-2.5">
          {/* Pending uploads bar */}
          <div className="flex items-center gap-1.5 px-2 pb-2">
            <div className="flex items-center gap-1 px-2 py-1 bg-surface-3 rounded-md text-[10px] text-text-secondary">
              <Image size={11} className="text-role-designer" />
              <span className="truncate max-w-[80px]">screenshot.png</span>
              <button type="button" className="ml-0.5 text-text-muted hover:text-text-primary">
                <X size={10} />
              </button>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 bg-surface-3 rounded-md text-[10px] text-text-secondary">
              <File size={11} className="text-danger" />
              <span className="truncate max-w-[80px]">report.pdf</span>
              <button type="button" className="ml-0.5 text-text-muted hover:text-text-primary">
                <X size={10} />
              </button>
            </div>
            <button
              type="button"
              className="p-1 rounded-md hover:bg-surface-3 text-text-muted transition-colors"
              title="添加更多"
            >
              <Plus size={12} />
            </button>
          </div>
          <div className="flex items-end gap-2 bg-surface-2 border border-border rounded-xl px-3 py-2">
            <button
              type="button"
              className="p-1 text-text-muted hover:text-text-secondary transition-colors shrink-0"
              title="上传文件 (图片/PDF/文档/表格/代码/音视频...)"
            >
              <Paperclip size={14} />
            </button>
            <button
              type="button"
              className="p-1 text-text-muted hover:text-text-secondary transition-colors shrink-0"
            >
              <Sparkles size={14} />
            </button>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="跟分身说点什么...  可以上传文件、图片、语音作为 context"
              rows={1}
              className="flex-1 bg-transparent text-[13px] text-text-primary placeholder:text-text-muted resize-none focus:outline-none leading-relaxed"
            />
            <button
              type="button"
              className="p-1 text-text-muted hover:text-text-secondary transition-colors shrink-0"
              title="语音输入"
            >
              <Mic size={14} />
            </button>
            <button
              type="button"
              className="p-1 text-text-muted hover:text-text-secondary transition-colors shrink-0"
              title="拍照/录屏"
            >
              <Film size={14} />
            </button>
            <button
              type="button"
              className="p-1.5 bg-accent text-accent-fg rounded-lg shrink-0 hover:bg-accent-hover transition-colors"
            >
              <Send size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* File Preview panel */}
      {previewOpen && currentOp && (
        <div className="w-80 shrink-0 border-l border-border flex flex-col bg-surface-0">
          {/* Preview header — shows selected file */}
          <div className="h-11 border-b border-border flex items-center justify-between px-3">
            <div className="flex items-center gap-2 min-w-0">
              <FileTypeIcon fileType={currentOp.fileType} />
              <span className="text-[12px] font-medium text-text-primary truncate">{fileName}</span>
              {(currentOp.action === "create" || currentOp.action === "write") && (
                <span
                  className={`text-[9px] px-1 py-0.5 rounded shrink-0 ${
                    FILE_OP_STYLES[currentOp.action].color
                  }`}
                >
                  {currentOp.action === "create" ? "新建" : "已修改"}
                </span>
              )}
              {currentOp.action === "execute" && (
                <span className="text-[9px] text-warning bg-warning-subtle px-1 py-0.5 rounded shrink-0">
                  已执行
                </span>
              )}
              {currentOp.action === "install" && (
                <span className="text-[9px] text-role-designer bg-role-designer/10 px-1 py-0.5 rounded shrink-0">
                  已安装
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => setPreviewOpen(false)}
              className="p-1 rounded hover:bg-surface-3 text-text-muted transition-colors"
            >
              <X size={13} />
            </button>
          </div>

          {/* Breadcrumb path */}
          <Breadcrumb className="border-b border-border px-3 py-1.5">
            <BreadcrumbList className="flex-nowrap gap-1 text-[10px] text-text-muted">
              <BreadcrumbItem className="shrink-0 gap-1">
                <FolderOpen size={10} />
                <span>~/clone</span>
              </BreadcrumbItem>
              {breadcrumbs.map((part) => (
                <BreadcrumbItem key={part.key} className="min-w-0">
                  <BreadcrumbSeparator className="shrink-0" />
                  <span className="truncate">{part.label}</span>
                </BreadcrumbItem>
              ))}
              <BreadcrumbItem className="min-w-0">
                <BreadcrumbSeparator className="shrink-0" />
                <BreadcrumbPage className="truncate text-[10px] text-text-secondary">
                  {fileName}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Editable file content */}
          <div className="flex-1 min-h-0 flex flex-col">
            {currentOp.preview ? (
              <FileEditor
                filePath={currentOp.path}
                initialContent={currentOp.preview}
                fileType={currentOp.fileType}
                lastEditedBy="agent"
                lastEditedAt={currentOp.time}
                compact
              />
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-text-muted">
                <FileText size={24} className="mb-2 opacity-40" />
                <span className="text-[11px]">无预览内容</span>
              </div>
            )}
            {currentOp.diff && (
              <div className="px-3 py-2 border-t border-border flex items-center gap-3 text-[10px] shrink-0">
                <span className="text-success font-mono">+{currentOp.diff.added} lines</span>
                {currentOp.diff.removed > 0 && (
                  <span className="text-danger font-mono">-{currentOp.diff.removed} lines</span>
                )}
                {currentOp.size && (
                  <span className="text-text-muted ml-auto">{currentOp.size}</span>
                )}
              </div>
            )}
          </div>

          {/* File operations list */}
          <div className="border-t border-border flex flex-col min-h-0 max-h-[45%]">
            <div className="px-3 pt-2.5 pb-1 flex items-center justify-between shrink-0">
              <div className="text-[10px] text-text-muted font-medium uppercase tracking-wider">
                本次会话文件变更
              </div>
              <div className="flex items-center gap-2 text-[9px] text-text-muted">
                <span className="flex items-center gap-0.5">
                  <Hash size={8} />
                  {fileOps.length}
                </span>
              </div>
            </div>
            <ScrollArea className="flex-1 px-2 pb-2">
              <div className="space-y-0.5">
                <SessionFileOpsTable
                  title="Writes"
                  ops={writeOps}
                  safeIdx={safeIdx}
                  fileOps={fileOps}
                  onSelect={setSelectedFileOp}
                />
                <SessionFileOpsTable
                  title="Reads"
                  ops={readOps}
                  safeIdx={safeIdx}
                  fileOps={fileOps}
                  onSelect={setSelectedFileOp}
                />
                <SessionFileOpsTable
                  title="Skills"
                  ops={execOps}
                  safeIdx={safeIdx}
                  fileOps={fileOps}
                  onSelect={setSelectedFileOp}
                />
              </div>
            </ScrollArea>
          </div>
        </div>
      )}
      <PricingModal open={pricingOpen} onClose={() => setPricingOpen(false)} />
    </>
  );
}

export default function SessionsPage() {
  const [activeSession, setActiveSession] = useState<number | null>(null);
  const [previewOpen, setPreviewOpen] = useState(true);
  const activeSessionOption = SESSIONS.find((session) => session.id === activeSession) ?? null;

  const handleStartChat = (_msg: string) => {
    setActiveSession(1);
  };

  return (
    <div className="flex h-full">
      {/* Session list */}
      <div className="w-56 shrink-0 border-r border-border flex flex-col bg-surface-0">
        <div className="p-2 border-b border-border">
          <div className="flex items-center gap-1.5">
            <Combobox
              value={activeSessionOption ? String(activeSessionOption.id) : undefined}
              onValueChange={(value: string) => setActiveSession(Number(value))}
            >
              <ComboboxTrigger className="h-8 flex-1 border-border-subtle bg-surface-2 px-2.5 text-[11px]">
                <span className="flex items-center gap-2 text-left">
                  <Search size={13} className="shrink-0 text-text-muted" />
                  <span className="truncate text-text-primary">
                    {activeSessionOption ? activeSessionOption.title : "搜索对话..."}
                  </span>
                </span>
              </ComboboxTrigger>
              <ComboboxContent className="w-[280px]">
                <ComboboxInput placeholder="搜索对话..." leadingIcon={<Search size={12} />} />
                <div className="max-h-72 overflow-y-auto p-1">
                  {SESSIONS.map((session) => (
                    <ComboboxItem
                      key={session.id}
                      value={String(session.id)}
                      textValue={`${session.title} ${session.channel} ${session.time} ${session.fileOps}`}
                      className="items-start"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[12px] font-medium text-text-primary">
                          {session.title}
                        </div>
                        <div className="truncate text-[10px] text-text-muted">
                          {session.channel} · {session.time}
                        </div>
                      </div>
                    </ComboboxItem>
                  ))}
                </div>
              </ComboboxContent>
            </Combobox>
            <button
              type="button"
              onClick={() => setActiveSession(null)}
              className="p-1 rounded-md hover:bg-surface-3 text-text-secondary transition-colors"
              title="新建对话"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-1 space-y-0.5">
            {SESSIONS.map((s) => {
              const ch = CHANNEL_ICONS[s.channel];
              const isActive = activeSession === s.id;
              return (
                <InteractiveRow
                  type="button"
                  key={s.id}
                  onClick={() => setActiveSession(s.id)}
                  className={`px-2.5 py-2 rounded-lg ${
                    isActive ? "bg-accent text-accent-fg" : "hover:bg-surface-3"
                  }`}
                >
                  <div className="flex items-start gap-2 w-full">
                    <span className="text-xs mt-0.5">{s.emoji}</span>
                    <InteractiveRowContent>
                      <div
                        className={`text-[12px] font-medium truncate ${
                          isActive ? "" : "text-text-primary"
                        }`}
                      >
                        {s.title}
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span
                          className={`text-[10px] ${
                            isActive ? "text-accent-fg/70" : "text-text-muted"
                          }`}
                        >
                          {s.time}
                        </span>
                        <span
                          className={`text-[10px] ${
                            isActive ? "text-accent-fg/50" : "text-text-muted"
                          }`}
                        >
                          ·
                        </span>
                        <span className="text-[10px]" title={s.channel}>
                          {ch.icon}
                        </span>
                        {s.fileOps > 0 && (
                          <>
                            <span
                              className={`text-[10px] ${
                                isActive ? "text-accent-fg/50" : "text-text-muted"
                              }`}
                            >
                              ·
                            </span>
                            <span
                              className={`text-[9px] font-mono ${
                                isActive ? "text-accent-fg/70" : "text-text-muted"
                              }`}
                            >
                              {s.fileOps} ops
                            </span>
                          </>
                        )}
                      </div>
                    </InteractiveRowContent>
                    <InteractiveRowTrailing>
                      {s.isProxy && !isActive && (
                        <span className="text-[8px] px-1 py-0.5 bg-info-subtle text-info rounded shrink-0 mt-1">
                          代问
                        </span>
                      )}
                      {s.isProactive && !isActive && !s.isProxy && (
                        <span className="text-[8px] px-1 py-0.5 bg-clone/10 text-clone rounded shrink-0 mt-1">
                          主动
                        </span>
                      )}
                      {s.unread && !isActive && !s.isProactive && !s.isProxy && (
                        <div className="w-1.5 h-1.5 rounded-full bg-clone shrink-0 mt-1.5" />
                      )}
                    </InteractiveRowTrailing>
                  </div>
                </InteractiveRow>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      {/* Main content: new session vs active chat */}
      {activeSession === null ? (
        <NewSessionView onStartChat={handleStartChat} />
      ) : (
        <ActiveChatView
          key={activeSession}
          sessionId={activeSession}
          previewOpen={previewOpen}
          setPreviewOpen={setPreviewOpen}
        />
      )}
    </div>
  );
}

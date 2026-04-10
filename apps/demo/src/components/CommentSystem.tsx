import { Badge, Button, Input, Textarea } from "@nexu-design/ui-web";
import { AnimatePresence, motion } from "framer-motion";
import { type MouseEvent, useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

interface Comment {
  id: string;
  page: string;
  text: string;
  author: string;
  x: number;
  y: number;
  timestamp: number;
  resolved: boolean;
  replies: Reply[];
}

interface Reply {
  id: string;
  text: string;
  author: string;
  timestamp: number;
}

const STORAGE_KEY = "nexu_demo_comments";
const COLORS = ["#F24E1E", "#A259FF", "#1ABCFE", "#0ACF83", "#FF7262", "#FFBD12"];

function getAuthorColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return COLORS[Math.abs(hash) % COLORS.length];
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function timeAgo(ts: number) {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function loadComments(): Comment[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveComments(comments: Comment[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(comments));
}

function loadAuthorName() {
  try {
    return localStorage.getItem("nexu_comment_author") || "";
  } catch {
    return "";
  }
}

function Avatar({ name, size = 28 }: { name: string; size?: number }) {
  const color = getAuthorColor(name);
  return (
    <div
      className="rounded-full flex items-center justify-center shrink-0"
      style={{ width: size, height: size, backgroundColor: color }}
    >
      <span className="text-white font-medium" style={{ fontSize: size * 0.38 }}>
        {getInitials(name)}
      </span>
    </div>
  );
}

function CommentPin({
  comment,
  index,
  isActive,
  onClick,
}: {
  comment: Comment;
  index: number;
  isActive: boolean;
  onClick: () => void;
}) {
  const color = getAuthorColor(comment.author);
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      className="absolute z-40 cursor-pointer group"
      style={{ left: `${comment.x}%`, top: `${comment.y}%` }}
      onClick={(e: MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        onClick();
      }}
    >
      <div className="relative -translate-x-1/2 -translate-y-1/2">
        <div
          className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-bold shadow-lg transition-transform ${
            isActive ? "scale-125 ring-2 ring-white ring-offset-2" : "hover:scale-110"
          } ${comment.resolved ? "opacity-40" : ""}`}
          style={{ backgroundColor: color }}
        >
          {index + 1}
        </div>
        {!isActive && !comment.resolved && (
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#1a1a1a] text-white text-[11px] px-2 py-1 rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            {comment.author}: {comment.text.slice(0, 30)}
            {comment.text.length > 30 ? "..." : ""}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function CommentCard({
  comment,
  index,
  isActive,
  onSelect,
  onResolve,
  onDelete,
  onReply,
}: {
  comment: Comment;
  index: number;
  isActive: boolean;
  onSelect: () => void;
  onResolve: () => void;
  onDelete: () => void;
  onReply: (text: string) => void;
}) {
  const [replyText, setReplyText] = useState("");
  const [showReplyInput, setShowReplyInput] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className={`border rounded-xl p-3.5 cursor-pointer transition-all ${
        isActive
          ? "border-[#1a1a1a] bg-surface-1 shadow-sm"
          : "border-border bg-surface-1 hover:border-border-hover"
      } ${comment.resolved ? "opacity-50" : ""}`}
      onClick={onSelect}
    >
      <div className="flex items-start gap-2.5">
        <Avatar name={comment.author} size={26} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <span className="text-[12px] font-semibold text-text-primary">{comment.author}</span>
              <span className="text-[11px] text-text-muted">{timeAgo(comment.timestamp)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Badge variant="outline" size="xs">
                #{index + 1}
              </Badge>
              <button
                type="button"
                onClick={(e: MouseEvent<HTMLButtonElement>) => {
                  e.stopPropagation();
                  onResolve();
                }}
                className="p-0.5 rounded hover:bg-surface-3 transition-colors text-text-muted hover:text-success cursor-pointer"
                title={comment.resolved ? "Reopen" : "Resolve"}
              >
                {comment.resolved ? (
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm3.22 5.28-3.5 3.5a.75.75 0 0 1-1.06 0l-1.5-1.5a.75.75 0 1 1 1.06-1.06l.97.97 2.97-2.97a.75.75 0 0 1 1.06 1.06z" />
                  </svg>
                ) : (
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <circle cx="8" cy="8" r="5.5" />
                    <path d="M6 8l1.5 1.5L10 7" />
                  </svg>
                )}
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="p-0.5 rounded hover:bg-surface-3 transition-colors text-text-muted hover:text-danger cursor-pointer"
                title="Delete"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path d="M4 4l8 8M12 4l-8 8" />
                </svg>
              </button>
            </div>
          </div>
          <p
            className={`text-[13px] mt-1 leading-relaxed ${
              comment.resolved ? "line-through text-text-tertiary" : "text-text-primary"
            }`}
          >
            {comment.text}
          </p>

          {comment.replies.length > 0 && (
            <div className="mt-2.5 space-y-2 pl-1 border-l-2 border-border-subtle">
              {comment.replies.map((reply) => (
                <div key={reply.id} className="pl-2.5">
                  <div className="flex items-center gap-1.5">
                    <Avatar name={reply.author} size={18} />
                    <span className="text-[11px] font-medium text-text-secondary">
                      {reply.author}
                    </span>
                    <span className="text-[10px] text-text-muted">{timeAgo(reply.timestamp)}</span>
                  </div>
                  <p className="text-[12px] text-text-secondary mt-0.5 ml-[26px]">{reply.text}</p>
                </div>
              ))}
            </div>
          )}

          {showReplyInput ? (
            <div className="mt-2 flex gap-1.5">
              <Input
                onClick={(e) => e.stopPropagation()}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && replyText.trim()) {
                    onReply(replyText.trim());
                    setReplyText("");
                    setShowReplyInput(false);
                  }
                  if (e.key === "Escape") setShowReplyInput(false);
                }}
                placeholder="Reply..."
                className="flex-1"
                size="sm"
              />
              <Button
                type="button"
                size="xs"
                onClick={() => {
                  if (replyText.trim()) {
                    onReply(replyText.trim());
                    setReplyText("");
                    setShowReplyInput(false);
                  }
                }}
              >
                Send
              </Button>
            </div>
          ) : (
            <Button
              type="button"
              variant="ghost"
              size="xs"
              onClick={(e) => {
                e.stopPropagation();
                setShowReplyInput(true);
              }}
              className="mt-1.5 h-auto px-0"
            >
              Reply
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function CommentSystem() {
  const location = useLocation();
  const page = location.pathname;
  const [comments, setComments] = useState<Comment[]>(loadComments);
  const [isOpen, setIsOpen] = useState(false);
  const [isPinMode, setIsPinMode] = useState(false);
  const [activeComment, setActiveComment] = useState<string | null>(null);
  const [newCommentPos, setNewCommentPos] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [newCommentText, setNewCommentText] = useState("");
  const [authorName, setAuthorName] = useState(loadAuthorName);
  const [showAuthorPrompt, setShowAuthorPrompt] = useState(false);
  const [filter, setFilter] = useState<"all" | "open" | "resolved">("all");
  const overlayRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const pageComments = comments.filter((c) => c.page === page);
  const filteredComments = pageComments.filter((c) => {
    if (filter === "open") return !c.resolved;
    if (filter === "resolved") return c.resolved;
    return true;
  });
  const openCount = pageComments.filter((c) => !c.resolved).length;

  useEffect(() => {
    saveComments(comments);
  }, [comments]);

  useEffect(() => {
    setActiveComment(null);
    setNewCommentPos(null);
    setIsPinMode(false);
  }, []);

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isPinMode) return;
      const rect = overlayRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setNewCommentPos({ x, y });
      setNewCommentText("");
      setTimeout(() => inputRef.current?.focus(), 50);
    },
    [isPinMode],
  );

  const submitComment = useCallback(() => {
    if (!newCommentText.trim() || !newCommentPos || !authorName.trim()) return;
    const comment: Comment = {
      id: crypto.randomUUID(),
      page,
      text: newCommentText.trim(),
      author: authorName.trim(),
      x: newCommentPos.x,
      y: newCommentPos.y,
      timestamp: Date.now(),
      resolved: false,
      replies: [],
    };
    setComments((prev) => [...prev, comment]);
    setNewCommentPos(null);
    setNewCommentText("");
    setActiveComment(comment.id);
    setIsOpen(true);
  }, [newCommentText, newCommentPos, authorName, page]);

  const handleResolve = useCallback((id: string) => {
    setComments((prev) => prev.map((c) => (c.id === id ? { ...c, resolved: !c.resolved } : c)));
  }, []);

  const handleDelete = useCallback(
    (id: string) => {
      setComments((prev) => prev.filter((c) => c.id !== id));
      if (activeComment === id) setActiveComment(null);
    },
    [activeComment],
  );

  const handleReply = useCallback(
    (commentId: string, text: string) => {
      const reply: Reply = {
        id: crypto.randomUUID(),
        text,
        author: authorName || "Reviewer",
        timestamp: Date.now(),
      };
      setComments((prev) =>
        prev.map((c) => (c.id === commentId ? { ...c, replies: [...c.replies, reply] } : c)),
      );
    },
    [authorName],
  );

  const startPinMode = useCallback(() => {
    if (!authorName.trim()) {
      setShowAuthorPrompt(true);
      return;
    }
    setIsPinMode(true);
    setIsOpen(false);
  }, [authorName]);

  return (
    <>
      {/* Pin mode overlay */}
      <AnimatePresence>
        {isPinMode && (
          <motion.div
            ref={overlayRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 cursor-crosshair"
            style={{ backgroundColor: "rgba(0,0,0,0.04)" }}
            onClick={handleOverlayClick}
          >
            <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-[#1a1a1a] text-white text-[13px] font-medium px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#F24E1E] animate-pulse" />
              Click anywhere to leave a comment
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsPinMode(false);
                  setNewCommentPos(null);
                }}
                className="ml-2 text-white/60 hover:text-white transition-colors cursor-pointer"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path d="M4 4l8 8M12 4l-8 8" />
                </svg>
              </button>
            </div>

            <AnimatePresence>
              {newCommentPos && (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="absolute z-[60]"
                  style={{
                    left: `${newCommentPos.x}%`,
                    top: `${newCommentPos.y}%`,
                  }}
                  onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}
                >
                  <div className="ml-4 -mt-2 w-[280px] bg-white rounded-xl shadow-2xl border border-border overflow-hidden">
                    <div className="p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Avatar name={authorName || "R"} size={22} />
                        <span className="text-[12px] font-medium text-text-secondary">
                          {authorName}
                        </span>
                      </div>
                      <Textarea
                        ref={inputRef}
                        value={newCommentText}
                        onChange={(e) => setNewCommentText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            submitComment();
                          }
                          if (e.key === "Escape") {
                            setNewCommentPos(null);
                            setNewCommentText("");
                          }
                        }}
                        placeholder="Add a comment..."
                        className="min-h-[60px] border-0 bg-transparent px-0 py-0 text-[13px] shadow-none focus-visible:ring-0"
                        rows={2}
                      />
                    </div>
                    <div className="flex items-center justify-between px-3 py-2 bg-surface-2 border-t border-border">
                      <span className="text-[10px] text-text-muted">⏎ to send · Esc to cancel</span>
                      <Button
                        type="button"
                        size="xs"
                        onClick={submitComment}
                        disabled={!newCommentText.trim()}
                      >
                        Comment
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comment pins on page */}
      {!isPinMode && (
        <div className="fixed inset-0 pointer-events-none z-30">
          <AnimatePresence>
            {pageComments
              .filter((c) => !c.resolved)
              .map((comment, i) => (
                <div key={comment.id} className="pointer-events-auto">
                  <CommentPin
                    comment={comment}
                    index={i}
                    isActive={activeComment === comment.id}
                    onClick={() => {
                      setActiveComment(comment.id);
                      setIsOpen(true);
                    }}
                  />
                </div>
              ))}
          </AnimatePresence>
        </div>
      )}

      {/* Comment panel (right side) */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => {
                setIsOpen(false);
                setActiveComment(null);
              }}
            />
            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 w-[340px] bg-surface-0 border-l border-border z-50 flex flex-col shadow-xl"
            >
              {/* Panel header */}
              <div className="px-4 py-3.5 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-[13px] font-semibold text-text-primary">Comments</h3>
                  {openCount > 0 && (
                    <Badge size="xs" className="bg-[#F24E1E] text-white">
                      {openCount}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={startPinMode}
                        title="Add comment"
                      >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <path d="M8 3v10M3 8h10" />
                    </svg>
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => {
                          setIsOpen(false);
                          setActiveComment(null);
                        }}
                      >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <path d="M4 4l8 8M12 4l-8 8" />
                    </svg>
                      </Button>
                </div>
              </div>

              {/* Filter tabs */}
              <div className="px-4 py-2 border-b border-border flex gap-1">
                {(["all", "open", "resolved"] as const).map((f) => (
                    <Button
                      type="button"
                      variant={filter === f ? 'default' : 'ghost'}
                      size="xs"
                      key={f}
                      onClick={() => setFilter(f)}
                    >
                      {f === "all"
                        ? `All (${pageComments.length})`
                        : f === "open"
                          ? `Open (${openCount})`
                          : `Resolved (${pageComments.length - openCount})`}
                    </Button>
                  ))}
              </div>

              {/* Comment list */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                <AnimatePresence>
                  {filteredComments.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center justify-center py-16 text-center"
                    >
                      <div className="w-12 h-12 rounded-full bg-surface-2 flex items-center justify-center mb-3">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 16 16"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.2"
                          className="text-text-muted"
                          aria-hidden="true"
                          focusable="false"
                        >
                          <path d="M2 3h12v8H5l-3 3V3z" />
                        </svg>
                      </div>
                      <p className="text-[13px] text-text-secondary font-medium">No comments yet</p>
                      <p className="text-[11px] text-text-muted mt-1">
                        Click the + button to add one
                      </p>
                    </motion.div>
                  ) : (
                    filteredComments.map((comment) => (
                      <CommentCard
                        key={comment.id}
                        comment={comment}
                        index={pageComments.indexOf(comment)}
                        isActive={activeComment === comment.id}
                        onSelect={() =>
                          setActiveComment(activeComment === comment.id ? null : comment.id)
                        }
                        onResolve={() => handleResolve(comment.id)}
                        onDelete={() => handleDelete(comment.id)}
                        onReply={(text) => handleReply(comment.id, text)}
                      />
                    ))
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Author name prompt modal */}
      <AnimatePresence>
        {showAuthorPrompt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/20 flex items-center justify-center"
            onClick={() => setShowAuthorPrompt(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl shadow-2xl border border-border p-5 w-[320px]"
              onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}
            >
              <h3 className="text-[14px] font-semibold text-text-primary mb-1">
                What's your name?
              </h3>
              <p className="text-[12px] text-text-tertiary mb-4">
                This will be shown with your comments
              </p>
              <Input
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && authorName.trim()) {
                    localStorage.setItem("nexu_comment_author", authorName.trim());
                    setShowAuthorPrompt(false);
                    setIsPinMode(true);
                    setIsOpen(false);
                  }
                }}
                placeholder="e.g. Alex Chen"
              />
              <div className="flex gap-2 mt-3">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowAuthorPrompt(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  className="flex-1"
                  onClick={() => {
                    if (authorName.trim()) {
                      localStorage.setItem("nexu_comment_author", authorName.trim());
                      setShowAuthorPrompt(false);
                      setIsPinMode(true);
                      setIsOpen(false);
                    }
                  }}
                  disabled={!authorName.trim()}
                >
                  Continue
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating action button */}
      {!isPinMode && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            delay: 0.5,
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
          className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2"
        >
          {!isOpen && (
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startPinMode}
              className="w-10 h-10 rounded-full bg-white border border-border shadow-lg flex items-center justify-center text-text-secondary hover:text-[#F24E1E] hover:border-[#F24E1E]/30 transition-colors cursor-pointer"
              title="Pin a comment"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
                focusable="false"
              >
                <path d="M10 2L6 6l-3.5.5L6 10l-.5 3.5L10 10l4-4" />
                <path d="M10 2l4 4" />
              </svg>
            </motion.button>
          )}
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(!isOpen)}
            className={`w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-colors cursor-pointer ${
              isOpen
                ? "bg-accent text-accent-fg"
                : "bg-white border border-border text-text-primary hover:bg-surface-3"
            }`}
            title="Toggle comments"
          >
            <div className="relative">
              <svg
                width="18"
                height="18"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
                focusable="false"
              >
                <path d="M2 3h12v8H5l-3 3V3z" />
              </svg>
              {openCount > 0 && !isOpen && (
                <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-[#F24E1E] text-white text-[9px] font-bold flex items-center justify-center">
                  {openCount}
                </span>
              )}
            </div>
          </motion.button>
        </motion.div>
      )}
    </>
  );
}

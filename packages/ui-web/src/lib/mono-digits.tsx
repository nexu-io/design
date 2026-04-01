import * as React from "react";

const DIGIT_RE = /(\d[\d.,]*)/;

/**
 * Renders children with numeric sequences in the mono font (--font-mono)
 * and all other text in the inherited font.
 *
 * Accepts string | number children for splitting; ReactNode children
 * that are not plain text are rendered as-is.
 */
export function MonoDigits({ children }: { children: React.ReactNode }) {
  const text = typeof children === "number" ? String(children) : children;

  if (typeof text !== "string") return <>{text}</>;

  const parts = text.split(DIGIT_RE);
  if (parts.length === 1) return <>{text}</>;

  return (
    <>
      {parts.map((part, i) =>
        DIGIT_RE.test(part) ? (
          // biome-ignore lint/suspicious/noArrayIndexKey: split() produces positional fragments with no stable identity
          <span key={i} className="font-[family-name:var(--font-mono)]">
            {part}
          </span>
        ) : (
          // biome-ignore lint/suspicious/noArrayIndexKey: split() produces positional fragments with no stable identity
          <React.Fragment key={i}>{part}</React.Fragment>
        ),
      )}
    </>
  );
}

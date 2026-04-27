"use client";

import { useState } from "react";

import { Button } from "../../../packages/ui-web/src/primitives/button";

interface CopyButtonProps {
  value: string;
  label?: string;
  className?: string;
}

export function CopyButton({ value, label = "Copy", className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setFailed(false);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setFailed(true);
      window.setTimeout(() => setFailed(false), 1600);
    }
  }

  return (
    <>
      <Button type="button" size="sm" variant="outline" className={className} onClick={handleCopy}>
        {copied ? "Copied" : failed ? "Retry" : label}
      </Button>
      <span className="sr-only" aria-live="polite">
        {copied ? "Copied code to clipboard" : failed ? "Could not copy code" : ""}
      </span>
    </>
  );
}

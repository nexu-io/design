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

  async function handleCopy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <>
      <Button type="button" size="sm" variant="outline" className={className} onClick={handleCopy}>
        {copied ? "Copied" : label}
      </Button>
      <span className="sr-only" aria-live="polite">
        {copied ? "Copied code to clipboard" : ""}
      </span>
    </>
  );
}

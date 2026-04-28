"use client";

import { useState } from "react";
import { Copy } from "lucide-react";

import { Button, type ButtonProps } from "@nexu-design/ui-web";

interface CopyButtonProps {
  value: string;
  label?: string;
  className?: string;
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
}

export function CopyButton({
  value,
  label = "Copy",
  className,
  variant = "outline",
  size = "sm",
}: CopyButtonProps) {
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
      <Button
        type="button"
        size={size}
        variant={variant}
        className={className}
        onClick={handleCopy}
        aria-label={copied ? "Copied code" : failed ? "Retry copying code" : label}
        title={copied ? "Copied" : failed ? "Retry" : label}
      >
        <Copy className="size-4" aria-hidden="true" />
      </Button>
      <span className="sr-only" aria-live="polite">
        {copied ? "Copied code to clipboard" : failed ? "Could not copy code" : ""}
      </span>
    </>
  );
}

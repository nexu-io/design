import { Send } from "lucide-react";
import * as React from "react";

import { cn } from "../lib/cn";
import { Button, type ButtonProps } from "../primitives/button";

export interface FollowUpInputProps extends React.HTMLAttributes<HTMLDivElement> {
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onSend?: (value: string) => void;
  sendLabel?: string;
  textareaClassName?: string;
  buttonClassName?: string;
  textareaProps?: Omit<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    "value" | "defaultValue" | "onChange" | "placeholder"
  >;
  buttonProps?: Omit<ButtonProps, "type" | "onClick" | "children">;
}

export function FollowUpInput({
  placeholder,
  value,
  defaultValue = "",
  onValueChange,
  onSend,
  sendLabel = "Send follow-up",
  className,
  textareaClassName,
  buttonClassName,
  textareaProps,
  buttonProps,
  ...props
}: FollowUpInputProps) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue);
  const currentValue = value ?? uncontrolledValue;
  const {
    className: textareaPropsClassName,
    onKeyDown,
    ...restTextareaProps
  } = textareaProps ?? {};
  const { className: buttonPropsClassName, ...restButtonProps } = buttonProps ?? {};

  const setCurrentValue = React.useCallback(
    (nextValue: string) => {
      if (value === undefined) {
        setUncontrolledValue(nextValue);
      }
      onValueChange?.(nextValue);
    },
    [onValueChange, value],
  );

  const handleSend = React.useCallback(() => {
    const nextValue = currentValue.trim();
    if (!nextValue) return;
    onSend?.(nextValue);
    setCurrentValue("");
  }, [currentValue, onSend, setCurrentValue]);

  return (
    <div
      data-slot="follow-up-input"
      className={cn(
        "flex items-end gap-2 rounded-xl border border-border bg-surface-1 px-3 py-2",
        className,
      )}
      {...props}
    >
      <textarea
        data-slot="follow-up-input-textarea"
        value={currentValue}
        onChange={(event) => setCurrentValue(event.target.value)}
        onKeyDown={(event) => {
          onKeyDown?.(event);
          if (event.defaultPrevented) return;
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            handleSend();
          }
        }}
        placeholder={placeholder}
        rows={1}
        className={cn(
          "flex-1 resize-none bg-transparent text-[12px] leading-relaxed text-text-primary placeholder:text-text-muted focus:outline-none",
          textareaPropsClassName,
          textareaClassName,
        )}
        {...restTextareaProps}
      />
      <Button
        type="button"
        size="inline"
        aria-label={sendLabel}
        onClick={handleSend}
        className={cn(
          "shrink-0 rounded-lg bg-accent p-1.5 text-accent-fg transition-colors hover:bg-accent-hover",
          buttonClassName,
          buttonPropsClassName,
        )}
        {...restButtonProps}
      >
        <Send size={12} />
      </Button>
    </div>
  );
}

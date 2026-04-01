import { ChevronDown } from "lucide-react";
import * as React from "react";

import { cn } from "../lib/cn";

type AccordionType = "single" | "multiple";

interface AccordionContextValue {
  type: AccordionType;
  value: string[];
  toggleItem: (itemValue: string) => void;
}

const AccordionContext = React.createContext<AccordionContextValue | null>(null);

function useAccordionContext() {
  const value = React.useContext(AccordionContext);

  if (!value) {
    throw new Error("Accordion components must be used within <Accordion>.");
  }

  return value;
}

const AccordionItemContext = React.createContext<{
  value: string;
  triggerId: string;
  contentId: string;
} | null>(null);

function useAccordionItemContext() {
  const value = React.useContext(AccordionItemContext);

  if (!value) {
    throw new Error("AccordionItem children must be used within <AccordionItem>.");
  }

  return value;
}

export interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: AccordionType;
  collapsible?: boolean;
  defaultValue?: string | string[];
  value?: string | string[];
  onValueChange?: (value: string | string[]) => void;
}

export function Accordion({
  children,
  className,
  type = "single",
  collapsible = false,
  defaultValue,
  value,
  onValueChange,
  ...props
}: AccordionProps) {
  const normalizedDefaultValue = React.useMemo(() => {
    if (defaultValue === undefined) return [];
    return Array.isArray(defaultValue) ? defaultValue : [defaultValue];
  }, [defaultValue]);

  const [uncontrolledValue, setUncontrolledValue] =
    React.useState<string[]>(normalizedDefaultValue);
  const isControlled = value !== undefined;
  const normalizedValue = React.useMemo(() => {
    if (value === undefined) return uncontrolledValue;
    return Array.isArray(value) ? value : [value];
  }, [uncontrolledValue, value]);

  const toggleItem = React.useCallback(
    (itemValue: string) => {
      const current = normalizedValue;
      const isOpen = current.includes(itemValue);
      const next =
        type === "single"
          ? isOpen && collapsible
            ? []
            : [itemValue]
          : isOpen
            ? current.filter((entry) => entry !== itemValue)
            : [...current, itemValue];

      if (!isControlled) {
        setUncontrolledValue(next);
      }

      onValueChange?.(type === "single" ? (next[0] ?? "") : next);
    },
    [collapsible, isControlled, normalizedValue, onValueChange, type],
  );

  return (
    <AccordionContext.Provider value={{ type, value: normalizedValue, toggleItem }}>
      <div data-slot="accordion" className={cn("w-full", className)} {...props}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

export interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

export function AccordionItem({ className, value, ...props }: AccordionItemProps) {
  const accordion = useAccordionContext();
  const open = accordion.value.includes(value);
  const id = React.useId();
  const triggerId = `${id}trigger`;
  const contentId = `${id}content`;

  return (
    <AccordionItemContext.Provider value={{ value, triggerId, contentId }}>
      <div
        data-slot="accordion-item"
        data-state={open ? "open" : "closed"}
        className={cn("border-b border-border", className)}
        {...props}
      />
    </AccordionItemContext.Provider>
  );
}

export const AccordionTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { icon?: React.ReactNode }
>(({ children, className, icon, onClick, ...props }, ref) => {
  const accordion = useAccordionContext();
  const item = useAccordionItemContext();
  const open = accordion.value.includes(item.value);

  return (
    <button
      ref={ref}
      type="button"
      id={item.triggerId}
      data-slot="accordion-trigger"
      data-state={open ? "open" : "closed"}
      aria-expanded={open}
      aria-controls={item.contentId}
      className={cn(
        "flex w-full items-center justify-between gap-3 px-4 py-4 text-left text-lg font-medium text-text-primary transition-colors hover:text-text-primary/80",
        className,
      )}
      onClick={(event) => {
        onClick?.(event);

        if (!event.defaultPrevented) {
          accordion.toggleItem(item.value);
        }
      }}
      {...props}
    >
      <span className="min-w-0 flex-1">{children}</span>
      {icon ?? (
        <ChevronDown
          size={16}
          aria-hidden="true"
          className={cn("shrink-0 text-text-tertiary transition-transform", open && "rotate-180")}
        />
      )}
    </button>
  );
});

AccordionTrigger.displayName = "AccordionTrigger";

export const AccordionContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { forceMount?: boolean }
>(({ className, forceMount = false, hidden, ...props }, ref) => {
  const accordion = useAccordionContext();
  const item = useAccordionItemContext();
  const open = accordion.value.includes(item.value);

  if (!forceMount && !open) {
    return null;
  }

  return (
    <div
      ref={ref}
      id={item.contentId}
      role="region"
      aria-labelledby={item.triggerId}
      data-slot="accordion-content"
      data-state={open ? "open" : "closed"}
      hidden={hidden ?? !open}
      className={cn("px-4 pb-4 text-lg text-text-secondary", className)}
      {...props}
    />
  );
});

AccordionContent.displayName = "AccordionContent";

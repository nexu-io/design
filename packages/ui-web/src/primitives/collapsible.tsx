import * as React from "react";

import { cn } from "../lib/cn";

interface CollapsibleContextValue {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  triggerId: string;
  contentId: string;
}

const CollapsibleContext = React.createContext<CollapsibleContextValue | null>(null);

function useCollapsibleContext() {
  const value = React.useContext(CollapsibleContext);

  if (!value) {
    throw new Error("Collapsible components must be used within <Collapsible>.");
  }

  return value;
}

export interface CollapsibleProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function Collapsible({
  children,
  defaultOpen = false,
  open,
  onOpenChange,
  ...props
}: CollapsibleProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const isControlled = open !== undefined;
  const currentOpen = isControlled ? open : uncontrolledOpen;
  const id = React.useId();
  const triggerId = `${id}trigger`;
  const contentId = `${id}content`;

  const setOpen: React.Dispatch<React.SetStateAction<boolean>> = React.useCallback(
    (value) => {
      const nextValue = typeof value === "function" ? value(currentOpen) : value;

      if (!isControlled) {
        setUncontrolledOpen(nextValue);
      }

      onOpenChange?.(nextValue);
    },
    [currentOpen, isControlled, onOpenChange],
  );

  return (
    <CollapsibleContext.Provider value={{ open: currentOpen, setOpen, triggerId, contentId }}>
      <div data-slot="collapsible" data-state={currentOpen ? "open" : "closed"} {...props}>
        {children}
      </div>
    </CollapsibleContext.Provider>
  );
}

export const CollapsibleTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, onClick, ...props }, ref) => {
  const { open, setOpen, triggerId, contentId } = useCollapsibleContext();

  return (
    <button
      ref={ref}
      type="button"
      id={triggerId}
      data-slot="collapsible-trigger"
      data-state={open ? "open" : "closed"}
      aria-expanded={open}
      aria-controls={contentId}
      className={cn(className)}
      onClick={(event) => {
        onClick?.(event);

        if (!event.defaultPrevented) {
          setOpen((previous) => !previous);
        }
      }}
      {...props}
    />
  );
});

CollapsibleTrigger.displayName = "CollapsibleTrigger";

export const CollapsibleContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { forceMount?: boolean }
>(({ className, forceMount = false, hidden, ...props }, ref) => {
  const { open, triggerId, contentId } = useCollapsibleContext();

  if (!forceMount && !open) {
    return null;
  }

  return (
    <div
      ref={ref}
      id={contentId}
      role="region"
      aria-labelledby={triggerId}
      data-slot="collapsible-content"
      data-state={open ? "open" : "closed"}
      hidden={hidden ?? !open}
      className={cn(className)}
      {...props}
    />
  );
});

CollapsibleContent.displayName = "CollapsibleContent";

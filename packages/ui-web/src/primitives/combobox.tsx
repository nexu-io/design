import { Check, ChevronDown } from "lucide-react";
import * as React from "react";

import { cn } from "../lib/cn";
import { Input, type InputProps } from "./input";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

type ComboboxItemRecord = {
  disabled: boolean;
  id: string;
  ref: React.RefObject<HTMLButtonElement | null>;
  textValue: string;
  value: string;
  visible: boolean;
};

type ComboboxContextValue = {
  activeValue: string | null;
  contentId: string;
  disabled: boolean;
  open: boolean;
  query: string;
  registerItem: (item: ComboboxItemRecord) => void;
  selectValue: (value: string) => void;
  selectedValue: string | undefined;
  setActiveValue: (value: string | null) => void;
  setOpen: (open: boolean) => void;
  setQuery: (query: string) => void;
  unregisterItem: (value: string) => void;
  updateItemVisibility: (value: string, visible: boolean) => void;
  visibleItems: ComboboxItemRecord[];
};

const ComboboxContext = React.createContext<ComboboxContextValue | null>(null);

function useComboboxContext(component: string) {
  const context = React.useContext(ComboboxContext);

  if (!context) {
    throw new Error(`${component} must be used within Combobox`);
  }

  return context;
}

function useControllableState<T>({
  defaultValue,
  onChange,
  value,
}: {
  defaultValue: T;
  onChange?: (value: T) => void;
  value?: T;
}) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue);
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : uncontrolledValue;

  const setValue = React.useCallback(
    (nextValue: T) => {
      if (!isControlled) {
        setUncontrolledValue(nextValue);
      }

      onChange?.(nextValue);
    },
    [isControlled, onChange],
  );

  return [currentValue, setValue] as const;
}

export interface ComboboxProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
  defaultValue?: string;
  disabled?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onValueChange?: (value: string) => void;
  value?: string;
}

function Combobox({
  children,
  defaultOpen = false,
  defaultValue,
  disabled = false,
  open,
  onOpenChange,
  onValueChange,
  value,
}: ComboboxProps) {
  const [currentOpen, setCurrentOpen] = useControllableState({
    defaultValue: defaultOpen,
    onChange: onOpenChange,
    value: open,
  });
  const [selectedValue, setSelectedValue] = useControllableState<string | undefined>({
    defaultValue,
    onChange: (nextValue) => {
      if (nextValue !== undefined) {
        onValueChange?.(nextValue);
      }
    },
    value,
  });
  const [query, setQuery] = React.useState("");
  const [activeValue, setActiveValue] = React.useState<string | null>(defaultValue ?? null);
  const [items, setItems] = React.useState<ComboboxItemRecord[]>([]);
  const contentId = React.useId();

  const registerItem = React.useCallback((item: ComboboxItemRecord) => {
    setItems((currentItems) => {
      const nextItems = [...currentItems];
      const existingIndex = nextItems.findIndex(
        (existingItem) => existingItem.value === item.value,
      );

      if (existingIndex >= 0) {
        nextItems[existingIndex] = item;
        return nextItems;
      }

      nextItems.push(item);
      return nextItems;
    });
  }, []);

  const unregisterItem = React.useCallback((valueToRemove: string) => {
    setItems((currentItems) =>
      currentItems.filter((existingItem) => existingItem.value !== valueToRemove),
    );
  }, []);

  const updateItemVisibility = React.useCallback((itemValue: string, visible: boolean) => {
    setItems((currentItems) =>
      currentItems.map((item) => (item.value === itemValue ? { ...item, visible } : item)),
    );
  }, []);

  const visibleItems = React.useMemo(
    () => items.filter((item) => item.visible && !item.disabled),
    [items],
  );

  React.useEffect(() => {
    if (!currentOpen) {
      setQuery("");
      setActiveValue(selectedValue ?? null);
      return;
    }

    setActiveValue((currentValue) => {
      if (currentValue && visibleItems.some((item) => item.value === currentValue)) {
        return currentValue;
      }

      if (selectedValue && visibleItems.some((item) => item.value === selectedValue)) {
        return selectedValue;
      }

      return visibleItems[0]?.value ?? null;
    });
  }, [currentOpen, selectedValue, visibleItems]);

  const setOpen = React.useCallback(
    (nextOpen: boolean) => {
      if (disabled) return;
      setCurrentOpen(nextOpen);
    },
    [disabled, setCurrentOpen],
  );

  const selectValue = React.useCallback(
    (nextValue: string) => {
      setSelectedValue(nextValue);
      setActiveValue(nextValue);
      setQuery("");
      setOpen(false);
    },
    [setOpen, setSelectedValue],
  );

  return (
    <ComboboxContext.Provider
      value={{
        activeValue,
        contentId,
        disabled,
        open: currentOpen,
        query,
        registerItem,
        selectValue,
        selectedValue,
        setActiveValue,
        setOpen,
        setQuery,
        unregisterItem,
        updateItemVisibility,
        visibleItems,
      }}
    >
      <Popover open={currentOpen} onOpenChange={setOpen}>
        {children}
      </Popover>
    </ComboboxContext.Provider>
  );
}

const ComboboxTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof PopoverTrigger>
>(({ className, children, disabled, ...props }, ref) => {
  const context = useComboboxContext("ComboboxTrigger");

  return (
    <PopoverTrigger
      ref={ref}
      aria-controls={context.contentId}
      aria-expanded={context.open}
      aria-haspopup="dialog"
      data-slot="combobox-trigger"
      disabled={context.disabled || disabled}
      className={cn(
        "flex h-9 w-full items-center justify-between gap-2 rounded-lg border border-input bg-card px-3 py-2 text-left text-[13px] text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <span className="min-w-0 flex-1 truncate">{children}</span>
      <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
    </PopoverTrigger>
  );
});

ComboboxTrigger.displayName = "ComboboxTrigger";

const ComboboxContent = React.forwardRef<
  React.ElementRef<typeof PopoverContent>,
  React.ComponentPropsWithoutRef<typeof PopoverContent>
>(({ className, children, onKeyDown, ...props }, ref) => {
  const context = useComboboxContext("ComboboxContent");

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!context.visibleItems.length) {
      onKeyDown?.(event);
      return;
    }

    const activeIndex = context.visibleItems.findIndex(
      (item) => item.value === context.activeValue,
    );

    if (event.key === "ArrowDown") {
      event.preventDefault();
      const nextIndex = activeIndex < 0 ? 0 : (activeIndex + 1) % context.visibleItems.length;
      context.setActiveValue(context.visibleItems[nextIndex]?.value ?? null);
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      const nextIndex =
        activeIndex < 0
          ? context.visibleItems.length - 1
          : (activeIndex - 1 + context.visibleItems.length) % context.visibleItems.length;
      context.setActiveValue(context.visibleItems[nextIndex]?.value ?? null);
    }

    if (event.key === "Enter" && context.activeValue) {
      event.preventDefault();
      context.selectValue(context.activeValue);
    }

    if (event.key === "Escape") {
      event.preventDefault();
      context.setOpen(false);
    }

    onKeyDown?.(event);
  };

  return (
    <PopoverContent
      ref={ref}
      id={context.contentId}
      data-slot="combobox-content"
      align="start"
      className={cn("w-[var(--radix-popover-trigger-width)] p-0", className)}
      onKeyDown={handleKeyDown}
      {...props}
    >
      <div className="overflow-hidden rounded-[inherit]">{children}</div>
    </PopoverContent>
  );
});

ComboboxContent.displayName = "ComboboxContent";

interface ComboboxInputProps extends Omit<InputProps, "onChange" | "value"> {}

const ComboboxInput = React.forwardRef<HTMLInputElement, ComboboxInputProps>(
  ({ className, inputClassName, onFocus, ...props }, ref) => {
    const context = useComboboxContext("ComboboxInput");
    const activeItemId = context.activeValue
      ? `${context.contentId}-${context.activeValue.replace(/[^a-zA-Z0-9_-]/g, "-")}`
      : undefined;

    return (
      <div className="border-b border-border p-2">
        <Input
          ref={ref}
          aria-activedescendant={activeItemId}
          autoFocus
          className={cn("border-none bg-transparent shadow-none focus-within:ring-0", className)}
          data-slot="combobox-input"
          inputClassName={cn("text-[12px]", inputClassName)}
          onChange={(event) => {
            const nextQuery = event.target.value;
            context.setQuery(nextQuery);
          }}
          onFocus={(event) => {
            if (!context.activeValue && context.visibleItems[0]) {
              context.setActiveValue(context.visibleItems[0].value);
            }

            onFocus?.(event);
          }}
          role="searchbox"
          value={context.query}
          {...props}
        />
      </div>
    );
  },
);

ComboboxInput.displayName = "ComboboxInput";

export interface ComboboxItemProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "value"> {
  keywords?: string[];
  textValue?: string;
  value: string;
}

const ComboboxItem = React.forwardRef<HTMLButtonElement, ComboboxItemProps>(
  (
    { children, className, disabled = false, keywords, onClick, textValue, value, ...props },
    ref,
  ) => {
    const context = useComboboxContext("ComboboxItem");
    const localRef = React.useRef<HTMLButtonElement>(null);
    const mergedRef = React.useCallback(
      (node: HTMLButtonElement | null) => {
        localRef.current = node;

        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref],
    );
    const {
      activeValue,
      contentId,
      query,
      registerItem,
      selectedValue,
      setActiveValue,
      selectValue,
      unregisterItem,
      updateItemVisibility,
    } = context;

    const searchableText = React.useMemo(
      () => `${textValue ?? value} ${(keywords ?? []).join(" ")}`.trim().toLowerCase(),
      [keywords, textValue, value],
    );

    const visible = !query || searchableText.includes(query.toLowerCase());
    const isActive = activeValue === value;
    const isSelected = selectedValue === value;
    const itemId = `${contentId}-${value.replace(/[^a-zA-Z0-9_-]/g, "-")}`;

    React.useEffect(() => {
      registerItem({
        disabled,
        id: itemId,
        ref: localRef,
        textValue: searchableText,
        value,
        visible,
      });

      return () => unregisterItem(value);
    }, [disabled, itemId, registerItem, searchableText, unregisterItem, value, visible]);

    React.useEffect(() => {
      updateItemVisibility(value, visible);
    }, [updateItemVisibility, value, visible]);

    React.useEffect(() => {
      if (isActive && typeof localRef.current?.scrollIntoView === "function") {
        localRef.current?.scrollIntoView({ block: "nearest" });
      }
    }, [isActive]);

    if (!visible) {
      return null;
    }

    return (
      <button
        ref={mergedRef}
        id={itemId}
        type="button"
        data-active={isActive ? "" : undefined}
        data-selected={isSelected ? "" : undefined}
        data-slot="combobox-item"
        disabled={disabled}
        className={cn(
          "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-[13px] text-foreground transition-colors outline-none hover:bg-accent/50 focus-visible:bg-accent/50 disabled:pointer-events-none disabled:opacity-50",
          isActive && "bg-accent/50",
          className,
        )}
        onClick={(event) => {
          onClick?.(event);

          if (!event.defaultPrevented) {
            selectValue(value);
          }
        }}
        onMouseEnter={() => setActiveValue(value)}
        {...props}
      >
        <span className="min-w-0 flex-1">{children}</span>
        {isSelected ? <Check className="size-4 shrink-0 text-accent" /> : null}
      </button>
    );
  },
);

ComboboxItem.displayName = "ComboboxItem";

export { Combobox, ComboboxContent, ComboboxInput, ComboboxItem, ComboboxTrigger };

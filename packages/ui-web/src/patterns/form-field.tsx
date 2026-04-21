import * as React from "react";

import { cn } from "../lib/cn";
import { Label } from "../primitives/label";

interface FormFieldContextValue {
  controlId: string;
  descriptionId: string;
  errorId: string;
  invalid: boolean;
}

const FormFieldContext = React.createContext<FormFieldContextValue | null>(null);

function useFormFieldContext() {
  const context = React.useContext(FormFieldContext);

  if (!context) {
    throw new Error("FormField components must be used within <FormField>");
  }

  return context;
}

/** Label, description, error, and layout options for a field; children receive ids via context. */
export interface FormFieldProps {
  label?: React.ReactNode;
  description?: React.ReactNode;
  error?: React.ReactNode;
  required?: boolean;
  invalid?: boolean;
  orientation?: "vertical" | "horizontal";
  className?: string;
  labelClassName?: string;
  children: React.ReactNode;
}

/**
 * Wraps a control with optional label, description, and error; clones the control with a11y wiring.
 *
 * @example
 * <FormField label="Email" required invalid={!!error} error={error}>
 *   <FormFieldControl>
 *     <Input type="email" placeholder="you@example.com" />
 *   </FormFieldControl>
 * </FormField>
 */
export function FormField({
  label,
  description,
  error,
  required = false,
  invalid = false,
  orientation = "vertical",
  className,
  labelClassName,
  children,
}: FormFieldProps) {
  const reactId = React.useId();
  const controlId = `field-${reactId}`;
  const descriptionId = `field-${reactId}-description`;
  const errorId = `field-${reactId}-error`;

  return (
    <FormFieldContext.Provider value={{ controlId, descriptionId, errorId, invalid }}>
      <div
        className={cn(
          orientation === "vertical"
            ? "grid gap-2"
            : "grid gap-3 md:grid-cols-[12rem_1fr] md:items-start",
          className,
        )}
      >
        {label ? (
          <FormFieldLabel required={required} className={labelClassName}>
            {label}
          </FormFieldLabel>
        ) : null}
        <div className="grid gap-2">
          <FormFieldControl>{children}</FormFieldControl>
          {description ? <FormFieldDescription>{description}</FormFieldDescription> : null}
          {error ? <FormFieldError>{error}</FormFieldError> : null}
        </div>
      </div>
    </FormFieldContext.Provider>
  );
}

/** Associates the visible label with the field control via `htmlFor`. */
export function FormFieldLabel({
  className,
  required,
  children,
}: React.PropsWithChildren<{ className?: string; required?: boolean }>) {
  const { controlId, invalid } = useFormFieldContext();

  return (
    <Label htmlFor={controlId} className={cn(invalid && "text-destructive", className)}>
      {children}
      {required ? <span className="ml-1 text-destructive">*</span> : null}
    </Label>
  );
}

/** Clones its child to set `id`, `aria-invalid`, and `aria-describedby` from context. */
export function FormFieldControl({
  className,
  children,
}: React.PropsWithChildren<{ className?: string }>) {
  const { controlId, descriptionId, errorId, invalid } = useFormFieldContext();

  if (!React.isValidElement(children)) {
    return <div className={className}>{children}</div>;
  }

  const child = children as React.ReactElement<Record<string, unknown>>;

  const describedBy = [child.props["aria-describedby"], descriptionId, invalid ? errorId : null]
    .filter(Boolean)
    .join(" ");

  return React.cloneElement(child, {
    id: child.props.id ?? controlId,
    "aria-invalid": child.props["aria-invalid"] ?? (invalid || undefined),
    "aria-describedby": describedBy || undefined,
    className: cn(
      typeof child.props.className === "string" ? child.props.className : undefined,
      className,
    ),
  });
}

/** Helper or hint text linked to the control for screen readers. */
export function FormFieldDescription({
  className,
  children,
}: React.PropsWithChildren<{ className?: string }>) {
  const { descriptionId } = useFormFieldContext();

  return (
    <p id={descriptionId} className={cn("text-xs text-muted-foreground", className)}>
      {children}
    </p>
  );
}

/** Validation or error message linked to the control when `invalid` is true. */
export function FormFieldError({
  className,
  children,
}: React.PropsWithChildren<{ className?: string }>) {
  const { errorId } = useFormFieldContext();

  return (
    <p id={errorId} className={cn("text-xs font-medium text-destructive", className)}>
      {children}
    </p>
  );
}

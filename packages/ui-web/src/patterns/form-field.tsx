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

export interface FormFieldProps {
  label?: React.ReactNode;
  description?: React.ReactNode;
  error?: React.ReactNode;
  required?: boolean;
  invalid?: boolean;
  orientation?: "vertical" | "horizontal";
  className?: string;
  children: React.ReactNode;
}

export function FormField({
  label,
  description,
  error,
  required = false,
  invalid = false,
  orientation = "vertical",
  className,
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
        {label ? <FormFieldLabel required={required}>{label}</FormFieldLabel> : null}
        <div className="grid gap-2">
          <FormFieldControl>{children}</FormFieldControl>
          {description ? <FormFieldDescription>{description}</FormFieldDescription> : null}
          {error ? <FormFieldError>{error}</FormFieldError> : null}
        </div>
      </div>
    </FormFieldContext.Provider>
  );
}

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

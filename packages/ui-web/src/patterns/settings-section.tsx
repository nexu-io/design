import type * as React from "react";

import { cn } from "../lib/cn";
import { Card, CardContent, CardHeader } from "../primitives/card";
import { SectionHeader } from "./section-header";

export interface SettingsSectionProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
}

export function SettingsSection({
  title,
  description,
  action,
  children,
  className,
  ...props
}: SettingsSectionProps) {
  return (
    <Card className={cn("gap-0", className)} {...props}>
      <CardHeader>
        <SectionHeader title={title} description={description} action={action} />
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

import type * as React from "react";

import {
  DetailPanel,
  DetailPanelCloseButton,
  type DetailPanelCloseButtonProps,
  DetailPanelContent,
  DetailPanelDescription,
  DetailPanelHeader,
  type DetailPanelProps,
  DetailPanelTitle,
} from "@nexu-design/ui-web";

export interface InspectorPanelProps extends Omit<DetailPanelProps, "children" | "title"> {
  title: React.ReactNode;
  children?: React.ReactNode;
  description?: React.ReactNode;
  meta?: React.ReactNode;
  leading?: React.ReactNode;
  badges?: React.ReactNode;
  footer?: React.ReactNode;
  onClose?: () => void;
  closeButtonProps?: Omit<DetailPanelCloseButtonProps, "onClick">;
  headerClassName?: string;
  contentClassName?: string;
  footerClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  metaClassName?: string;
  badgesClassName?: string;
}

export function InspectorPanel({
  title,
  children,
  description,
  meta,
  leading,
  badges,
  footer,
  onClose,
  closeButtonProps,
  className,
  headerClassName,
  contentClassName,
  footerClassName,
  titleClassName,
  descriptionClassName,
  metaClassName,
  badgesClassName,
  width = 400,
  ...props
}: InspectorPanelProps) {
  return (
    <DetailPanel width={width} className={`bg-surface-0 ${className ?? ""}`} {...props}>
      <DetailPanelHeader className={`items-center shrink-0 ${headerClassName ?? ""}`}>
        {leading}
        <div className="min-w-0 flex-1">
          {badges ? (
            <div className={`mb-0.5 flex flex-wrap items-center gap-1.5 ${badgesClassName ?? ""}`}>
              {badges}
            </div>
          ) : null}
          <DetailPanelTitle className={`truncate ${titleClassName ?? ""}`}>
            {title}
          </DetailPanelTitle>
          {description ? (
            <DetailPanelDescription className={descriptionClassName}>
              {description}
            </DetailPanelDescription>
          ) : null}
          {meta ? (
            <div
              className={`mt-2 flex flex-wrap items-center gap-3 text-[11px] text-text-muted ${metaClassName ?? ""}`}
            >
              {meta}
            </div>
          ) : null}
        </div>
        {onClose ? <DetailPanelCloseButton onClick={onClose} {...closeButtonProps} /> : null}
      </DetailPanelHeader>
      <DetailPanelContent className={contentClassName}>{children}</DetailPanelContent>
      {footer ? (
        <div className={`shrink-0 border-t border-border px-4 py-3 ${footerClassName ?? ""}`}>
          {footer}
        </div>
      ) : null}
    </DetailPanel>
  );
}

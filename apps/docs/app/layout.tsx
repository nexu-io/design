import type { Metadata } from "next";
import type { ReactNode } from "react";
import { RootProvider } from "fumadocs-ui/provider/next";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Nexu Design",
    template: "%s · Nexu Design",
  },
  description: "Documentation for the Nexu Design React component library and tokens.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <RootProvider search={{ enabled: false }} theme={{ storageKey: "nexu-docs-theme" }}>
          {children}
        </RootProvider>
      </body>
    </html>
  );
}

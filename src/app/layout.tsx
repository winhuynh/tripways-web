import type { Metadata } from "next";

import { readApplicationEnvironment } from "@/lib/server/application-environment";
import { SiteFooter, SiteHeader } from "@/shared/ui";

import "./globals.css";

const { siteUrl } = readApplicationEnvironment();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Tripways",
    template: "%s | Tripways",
  },
  description: "Discover direct flights, compare routes, and plan airport journeys with Tripways.",
};

/**
 * Applies the shared site shell and document metadata to every App Router page.
 */
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}

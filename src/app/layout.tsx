import type { Metadata } from "next";

import { SiteFooter, SiteHeader } from "@/shared/ui";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Tripways",
    template: "%s | Tripways",
  },
  description: "Tripways legal information and terms of service.",
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

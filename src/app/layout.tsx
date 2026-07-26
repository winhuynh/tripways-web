import type { Metadata } from "next";
import {
  Inter,
  Merriweather,
  Playfair_Display,
} from "next/font/google";

import "./globals.css";

const headlineFont = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair-display",
  display: "swap",
});

const bodyFont = Merriweather({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  variable: "--font-merriweather",
  display: "swap",
});

const labelFont = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Tripways",
    template: "%s | Tripways",
  },
  description: "Explore direct-flight routes by city, airport, and airline.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      className={`${headlineFont.variable} ${bodyFont.variable} ${labelFont.variable}`}
      lang="en"
    >
      <body>{children}</body>
    </html>
  );
}

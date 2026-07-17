import Link from "next/link";

import { Brand } from "./brand";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#dce5ef] bg-white/90 backdrop-blur-xl">
      <div className="page-container flex h-18 items-center justify-between gap-6">
        <Brand />
        <nav aria-label="Main navigation" className="hidden items-center gap-7 text-sm font-semibold md:flex">
          <Link href="/flights-from/SGN">Explore routes</Link>
          <a href="#how-it-works">How it works</a>
          <span className="rounded-full bg-[#eaf4ff] px-4 py-2 text-[#075fc4]">Local prototype</span>
        </nav>
        <Link
          className="rounded-full bg-[#101828] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#147df5]"
          href="/flights-from/SGN"
        >
          Start exploring
        </Link>
      </div>
    </header>
  );
}

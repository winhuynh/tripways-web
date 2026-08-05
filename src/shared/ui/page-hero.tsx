import type { ReactNode } from "react";

export function PageHero({ eyebrow, title, intro, meta }: { eyebrow?: string; title: string; intro: string; meta?: ReactNode }) {
  return (
    <header className="pseo-hero">
      {eyebrow ? <p className="pseo-eyebrow">{eyebrow}</p> : null}
      <h1>{title}</h1>
      <p className="pseo-hero__intro">{intro}</p>
      {meta ? <div className="pseo-hero__meta">{meta}</div> : null}
    </header>
  );
}

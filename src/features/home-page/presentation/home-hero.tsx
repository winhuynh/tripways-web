import type { HomeHeroReadModel } from "../domain/home-page-model";
import { EditorialButton } from "@/shared/ui";

type HomeHeroProps = Readonly<{
  hero: HomeHeroReadModel;
  issueLabel: string;
}>;

/**
 * Renders the homepage introduction and primary route-search action from the
 * homepage read model.
 */
export function HomeHero({ hero, issueLabel }: HomeHeroProps) {
  return (
    <section className="home-hero">
      <p className="editorial-eyebrow home-hero__issue">
        <span aria-hidden="true" />
        {issueLabel}
      </p>
      <h1>
        <span>{hero.headingLead} </span>
        <em>{hero.headingEmphasis}</em>
        <span>{` ${hero.headingTail}`}</span>
      </h1>
      <p className="home-hero__description">{hero.description}</p>
      <EditorialButton href={hero.ctaHref} tone="accent">
        {hero.ctaLabel}
      </EditorialButton>
    </section>
  );
}

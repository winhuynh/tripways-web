export type HomeHeroReadModel = Readonly<{
  headingLead: string;
  headingEmphasis: string;
  headingTail: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
}>;

export type HomeDirectoryReadModel = Readonly<{
  key: string;
  inventoryLabel: string;
  title: string;
  href: string;
  icon: "airport" | "city" | "country" | "region" | "airline";
}>;

export type HomeCorridorReadModel = Readonly<{
  key: string;
  origin: string;
  destination: string;
  href: string;
}>;

export type HomeValuePropositionReadModel = Readonly<{
  key: string;
  title: string;
  description: string;
  tone: "primary" | "accent" | "neutral";
}>;

export type HomePageReadModel = Readonly<{
  issueLabel: string;
  hero: HomeHeroReadModel;
  directories: readonly HomeDirectoryReadModel[];
  corridors: readonly HomeCorridorReadModel[];
  valuePropositions: readonly HomeValuePropositionReadModel[];
  corridorStory: Readonly<{
    eyebrow: string;
    title: string;
    imagePath: string;
    imageAlt: string;
  }>;
}>;

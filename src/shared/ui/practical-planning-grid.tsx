export type PlanningSectionItem = Readonly<{
  heading: string;
  body: string;
  type?: string;
}>;

export type PlanningFactItem = Readonly<{
  title: string;
  body: string;
  sourceUrl?: string;
  type?: string;
}>;

export type PracticalPlanningGridProps = Readonly<{
  title: string;
  sections?: readonly PlanningSectionItem[];
  facts?: readonly PlanningFactItem[];
  className?: string;
}>;

export function PracticalPlanningGrid({
  title,
  sections = [],
  facts = [],
  className = "",
}: PracticalPlanningGridProps) {
  if (sections.length === 0 && facts.length === 0) return null;

  return (
    <section
      className={`practical-planning pseo-section ${className}`}
      aria-labelledby="practical-planning-heading"
    >
      <h2 id="practical-planning-heading" className="practical-planning__title">
        {title}
      </h2>

      <div className="practical-planning__grid">
        {sections.map((section, idx) => (
          <article
            key={`${section.type ?? "sec"}:${idx}:${section.heading}`}
            className="practical-planning-card"
          >
            <h3 className="practical-planning-card__heading">
              {section.heading}
            </h3>
            <p className="practical-planning-card__body">{section.body}</p>
          </article>
        ))}

        {facts.map((fact, idx) => (
          <article
            key={`${fact.type ?? "fact"}:${idx}:${fact.title}`}
            className="practical-planning-card"
          >
            <h3 className="practical-planning-card__heading">{fact.title}</h3>
            <p className="practical-planning-card__body">{fact.body}</p>
            {fact.sourceUrl ? (
              <a
                href={fact.sourceUrl}
                className="practical-planning-card__link"
                rel="noreferrer nofollow"
                target="_blank"
              >
                Official source →
              </a>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}

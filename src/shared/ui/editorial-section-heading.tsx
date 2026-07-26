type EditorialSectionHeadingProps = Readonly<{
  description?: string;
  eyebrow?: string;
  title: string;
}>;

/**
 * Renders the reusable eyebrow, heading, and optional description hierarchy
 * used by editorial sections.
 */
export function EditorialSectionHeading({
  description,
  eyebrow,
  title,
}: EditorialSectionHeadingProps) {
  return (
    <header className="editorial-section-heading">
      {eyebrow ? (
        <p className="editorial-eyebrow">
          <span aria-hidden="true" />
          {eyebrow}
        </p>
      ) : null}
      <h2>{title}</h2>
      {description ? <p>{description}</p> : null}
    </header>
  );
}

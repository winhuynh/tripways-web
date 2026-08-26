export type RecommendationItem = Readonly<{
  badge: string;
  variant?: "fastest" | "lowest" | "direct" | "default";
  title: string;
  description?: string;
  href?: string;
}>;

export type RecommendationHighlightsProps = Readonly<{
  heading?: string;
  items?: readonly RecommendationItem[];
  className?: string;
}>;

export function RecommendationHighlights({
  heading = "Our Recommendations",
  items,
  className = "",
}: RecommendationHighlightsProps) {
  if (!items || items.length === 0) return null;

  return (
    <section className={`recommendation-highlights ${className}`} aria-label={heading}>
      {heading ? (
        <h3 className="recommendation-highlights__heading">{heading}</h3>
      ) : null}
      <div className="recommendation-highlights__grid">
        {items.map((item) => (
          <div
            key={`${item.badge}:${item.title}`}
            className={`recommendation-card recommendation-card--${item.variant ?? "default"}`}
          >
            <span className="recommendation-card__badge">{item.badge}</span>
            <strong className="recommendation-card__title">{item.title}</strong>
            {item.description ? (
              <p className="recommendation-card__desc">{item.description}</p>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}

import Image from "next/image";

import type { HomeValuePropositionReadModel } from "../domain/home-page-model";

type HomeValuePropositionsProps = Readonly<{
  values: readonly HomeValuePropositionReadModel[];
}>;

/**
 * Renders the closing homepage value propositions as a reusable editorial
 * list.
 */
export function HomeValuePropositions({
  values,
}: HomeValuePropositionsProps) {
  return (
    <section className="home-values" id="about">
      <div className="home-content home-values__grid">
        {values.map((value) => (
          <article className={`home-value home-value--${value.tone}`} key={value.key}>
            <span className="home-value__icon">
              <Image
                alt=""
                aria-hidden="true"
                height={20}
                src={`/figma/home/value-${value.key}.svg`}
                width={20}
              />
            </span>
            <h2>{value.title}</h2>
            <p>{value.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

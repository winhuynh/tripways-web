import Image from "next/image";
import Link from "next/link";

import type {
  HomeCorridorReadModel,
  HomePageReadModel,
} from "../domain/home-page-model";
import { EditorialSectionHeading } from "@/shared/ui";

type HomeCorridorsProps = Readonly<{
  corridors: readonly HomeCorridorReadModel[];
  story: HomePageReadModel["corridorStory"];
}>;

/**
 * Presents the editorial corridor story together with its highlighted
 * origin/destination pairs.
 */
export function HomeCorridors({ corridors, story }: HomeCorridorsProps) {
  return (
    <section className="home-corridors">
      <div className="home-content home-corridors__grid">
        <div>
          <EditorialSectionHeading
            eyebrow="The connectivity audit"
            title="Significant Corridors"
          />
          <ul className="home-corridor-list">
            {corridors.map((corridor) => (
              <li key={corridor.key}>
                <Link href={corridor.href}>
                  <span>{corridor.origin}</span>
                  <span aria-hidden="true">→</span>
                  <span>{corridor.destination}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <article className="home-corridor-story">
          <Image
            alt={story.imageAlt}
            fill
            sizes="(max-width: 760px) 100vw, 50vw"
            src={story.imagePath}
          />
          <div>
            <p>{story.eyebrow}</p>
            <h3>{story.title}</h3>
          </div>
        </article>
      </div>
    </section>
  );
}

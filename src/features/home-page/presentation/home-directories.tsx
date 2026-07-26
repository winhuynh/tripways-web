import Image from "next/image";
import Link from "next/link";

import type { HomeDirectoryReadModel } from "../domain/home-page-model";
import { EditorialSectionHeading } from "@/shared/ui";

type HomeDirectoriesProps = Readonly<{
  directories: readonly HomeDirectoryReadModel[];
}>;

/**
 * Renders the crawlable homepage directory groups supplied by the homepage
 * read model.
 */
export function HomeDirectories({ directories }: HomeDirectoriesProps) {
  return (
    <section className="home-directories" id="directories">
      <div className="home-content">
        <div className="home-directories__heading">
          <EditorialSectionHeading
            description="Our exhaustive indexes of global infrastructure. Updated daily by precision logistics systems."
            title="Directories"
          />
          <Link className="editorial-text-link" href="/flights-from/bangkok">
            VIEW ALL INDICES
          </Link>
        </div>

        <ul className="home-directory-grid">
          {directories.map((directory) => (
            <li key={directory.key}>
              <Link href={directory.href}>
                <Image
                  alt=""
                  aria-hidden="true"
                  height={25}
                  src={`/figma/home/directory-${directory.icon}.svg`}
                  width={145}
                />
                <span>{directory.inventoryLabel}</span>
                <strong>{directory.title}</strong>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

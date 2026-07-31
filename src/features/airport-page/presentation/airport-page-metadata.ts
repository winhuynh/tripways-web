import type { Metadata } from "next";

import type { AirportPageIdentity } from "../domain/models";
import { isAirportPageNotFound } from "../domain/airport-page-error";
import { airportPage } from "../server";

export async function createAirportPageMetadata(
  identity: AirportPageIdentity,
  canonicalPath = `/airports/${identity.airportIata.toLowerCase()}`,
): Promise<Metadata> {
  try {
    const page = await airportPage.getPage(identity);
    return {
      title: page.seo.title,
      description: page.seo.description,
      alternates: { canonical: page.meta.canonicalPath },
      robots: { index: false, follow: true },
      openGraph: {
        title: page.seo.ogTitle,
        description: page.seo.ogDescription,
        type: "website",
      },
    };
  } catch (error) {
    if (isAirportPageNotFound(error)) return {};
    return {
      title: "Airport routes | Tripways",
      alternates: { canonical: canonicalPath },
      robots: { index: false, follow: false },
    };
  }
}

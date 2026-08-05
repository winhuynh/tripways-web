import type { Metadata } from "next";

import { InformationalPage } from "@/shared/ui";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <InformationalPage eyebrow="Tripways" title="About">
      <p>
        Tripways provides practical information about airports, cities, and scheduled flight routes
        to help travellers research a journey.
      </p>
      <p>
        Tripways is an informational service. Travellers should confirm operational details and
        booking conditions with the relevant airport, authority, airline, or booking provider.
      </p>
    </InformationalPage>
  );
}

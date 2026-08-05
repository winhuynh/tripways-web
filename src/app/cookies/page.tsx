import type { Metadata } from "next";

import { InformationalPage } from "@/shared/ui";

export const metadata: Metadata = { title: "Cookie Policy" };

export default function CookiesPage() {
  return (
    <InformationalPage eyebrow="Legal" title="Cookie Policy">
      <p>
        Tripways uses only cookies or similar storage that are necessary for the current service to
        function securely.
      </p>
      <p>
        Optional analytics, advertising, or personalisation storage will require an updated policy
        and appropriate consent controls before it is enabled.
      </p>
    </InformationalPage>
  );
}

import type { Metadata } from "next";

import { InformationalPage } from "@/shared/ui";

export const metadata: Metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return (
    <InformationalPage eyebrow="Legal" title="Privacy">
      <p>
        Tripways limits the personal information it collects to what is necessary to operate,
        protect, and understand the service.
      </p>
      <p>
        This page will be expanded before production analytics, accounts, or commercial partners are
        enabled. Tripways does not collect payment details through the current informational service.
      </p>
    </InformationalPage>
  );
}

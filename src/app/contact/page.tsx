import type { Metadata } from "next";

import { InformationalPage } from "@/shared/ui";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <InformationalPage eyebrow="Support" title="Contact">
      <p>
        A public support channel has not yet been enabled for this pre-production service. Contact
        details will be published here before Tripways launches publicly.
      </p>
      <p>Do not send booking details, passport information, payment data, or other sensitive data.</p>
    </InformationalPage>
  );
}

import type { Metadata } from "next";

import { InformationalPage } from "@/shared/ui";

export const metadata: Metadata = { title: "Accessibility" };

export default function AccessibilityPage() {
  return (
    <InformationalPage eyebrow="Support" title="Accessibility">
      <p>
        Tripways aims to provide readable, keyboard-accessible pages with clear structure, visible
        focus states, responsive layouts, and meaningful labels.
      </p>
      <p>
        If part of the service is difficult to use, contact Tripways with the page address and a
        description of the issue.
      </p>
    </InformationalPage>
  );
}

import type { Metadata } from "next";
import Link from "next/link";

import { SiteFooter, SiteHeader } from "@/shared/ui";

import "./terms-page.css";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms governing access to Tripways and use of its informational flight-route content.",
};

export default function TermsPage() {
  return (
    <div className="terms-shell">
      <SiteHeader />
      <main className="terms-page">
        <header className="terms-page__header">
          <p>LEGAL</p>
          <h1>Terms of Service</h1>
          <p>Effective July 30, 2026</p>
        </header>

        <div className="terms-page__content">
          <LegalSection title="1. Acceptance of these Terms">
            <p>
              By accessing or using Tripways, you agree to these Terms of
              Service. If you do not agree, do not use the service.
            </p>
          </LegalSection>

          <LegalSection title="2. Informational service">
            <p>
              Tripways provides airport, city, airline, and flight-route
              information for informational and planning purposes only. Tripways
              is not an airline, airport, travel agency, booking service, or
              air-navigation service.
            </p>
            <p>
              Route availability, schedules, connection options, and related
              details can change without notice. Verify current services,
              schedules, travel requirements, and booking conditions with the
              relevant airline, airport, authority, or booking provider before
              making travel decisions.
            </p>
          </LegalSection>

          <LegalSection title="3. Permitted use">
            <p>
              You may use Tripways for lawful personal or internal business
              research. You may link to public Tripways pages and quote limited
              portions of original editorial content with appropriate
              attribution, where permitted by law.
            </p>
          </LegalSection>

          <LegalSection title="4. Third-party data and services">
            <p>
              Tripways may present facts, reference data, links, or other
              material obtained from public sources, licensors, and third-party
              service providers. Those parties retain their applicable
              intellectual-property, trademark, and database rights. Tripways
              does not claim ownership of third-party APIs, provider data,
              airline marks, or airport marks.
            </p>
            <p>
              Third-party services have their own terms and privacy practices.
              Tripways is not responsible for their availability, content, or
              transactions.
            </p>
          </LegalSection>

          <LegalSection title="5. Tripways intellectual property">
            <p>
              Tripways retains its rights in its software, branding, original
              editorial content, interface, and proprietary selection,
              arrangement, ranking, and route-derivation logic to the extent
              protected by applicable law. No ownership right is transferred to
              you by access to the service.
            </p>
          </LegalSection>

          <LegalSection title="6. Automated access and extraction">
            <p>
              Unless Tripways gives prior written permission, you must not use
              automated means to scrape, crawl, bulk-download, monitor, copy, or
              extract the service or its compiled content; bypass rate limits or
              technical controls; impose unreasonable load; reconstruct a
              substantial part of a Tripways database; or republish extracted
              content or compiled data commercially.
            </p>
            <p>
              This restriction does not prohibit public search-engine crawlers
              that identify themselves accurately and comply with Tripways&apos;
              robots.txt and other published technical controls, or agents
              expressly authorized by Tripways in writing.
            </p>
          </LegalSection>

          <LegalSection title="7. Service changes and enforcement">
            <p>
              Tripways may update, correct, remove, suspend, or discontinue
              content, features, or data sources at any time. Tripways may
              restrict access when reasonably necessary to protect the service,
              its users, or third-party rights, or to address misuse of the
              service.
            </p>
          </LegalSection>

          <LegalSection title="8. Disclaimer of warranties">
            <p>
              The service is provided on an “as is” and “as available” basis. To
              the maximum extent permitted by applicable law, Tripways disclaims
              warranties of accuracy, completeness, fitness for a particular
              purpose, non-infringement, uninterrupted operation, and error-free
              availability.
            </p>
          </LegalSection>

          <LegalSection title="9. Limitation of liability">
            <p>
              To the maximum extent permitted by applicable law, Tripways will
              not be liable for indirect, incidental, special, consequential, or
              exemplary loss arising from use of, inability to use, or reliance
              on the service, including missed flights, booking loss, itinerary
              disruption, lost profits, or loss of data. Nothing in these Terms
              excludes liability that cannot lawfully be excluded.
            </p>
          </LegalSection>

          <LegalSection title="10. Changes to these Terms">
            <p>
              Tripways may revise these Terms as the service changes. The
              effective date identifies the current version. Continued use after
              revised Terms take effect constitutes acceptance where permitted
              by applicable law.
            </p>
          </LegalSection>

          <LegalSection title="11. Applicable law">
            <p>
              These Terms are governed by the applicable laws and mandatory
              consumer protections of the jurisdiction with authority over the
              service and the relevant use. A specific governing jurisdiction
              may be identified when Tripways publishes updated entity details.
            </p>
          </LegalSection>

          <LegalSection title="12. Contact">
            <p>
              Questions about these Terms or requests for authorized automated
              access may be submitted through the contact channel published by
              Tripways. Until a dedicated channel is published, please do not
              attempt automated access.
            </p>
          </LegalSection>

          <p className="terms-page__return">
            <Link href="/">Return to Tripways</Link>
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function LegalSection({
  children,
  title,
}: Readonly<{
  children: React.ReactNode;
  title: string;
}>) {
  return (
    <section>
      <h2>{title}</h2>
      {children}
    </section>
  );
}

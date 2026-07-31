# Public Terms and Data Use Design

**Date:** 2026-07-30  
**Status:** Approved for specification review  
**Scope:** English public Terms of Service, route-information disclaimer, and legal navigation

## 1. Objective

Tripways will publish an English Terms of Service page that describes the site as an informational
flight-route discovery product. The terms must distinguish Tripways-owned product elements from
third-party data, communicate that route information can change, and prohibit unauthorized
automated extraction of Tripways pages and compiled data.

This feature does not grant Tripways any additional rights to upstream provider data. Provider
storage, publication, retention, attribution, and derivative-use rights remain separate ingestion
requirements.

## 2. Product Position

Tripways helps visitors understand airports, cities, direct routes, and derived connecting-route
options. It is not an airline, airport, travel agency, booking service, air navigation service, or
authoritative operational source.

Route information is informational only. Users must verify schedules, availability, entry
requirements, connection feasibility, and travel details with the relevant airline, airport, or
booking provider before acting.

## 3. Public Surfaces

### 3.1 Terms page

Add a static, server-rendered `/terms` page with:

- page title, effective date, and concise introduction;
- acceptance and permitted personal use;
- informational-purpose and no-booking disclaimer;
- route accuracy, completeness, and freshness limitations;
- third-party data and service attribution;
- Tripways intellectual-property scope;
- prohibited scraping, crawling, bulk extraction, circumvention, and database reconstruction;
- an exception for compliant public search-engine crawlers and other agents explicitly authorized
  by Tripways;
- external-link and third-party-service terms;
- service changes, suspension, and termination;
- disclaimers and limitation of liability;
- changes to the terms;
- contact instructions;
- a jurisdiction-neutral governing-law statement until a legal entity and jurisdiction are
  selected.

The copy must not claim that Tripways owns provider APIs, third-party facts, airline marks, airport
marks, or licensed source data.

### 3.2 Footer

Replace the legal preview text with a real `Terms` link. Privacy and other legal links remain
unpublished rather than linking to placeholder pages.

### 3.3 Route disclaimer

Add a short reusable disclaimer to public route-discovery pages:

> Route information is for planning reference only and may change. Verify current services and
> schedules with the airline or booking provider.

The disclaimer links to `/terms`. It must be visible without interrupting the primary route
discovery flow.

## 4. Rights and Attribution Model

Tripways may claim rights only over its original software, interface, branding, editorial content,
selection and arrangement where legally protectable, and proprietary route-ranking or
route-derivation logic.

Airport, city, airline, and route facts may originate from third-party or public sources. Relevant
rights, trademarks, and database rights remain with their owners. Source-specific attribution must
be displayed when the applicable license requires it.

The terms must not describe provider-derived records as owned exclusively by Tripways.

## 5. Automated Access Policy

The public terms prohibit, without written permission:

- scraping or crawling for bulk extraction;
- automated copying or monitoring that places unreasonable load on the service;
- bypassing rate limits, access controls, or technical restrictions;
- reproducing or reconstructing a substantial part of the Tripways database;
- republishing or commercially redistributing extracted Tripways content or compiled data;
- using automated access in a way that violates third-party rights.

The prohibition does not apply to:

- ordinary browser use;
- public search-engine crawlers that obey `robots.txt` and published controls;
- integrations or agents explicitly authorized by Tripways in writing.

Terms are a contractual notice, not a complete technical defense. Existing `robots.txt`, server
rate limits, monitoring, and source-isolated ingestion remain the enforcement layers. This change
does not introduce new bot-detection infrastructure.

## 6. Provider Replaceability

The legal page reflects, but does not implement, the backend provider boundary:

- canonical records retain a source identifier and freshness metadata;
- raw provider payloads remain private;
- public responses do not expose provider credentials or raw payloads;
- records from one provider can be disabled or removed without redesigning public contracts;
- derived connecting routes are calculated by Tripways from eligible direct-route records;
- provider-specific retention or deletion rules override general Tripways retention preferences.

No provider name is hard-coded into the public Terms. Required attribution belongs in a separate,
maintainable attribution surface or in the relevant page copy.

## 7. Accessibility and Presentation

The Terms page uses the existing site header, footer, typography, spacing, and responsive
foundation. It is readable as a conventional legal document with:

- one visible page heading;
- semantic sections and headings;
- sufficient text contrast;
- keyboard-accessible links;
- a comfortable bounded reading width;
- no client-side JavaScript requirement.

No third-party visual branding or layout is copied.

## 8. Error Handling and Indexing

The static Terms page has no external runtime dependency and therefore no provider-specific error
state. It may be indexed as a normal public page once the site indexing contract permits production
content.

The implementation must preserve the repository's current indexing safeguards. It must not enable
fixture route pages, staging content, or unpublished data for search indexing.

## 9. Verification

Test-first implementation will verify:

- `/terms` renders the required headings and effective date;
- Terms include the informational-use, third-party-rights, and automated-extraction clauses;
- the shared footer links to `/terms` and no longer labels Terms as a preview;
- the route disclaimer renders with a working Terms link on applicable route pages;
- semantic navigation and existing site-chrome contracts remain valid;
- lint, typecheck, tests, and production build pass.

Responsive browser checks cover mobile and desktop reading layouts.

## 10. Explicit Exclusions

This scope does not include:

- legal advice or attorney certification;
- a Privacy Policy, Cookie Policy, or consent-management platform;
- user accounts, subscriptions, payments, or booking terms;
- a provider license approval workflow;
- new rate limiting, bot fingerprinting, CAPTCHA, or firewall rules;
- a public data API;
- changes to route ingestion or canonical database schemas;
- naming a governing jurisdiction before a legal entity is selected.

These items should be added only when the corresponding product behavior exists or a legal entity
requires them.

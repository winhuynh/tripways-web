import type { CityFaq } from "../domain/models";

/**
 * Renders reviewed City Hub FAQs as accessible disclosure controls.
 */
export function CityFaqSection({ faqs }: { faqs: readonly CityFaq[] }) {
  return (
    <section className="city-faq" id="faq">
      <div className="section-heading section-heading--center">
        <div>
          <p className="eyebrow">Frequently asked</p>
          <h2 className="sr-only">Frequently asked questions</h2>
        </div>
      </div>
      <div className="faq-list">
        {faqs.map((faq, index) => (
          <details key={faq.question} open={index === 0}>
            <summary>{faq.question}</summary>
            <p>{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

/**
 * Serializes the same reviewed FAQs into an escaped schema.org FAQPage block.
 */
export function FaqStructuredData({ faqs }: { faqs: readonly CityFaq[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <script
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
      type="application/ld+json"
    />
  );
}

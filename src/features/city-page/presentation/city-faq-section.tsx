import type { CityFaq } from "../domain/models";

export function CityFaqSection({ faqs }: { faqs: readonly CityFaq[] }) {
  return (
    <section id="faq">
      <div className="section-heading section-heading--center">
        <div>
          <p className="eyebrow">Plan with confidence</p>
          <h2>Frequently asked questions</h2>
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

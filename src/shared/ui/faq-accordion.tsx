export function FaqAccordion({ items }: { items: ReadonlyArray<{ question: string; answer: string }> }) {
  if (items.length === 0) return null;
  return (
    <section className="pseo-section" aria-labelledby="faq-heading">
      <h2 id="faq-heading">Frequently Asked Questions</h2>
      <div className="pseo-faqs">
        {items.map((item) => (
          <details key={item.question}>
            <summary>{item.question}</summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

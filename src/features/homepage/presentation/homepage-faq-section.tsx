const FAQ_ITEMS = [
  {
    question: "Where can I fly directly from my city without layovers?",
    answer:
      "To discover all nonstop destinations from your home airport, enter your city into the Route Explorer search bar or explore your dedicated City Hub page. Tripways instantly maps every active direct flight route, complete with typical flight durations, route distances, and weekly operating frequencies.",
  },
  {
    question: "How can I find the fastest route if there is no direct flight?",
    answer:
      "When two cities lack a nonstop flight, search the city pair in the Route Explorer. Tripways automatically analyzes global connection graphs to identify the smartest 1-stop transfer hubs—filtering out grueling 20+ hour layovers and illogical detours so you get the shortest total travel time.",
  },
  {
    question: "How do I find out which airlines fly between two cities?",
    answer:
      "Enter your origin and destination to view a complete carrier breakdown for that corridor. Tripways displays every airline operating each flight segment—from major global alliances (Star Alliance, SkyTeam, Oneworld) to regional budget carriers—with 100% transparency and zero sponsored ranking bias.",
  },
  {
    question: "Can I explore flight routes and schedules without picking specific travel dates?",
    answer:
      "Yes. Unlike traditional booking engines that force you to guess rigid dates before showing flights, Tripways lets you evaluate route feasibility first. You can explore flight corridors, typical travel times, and operating carriers anytime to plan your itinerary before locking in dates.",
  },
  {
    question: "How accurate and up-to-date is Tripways route data?",
    answer:
      "Tripways routes and operating timetables are synchronized with official IATA seasonal schedules and global aviation registry data. This ensures you see genuine scheduled airline services, verified flight corridors, and authentic airport connections rather than speculative itineraries.",
  },
  {
    question: "Does Tripways charge booking fees or sell flight tickets directly?",
    answer:
      "No. Tripways is a 100% free flight route intelligence and planning tool. We do not sell tickets, charge service fees, or mark up fares. Once you discover your ideal route and airline, we connect you directly to the airline or verified booking partners to complete your reservation safely.",
  },
] as const;

export function HomepageFaqSection() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <section className="home-faq-section" aria-label="Frequently asked questions">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="pseo-container">
        <div className="home-faq__header">
          <span className="home-section-eyebrow">Help &amp; Insights</span>
          <h2 className="home-faq__title">Frequently Asked Questions</h2>
          <p className="home-faq__intro">
            Everything you need to know about planning flight routes, layovers, operating airlines, and connection schedules.
          </p>
        </div>

        <div className="home-faq__accordion">
          {FAQ_ITEMS.map((item, index) => (
            <details
              key={item.question}
              className="home-faq-item"
              open={index === 0}
            >
              <summary className="home-faq-item__question">
                <span>{item.question}</span>
                <span className="home-faq-item__icon" aria-hidden="true">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </span>
              </summary>
              <div className="home-faq-item__answer">
                <p>{item.answer}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

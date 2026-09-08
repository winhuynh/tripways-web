export function ValuePillarsSection() {
  return (
    <>
      <section className="home-pillars-section" aria-label="Useful tools for planning your journey">
        <div className="pseo-container">
          <div className="home-pillars-header">
            <h2 className="home-pillars-section-title">
              Useful tools to help you plan your journey
            </h2>
            <p className="home-pillars-section-subtitle">
              Make confident route decisions backed by verified airline networks and travel graphs.
            </p>
          </div>

          <div className="home-pillars-grid">
            {/* Pillar 1: Find your next destination */}
            <article className="home-pillar-card">
              <div className="home-pillar-icon-wrap" aria-hidden="true">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
                </svg>
              </div>
              <h3 className="home-pillar-title">Find your next destination</h3>
              <p className="home-pillar-body">
                See every city you can reach nonstop from your nearest airport — and discover
                places you may not have considered.
              </p>
            </article>

            {/* Pillar 2: See your options on a map */}
            <article className="home-pillar-card">
              <div className="home-pillar-icon-wrap" aria-hidden="true">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
              </div>
              <h3 className="home-pillar-title">See your options on a map</h3>
              <p className="home-pillar-body">
                Explore nonstop destinations visually, so it&apos;s easier to compare regions and
                choose where to go next.
              </p>
            </article>

            {/* Pillar 3: Choose the route that works for you */}
            <article className="home-pillar-card">
              <div className="home-pillar-icon-wrap" aria-hidden="true">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="12" y1="19" x2="12" y2="5" />
                  <polyline points="5 12 12 5 19 12" />
                </svg>
              </div>
              <h3 className="home-pillar-title">Choose the route that works for you</h3>
              <p className="home-pillar-body">
                Compare airlines and typical flight times to find a simpler, more convenient
                journey.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* Google Flights Style FAQ Accordion */}
      <section className="home-faq-section" aria-label="Frequently asked questions">
        <div className="pseo-container">
          <h2 className="home-faq-title">Frequently asked questions</h2>
          <div className="home-faq-list">
            <details className="home-faq-item">
              <summary className="home-faq-summary">
                <span>How does Tripways find nonstop flight routes?</span>
                <span className="home-faq-chevron" aria-hidden="true">▾</span>
              </summary>
              <div className="home-faq-content">
                <p>
                  Tripways utilizes global aviation reference data and schedule networks (AeroDataBox, OurAirports)
                  to build a verified travel graph between city pairs and airports worldwide.
                </p>
              </div>
            </details>

            <details className="home-faq-item">
              <summary className="home-faq-summary">
                <span>Can I book flight tickets directly on Tripways?</span>
                <span className="home-faq-chevron" aria-hidden="true">▾</span>
              </summary>
              <div className="home-faq-content">
                <p>
                  Tripways is a route discovery and planning platform. When you select a route, we hand you
                  off safely to trusted airline partners or verified ticket platforms (like Aviasales) to complete your booking.
                </p>
              </div>
            </details>

            <details className="home-faq-item">
              <summary className="home-faq-summary">
                <span>What does &quot;Observed fare&quot; mean?</span>
                <span className="home-faq-chevron" aria-hidden="true">▾</span>
              </summary>
              <div className="home-faq-content">
                <p>
                  Observed fares are recently recorded economy one-way prices cached over the past 2–7 days to give you
                  a realistic benchmark before checking live flight availability.
                </p>
              </div>
            </details>
          </div>
        </div>
      </section>
    </>
  );
}

export function ValuePillarsSection() {
  return (
    <section className="home-pillars-section" aria-label="Why choose Tripways">
      <div className="pseo-container">
        <div className="home-pillars-grid">
          {/* Pillar 1: Find your next destination */}
          <article className="home-pillar-card">
            <div className="home-pillar-icon-wrap" aria-hidden="true">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
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
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
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
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
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
  );
}

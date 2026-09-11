export function TravelAdvisoryNotice() {
  return (
    <section className="home-advisory-section" aria-label="Travel advisory">
      <div className="pseo-container">
        <div className="home-advisory-banner">
          <div className="home-advisory-icon-wrap" aria-hidden="true">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <p className="home-advisory-text">
            <strong>Data Accuracy Notice — Before you travel:</strong> Airline schedules and route
            networks reflect current IATA seasonal timetables. Always reconfirm specific flight
            dates, operating carriers, and travel policies before booking or travelling.
          </p>
        </div>
      </div>
    </section>
  );
}

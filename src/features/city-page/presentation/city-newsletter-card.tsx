/**
 * Reserves the City Hub newsletter UI boundary. Submission remains
 * provider-agnostic until a newsletter integration is selected.
 */
export function CityNewsletterCard({ cityName }: { cityName: string }) {
  return (
    <form
      action="#newsletter-signup"
      aria-label={`${cityName} travel deals newsletter`}
      className="newsletter-card"
      id="newsletter-signup"
      method="get"
    >
      <p className="eyebrow">Travel deals</p>
      <h3>Weekly route inspiration</h3>
      <p>
        Join curious travellers finding better direct-flight ideas from {cityName}.
      </p>
      <label className="sr-only" htmlFor="city-newsletter-email">
        Email address
      </label>
      <input
        autoComplete="email"
        id="city-newsletter-email"
        name="email"
        placeholder="Email address"
        type="email"
      />
      <button type="submit">Subscribe</button>
    </form>
  );
}

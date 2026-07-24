export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="page-shell footer-grid">
        <div>
          <strong>✈ Tripways</strong>
          <p>Direct-flight discovery built from reviewed route data.</p>
        </div>
        <div>
          <strong>Bangkok</strong>
          <a href="#destinations">Direct destinations</a>
          <a href="#airports">Airport hubs</a>
        </div>
        <div>
          <strong>Resources</strong>
          <a href="#airlines">Airlines</a>
          <a href="#faq">Frequently asked questions</a>
        </div>
        <div>
          <strong>Data status</strong>
          <p>Draft local fixture. Live fares are not included.</p>
        </div>
      </div>
    </footer>
  );
}

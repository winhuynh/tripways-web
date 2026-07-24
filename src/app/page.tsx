import Link from "next/link";

export default function HomePage() {
  return (
    <main className="reset-page">
      <section>
        <p>Tripways</p>
        <h1>City direct-flight discovery</h1>
        <p>Open the local Bangkok city-page draft backed by Supabase read models.</p>
        <Link className="primary-button" href="/flights-from/bangkok">
          View Bangkok draft
        </Link>
      </section>
    </main>
  );
}

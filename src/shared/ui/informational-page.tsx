type InformationalPageProps = Readonly<{
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}>;

/**
 * Provides a consistent readable layout for supporting site information.
 */
export function InformationalPage({ children, eyebrow, title }: InformationalPageProps) {
  return (
    <main className="informational-page">
      <header className="informational-page__header">
        <p>{eyebrow}</p>
        <h1>{title}</h1>
      </header>
      <div className="informational-page__content">{children}</div>
    </main>
  );
}

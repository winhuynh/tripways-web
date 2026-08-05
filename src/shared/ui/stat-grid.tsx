export function StatGrid({ items }: { items: ReadonlyArray<{ label: string; value: string | number }> }) {
  return (
    <dl className="pseo-stat-grid">
      {items.map((item) => (
        <div key={item.label}>
          <dd>{item.value}</dd>
          <dt>{item.label}</dt>
        </div>
      ))}
    </dl>
  );
}

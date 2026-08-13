
export type Stat = {
  figure: string;
  headline: string;
  detail: string;
};

/**
 * The three-up proof row. The figures are set in the display grotesque at the file's 32px, and
 * the 60px indent from the design is kept as a left rule so the column has an edge to sit against.
 */
export function StatGrid({ stats }: { stats: Stat[] }) {
  return (
    <ul className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-20">
      {stats.map((stat) => (
        <li key={stat.headline} className="border-l border-hairline pl-8 lg:pl-15">
          <p className="font-figure text-[2rem] leading-[1.4] font-semibold text-ink">{stat.figure}</p>
          <p className="font-figure text-[2rem] leading-[1.4] text-ink">{stat.headline}</p>
          <p className="mt-4 max-w-[295px] text-body text-ink/80">{stat.detail}</p>
        </li>
      ))}
    </ul>
  );
}

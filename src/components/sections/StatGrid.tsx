
export type Stat = {
  figure: string;
  headline: string;
  detail: string;
};

/**
 * The three-up proof row. The figures are set in the display grotesque at the file's 32px, and
 * the 60px indent from the design is kept as a left rule so the column has an edge to sit against.
 *
 * In the design each stat is one text layer whose first line carries a per-character fill of
 * azure-400, which is why the figure is blue and the headline under it is ink. Here they are two
 * elements, so the same split is made with the colour rather than with a character range.
 *
 * The step is azure-700 rather than the file's azure-400. At 32px the figure counts as large text,
 * so it needs 3:1 — and #4da8fd manages only 2.5:1 on the white sections and 2.3:1 on the tinted
 * ground the /for pages put behind it, so the highlight was under AA wherever it appeared. This
 * step is the same hue at 6.0:1 and 5.4:1. The brand-blue token keeps azure-400, which is correct
 * on the dark grounds and in the gradients that use it.
 */
export function StatGrid({ stats }: { stats: Stat[] }) {
  return (
    <ul className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-20">
      {stats.map((stat) => (
        <li key={stat.headline} className="border-l border-hairline pl-8 lg:pl-15">
          <p className="font-figure text-[2rem] leading-[1.4] font-semibold text-azure-700">{stat.figure}</p>
          <p className="font-figure text-[2rem] leading-[1.4] text-ink">{stat.headline}</p>
          <p className="mt-4 max-w-[295px] text-body text-ink/80">{stat.detail}</p>
        </li>
      ))}
    </ul>
  );
}

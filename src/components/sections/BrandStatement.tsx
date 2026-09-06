import { Section } from '@/components/ui/Section';
import { site } from '@/config/site';
import { cn } from '@/lib/cn';

type BrandStatementProps = {
  /** Talentilo's own words. Not a customer quote — see the note on the component below. */
  statement: string;
  /** What the statement is about, shown under the brand name. */
  context: string;
  /** Each audience page pairs the panels with its own tinted/solid colour trio. */
  tone?: 'azure' | 'crusta';
};

/**
 * Each audience page takes one hue across both panels: the mark panel sits on the 100 step, the
 * statement on the 50 above it, and the shape between them is the solid. A white statement panel
 * read as a plain surface parked beside a coloured one; on the same ramp the two halves read as
 * one section.
 */
const TONE = {
  azure: { tint: 'bg-azure-100', wash: 'bg-azure-50', mark: 'text-azure-400' },
  crusta: { tint: 'bg-crusta-100', wash: 'bg-crusta-50', mark: 'text-crusta-400' },
} as const;

/**
 * The organic shape the statement panel is paired with, one per audience page.
 *
 * This was a rotated squircle — the site's 45° grid motif turned into a single tile. Talentilo
 * asked for something less geometric, so each page now gets its own blob from the same family:
 * a closed Catmull-Rom curve through ten (azure) or eight (crusta) points whose radii swing
 * between 70 and 132 in a 260 viewBox. Same construction and the same radius band, so the two
 * read as siblings rather than as two unrelated marks.
 *
 * The curves are baked rather than generated at render time. A shape randomised per render would
 * differ between the server and the client pass, and would change on every reload — the point is
 * an irregular silhouette, not an unstable one.
 *
 * The four small squares carry over the grid motif. They sit on the lobes at 60% of each lobe's
 * own radius, which keeps them inside the shape where it is thickest — placing them on fixed
 * diagonals put them outside the blob at its concave points.
 */
const BRAND_SHAPES = {
  azure: {
    path: 'M254.77 147.54C251.34 162.29 198.83 161.6 181.79 180.02C164.76 198.43 167.34 253.78 152.57 258.03C137.8 262.27 114.3 217.6 93.18 205.5C72.05 193.39 32.22 199.74 25.81 185.4C19.41 171.05 52.72 143.48 54.74 119.42C56.76 95.37 27.41 50.81 37.92 41.08C48.44 31.36 93.59 64.52 117.84 61.06C142.1 57.61 169.39 15.27 183.48 20.35C197.57 25.42 190.52 70.31 202.4 91.5C214.28 112.7 258.21 132.78 254.77 147.54Z',
    squares: [
      [200.4, 136],
      [139, 202.3],
      [63, 158.7],
      [70.3, 72.2],
    ],
  },
  crusta: {
    path: 'M247.61 189.93C238.32 206.62 182.63 196.65 154.1 204.18C125.57 211.72 94.4 242.97 76.43 235.14C58.46 227.31 56.39 184.4 46.31 157.19C36.23 129.99 5.61 87.52 15.95 71.89C26.29 56.26 79.98 72.16 108.37 63.43C136.76 54.7 169.37 12.75 186.29 19.52C203.21 26.28 199.67 75.64 209.89 104.04C220.11 132.44 256.91 173.24 247.61 189.93Z',
    squares: [
      [196.1, 161.5],
      [93.4, 188.6],
      [57.1, 90.6],
      [159.3, 59.2],
    ],
  },
} as const;

function BrandShape({ tone, className }: { tone: keyof typeof BRAND_SHAPES; className?: string }) {
  const shape = BRAND_SHAPES[tone];
  return (
    <svg viewBox="0 0 260 260" className={className} aria-hidden="true">
      <path d={shape.path} fill="currentColor" />
      <g fill="#ffffff" opacity="0.55">
        {shape.squares.map(([x, y]) => (
          <rect key={`${x}-${y}`} x={x} y={y} width="9" height="9" rx="2.5" />
        ))}
      </g>
    </svg>
  );
}

/**
 * The position statement the audience pages open with.
 *
 * This was a customer testimonial, and every part of it was invented: one stock headshot and the
 * name "John Doe" on one page, another headshot and "Paula Bennett" on the other, both at a
 * company that does not exist, both saying the same sentence — and that sentence was Figma's
 * filler about building a website, on a recruitment product.
 *
 * A page cannot claim a customer said something until a customer has said it. So the section now
 * speaks in Talentilo's own voice and is attributed to Talentilo: the mark panel names the
 * speaker, and the statement panel carries the claim. Nothing here is put in a third party's
 * mouth. When a real customer gives a real quote, this becomes a testimonial again — the layout
 * is the same one, and the mark panel is where the portrait and attribution go back.
 */
export function BrandStatement({ statement, context, tone = 'azure' }: BrandStatementProps) {
  const palette = TONE[tone];

  return (
    <Section padding="normal">
      {/*
        47/53. The wider mark panel gives the shape a squarer footprint to sit in, and narrowing
        the statement panel pulls the statement onto four lines, which is a measure the eye tracks
        better and which fills the panel instead of stranding it across the width.
      */}
      <div className="grid gap-4 lg:grid-cols-[minmax(0,0.94fr)_minmax(0,1.06fr)]">
        <div
          className={cn(
            'relative flex min-h-[420px] flex-col justify-between overflow-hidden rounded-card p-8 sm:p-10 lg:min-h-[520px]',
            palette.tint
          )}
        >
          <div className="relative flex flex-1 items-center justify-center pb-10">
            <BrandShape
              tone={tone}
              className={cn('size-[280px] max-w-full lg:size-[344px]', palette.mark)}
            />
          </div>
          <div className="relative text-body text-ink/80">
            <span className="block font-medium text-ink">{site.name}</span>
            {context}
          </div>
        </div>

        <div className={cn('flex flex-col justify-center rounded-card p-8 sm:p-15', palette.wash)}>
          {/*
            An oversized opening mark gives the block the mass the panel height needs — a statement
            alone, centred in 520, left the panel empty. It stands in for the inline quotation
            marks rather than doubling them.
          */}
          <span
            aria-hidden="true"
            className={cn('block font-display text-[100px] leading-[0.72] lg:text-[140px]', palette.mark)}
          >
            &ldquo;
          </span>
          <p className="mt-7 font-sans text-[clamp(1.375rem,1rem+1.1vw,1.6875rem)] leading-[1.6] font-medium text-ink">
            {statement}
          </p>
        </div>
      </div>
    </Section>
  );
}

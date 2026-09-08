import { FigmaImage } from '@/components/ui/Creative';
import { Section } from '@/components/ui/Section';
import type { figmaImages } from '@/data/images';
import { cn } from '@/lib/cn';

type TestimonialProps = {
  quote: string;
  name: string;
  role: string;
  /**
   * Optional. Where there is no photograph of this person, the card falls back to their initials
   * rather than to a stock face: every stock portrait is a photograph of some other real person,
   * and captioning one with this name misrepresents both of them. A monogram fills the same
   * circle and claims nothing.
   */
  avatarHash?: keyof typeof figmaImages;
  /** Each audience page pairs the panels with its own tinted/solid colour trio. */
  tone?: 'azure' | 'crusta';
};

/**
 * Each audience page takes one hue across both panels: the portrait sits on the 100 step, the
 * quote on the 50 above it, and the shape between them is the solid. A white quote panel read as
 * a plain surface parked beside a coloured one; on the same ramp the two halves read as one
 * section.
 */
const TONE = {
  azure: {
    tint: 'bg-azure-100',
    wash: 'bg-azure-50',
    mark: 'text-azure-400',
    monogram: 'bg-azure-50 text-azure-800',
  },
  crusta: {
    tint: 'bg-crusta-100',
    wash: 'bg-crusta-50',
    mark: 'text-crusta-400',
    monogram: 'bg-crusta-50 text-crusta-800',
  },
} as const;

/** First letters of the first and last words of a name — "Mohit Sharma" gives "MS". */
function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return `${parts[0]?.[0] ?? ''}${parts.length > 1 ? (parts.at(-1)?.[0] ?? '') : ''}`.toUpperCase();
}

/**
 * The organic shape the portrait sits on, one per audience page.
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
 * own radius, which keeps them inside the shape where it is thickest and clear of the portrait
 * ring at 45.3 — placing them on fixed diagonals put them outside the blob at its concave points.
 */
const PORTRAIT_SHAPES = {
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

function PortraitMark({ tone, className }: { tone: keyof typeof PORTRAIT_SHAPES; className?: string }) {
  const shape = PORTRAIT_SHAPES[tone];
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
 * The pull quote the audience pages open with.
 *
 * PLACEHOLDER CONTENT. The names, roles, employer and photographs here are dummies that Talentilo
 * is carrying deliberately until real customer quotes are cleared, and the pages are live, so
 * every one of them needs replacing before the section is treated as social proof. Swapping in a
 * real quote is four props on the page — nothing in this component needs to change.
 *
 * The photograph is 112px square at source, so it is presented at that size rather than blown up:
 * the shape behind it supplies the scale the panel needs and the face stays sharp.
 */
export function Testimonial({ quote, name, role, avatarHash, tone = 'azure' }: TestimonialProps) {
  const palette = TONE[tone];

  return (
    <Section padding="normal">
      {/*
        47/53. The wider portrait panel gives the photograph a squarer footprint to sit in, and
        narrowing the quote panel pulls the quote onto four lines, which is a measure the eye
        tracks better and which fills the panel instead of stranding it across the width.
      */}
      <div className="grid gap-4 lg:grid-cols-[minmax(0,0.94fr)_minmax(0,1.06fr)]">
        <div
          className={cn(
            'relative flex min-h-[420px] flex-col justify-between overflow-hidden rounded-card p-8 sm:p-10 lg:min-h-[520px]',
            palette.tint
          )}
        >
          <div className="relative flex flex-1 items-center justify-center pb-10">
            <PortraitMark
              tone={tone}
              className={cn('absolute size-[280px] max-w-full lg:size-[344px]', palette.mark)}
            />
            <div
              className={cn(
                'relative grid size-28 place-items-center overflow-hidden rounded-full ring-4 ring-white',
                !avatarHash && palette.monogram
              )}
            >
              {avatarHash ? (
                <FigmaImage hash={avatarHash} alt="" />
              ) : (
                <span aria-hidden="true" className="font-sans text-[2rem] font-semibold">
                  {initials(name)}
                </span>
              )}
            </div>
          </div>
          <div className="relative text-body text-ink/80">
            <span className="block font-medium text-ink">{name}</span>
            {role}
          </div>
        </div>

        <figure className={cn('flex flex-col justify-center rounded-card p-8 sm:p-15', palette.wash)}>
          {/*
            An oversized opening mark gives the block the mass the panel height needs — a quote
            alone, centred in 520, left the panel empty. It stands in for the inline quotation
            marks rather than doubling them.

            The gap under it is set by measurement, not by the box model. The mark's ink fills only
            the top third of its line box, and the quote carries its own half-leading above the
            first line, so the two boxes touching still left 102px of visible space. Tightening the
            line box to 0.34 and pulling the quote up 16px brings the ink-to-ink gap to 31px.
          */}
          <span
            aria-hidden="true"
            className={cn('block font-display text-[100px] leading-[0.34] lg:text-[140px]', palette.mark)}
          >
            &ldquo;
          </span>
          <blockquote className="-mt-4 font-sans text-[clamp(1.375rem,1rem+1.1vw,1.6875rem)] leading-[1.6] font-medium text-ink">
            {quote}
          </blockquote>
        </figure>
      </div>
    </Section>
  );
}

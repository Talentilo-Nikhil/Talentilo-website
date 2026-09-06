import Link from 'next/link';

import { FigmaImage } from '@/components/ui/Creative';
import { Section } from '@/components/ui/Section';
import type { figmaImages } from '@/data/images';
import { cn } from '@/lib/cn';

type TestimonialProps = {
  quote: string;
  name: string;
  role: string;
  avatarHash: keyof typeof figmaImages;
  /** Each audience page pairs the card with its own tinted/solid colour pair. */
  tone?: 'azure' | 'crusta';
  /** A result this customer saw. Rendered only when the page has a real one to give. */
  stat?: { figure: string; label: string };
  /** The full story behind the quote. Rendered only when the page has somewhere to point. */
  link?: { label: string; href: string };
};

/**
 * Each audience page takes one hue across both panels: the portrait sits on the 100 step, the
 * quote on the 50 above it, and the mark between them is the solid. A white quote card read as a
 * plain surface parked beside a coloured one; on the same ramp the two halves read as one section.
 */
const TONE = {
  azure: { tint: 'bg-azure-100', wash: 'bg-azure-50', mark: 'text-azure-400' },
  crusta: { tint: 'bg-crusta-100', wash: 'bg-crusta-50', mark: 'text-crusta-400' },
} as const;

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
 * Two panels: the person on one side and what they said on the other. The right half used to be a
 * flat colour block with `aria-hidden` on it — a quarter of the section's width carrying nothing —
 * so the portrait moved out of the caption, where it was a 70px thumbnail, and became the other
 * half of the composition.
 *
 * The photograph is 112px square at source, so it is presented at that size rather than blown up:
 * the mark behind it supplies the scale the panel needs and the face stays sharp.
 */
export function Testimonial({
  quote,
  name,
  role,
  avatarHash,
  tone = 'azure',
  stat,
  link,
}: TestimonialProps) {
  const palette = TONE[tone];

  return (
    <Section padding="normal">
      {/*
        47/53 rather than 40/60. The wider portrait panel gives the photograph a squarer footprint
        to sit in, and narrowing the quote panel pulls the pull quote from three lines onto four,
        which is a measure the eye tracks better and which fills the card instead of stranding it.
      */}
      <div className="grid gap-4 lg:grid-cols-[minmax(0,0.94fr)_minmax(0,1.06fr)]">
        <div
          className={cn(
            'relative flex min-h-[420px] flex-col justify-between overflow-hidden rounded-card p-8 sm:p-10 lg:min-h-[520px]',
            palette.tint
          )}
        >
          <div className="relative flex flex-1 items-center justify-center pb-10">
            <PortraitMark tone={tone} className={cn('absolute size-[280px] max-w-full lg:size-[344px]', palette.mark)} />
            <div className="relative size-28 overflow-hidden rounded-full ring-4 ring-white">
              <FigmaImage hash={avatarHash} alt="" />
            </div>
          </div>
          <div className="relative text-body text-ink/80">
            <span className="block font-medium text-ink">{name}</span>
            {role}
          </div>
        </div>

        <figure
          className={cn(
            'flex flex-col gap-10 rounded-card p-8 sm:p-15',
            palette.wash,
            stat || link ? 'justify-between' : 'justify-center'
          )}
        >
          <div>
            {/*
              At the panel height Talentilo asked for, a centred quote alone left the card empty —
              the reference fills its own with a client logo, a case-study link and a stat, none of
              which we have. An oversized opening mark gives the block the mass that height needs.
              It replaces the inline quotation marks rather than doubling them.
            */}
            <span
              aria-hidden="true"
              className={cn(
                'block font-display text-[100px] leading-[0.72] lg:text-[140px]',
                palette.mark
              )}
            >
              &ldquo;
            </span>
            <blockquote className="mt-7 font-sans text-[clamp(1.375rem,1rem+1.1vw,1.6875rem)] leading-[1.6] font-medium text-ink">
              {quote}
            </blockquote>
          </div>

          {stat || link ? (
            <figcaption className="flex flex-col gap-8">
              {link ? (
                <Link
                  href={link.href}
                  className="inline-flex w-fit items-center gap-2 text-body font-semibold text-ink
                             underline-offset-4 transition-colors hover:text-azure-700 hover:underline"
                >
                  {link.label}
                  <span aria-hidden="true">&rarr;</span>
                </Link>
              ) : null}

              {stat ? (
                <div className="flex items-baseline gap-4">
                  <span className="font-figure text-[2.5rem] leading-none font-semibold text-ink">
                    {stat.figure}
                  </span>
                  <span className="max-w-[220px] text-small text-ink/70">{stat.label}</span>
                </div>
              ) : null}
            </figcaption>
          ) : null}
        </figure>
      </div>
    </Section>
  );
}

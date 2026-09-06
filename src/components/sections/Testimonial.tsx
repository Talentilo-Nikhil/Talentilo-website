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
 * The rotated squircle the portrait sits on, in the tone's solid colour.
 *
 * The backdrop of every creative on the site is a grid of squares turned 45°, so the panel borrows
 * that motif rather than importing a shape language from somewhere else: one large rounded square
 * off its axis, with four small ones on its faces.
 *
 * The small squares sit ±54 from the centre on each diagonal, which is the band that clears the
 * portrait and its ring (69 units) while staying inside the rotated square (88 in its own frame).
 * On the axis points they collided with the portrait on two sides and not the other two, which
 * read as a mistake rather than as a pattern.
 */
function PortraitMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 260 260" className={className} aria-hidden="true">
      <rect
        x="42"
        y="42"
        width="176"
        height="176"
        rx="48"
        transform="rotate(45 130 130)"
        fill="currentColor"
      />
      <g fill="#ffffff" opacity="0.55">
        <rect x="71.5" y="71.5" width="9" height="9" rx="2.5" />
        <rect x="179.5" y="71.5" width="9" height="9" rx="2.5" />
        <rect x="71.5" y="179.5" width="9" height="9" rx="2.5" />
        <rect x="179.5" y="179.5" width="9" height="9" rx="2.5" />
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
            <PortraitMark className={cn('absolute size-[280px] max-w-full lg:size-[344px]', palette.mark)} />
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

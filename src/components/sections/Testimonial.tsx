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
};

const TONE = {
  azure: { tint: 'bg-azure-100', solid: 'bg-azure-400' },
  crusta: { tint: 'bg-crusta-100', solid: 'bg-crusta-400' },
} as const;

/**
 * The pull quote the audience pages open with: a tinted card with the quote and author on one
 * side, and a flat colour block — no photo, per the file — filling the other.
 */
export function Testimonial({ quote, name, role, avatarHash, tone = 'azure' }: TestimonialProps) {
  const palette = TONE[tone];

  return (
    <Section padding="normal">
      <div className="grid gap-4 lg:grid-cols-2">
        <figure
          className={cn(
            'flex flex-col justify-between gap-10 rounded-card p-8 sm:p-15',
            palette.tint
          )}
        >
          <blockquote className="font-sans text-[clamp(1.375rem,1rem+1.5vw,2.0625rem)] leading-[1.6] font-medium text-ink">
            &ldquo;{quote}&rdquo;
          </blockquote>
          <figcaption className="flex flex-col gap-4">
            <div className="size-[70px] overflow-hidden rounded-full">
              <FigmaImage hash={avatarHash} alt="" />
            </div>
            <div className="text-body text-ink/80">
              <span className="block font-medium text-ink">{name}</span>
              {role}
            </div>
          </figcaption>
        </figure>
        <div aria-hidden="true" className={cn('min-h-[240px] rounded-card lg:min-h-0', palette.solid)} />
      </div>
    </Section>
  );
}

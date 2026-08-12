import { ButtonLink } from '@/components/ui/Button';
import { Creative } from '@/components/ui/Creative';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';
import type { CreativeName } from '@/data/creatives';
import { cn } from '@/lib/cn';

export type FeatureSplitProps = {
  id?: string;
  title: string;
  body: string;
  points: string[];
  cta?: { label: string; href: string };
  creative: CreativeName;
  /** Alt text for the artwork; pass '' when a nearby caption already describes it. */
  creativeAlt?: string;
  /** Which side the artwork sits on at desktop width. */
  media?: 'left' | 'right';
  tone?: 'light' | 'dark';
  padding?: 'normal' | 'loose';
};

/**
 * The copy-and-artwork row the product story is told in. Below `lg` the two columns stack with
 * the copy first, so the reading order stays the same no matter which side the art is on.
 */
export function FeatureSplit({
  id,
  title,
  body,
  points,
  cta,
  creative,
  creativeAlt,
  media = 'right',
  tone = 'light',
  padding = 'normal',
}: FeatureSplitProps) {
  const dark = tone === 'dark';

  return (
    <Section id={id} tone={tone} padding={padding}>
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-x-split">
        <Reveal className={cn('flex flex-col gap-6', media === 'left' && 'lg:order-2')}>
          <h2
            className={cn(
              'max-w-[605px] text-[clamp(2rem,1.35rem+2.7vw,3.25rem)] whitespace-pre-line',
              dark ? 'text-white' : 'text-ink'
            )}
          >
            {title}
          </h2>

          <p className={cn('max-w-[549px] text-body', dark ? 'text-white/85' : 'text-ink/85')}>{body}</p>

          <ul
            className={cn(
              'ml-1 flex list-disc flex-col gap-0 pl-5 text-body',
              dark ? 'text-white/85 marker:text-white/50' : 'text-ink/85 marker:text-ink/40'
            )}
          >
            {points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>

          {cta ? (
            <div className="mt-4">
              <ButtonLink href={cta.href} variant={dark ? 'light' : 'dark'}>
                {cta.label}
              </ButtonLink>
            </div>
          ) : null}
        </Reveal>

        <Reveal
          delay={80}
          className={cn('overflow-hidden rounded-card', media === 'left' && 'lg:order-1')}
        >
          <Creative name={creative} alt={creativeAlt} sizes="(min-width: 1024px) 588px, 100vw" />
        </Reveal>
      </div>
    </Section>
  );
}

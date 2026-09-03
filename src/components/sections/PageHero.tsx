import type { ReactNode } from 'react';

import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Creative } from '@/components/ui/Creative';
import { creatives, type CreativeName } from '@/data/creatives';
import { cn } from '@/lib/cn';

type PageHeroProps = {
  /** The small caps kicker above the headline, e.g. "Real-Time Velocity". */
  eyebrow?: ReactNode;
  title: ReactNode;
  lede: ReactNode;
  cta?: { label: string; href: string };
  /**
   * Where the action sits. `above` puts it between the lede and the artwork; `overlay` floats it
   * over the artwork's bottom edge, the way the Recruitment OS hero draws it.
   */
  ctaPlacement?: 'above' | 'overlay';
  /** The small line under the fold, e.g. "Powered by the Agency Velocity Index (AVI)". */
  note?: string;
  creative?: CreativeName;
  creativeAlt?: string;
  /** A hand-built panel in place of an exported creative. Takes precedence over `creative`. */
  media?: ReactNode;
  /**
   * `brand` is the gradient wash the two Figma product pages sit on; `dark` is the ink field the
   * Platform pages use; `none` is a white field.
   */
  wash?: 'brand' | 'dark' | 'none';
  /**
   * Fraction of the artwork the band shows before clipping it, matching designs where the
   * mockup runs off the bottom edge. 1 shows the whole thing.
   */
  reveal?: number;
  /** Absolutely positioned over the artwork, scaled with it — for detail the export dropped. */
  overlay?: ReactNode;
};

/**
 * The top of every inner page: centred headline, lede, one action, and the product artwork
 * bleeding off the bottom of a gradient band.
 */
export function PageHero({
  eyebrow,
  title,
  lede,
  cta,
  ctaPlacement = 'above',
  note,
  creative,
  creativeAlt,
  media,
  wash = 'none',
  reveal = 1,
  overlay,
}: PageHeroProps) {
  const dark = wash === 'dark';
  // Hold the artwork to the width it occupies in the 1440 frame so the band shows either side.
  const asset = creative ? creatives[creative] : null;
  const maxWidth = asset ? `${asset.designWidth}px` : undefined;
  // A percentage padding-top on an empty box reproduces the artwork's aspect ratio, scaled by
  // `reveal`, so the clip holds at every width instead of only at 1440.
  const aspect = asset ? `${((asset.designHeight / asset.designWidth) * reveal * 100).toFixed(3)}%` : undefined;
  // A raster mockup bleeds off the bottom edge, the way the Figma heroes draw it. A hand-built
  // panel is content, so it keeps the band's normal bottom padding and stays whole.
  const bleeds = Boolean(creative) && !media;

  return (
    <section
      className={cn(
        'relative overflow-hidden pt-14 md:pt-16 lg:pt-20',
        bleeds ? 'pb-0' : 'pb-14 md:pb-16 lg:pb-20',
        dark && 'bg-ink'
      )}
      style={wash === 'brand' ? { backgroundImage: 'var(--gradient-brand-vertical)' } : undefined}
    >
      <Container>
        <div className="flex flex-col items-center gap-6 text-center">
          {eyebrow ? (
            <p
              className={cn(
                'font-sans text-small font-medium tracking-[0.08em] uppercase',
                dark ? 'text-brand-violet' : 'text-muted'
              )}
            >
              {eyebrow}
            </p>
          ) : null}

          <h1
            className={cn(
              'max-w-[950px] text-[clamp(2.25rem,1.35rem+3.9vw,4.0625rem)] whitespace-pre-line',
              dark ? 'text-white' : 'text-ink'
            )}
          >
            {title}
          </h1>

          <p className={cn('max-w-[900px] text-body', dark ? 'text-white/85' : 'text-ink/85')}>{lede}</p>

          {cta && ctaPlacement === 'above' ? (
            <div className="mt-4">
              <ButtonLink href={cta.href} variant={dark ? 'light' : 'dark'}>
                {cta.label}
              </ButtonLink>
            </div>
          ) : null}

          {note ? (
            <p className={cn('pt-2 text-small', dark ? 'text-white/70' : 'text-ink/80')}>{note}</p>
          ) : null}
        </div>

        {media ? (
          <div className="mt-10 lg:mt-12">{media}</div>
        ) : creative ? (
          <div className="mt-10 lg:mt-12">
            <div style={{ maxWidth }} className="relative mx-auto overflow-hidden rounded-t-card">
              {reveal < 1 ? <div style={{ paddingTop: aspect }} aria-hidden="true" /> : null}
              <div className={reveal < 1 ? 'absolute inset-x-0 top-0' : undefined}>
                <Creative
                  name={creative}
                  alt={creativeAlt}
                  priority
                  sizes={`(min-width: 1440px) ${maxWidth}, 100vw`}
                />
              </div>
              {overlay ? (
                <div aria-hidden="true" className="absolute inset-0">
                  {overlay}
                </div>
              ) : null}
            </div>
          </div>
        ) : null}

        {cta && ctaPlacement === 'overlay' ? (
          // The band runs to the button when the artwork bleeds, so the padding that would have
          // closed the section has to sit under the button instead.
          <div className="relative z-10 -mt-6 flex justify-center pb-10 md:-mt-7 md:pb-12 lg:pb-14">
            <ButtonLink href={cta.href} variant="dark">
              {cta.label}
            </ButtonLink>
          </div>
        ) : null}
      </Container>
    </section>
  );
}

import type { ReactNode } from 'react';

import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Creative } from '@/components/ui/Creative';
import { creatives, type CreativeName } from '@/data/creatives';
import { cn } from '@/lib/cn';

type PageHeroProps = {
  title: ReactNode;
  lede: ReactNode;
  cta?: { label: string; href: string };
  /** The small line under the fold, e.g. "Powered by the Agency Velocity Index (AVI)". */
  note?: string;
  creative?: CreativeName;
  creativeAlt?: string;
  /** Only the two product pages sit on the brand wash; every other hero is a white field. */
  wash?: 'brand' | 'none';
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
  title,
  lede,
  cta,
  note,
  creative,
  creativeAlt,
  wash = 'none',
  reveal = 1,
  overlay,
}: PageHeroProps) {
  // Hold the artwork to the width it occupies in the 1440 frame so the band shows either side.
  const asset = creative ? creatives[creative] : null;
  const maxWidth = asset ? `${asset.designWidth}px` : undefined;
  // A percentage padding-top on an empty box reproduces the artwork's aspect ratio, scaled by
  // `reveal`, so the clip holds at every width instead of only at 1440.
  const aspect = asset ? `${((asset.designHeight / asset.designWidth) * reveal * 100).toFixed(3)}%` : undefined;
  return (
    <section
      className={cn(
        'relative overflow-hidden pt-14 md:pt-16 lg:pt-20',
        creative ? 'pb-0' : 'pb-14 md:pb-16 lg:pb-20'
      )}
      style={wash === 'brand' ? { backgroundImage: 'var(--gradient-brand-vertical)' } : undefined}
    >
      <Container>
        <div className="flex flex-col items-center gap-6 text-center">
          <h1 className="max-w-[950px] text-[clamp(2.25rem,1.35rem+3.9vw,4.0625rem)] text-ink">{title}</h1>
          <p className="max-w-[900px] text-body text-ink/85">{lede}</p>
          {cta ? (
            <div className="mt-4">
              <ButtonLink href={cta.href} variant="dark">
                {cta.label}
              </ButtonLink>
            </div>
          ) : null}
          {note ? <p className="pt-2 text-small text-ink/80">{note}</p> : null}
        </div>

        {creative ? (
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
      </Container>
    </section>
  );
}

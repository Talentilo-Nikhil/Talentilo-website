import type { ReactNode } from 'react';

import { ButtonLink } from '@/components/ui/Button';
import { Creative } from '@/components/ui/Creative';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import type { CreativeName } from '@/data/creatives';
import { cn } from '@/lib/cn';

type CenteredFeatureProps = {
  id?: string;
  /** The small caps kicker above the heading, e.g. "Universal Parser". */
  eyebrow?: ReactNode;
  title: ReactNode;
  lede?: ReactNode;
  /** The short emphasis line that closes the copy, e.g. "Ghosting isn't sudden. It's a pattern." */
  pullQuote?: string;
  creative?: CreativeName;
  creativeAlt?: string;
  /** A custom full-width panel in place of an exported creative, e.g. a flat colour block. */
  media?: ReactNode;
  cta?: { label: string; href: string };
  tone?: 'light' | 'mint' | 'dark';
  children?: ReactNode;
};

/** Heading and lede centred over full-width artwork, with the action underneath. */
export function CenteredFeature({
  id,
  eyebrow,
  title,
  lede,
  pullQuote,
  creative,
  creativeAlt,
  media,
  cta,
  tone = 'light',
  children,
}: CenteredFeatureProps) {
  const dark = tone === 'dark';

  return (
    <Section id={id} tone={tone}>
      <SectionHeading
        eyebrow={eyebrow}
        title={title}
        lede={lede}
        tone={dark ? 'dark' : tone === 'mint' ? 'mint' : 'light'}
      />

      {pullQuote ? (
        <p
          className={cn(
            'mx-auto mt-6 max-w-[42rem] text-center text-lede font-medium',
            dark ? 'text-white' : 'text-ink'
          )}
        >
          {pullQuote}
        </p>
      ) : null}

      {children}

      {media ? (
        <div className="mt-10 overflow-hidden rounded-card">{media}</div>
      ) : creative ? (
        <div className="mt-10 overflow-hidden rounded-card">
          <Creative name={creative} alt={creativeAlt} sizes="(min-width: 1440px) 1312px, 100vw" />
        </div>
      ) : null}

      {cta ? (
        <div className="mt-10 flex justify-center">
          <ButtonLink href={cta.href} variant={tone === 'dark' ? 'light' : 'dark'}>
            {cta.label}
          </ButtonLink>
        </div>
      ) : null}
    </Section>
  );
}

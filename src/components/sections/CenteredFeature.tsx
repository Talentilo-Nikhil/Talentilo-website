import type { ReactNode } from 'react';

import { ButtonLink } from '@/components/ui/Button';
import { Creative } from '@/components/ui/Creative';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import type { CreativeName } from '@/data/creatives';

type CenteredFeatureProps = {
  id?: string;
  title: ReactNode;
  lede?: ReactNode;
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
  title,
  lede,
  creative,
  creativeAlt,
  media,
  cta,
  tone = 'light',
  children,
}: CenteredFeatureProps) {
  return (
    <Section id={id} tone={tone}>
      <SectionHeading title={title} lede={lede} tone={tone === 'dark' ? 'dark' : 'light'} />

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

import type { ReactNode } from 'react';

import { ButtonLink } from '@/components/ui/Button';
import { Creative } from '@/components/ui/Creative';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import type { CreativeName } from '@/data/creatives';

type CenteredFeatureProps = {
  id?: string;
  title: ReactNode;
  lede?: ReactNode;
  creative?: CreativeName;
  creativeAlt?: string;
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
  cta,
  tone = 'light',
  children,
}: CenteredFeatureProps) {
  return (
    <Section id={id} tone={tone}>
      <SectionHeading title={title} lede={lede} tone={tone === 'dark' ? 'dark' : 'light'} />

      {children}

      {creative ? (
        <Reveal delay={80} className="mt-10 overflow-hidden rounded-card">
          <Creative name={creative} alt={creativeAlt} sizes="(min-width: 1440px) 1312px, 100vw" />
        </Reveal>
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

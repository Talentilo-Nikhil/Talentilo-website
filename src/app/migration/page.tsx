import type { Metadata } from 'next';

import { CtaCentered } from '@/components/sections/CtaCentered';
import { PageHero } from '@/components/sections/PageHero';
import { ButtonLink } from '@/components/ui/Button';
import { Creative } from '@/components/ui/Creative';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';

export const metadata: Metadata = {
  title: 'Migration',
  description:
    'Move off Bullhorn, Zoho Recruit or a legacy tracker with 100% data fidelity and zero downtime. Every field, tag and stage history survives the switch.',
  alternates: { canonical: '/migration' },
};

const paths = [
  {
    title: 'Switch from Bullhorn',
    pain: 'Tired of the clunky interface and endless plugin costs? Bullhorn is a static database. Talentilo is an active engine.',
    benefit: 'Modernize your workflow without losing a decade of relationship data.',
    cta: 'Map Your Bullhorn Data',
    creative: 'mg-card-bullhorn',
  },
  {
    title: 'Switch from Zoho',
    pain: 'Outgrown the "Small Biz" limitations? Stop building workarounds for a system that can\'t scale with your agency.',
    benefit: 'Keep your operational simplicity, but gain Enterprise AI leverage.',
    cta: 'Map Your Zoho Data',
    creative: 'mg-card-zoho',
  },
] as const;

export default function MigrationPage() {
  return (
    <>
      <PageHero
        title="Move Without The Data Headache"
        lede="Fear of data loss shouldn't keep you held hostage by legacy software. We guarantee 100% fidelity. Your relationships move with you, with Zero Downtime for your team."
        cta={{ label: 'Plan Your Switch', href: '/contact' }}
        note="100% Data Integrity Guarantee"
        creative="mg-transfer"
      />

      <Section>
        <SectionHeading
          title={'Upgrade From a Tool\nto an Operating System.'}
          lede="Whether you Switch from Bullhorn or Switch from Zoho Recruit, we make it as easy as switching a tab on your browser. Stop paying for legacy limits."
        />

        <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:gap-25">
          {paths.map((path) => (
            <div key={path.title} className="flex flex-col gap-10 rounded-card border border-hairline p-6">
              <Creative name={path.creative} sizes="(min-width: 1024px) 480px, 100vw" />
              <div className="flex flex-1 flex-col gap-6">
                <h2 className="font-sans text-[clamp(1.75rem,1.3rem+1.8vw,2.75rem)] font-medium text-ink">
                  {path.title}
                </h2>
                <p className="text-body text-ink/85">
                  <strong className="font-semibold">Pain:</strong> {path.pain}
                </p>
                <p className="text-body text-ink/85">
                  <strong className="font-semibold">Benefit:</strong> {path.benefit}
                </p>
                <div className="mt-auto pt-2">
                  <ButtonLink href="/contact" variant="outline">
                    {path.cta}
                  </ButtonLink>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <div className="grid items-center gap-12 lg:grid-cols-[456px_1fr] lg:gap-15">
          <div className="flex flex-col gap-6">
            <SectionHeading
              align="left"
              title="We Speak Your Data's Language."
              lede="Most Data Migration Services fail because they force you to fit their rigid template. Talentilo fits yours."
            />
            <div>
              <p className="font-sans text-h5 font-semibold text-ink">Workflow inside our OS</p>
              <p className="mt-2 text-body text-ink/85">
                Talentilo reads fields, specific tags, and weird formatting—and reconstructs your exact
                workflow inside our OS.
              </p>
            </div>
            <div className="mt-2">
              <ButtonLink href="/contact" variant="dark">
                Plan Your Safe Switch
              </ButtonLink>
            </div>
          </div>

          <div className="overflow-hidden rounded-card">
            <Creative name="mg-terminal" sizes="(min-width: 1024px) 796px, 100vw" />
          </div>
        </div>
      </Section>

      <CtaCentered
        title={'Don’t Let Fear of Switching\nStall Your Growth.'}
        cta={{ label: "Let's Talk Integration", href: '/contact' }}
        note="Zero downtime. Zero data loss."
      />
    </>
  );
}

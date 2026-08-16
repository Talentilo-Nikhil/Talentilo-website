import type { Metadata } from 'next';

import { CtaPhoto } from '@/components/sections/CtaPhoto';
import { PageHero } from '@/components/sections/PageHero';
import { ButtonLink } from '@/components/ui/Button';
import { Creative } from '@/components/ui/Creative';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';

/**
 * The file routes each "Old ATS" row into the Talentilo OS card with a dashed connector — but
 * those are Figma CONNECTOR nodes, which the offline exporter can't rasterize, so they're absent
 * from the exported artwork. Redrawn here at the file's own coordinates (a 1312x560 canvas)
 * rather than left blank.
 */
function TransferConnectors() {
  return (
    <svg viewBox="0 0 1312 560" className="size-full" fill="none">
      <path d="M440,234 C584,234 584,313 728,313" stroke="#c3cad4" strokeWidth="1.5" strokeDasharray="4 4" strokeLinecap="round" />
      <path d="M440,313 L728,313" stroke="#c3cad4" strokeWidth="1.5" strokeDasharray="4 4" strokeLinecap="round" />
      <path d="M440,392 C584,392 584,313 728,313" stroke="#c3cad4" strokeWidth="1.5" strokeDasharray="4 4" strokeLinecap="round" />
      <circle cx="440" cy="234" r="3" fill="#c3cad4" />
      <circle cx="440" cy="313" r="3" fill="#c3cad4" />
      <circle cx="440" cy="392" r="3" fill="#c3cad4" />
      <circle cx="728" cy="313" r="5" fill="#fdfcff" stroke="#c3cad4" strokeWidth="1.5" />
    </svg>
  );
}

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
        overlay={<TransferConnectors />}
      />

      <Section>
        <SectionHeading
          title={'Upgrade From a Tool\nto an Operating System.'}
          lede="Whether you Switch from Bullhorn or Switch from Zoho Recruit, we make it as easy as switching a tab on your browser. Stop paying for legacy limits."
        />

        <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:gap-25">
          {paths.map((path) => (
            <div key={path.title} className="flex flex-col gap-10 p-6">
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

      <Section padding="tight">
        <div className="flex flex-col gap-10 rounded-card bg-ink p-8 lg:flex-row lg:items-center lg:justify-between lg:p-20">
          <h2 className="max-w-[701px] font-sans text-[clamp(1.75rem,1.3rem+1.8vw,2.75rem)] font-medium text-white">
            Your Workflow Survives The Move.
          </h2>
          <ButtonLink href="/contact" variant="light" className="self-start lg:self-auto">
            Get started
          </ButtonLink>
        </div>
      </Section>

      <Section>
        <div className="flex flex-col gap-12">
          <div className="flex flex-col gap-6">
            <SectionHeading align="left" title="We Speak Your Data's Language." />
            <div>
              <ButtonLink href="/contact" variant="dark">
                Plan Your Safe Switch
              </ButtonLink>
            </div>
          </div>

          <div className="grid items-start gap-12 lg:grid-cols-[456px_1fr] lg:gap-15">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4 border-b border-crusta-200 pb-6">
                <p className="font-sans text-h5 font-semibold text-ink">Data Migration</p>
                <p className="text-body text-ink/85">
                  Most Data Migration Services fail because they force you to fit their rigid
                  template. Talentilo fits yours.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <p className="font-sans text-h5 font-semibold text-ink">Workflow inside our OS</p>
                <p className="text-body text-ink/85">
                  Talentilo reads fields, specific tags, and weird formatting—and reconstructs your
                  exact workflow inside our OS.
                </p>
              </div>
            </div>

            <div className="overflow-hidden rounded-card">
              <Creative name="mg-terminal" sizes="(min-width: 1024px) 796px, 100vw" />
            </div>
          </div>
        </div>
      </Section>

      <CtaPhoto
        title={'Don’t Let Fear of Switching\nStall Your Growth.'}
        lede="Get a free Data Migration Assessment before you commit."
        cta={{ label: "Let's Talk Integration", href: '/contact' }}
        note="Zero downtime. Zero data loss."
        imageHash="314902fc64e8d97d98ed5a69c66ff248b822ec2e"
      />
    </>
  );
}

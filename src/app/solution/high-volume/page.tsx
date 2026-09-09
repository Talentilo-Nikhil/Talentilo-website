import type { Metadata } from 'next';
import Link from 'next/link';

import { CtaBanner } from '@/components/sections/CtaBanner';
import { FeatureSplit } from '@/components/sections/FeatureSplit';
import { PageHero } from '@/components/sections/PageHero';
import { StatGrid } from '@/components/sections/StatGrid';
import { ButtonLink } from '@/components/ui/Button';
import { Creative } from '@/components/ui/Creative';
import { JsonLd } from '@/components/ui/JsonLd';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { companyStats } from '@/data/stats';
import { serviceSchema } from '@/lib/json-ld';

const PAGE_DESCRIPTION =
  'Talentilo is high-volume hiring software that engages, screens and qualifies thousands of applicants at once — without losing the candidate experience.';
const PAGE_PATH = '/solution/high-volume';

export const metadata: Metadata = {
  title: 'High Volume Hiring Software',
  description: PAGE_DESCRIPTION,
  alternates: { canonical: PAGE_PATH },
};

export default function HighVolumePage() {
  return (
    <>
      <JsonLd
        data={serviceSchema({
          name: 'Talentilo High Volume Hiring Software',
          description: PAGE_DESCRIPTION,
          path: PAGE_PATH,
          serviceType: 'High-volume recruitment software',
        })}
      />

      <PageHero
        title="Hire at Scale Without Losing the Human Touch"
        lede="Usually, when volume goes up, candidate experience goes down. Talentilo breaks that trade-off. Our Mass Hiring Software allows you to engage, screen, and qualify thousands of applicants simultaneously—giving every single candidate a responsive, human-grade experience, no matter the volume."
        cta={{ label: 'Scale Without Chaos', href: '/contact' }}
      />

      <FeatureSplit
        title="Filter Less, Engage More"
        body="High-volume recruitment usually means high-volume rejection. Great talent is lost in the pile. Talentilo changes the logic. We use AI Voice Agents to actually talk to candidates at scale, verifying interest and fit in real-time. Don't just fill seats; fill them with the right people."
        points={[]}
        cta={{ label: 'Get Started', href: '/contact' }}
        creative="hv-engaging"
        mediaSide="left"
      />

      <FeatureSplit
        title="The Always-On Recruiting Team"
        body="When a campaign launches, 500 applications might hit your inbox overnight. Humans can't handle that spike. Your AI Multiple can. It instantly greets and engages every applicant, answering questions and building rapport while your competitors are sleeping."
        points={[]}
        cta={{ label: 'Get Started', href: '/contact' }}
        aside={
          <p className="text-small text-ink/80">
            The same voice and messaging automation drives{' '}
            <Link
              href="/platform/ai-powers"
              className="underline underline-offset-4 hover:text-brand-blue"
            >
              AI candidate screening
            </Link>{' '}
            across the platform.
          </p>
        }
        creative="hv-always-on"
        mediaSide="left"
      />

      <Section>
        <SectionHeading
          title="500 Messages. 500 Personal Conversations. One Click"
          lede="Speed is the only currency but spamming kills your brand. Talentilo engages your pool with context. It starts 2-way conversations. 'Hi Sam, a [role] opened near [Sam's City] matching your [Sam's Skill]'. Turn a broadcast into a 1:1 chat, instantly."
        />
        {/* The design sets the panel at 950 of the 1312 content width, so it stays narrower than
            the heading above it and the proof row below. It carries 12px labels, which a phone
            reduces past reading, so it keeps the tap-to-enlarge control. */}
        <div className="mx-auto mt-12 max-w-[950px]">
          <Creative name="hv-broadcast" zoom sizes="(min-width: 1024px) 950px, 100vw" />
        </div>

        <div className="mt-15">
          <StatGrid stats={companyStats} />
        </div>
        <div className="mt-10 flex flex-col items-center gap-4">
          <ButtonLink href="/contact" variant="dark">
            See the Dashboard Live
          </ButtonLink>
          <p className="text-small text-ink/80">
            Hiring engineers rather than at volume? See{' '}
            <Link
              href="/solution/tech-recruitment"
              className="underline underline-offset-4 hover:text-brand-blue"
            >
              tech recruitment
            </Link>
            .
          </p>
        </div>
      </Section>

      <CtaBanner
        title="Fill Seats with People Who Want to Stay"
        cta={{ label: 'See the Difference', href: '/contact' }}
        imageHash="6c652468288e770c845ef5aa877e4ead5e6b85db"
      />
    </>
  );
}

import type { Metadata } from 'next';

import { CtaBanner } from '@/components/sections/CtaBanner';
import { FeatureSplit } from '@/components/sections/FeatureSplit';
import { LogoStrip } from '@/components/sections/LogoStrip';
import { PageHero } from '@/components/sections/PageHero';
import { StatGrid, type Stat } from '@/components/sections/StatGrid';
import { Testimonial } from '@/components/sections/Testimonial';
import { Section } from '@/components/ui/Section';

export const metadata: Metadata = {
  title: 'For Agency Owners',
  description:
    'The headcount trap kills agency margins. Talentilo uses AI leverage to help your existing team bill 3x more, without adding seats.',
  alternates: { canonical: '/for/agency-owner' },
};

const clients = [
  { name: 'logo-bell', label: 'Bell' },
  { name: 'logo-asana', label: 'Asana' },
  { name: 'logo-sap', label: 'SAP' },
  { name: 'logo-salesforce', label: 'Salesforce' },
  { name: 'logo-notion', label: 'Notion' },
] as const;

const stats: Stat[] = [
  { figure: '2.4 more', headline: 'accurate', detail: 'community- and expert-built templates' },
  { figure: '97%', headline: 'preferred', detail: 'community- and expert-built templates' },
  { figure: '100m+', headline: 'sources', detail: 'integrations with technology partners' },
];

export default function AgencyOwnerPage() {
  return (
    <>
      <PageHero
        title="Scale Revenue. Not Just The Headcount"
        lede="The 'Headcount Trap' kills agency margins. You hire more recruiters to get more billings, but your profits stay flat. Talentilo is the Agency Management Software that breaks the cycle—using AI Leverage to help your existing team bill 3x more"
        cta={{ label: 'Calculate EBITDA Impact', href: '/pricing#roi' }}
      />

      <Testimonial
        quote="Talentilo.ai had everything we needed to build a stunning website in no time. The attention to detail in this product is simply remarkable."
        name="Paula Bennett"
        role="VP of Product Development, Morance"
        avatarHash="da416245e6c0008541ebbaee04a05405e58598b7"
        tone="azure"
      />

      <LogoStrip title="Trusted by industry leaders and developers worldwide" logos={[...clients]} />

      <FeatureSplit
        title={'Don’t Just Rely on "Superstar" Recruiters'}
        body="When a top biller leaves, do they take your business with them? Not if you Scale Recruitment Agency processes with an OS. Talentilo institutionalizes the workflow. The intelligence sits in the software, not just in the recruiter's head"
        points={[]}
        creative="ao-superstar"
      />

      <FeatureSplit
        title={'Increase Profit Margins\nUp to 30%'}
        body="Most agencies run at 10-15% margins. A Profitable Staffing Model requires leverage. By automating the admin and defense layers, Talentilo increases your 'Revenue per Seat' efficiency, driving your bottom line straight up"
        points={[]}
        creative="ao-margins"
        mediaSide="left"
      />

      <Section tone="none" className="bg-[#f3f2fe]">
        <StatGrid stats={stats} />
      </Section>

      <CtaBanner
        title="Build a Recruitment Engine That Lasts"
        cta={{ label: 'Take the Demo', href: '/contact' }}
      />
    </>
  );
}

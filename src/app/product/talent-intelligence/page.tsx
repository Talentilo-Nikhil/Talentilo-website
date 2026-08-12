import type { Metadata } from 'next';

import { CenteredFeature } from '@/components/sections/CenteredFeature';
import { CtaCentered } from '@/components/sections/CtaCentered';
import { FeatureSplit } from '@/components/sections/FeatureSplit';
import { PageHero } from '@/components/sections/PageHero';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';

export const metadata: Metadata = {
  title: 'Talent Intelligence',
  description:
    'Our Semantic Engine reads your job descriptions like a human and surfaces the best matches already in your database — before you spend a rupee on new job ads.',
  alternates: { canonical: '/product/talent-intelligence' },
};

const parserPoints = [
  'Instant PDF to JSON Mapping',
  'Multi-Language Support',
  'Automatic Deduplication',
];

export default function TalentIntelligencePage() {
  return (
    <>
      <PageHero
        title="Your Next Hire is NOT a Search Away"
        lede="Your ATS is likely a digital graveyard where great talent goes to be forgotten. Our Semantic Engine reads your Job Descriptions like a human and instantly surfaces the best matches from your intelligent database, before you spend a dime on new job ads"
        cta={{ label: 'Rank Your Existing Candidates', href: '/contact' }}
        note="Powered by Contextual Semantic Scoring"
        creative="ti-hero-shapes"
        creativeAlt=""
        wash="brand"
      />

      <CenteredFeature
        title="Why Boolean Logic Fails Modern Recruitment"
        lede="Humans don't speak in rigid keywords, and neither should your software. Talentilo understands that a resume is a career story, not a word cloud. Our engine reads between the lines to connect the dots that exact-match search engines blindly miss"
        creative="ti-boolean"
        cta={{ label: 'Rank Your Existing Candidates', href: '/contact' }}
      />

      <FeatureSplit
        title="Rank Every Candidate by Fit Instead of Frequency"
        body="Bad ATS algorithms simply count how many times a keyword appears. Talentilo scientifically scores the candidate 0-100% based on skills density, career trajectory, and role relevance. Stop wasting time reading the wrong resumes"
        points={[]}
        cta={{ label: 'Get Started', href: '/contact' }}
        creative="ti-ranking"
      />

      <CenteredFeature
        title="Stop Paying to Acquire Talent You Already Own"
        lede="It is the greatest inefficiency in recruitment: spending thousands on LinkedIn to find a candidate who is already in your database. Talentilo’s 'Active Recall' continuously scans your archive against new open roles, ensuring you never pay for the same lead twice"
        creative="ti-recall"
        cta={{ label: 'See the Dashboard Live', href: '/contact' }}
      />

      <Section>
        <div className="grid items-center gap-12 lg:grid-cols-[620px_1fr] lg:gap-[150px]">
          <Reveal>
            <SectionHeading
              align="left"
              title={'The Universal Translator\nfor Talent'}
              lede="PDFs, LinkedIn profiles, and email attachments are unstructured chaos. Our Universal Parser acts as the gateway, stripping formatting and structuring every data point into a clean, uniform profile that the Semantic Engine can actually read"
              className="[&_h2]:whitespace-pre-line"
            />
          </Reveal>
          <Reveal delay={80}>
            <ul className="flex flex-col gap-3">
              {parserPoints.map((point) => (
                <li
                  key={point}
                  className="rounded-card border border-hairline px-6 py-5 text-lede font-semibold text-ink"
                >
                  {point}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Section>

      <CtaCentered
        title="Reveal the Hidden Value in Your Pipeline"
        cta={{ label: 'See how it works', href: '/contact' }}
      />
    </>
  );
}

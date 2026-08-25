import type { Metadata } from 'next';

import { ComparePanel } from '@/components/panels/ComparePanel';
import { Panel } from '@/components/panels/Panel';
import { CenteredFeature } from '@/components/sections/CenteredFeature';
import { CtaCentered } from '@/components/sections/CtaCentered';
import { FeatureSplit } from '@/components/sections/FeatureSplit';
import { PageHero } from '@/components/sections/PageHero';

export const metadata: Metadata = {
  title: 'AI Candidate Sourcing & Resume Parsing Software',
  description:
    'Your ATS is a graveyard where great talent goes to be forgotten. Talentilo reads your job descriptions like a human and finds the best matches already in your database — before you spend on new ads.',
  alternates: { canonical: '/platform/talent-intelligence' },
};

const parserPoints = [
  'Instant PDF to JSON mapping',
  'Structure messy email attachments',
  'Normalize skill taxonomies',
];

export default function TalentIntelligencePage() {
  return (
    <>
      <PageHero
        eyebrow="Contextual Intelligence"
        title={'Your Next Hire is NOT\na Search Away.'}
        lede="Your ATS is likely a graveyard where great talent goes to be forgotten. Talentilo reads your job descriptions like a human and helps you find the best matches from your existing database — before you spend a rupee on new job ads or portals."
        cta={{ label: 'Rank Your Existing Candidates', href: '/contact' }}
        note="Powered by Contextual Semantic Scoring"
        wash="dark"
      />

      <CenteredFeature
        eyebrow="The Problem"
        title={'Why Boolean Logic Fails\nModern Recruitment.'}
        lede="Humans don't speak in rigid keywords, and neither should your software. Talentilo understands that a resume is a career story, not a word cloud. Our engine reads between the lines to connect the dots that exact-match software blindly misses."
        cta={{ label: 'Rank Your Existing Candidates', href: '/contact' }}
        media={
          <ComparePanel
            className="mx-auto max-w-[980px]"
            before={{
              label: 'Legacy way (Boolean)',
              caption: 'Result: missed opportunity',
              items: [
                'Search: "Manager" AND "P&L"',
                'John Doe — Project Lead, Budget Owner',
                '"Manager" keyword missing, so filtered out',
              ],
              badge: 'Failed match',
            }}
            after={{
              label: 'Talentilo way (Semantic)',
              caption: 'Result: true discovery',
              items: [
                'AI inference: "Project Lead" = "Manager"',
                'Budget ownership read as P&L exposure',
                'John Doe surfaced at 94% fit',
              ],
              badge: 'Perfect match',
            }}
          />
        }
      />

      <FeatureSplit
        eyebrow="True Scoring"
        title={'Rank Candidates by Fit\nInstead of Frequency.'}
        body="Bad ATS algorithms simply count how many times a keyword appears. Talentilo scientifically scores each candidate from 0–100% on skills density, career trajectory and role relevance."
        points={[]}
        pullQuote="Don't read 50 resumes. Read the top 5."
        cta={{ label: 'See It In Action', href: '/contact' }}
        creative="ti-ranking"
        mediaSide="left"
      />

      <FeatureSplit
        eyebrow="Intelligent Recall"
        title={'Stop Paying to Acquire\nTalent You Already Own.'}
        body="This is the greatest inefficiency in recruitment: spending thousands on job boards to find a candidate who is already in your database. Talentilo's Active Recall continuously scans your archive against every new open role."
        points={[]}
        pullQuote="Your highest ROI channel is your own history."
        media={
          <ComparePanel
            accent="crusta"
            before={{
              label: 'External search',
              value: '$1,200 / hire',
              items: ['LinkedIn Recruiter — $800', 'Job board ad — $400'],
            }}
            after={{
              label: 'Talentilo Active Recall',
              value: '$0 / hire',
              items: ['Existing data included', 'Recall speed: instant'],
            }}
          />
        }
      />

      <CenteredFeature
        eyebrow="Universal Parser"
        title={'The Universal Translator\nfor Talent Data.'}
        lede="PDFs, DOCX files, LinkedIn profiles and email attachments are unstructured chaos. Our Universal Parser acts as the gateway — stripping formatting and structuring every data point into a clean, uniform profile that Talentilo can read, and that you can understand and edit."
        media={
          <Panel title="Universal Parser" meta="JSON structured" className="mx-auto max-w-[820px]">
            <ul className="grid gap-px bg-ink/8 sm:grid-cols-3">
              {parserPoints.map((point) => (
                <li key={point} className="bg-surface px-6 py-8 text-center">
                  <p className="text-body font-semibold text-ink">{point}</p>
                </li>
              ))}
            </ul>
          </Panel>
        }
      />

      <CtaCentered
        title="Reveal the Hidden Value in Your Pipeline."
        lede="See how many placements are hiding in your database right now."
        cta={{ label: 'Get Talentilo', href: '/contact' }}
      />
    </>
  );
}

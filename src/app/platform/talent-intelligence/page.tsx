import type { Metadata } from 'next';
import Link from 'next/link';

import { ScorecardPanel } from '@/components/panels/ScorecardPanel';
import { CenteredFeature } from '@/components/sections/CenteredFeature';
import { CtaCentered } from '@/components/sections/CtaCentered';
import { FeatureSplit } from '@/components/sections/FeatureSplit';
import { PageHero } from '@/components/sections/PageHero';
import { Creative } from '@/components/ui/Creative';
import { JsonLd } from '@/components/ui/JsonLd';
import { DEMO_URL } from '@/config/navigation';
import { serviceSchema } from '@/lib/json-ld';

const PAGE_DESCRIPTION =
  'Talentilo reads your job descriptions like a human and ranks the best matches already sitting in your database — before you spend on new job ads.';
const PAGE_PATH = '/platform/talent-intelligence';

export const metadata: Metadata = {
  title: 'AI Candidate Sourcing Software',
  description: PAGE_DESCRIPTION,
  alternates: { canonical: PAGE_PATH },
};

const parserPoints = [
  'Instant PDF to JSON mapping',
  'Structure messy email attachments',
  'Normalize skill taxonomies',
];

/** The Boolean comparison is two half-width panels in the design, so each is its own creative. */
const COMPARE_SIZES = '(min-width: 1280px) 636px, (min-width: 768px) 50vw, 100vw';
const FULL_SIZES = '(min-width: 1440px) 1312px, 100vw';
const RECALL_SIZES = '(min-width: 1200px) 1074px, 100vw';

export default function TalentIntelligencePage() {
  return (
    <>
      <JsonLd
        data={serviceSchema({
          name: 'Talentilo Talent Intelligence',
          description: PAGE_DESCRIPTION,
          path: PAGE_PATH,
          serviceType: 'AI candidate sourcing and resume parsing software',
        })}
      />

      <PageHero
        title={'Your Next Hire is NOT\na Search Away.'}
        /*
         * The last clause follows the artwork. It used to end on "before you spend a rupee on new
         * job ads or portals" — a cost argument, which the All Candidates table under it illustrated
         * by being a database. The command centre is not a database; it is the desk. So the clause
         * now ends where the screen does, and keeps the money in it: a job board you paid for.
         */
        lede="Your ATS is likely a graveyard where great talent goes to be forgotten. Talentilo reads your job descriptions like a human and ranks the best matches out of your existing database — so your next hire is already on your desk, not on a job board you paid for."
        cta={{ label: 'Rank Your Existing Candidates', href: DEMO_URL }}
        ctaPlacement="overlay"
        wash="brand"
        /*
         * The command centre, cut out of its ground — see `command-center-screen` in
         * tools/figma/illustrations.mjs.
         *
         * It replaces `ti-hero-database`, the All Candidates table, which said the same thing as
         * the page's own headline and then again as its first section. The screen shows where a
         * ranking ends up instead — held-up CVs, today's interviews, an offer waiting on a date —
         * which is a claim the copy has to make too, or the picture is only decoration. See the
         * lede's last clause.
         *
         * `grounded={false}` because the file arrives transparent: the wash under it is this
         * band's, and the band already paints `--gradient-brand-vertical`, which is the very
         * gradient the export's own frame carried. There is no `reveal` either — the export is
         * already cut at the frame's foot, mid-row, so the artwork's bottom edge and the band's
         * are the same line.
         */
        creative="command-center-screen"
        grounded={false}
      />

      <CenteredFeature
        eyebrow="The Problem"
        title={'Why Boolean Logic Fails\nModern Recruitment.'}
        lede="Humans don't speak in rigid keywords, and neither should your software. Talentilo understands that a resume is a career story, not a word cloud. Our engine reads between the lines to connect the dots that exact-match software blindly misses."
        cta={{ label: 'Rank Your Existing Candidates', href: DEMO_URL }}
        media={
          <div className="grid gap-10 md:grid-cols-2">
            <Creative
              name="ti-boolean-legacy"
              className="overflow-hidden rounded-card"
              sizes={COMPARE_SIZES}
            />
            <Creative
              name="ti-boolean-semantic"
              className="overflow-hidden rounded-card"
              sizes={COMPARE_SIZES}
            />
          </div>
        }
      />

      <FeatureSplit
        eyebrow="True Scoring"
        title={'Rank Candidates by Fit\nInstead of Frequency.'}
        body="Bad ATS algorithms simply count how many times a keyword appears. Talentilo scores each candidate from 0–100% on location, experience, skills and education — and names the skills they have alongside the ones they are missing."
        points={[]}
        pullQuote="Don't read 50 resumes. Read the top 5."
        cta={{ label: 'See It In Action', href: DEMO_URL }}
        aside={
          <p className="text-small text-ink/80">
            Hiring engineers? See how the same scoring handles{' '}
            <Link
              href="/solution/tech-recruitment"
              className="underline underline-offset-4 hover:text-brand-blue"
            >
              technical roles
            </Link>
            .
          </p>
        }
        media={
          <ScorecardPanel
            leader={{
              name: 'Sayali Mahale',
              initials: 'SM',
              role: 'Senior Python Developer',
              score: 90,
              // The four average to 90 exactly. A leader whose own working-out does not add up to
              // the figure above it argues the opposite of the section it sits in.
              dimensions: [
                { label: 'Location', value: 100, note: 'In Pune, where the role is' },
                { label: 'Experience', value: 94, note: '9 years, 6 of them in Python' },
                { label: 'Skills', value: 78, note: 'Four of the six the role asks for' },
                { label: 'Education', value: 88, note: 'B.E. Electronics and Communication' },
              ],
              matched: ['Python', 'Django', 'AWS', 'REST APIs'],
              missing: ['Docker', 'Kubernetes'],
            }}
            rest={[
              { name: 'Vikram Joshi', role: 'Backend Developer', score: 74 },
              { name: 'Anita Kulkarni', role: 'Junior Developer', score: 42 },
            ]}
          />
        }
        mediaSide="left"
      />

      <CenteredFeature
        eyebrow="Intelligent Recall"
        title={'Stop Paying to Acquire\nTalent You Already Own.'}
        lede="This is the greatest inefficiency in recruitment: spending thousands on job boards to find a candidate who is already in your database. Talentilo's Active Recall continuously scans your archive against every new open role."
        pullQuote="Your highest ROI channel is your own history."
        media={
          // Held to the width of the hero screen above it: the panel is drawn at 1312 with 33px
          // headings, which read oversized against the page's own type at full bleed.
          <Creative name="ti-recall" className="mx-auto max-w-[1074px]" sizes={RECALL_SIZES} />
        }
      >
        <p className="mt-4 text-center text-small text-ink/80">
          Recall results surface in the{' '}
          <Link
            href="/platform/recruitment-os"
            className="underline underline-offset-4 hover:text-brand-blue"
          >
            recruitment command centre
          </Link>{' '}
          alongside every open role.
        </p>
      </CenteredFeature>

      <CenteredFeature
        eyebrow="Universal Parser"
        title={'The Universal Translator\nfor Talent Data.'}
        lede="PDFs, DOCX files, LinkedIn profiles and email attachments are unstructured chaos. Our Universal Parser acts as the gateway — stripping formatting and structuring every data point into a clean, uniform profile that Talentilo can read, and that you can understand and edit."
        media={
          <div className="flex flex-col gap-6">
            <Creative name="ti-parser" className="overflow-hidden rounded-card" sizes={FULL_SIZES} />
            {/* The design closes the section with the three capabilities on a divided row. */}
            <ul className="grid gap-px bg-ink/10 sm:grid-cols-3">
              {parserPoints.map((point) => (
                <li key={point} className="bg-surface px-6 py-8 text-center">
                  <p className="text-body font-semibold text-ink">{point}</p>
                </li>
              ))}
            </ul>
          </div>
        }
      />

      <CtaCentered
        title="Reveal the Hidden Value in Your Pipeline."
        lede="See how many placements are hiding in your database right now."
        cta={{ label: 'Get Talentilo', href: DEMO_URL }}
      />
    </>
  );
}

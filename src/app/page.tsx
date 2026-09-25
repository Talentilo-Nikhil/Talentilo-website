import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { CtaBanner } from '@/components/sections/CtaBanner';
import { FeatureSplit } from '@/components/sections/FeatureSplit';
import { StatGrid } from '@/components/sections/StatGrid';
import { ViewPanel, type ViewTab } from '@/components/sections/ViewPanel';
import { ButtonLink } from '@/components/ui/Button';
import { Creative } from '@/components/ui/Creative';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { DEMO_URL } from '@/config/navigation';
import { site } from '@/config/site';
import { companyStats } from '@/data/stats';

export const metadata: Metadata = {
  title: `${site.titleBrand} | ${site.tagline}`,
  description:
    "Recruitment isn't about admin; it's about connection. Talentilo automates your workflow, closes the Speed Gap, and handles the end-to-end recruitment lifecycle.",
  alternates: { canonical: '/' },
};

/**
 * The pastel ground the Recruitment OS cuts have baked into them, rebuilt around a screen that
 * does not.
 *
 * `Recruiter-Target-1` is the bare app frame — the v3 archive holds the screen and nothing else —
 * where `ros-view-owner` and its siblings were exported with the ground already painted in. Every
 * number here is that ground's, read off `design/spec/platform-recruitment-os-owner.json`: a
 * 1312x614 frame filled #ffcea8, which is crusta-200; the screen inset 165.79 either side
 * (12.636% of the width) and 55 from the top (8.958% of the height); and the same 12px corner
 * every card on the site carries.
 *
 * The screen runs off the bottom, as it does on /platform/recruitment-os. It is 674.9 tall at this
 * width against the 559 the frame leaves below the inset, so 83% of it shows and the frame cuts
 * the rest — the same device the file uses to say there is more screen than the picture.
 *
 * The two white hairlines are the frame's own `Polygon 28` and `Ellipse 50`, at their own
 * coordinates and their own 1.19 stroke, both starting halfway down and running out of the frame.
 */
function PastelGround({ children }: { children: ReactNode }) {
  return (
    <div className="relative isolate aspect-[1312/614] overflow-hidden rounded-card bg-crusta-200">
      <svg
        viewBox="0 0 1312 614"
        preserveAspectRatio="xMidYMid slice"
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full"
        fill="none"
        stroke="#ffffff"
        strokeWidth="1.19"
        aria-hidden="true"
      >
        <path d="M295.053 0L590.107 516.344L0 516.344L295.053 0Z" transform="translate(522.69 308.66)" />
        <circle cx="1112.79" cy="566.83" r="258.17" />
      </svg>
      {/* Positioned rather than padded: the frame's height is fixed by the design, so the screen
          hangs from the inset and the frame decides where it stops. */}
      <div className="absolute top-[8.958%] left-[12.636%] w-[74.727%]">{children}</div>
    </div>
  );
}

/**
 * The screen this section shows, and the copy that goes with it.
 *
 * Cut from `Recruiter-Target-1` in website-update-v3.fig — the archive route, since figma.com
 * itself is blocked by this session's egress policy. See the `recruiter-performance` entry in
 * tools/figma/illustrations.mjs for what was swept out of the frame on the way through.
 */
const performanceView: ViewTab = {
  label: 'Recruiter Performance',
  title: 'Recruiter Performance',
  detail:
    "One recruiter's month: target against achieved, the gap on every metric, and their average beside the organisation's.",
  media: (
    <PastelGround>
      <Creative
        name="home-recruiter-targets"
        className="overflow-hidden rounded-card"
        sizes="(min-width: 1440px) 981px, 75vw"
      />
    </PastelGround>
  ),
};

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <Section padding="normal" className="pb-0 lg:pb-0">
        <div className="flex flex-col items-center gap-6">
          <SectionHeading
            as="h1"
            level="display"
            title={
              // The file wraps this exact line-for-line at 1440 and sets the last two words in
              // Medium Italic — hard-coded rather than left to fluid wrap + font-style, since
              // the file's own resolved layout is the source of truth here, not a browser's.
              <>
                Recruitment is All About
                <br />
                Connection. Let Talentilo Handle
                <br />
                <span className="font-medium italic">Everything Else</span>
              </>
            }
            lede={
              <>
                Recruitment isn&rsquo;t about admin; it&rsquo;s about connection. Talentilo is the
                intelligent Operating System that automates your workflow, closes the &ldquo;Speed
                Gap,&rdquo; and handles end-to-end recruitment lifecycle.
              </>
            }
            className="max-w-[950px]"
          >
            <div className="mt-4 flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
              <ButtonLink href="/platform/recruitment-os" variant="dark">
                See the OS in Action
              </ButtonLink>
              <ButtonLink href={DEMO_URL} variant="ghost">
                Request Demo
              </ButtonLink>
            </div>
          </SectionHeading>

          <p className="pt-2 text-center text-small text-ink">
            Replaces your Legacy ATS + CRM + Spreadsheet. Instantly.
          </p>
        </div>

        <div className="mt-10 overflow-hidden rounded-card lg:mt-10">
          <Creative
            name="hero-command-center"
            priority
            sizes="(min-width: 1440px) 1312px, 100vw"
          />
        </div>
      </Section>

      {/* Proof */}
      <Section padding="normal">
        <SectionHeading
          title={
            <>
              Break the Walls Between You &amp;
              <br className="hidden sm:inline" /> the Candidate.
            </>
          }
          lede="Legacy ATS software builds barriers with data entry and clunky forms. Talentilo's active operating system works in the background, so your connection is direct, unbroken, and human."
        />
        <div className="mt-15">
          <StatGrid stats={companyStats} />
        </div>
      </Section>

      <FeatureSplit
        title="We Find the Right Candidates Faster, Always."
        body="Stop manual resume screening. Our Semantic Matching Engine instantly parses JDs and scans profiles to find context, skills, and fit, not just keywords."
        points={[
          'Eliminates Boolean search complexity',
          'Ranks candidates by specific fit score',
          'Shortlists top talent instantly, not in days',
        ]}
        cta={{ label: 'Explore AI Powers', href: '/platform/ai-powers' }}
        creative="semantic-matching"
        tone="dark"
        padding="loose"
      />

      <FeatureSplit
        title={'Trust is Fragile.\nWe Are Your Safety Net.'}
        body={
          'Candidates ghost. Offers get rejected. Talentilo’s Offer Management System monitors ' +
          'every deal in your pipeline, flagging “Risk Alerts” before you lose the commission.'
        }
        points={[
          'Eliminates complex offer tracking',
          'Flags at-risk deals with actionable insights',
          'Saves lost revenue with timely follow-ups',
        ]}
        cta={{ label: 'Explore Revenue Defense', href: '/platform/revenue-defense' }}
        creative="offer-risk-alerts"
      />

      <FeatureSplit
        title="The Truth About Your Operations."
        body="Most agencies scale blindly. Talentilo replaces gut feeling with a live CV Shortlist Rate and CV Submissions tracker—a single dashboard that measures speed, bottlenecks, and true pipeline health."
        points={[]}
        cta={{ label: 'See the Dashboard', href: '/for/agency-owner' }}
        creative="velocity-index"
        mediaSide="left"
      />

      {/* One screen, so the panel renders without a tab group around it. */}
      <Section>
        <SectionHeading
          title={'Set the Targets.\nWatch Them Land.'}
          lede="Revenue, interviews, submissions and shortlist ratio — set for each recruiter, tracked against what they actually did, and measured against the organisation average. No spreadsheet, no month-end scramble."
        />
        <div className="mt-10 flex flex-col items-center gap-7">
          <ViewPanel tab={performanceView} />
        </div>
      </Section>

      <CtaBanner
        title={'Ready to\nBuild with Talentilo?'}
        cta={{ label: 'Get Started', href: DEMO_URL }}
      />

      {/* Migration teaser */}
      <Section tone="mint" padding="normal" className="isolate">
        <SectionHeading
          title="Zero Downtime."
          lede="We migrate your data securely with 100% integrity guarantee."
        />
        {/* The soft dome from the file: a 735px circle whose top edge rises out of the band's floor. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-[72%] -z-10 mx-auto aspect-square w-[735px] max-w-[140vw]
                     rounded-full bg-[linear-gradient(180deg,rgb(255_255_255/0.4)_0%,rgb(255_255_255/0)_100%)]"
        />
      </Section>
    </>
  );
}

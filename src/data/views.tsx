import type { ViewTab } from '@/components/sections/ViewPanel';
import { Creative } from '@/components/ui/Creative';

/** Each view shows the workspace as that role actually sees it, captured from the design file. */
const VIEW_SIZES = '(min-width: 1280px) 1216px, 100vw';

/**
 * The three lenses the switcher on /platform/recruitment-os offers, in the order it shows them.
 *
 * The home page briefly rendered one of these on its own and imported it from here. It now makes
 * its own case with its own screen, so these are back to serving the one page that shows all
 * three — see the note on the Recruiter Performance section in src/app/page.tsx.
 */
export const views: ViewTab[] = [
  {
    label: 'The Owner/VP',
    title: 'The Owner/VP',
    // The screen behind this tab was an annual target table until website-update-v4.fig replaced
    // it with one recruiter's month against target. The detail follows it: what it promised —
    // revenue forecasts, cash flow, a global index — is not on the screen, and the screen is
    // about one person rather than the agency.
    detail:
      "Every recruiter's month against target: revenue, interviews, submissions and shortlist ratio, set and tracked in one place.",
    media: <Creative name="ros-view-owner" sizes={VIEW_SIZES} />,
  },
  {
    label: 'The Ops Manager',
    title: 'The Ops Manager',
    // Likewise: the floor workspace here became a candidate scoring breakdown, so the standard-of-
    // working line it carried describes nothing on the screen.
    detail:
      'Why a candidate scores what they score: location, experience, skills and education, with the gaps named.',
    media: <Creative name="ros-view-ops" sizes={VIEW_SIZES} />,
  },
  {
    label: 'The Recruiter',
    title: 'The Recruiter',
    detail: "Today's pipeline, today's follow-ups, and nothing else in the way.",
    media: <Creative name="ros-view-recruiter" sizes={VIEW_SIZES} />,
  },
];

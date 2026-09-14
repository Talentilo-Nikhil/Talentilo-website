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
    detail:
      'Strategic visibility: real-time revenue forecasts, cash flow, and the global Agency Velocity Index.',
    media: <Creative name="ros-view-owner" sizes={VIEW_SIZES} />,
  },
  {
    label: 'The Ops Manager',
    title: 'The Ops Manager',
    detail: 'One standard of working across every desk and geography, enforced rather than requested.',
    media: <Creative name="ros-view-ops" sizes={VIEW_SIZES} />,
  },
  {
    label: 'The Recruiter',
    title: 'The Recruiter',
    detail: "Today's pipeline, today's follow-ups, and nothing else in the way.",
    media: <Creative name="ros-view-recruiter" sizes={VIEW_SIZES} />,
  },
];

import type { ViewTab } from '@/components/sections/ViewPanel';
import { Creative } from '@/components/ui/Creative';

/** Each view shows the workspace as that role actually sees it, captured from the design file. */
const VIEW_SIZES = '(min-width: 1280px) 1216px, 100vw';

export const ownerView: ViewTab = {
  label: 'The Owner/VP',
  title: 'The Owner/VP',
  detail:
    'Strategic visibility: real-time revenue forecasts, cash flow, and the global Agency Velocity Index.',
  media: <Creative name="ros-view-owner" sizes={VIEW_SIZES} />,
};

export const opsView: ViewTab = {
  label: 'The Ops Manager',
  title: 'The Ops Manager',
  detail: 'One standard of working across every desk and geography, enforced rather than requested.',
  media: <Creative name="ros-view-ops" sizes={VIEW_SIZES} />,
};

export const recruiterView: ViewTab = {
  label: 'The Recruiter',
  title: 'The Recruiter',
  detail: "Today's pipeline, today's follow-ups, and nothing else in the way.",
  media: <Creative name="ros-view-recruiter" sizes={VIEW_SIZES} />,
};

/**
 * The three together, in the order the switcher shows them on /platform/recruitment-os. The home
 * page shows `ownerView` on its own, so a view's copy is written once and read in both places.
 */
export const views: ViewTab[] = [ownerView, opsView, recruiterView];

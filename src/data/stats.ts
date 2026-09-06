import type { Stat } from '@/components/sections/StatGrid';

/**
 * The company-level proof row.
 *
 * Four pages each carried their own copy of this block, and all four had drifted to the same
 * unedited template text — two of the three rows sharing one detail line, and figures ("2.4 more
 * accurate", "100m+ sources") that named no unit and matched nothing else on the site. Kept in one
 * place now, so a page picks the row up rather than restating it and the four cannot disagree
 * again.
 *
 * A page with a claim of its own to make writes its own row instead — see /for/agency-owner.
 */
export const companyStats: Stat[] = [
  {
    figure: '2.4X',
    headline: 'Increased Revenue',
    detail: 'Billings per recruiter without adding headcount',
  },
  {
    figure: '87%',
    headline: 'Placement Velocity',
    detail: 'Reduction in time-to-submit using AI',
  },
  {
    figure: '7 hrs.',
    headline: 'Avg. Time to Submit',
    detail: 'AI-indexed profiles, ranked by context',
  },
];

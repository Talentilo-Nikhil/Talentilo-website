/**
 * The single source of truth for site navigation — header, mobile drawer and footer all read
 * from here, so adding a section is a one-line change.
 *
 * Labels, descriptions and column headings follow the live talentilo.ai nav rather than the
 * Figma file, at Talentilo's direction.
 *
 * `Resources`, which the Figma header carries, is likewise omitted — it has no page either, and
 * the live nav does not show it.
 */

export type NavLink = {
  label: string;
  href: string;
  description?: string;
};

/** One labelled column of a dropdown. A single unheaded group renders as a plain list. */
export type NavGroup = {
  heading?: string;
  links: NavLink[];
};

export type NavItem = {
  label: string;
  href?: string;
  groups?: NavGroup[];
};

/** Every destination under a dropdown, flattened — for active state and link checking. */
export function linksOf(item: NavItem): NavLink[] {
  return (item.groups ?? []).flatMap((group) => group.links);
}

export const primaryNav: NavItem[] = [
  {
    label: 'Platform',
    groups: [
      {
        heading: 'Core Platform',
        links: [
          {
            label: 'Recruitment OS',
            href: '/platform/recruitment-os',
            description: 'Your entire operations in one view.',
          },
          {
            label: 'Talent Intelligence',
            href: '/platform/talent-intelligence',
            description: 'Semantic search and candidate ranking.',
          },
          {
            label: 'Faster Operations',
            href: '/platform/faster-operations',
            description: 'Real-time velocity for your workflow.',
          },
          {
            label: 'AI Powers',
            href: '/platform/ai-powers',
            description: 'Scale your output, not your headcount.',
          },
          {
            label: 'Revenue Defense',
            href: '/platform/revenue-defense',
            description: 'Protect your placements post-offer.',
          },
        ],
      },
    ],
  },
  {
    label: 'Solution',
    groups: [
      {
        heading: 'For',
        links: [
          {
            label: 'Agency Owner',
            href: '/for/agency-owner',
            description: 'Scale billing and automate ops.',
          },
          {
            label: 'Organization',
            href: '/for/recruitment-operations',
            description: 'Enterprise governance & security.',
          },
        ],
      },
      {
        heading: 'Recruitment Type',
        links: [
          {
            label: 'High Volume',
            href: '/solution/high-volume',
            description: 'Automate thousands of interactions.',
          },
          {
            label: 'Tech Recruitment',
            href: '/solution/tech-recruitment',
            description: 'Deep semantic matching for devs.',
          },
        ],
      },
    ],
  },
  { label: 'Migration', href: '/migration' },
];

/**
 * Where every main call to action on the site goes.
 *
 * The site used to send all of them to `/contact`, which put a demo request and a support
 * question through the same form and the same inbox. The demo now books directly against the
 * sales calendar instead, so this is an absolute URL rather than a route — `ButtonLink` tests the
 * scheme and renders an external href as a new-tab `<a rel="noreferrer noopener">`, so nothing at
 * the call sites has to know which it is.
 *
 * `/contact` is still there and still takes messages; it is reachable from the footer's Company
 * column, from the legal pages' "Request the document" button, and from the few prose links that
 * are about pricing or support rather than about seeing the product. Those are deliberately not
 * pointed here: someone chasing a DPA does not want a calendar.
 */
export const DEMO_URL = '/contact';

export const headerActions = {
  signIn: { label: 'Sign In', href: '/contact' },
  demo: { label: 'Request Demo', href: DEMO_URL },
} as const;

export type FooterColumn = {
  heading: string;
  links: NavLink[];
};

/**
 * The footer used to repeat just the four top-level labels. It now mirrors the header's own
 * Platform/Solution dropdowns in full, grouped under the same headings, plus a third column for
 * the flat routes — so every destination in the header nav is also reachable from the footer.
 */
export const footerColumns: FooterColumn[] = [
  { heading: 'Platform', links: linksOf(primaryNav.find((item) => item.label === 'Platform')!) },
  { heading: 'Solution', links: linksOf(primaryNav.find((item) => item.label === 'Solution')!) },
  {
    heading: 'Company',
    links: [
      { label: 'Migration', href: '/migration' },
      { label: 'Contact', href: '/contact' },
    ],
  },
];

export const legalNav: NavLink[] = [{ label: 'Privacy Policy', href: '/privacy' }];

/** Every route the site serves, used by the QA link checker. */
export const allRoutes = [
  '/',
  '/platform/recruitment-os',
  '/platform/talent-intelligence',
  '/platform/faster-operations',
  '/platform/ai-powers',
  '/platform/revenue-defense',
  '/for/agency-owner',
  '/for/recruitment-operations',
  '/solution/high-volume',
  '/solution/tech-recruitment',
  '/migration',
  '/contact',
  '/privacy',
] as const;

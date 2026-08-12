/**
 * The single source of truth for site navigation — header, mobile drawer and footer all read
 * from here, so adding a section is a one-line change.
 *
 * The Figma header lists Platform · Solution · Migration · Resources · Pricing. `Resources` is
 * the only item with no designed page behind it, so it is omitted rather than shipped as a dead
 * link; restoring it is a matter of adding an entry with a real `href`.
 */

export type NavLink = {
  label: string;
  href: string;
  description?: string;
};

export type NavItem = {
  label: string;
  href?: string;
  children?: NavLink[];
};

export const primaryNav: NavItem[] = [
  {
    label: 'Platform',
    children: [
      {
        label: 'Command Center',
        href: '/product/command',
        description: 'Run the whole desk from one workspace.',
      },
      {
        label: 'Talent Intelligence',
        href: '/product/talent-intelligence',
        description: 'Semantic matching that ranks by context, not keywords.',
      },
    ],
  },
  {
    label: 'Solution',
    children: [
      {
        label: 'High Volume Hiring',
        href: '/solution/high-volume',
        description: 'Throughput without adding headcount.',
      },
      {
        label: 'Tech Recruitment',
        href: '/solution/tech-recruitment',
        description: 'Depth on engineering and GenAI roles.',
      },
      {
        label: 'For Agency Owners',
        href: '/for/agency-owner',
        description: 'Margin, velocity and pipeline health.',
      },
      {
        label: 'For Recruitment Operations',
        href: '/for/recruitment-operations',
        description: 'Standardise the process across the floor.',
      },
    ],
  },
  { label: 'Migration', href: '/migration' },
  { label: 'Pricing', href: '/pricing' },
];

export const headerActions = {
  signIn: { label: 'Sign In', href: '/contact' },
  demo: { label: 'Request Demo', href: '/contact' },
} as const;

export const footerNav: NavLink[] = [
  { label: 'Platform', href: '/product/command' },
  { label: 'Solution', href: '/solution/high-volume' },
  { label: 'Migration', href: '/migration' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Contact', href: '/contact' },
];

export const legalNav: NavLink[] = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms and Conditions', href: '/terms' },
  { label: 'Trust Center', href: '/trust' },
];

/** Every route the site serves, used by the QA link checker. */
export const allRoutes = [
  '/',
  '/product/command',
  '/product/talent-intelligence',
  '/for/agency-owner',
  '/for/recruitment-operations',
  '/solution/high-volume',
  '/solution/tech-recruitment',
  '/migration',
  '/pricing',
  '/contact',
  '/privacy',
  '/terms',
  '/trust',
] as const;

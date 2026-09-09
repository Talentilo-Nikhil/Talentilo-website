export const site = {
  name: 'Talentilo.ai',
  tagline: 'The Recruitment Operating System',
  description:
    'Talentilo is the intelligent Operating System for recruitment agencies — semantic matching, offer risk alerts and the Agency Velocity Index in one place.',
  url: 'https://talentilo.ai',
  /** Both enquiry types route to the same inbox today. */
  email: {
    support: 'marketing@talentilo.ai',
    sales: 'marketing@talentilo.ai',
  },
  social: {
    linkedin: 'https://www.linkedin.com/company/talentilo',
    x: 'https://x.com/talentilo',
    instagram: 'https://www.instagram.com/talentilo',
  },
} as const;

/**
 * The stable identifier for Talentilo as an entity in structured data. The layout emits the one
 * Organization node under this id; page-level schema references it rather than restating the
 * company, so no page ever carries two competing Organization definitions.
 */
export const ORGANIZATION_ID = `${site.url}/#organization`;

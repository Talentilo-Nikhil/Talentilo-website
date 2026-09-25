export const site = {
  name: 'Talentilo.ai',
  /**
   * How the brand reads in a browser tab, where it is prose rather than an address.
   *
   * `name` stays the domain because that is what the copyright line, the structured data and the
   * logo's label are naming; a tab is read, not typed, so the dot goes.
   */
  titleBrand: 'Talentilo AI',
  tagline: 'The Recruitment Operating System',
  description:
    'Talentilo is the intelligent Operating System for recruitment agencies — semantic matching, offer risk alerts and live recruiter targets in one place.',
  url: 'https://talentilo.ai',
  email: {
    support: 'support@talentilo.ai',
    sales: 'sales@talentilo.ai',
    /**
     * Where the contact form delivers when `CONTACT_TO_EMAIL` is unset.
     *
     * Deliberately separate from the two addresses above: those are what the site prints, this is
     * where live enquiries land. Moving it is an operational change, not a copy one — point it at
     * sales@ once someone is reading that inbox, and not before.
     */
    enquiries: 'marketing@talentilo.ai',
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

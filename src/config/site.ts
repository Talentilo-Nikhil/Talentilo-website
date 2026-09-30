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
  /**
   * The sales calendar behind every "Request Demo" on the site, embedded on /demo.
   *
   * The query string is part of the address, not decoration: `hide_event_type_details` drops the
   * duplicate title Calendly would otherwise print above a page that already has a heading,
   * `hide_gdpr_banner` drops its cookie notice, and `primary_color` is the brand lavender so the
   * widget's buttons are not Calendly blue in the middle of a Talentilo page.
   */
  calendly: 'https://calendly.com/talentilo-marketing/30min?hide_event_type_details=1&hide_gdpr_banner=1&primary_color=a2a5ff',

  /**
   * LinkedIn is the only account Talentilo runs. The X and Instagram handles that sat here were
   * never claimed, so the footer linked to pages that do not exist and the organisation's
   * structured data claimed two profiles it does not own.
   */
  social: {
    linkedin: 'https://www.linkedin.com/company/talentilo-ai/',
  },
} as const;

/**
 * The stable identifier for Talentilo as an entity in structured data. The layout emits the one
 * Organization node under this id; page-level schema references it rather than restating the
 * company, so no page ever carries two competing Organization definitions.
 */
export const ORGANIZATION_ID = `${site.url}/#organization`;

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
   * The plain booking link, with no query string, and that is deliberate. It carried three of
   * Calendly's embed options for a while — the first of them, `hide_event_type_details=1`, is what
   * removes the panel with the logo, the host, the meeting name, its length and its description,
   * and that panel is half of what the page is meant to show. `hide_gdpr_banner=1` and
   * `primary_color` went with it, so the widget draws its own cookie notice where a region
   * requires one and uses Calendly's blue rather than a brand tint.
   *
   * Any option added back here is a change to what visitors see, not a tidy-up: the parameters
   * are the embed's settings. `qa:interactions` asserts this URL exactly, so one arriving by
   * accident fails the suite rather than surprising someone on the live site.
   */
  calendly: 'https://calendly.com/talentilo-marketing/30min',

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

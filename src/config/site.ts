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
   * One embed option, and only one. Calendly's query parameters are the widget's settings rather
   * than decoration, so each is a decision about what visitors see:
   *
   * - `primary_color=394ccb` tints the widget's buttons, its selected date and its confirmation
   *   from Calendly's own `006bff` to a deeper blue. The widget puts white on this colour, and
   *   394ccb carries it at 6.84:1 — better than the default it replaces at 4.62. It is close to
   *   but not one of the azure ramp: `brand-blue` is `4da8fd`, which holds white at only 2.52 and
   *   would have failed where this passes.
   * - `hide_event_type_details=1` is deliberately absent. It removes the panel carrying the logo,
   *   the host, the meeting's name, its length and its description, and that panel is half of what
   *   the page is meant to show — /demo's lede is one line precisely because the panel says the
   *   rest.
   * - `hide_gdpr_banner=1` is deliberately absent too. This site has no consent banner of its own,
   *   so Calendly's is the only notice an EU visitor gets.
   *
   * `qa:interactions` asserts this URL exactly, so a parameter arriving by accident fails the
   * suite rather than surprising someone on the live site.
   */
  calendly: 'https://calendly.com/talentilo-marketing/30min?primary_color=394ccb',

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

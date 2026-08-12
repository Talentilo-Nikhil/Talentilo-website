/** Every route the site serves, plus one that it deliberately does not (the 404 probe). */
export const ROUTES = [
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
];

export const MISSING_ROUTE = '/this-route-does-not-exist';

export const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 1200 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 375, height: 812 },
];

import { ORGANIZATION_ID, site } from '@/config/site';

type ServiceSchemaInput = {
  /** The offering as a person would name it, e.g. "Talentilo High-Volume Hiring Software". */
  name: string;
  description: string;
  /** The page's own path, e.g. `/platform/ai-powers`. */
  path: string;
  /** The category of service, e.g. "Recruitment automation software". */
  serviceType: string;
};

/**
 * One product or solution page described as a Service. `provider` points at the sitewide
 * Organization by id rather than restating the company, so a page never carries two Organization
 * nodes.
 */
export function serviceSchema({ name, description, path, serviceType }: ServiceSchemaInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    serviceType,
    url: `${site.url}${path}`,
    provider: { '@id': ORGANIZATION_ID },
  };
}

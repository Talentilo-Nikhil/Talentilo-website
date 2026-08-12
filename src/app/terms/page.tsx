import type { Metadata } from 'next';

import { LegalPage } from '@/components/sections/LegalPage';

export const metadata: Metadata = {
  title: 'Terms and Conditions',
  description: 'The terms that govern use of the Talentilo.ai recruitment operating system.',
  alternates: { canonical: '/terms' },
  robots: { index: false },
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms and Conditions"
      summary="Our terms of service are being finalised. This page will hold the published agreement."
      covers={[
        'Subscription terms, per-seat billing and renewal',
        'Acceptable use of the platform and its AI agents',
        'Service levels, support response times and uptime commitments',
        'Ownership of the data you bring with you and take away',
      ]}
    />
  );
}

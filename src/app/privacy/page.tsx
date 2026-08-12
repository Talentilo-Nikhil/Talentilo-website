import type { Metadata } from 'next';

import { LegalPage } from '@/components/sections/LegalPage';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Talentilo.ai collects, stores and processes candidate and customer data.',
  alternates: { canonical: '/privacy' },
  robots: { index: false },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      summary="Our privacy policy is being finalised alongside the platform's compliance certifications. This page will hold the published document."
      covers={[
        'What candidate and customer data Talentilo stores, and for how long',
        'Where data is hosted, and which sub-processors touch it',
        'How GDPR data-subject requests are handled, and in what timeframe',
        'How data is exported or deleted when an account closes',
      ]}
    />
  );
}

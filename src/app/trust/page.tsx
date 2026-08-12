import type { Metadata } from 'next';

import { LegalPage } from '@/components/sections/LegalPage';

export const metadata: Metadata = {
  title: 'Trust Center',
  description: 'Security, compliance and data-handling practices behind Talentilo.ai.',
  alternates: { canonical: '/trust' },
  robots: { index: false },
};

export default function TrustPage() {
  return (
    <LegalPage
      title="Trust Center"
      summary="Our security and compliance documentation is being assembled here. Until it is published, we share it on request."
      covers={[
        'Certification status, including SOC 2 and GDPR readiness',
        'Encryption in transit and at rest, and key management',
        'Access control, audit logging and incident response',
        'Sub-processor list and data-residency options',
      ]}
    />
  );
}

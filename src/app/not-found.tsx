import Link from 'next/link';

import { Creative } from '@/components/ui/Creative';
import { Section } from '@/components/ui/Section';

export default function NotFound() {
  return (
    <Section padding="loose">
      <div className="flex flex-col items-center gap-10 text-center">
        <p className="font-sans text-[clamp(2.5rem,2rem+2.5vw,3.25rem)] font-medium text-ink">404</p>

        <Creative name="nf-shapes" alt="" className="w-[343px] max-w-full" />

        <h1 className="max-w-[950px] text-[clamp(2.25rem,1.35rem+3.9vw,4.0625rem)] text-ink">
          Oops, we couldn&rsquo;t find what you&rsquo;re looking for.
        </h1>

        <p className="max-w-[900px] text-body text-ink/85">
          Here are some useful links to get you started:{' '}
          <Link href="/" className="underline underline-offset-4 hover:text-brand-blue">
            Homepage
          </Link>
          ,{' '}
          <Link href="/product/command" className="underline underline-offset-4 hover:text-brand-blue">
            Platform
          </Link>{' '}
          or{' '}
          <Link href="/migration" className="underline underline-offset-4 hover:text-brand-blue">
            Onboarding
          </Link>
          .
        </p>
      </div>
    </Section>
  );
}

import Link from 'next/link';

import { Creative } from '@/components/ui/Creative';
import { Section } from '@/components/ui/Section';

export default function NotFound() {
  return (
    // The file's own vertical rhythm for this page: 92px before the shapes, 120px after the
    // links — neither matches the shared padding presets, since this is a one-off utility page.
    <Section padding="none" className="pt-[92px] pb-[120px]">
      <div className="flex flex-col items-center gap-[72px] text-center">
        {/* "404" sits centred inside the shape cluster in the file, not stacked above it. */}
        <div className="relative w-[343px] max-w-full">
          <Creative name="nf-shapes" alt="" />
          <p className="absolute inset-0 flex items-center justify-center font-sans text-[52px] font-medium text-ink">
            404
          </p>
        </div>

        <div className="flex flex-col items-center gap-6">
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
      </div>
    </Section>
  );
}

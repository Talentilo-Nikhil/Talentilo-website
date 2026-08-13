import Link from 'next/link';

import { Creative } from '@/components/ui/Creative';
import { site } from '@/config/site';
import { cn } from '@/lib/cn';

type LogoProps = {
  /** `dark` is the wordmark in ink for light backgrounds; `light` is the white one for dark ones. */
  tone?: 'dark' | 'light';
  className?: string;
  /** The header logo is the site's home link; the footer one repeats it, so it is hidden from AT. */
  label?: string;
};

export function Logo({ tone = 'dark', className, label = site.name }: LogoProps) {
  return (
    <Link
      href="/"
      aria-label={`${site.name} — home`}
      className={cn(
        'inline-flex w-[180px] shrink-0 transition-opacity duration-200 hover:opacity-80',
        className
      )}
    >
      {/* The approved lockups off the Design system canvas, not a wordmark lifted from a page. */}
      <Creative
        name={tone === 'light' ? 'logo-color-on-dark' : 'logo-color'}
        alt={label}
        priority
        zoom={false}
      />
    </Link>
  );
}

import Link from 'next/link';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

import { ArrowRight } from '@/components/icons';
import { cn } from '@/lib/cn';

const VARIANT = {
  /**
   * The brand wash used for the primary call to action.
   *
   * `--gradient-brand` runs to a near-white `#fdfcff`, and the file sets this label to white, so
   * the pale end of the gradient cannot sit under the text. The background is scaled to 180% and
   * held at its saturated end — the wash is never slid along on hover, which is what used to
   * wash the label out. Hover deepens the colour instead; see below.
   */
  gradient:
    'relative isolate text-white [background-image:var(--gradient-brand)] bg-[length:180%_100%] ' +
    'bg-[position:0%_50%] shadow-[0_1px_2px_rgb(12_10_16/0.08)] ' +
    /*
     * Hover deepens the wash. `background-image` is not animatable, so the deeper gradient is a
     * pseudo-element faded in behind the label — `isolate` keeps its negative z-index inside this
     * button, so it paints over the resting wash but under the text. The resting appearance is
     * untouched; only the hover differs.
     */
    'before:absolute before:inset-0 before:-z-10 before:rounded-[inherit] before:opacity-0 ' +
    'before:[background-image:var(--gradient-brand-deep)] before:bg-[length:180%_100%] ' +
    'before:bg-[position:0%_50%] before:transition-opacity before:duration-300 ' +
    'before:ease-[var(--ease-out-soft)] hover:before:opacity-100 focus-visible:before:opacity-100',
  /** Ink hairline on a transparent field — the header "Sign In". */
  outline:
    'text-ink border border-ink bg-transparent hover:bg-ink hover:text-white',
  /** White pill used on dark or photographic backgrounds. */
  light: 'bg-white text-ink border border-transparent hover:bg-white/90',
  /** Solid ink pill used on light backgrounds. */
  dark: 'bg-ink text-white hover:bg-ink/90',
  /** Text-only, for tertiary actions. */
  ghost: 'text-ink hover:text-brand-blue underline-offset-4 hover:underline px-0',
} as const;

const SIZE = {
  /** 43px tall, matching the header buttons. */
  sm: 'min-h-[43px] px-6 py-2 text-body',
  /** 48px tall, matching the in-page buttons. */
  md: 'min-h-12 px-6 py-3 text-body',
  lg: 'min-h-[64px] px-10 py-4 text-h5',
} as const;

type ButtonBaseProps = {
  children: ReactNode;
  variant?: keyof typeof VARIANT;
  size?: keyof typeof SIZE;
  /** The paired arrow the Figma buttons hide until hover. */
  withArrow?: boolean;
  className?: string;
};

const base =
  'group inline-flex items-center justify-center gap-2 rounded-pill font-sans font-medium ' +
  'whitespace-nowrap transition-[background-color,color,box-shadow,transform] ' +
  'duration-300 ease-[var(--ease-out-soft)] active:translate-y-px ' +
  'disabled:pointer-events-none disabled:opacity-60';

function Inner({ children, withArrow }: { children: ReactNode; withArrow: boolean }) {
  if (!withArrow) return <>{children}</>;
  return (
    <>
      {/* The label gives way as the arrow slides in — both move on hover, neither changes the
          button's width, since it's transform on fixed-size boxes rather than layout. */}
      <span
        className="transition-transform duration-300 ease-[var(--ease-out-soft)]
                   group-hover:-translate-x-1 group-focus-visible:-translate-x-1"
      >
        {children}
      </span>
      <span
        aria-hidden="true"
        className="grid size-4 shrink-0 -translate-x-1.5 place-items-center text-[16px]
                   transition-transform duration-300 ease-[var(--ease-out-soft)]
                   group-hover:translate-x-0 group-focus-visible:translate-x-0"
      >
        <ArrowRight />
      </span>
    </>
  );
}

type ButtonLinkProps = ButtonBaseProps & { href: string } & Omit<
    ComponentPropsWithoutRef<typeof Link>,
    'href' | 'className' | 'children'
  >;

export function ButtonLink({
  children,
  href,
  variant = 'gradient',
  size = 'md',
  withArrow = true,
  className,
  ...rest
}: ButtonLinkProps) {
  const external = /^https?:|^mailto:|^tel:/.test(href);
  const classes = cn(base, VARIANT[variant], SIZE[size], className);

  if (external) {
    return (
      <a href={href} className={classes} rel="noreferrer noopener" target="_blank">
        <Inner withArrow={withArrow}>{children}</Inner>
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...rest}>
      <Inner withArrow={withArrow}>{children}</Inner>
    </Link>
  );
}

type ButtonProps = ButtonBaseProps & ComponentPropsWithoutRef<'button'>;

export function Button({
  children,
  variant = 'gradient',
  size = 'md',
  withArrow = false,
  className,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button type={type} className={cn(base, VARIANT[variant], SIZE[size], className)} {...rest}>
      <Inner withArrow={withArrow}>{children}</Inner>
    </button>
  );
}

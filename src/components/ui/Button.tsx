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
   * held at its saturated end — no hover slide, which is what used to wash the label out.
   */
  gradient:
    'text-white [background-image:var(--gradient-brand)] bg-[length:180%_100%] bg-[position:0%_50%] ' +
    'shadow-[0_1px_2px_rgb(12_10_16/0.08)]',
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
  sm: 'min-h-[43px] py-2 text-body',
  /** 48px tall, matching the in-page buttons. */
  md: 'min-h-12 py-3 text-body',
  lg: 'min-h-[64px] py-4 text-h5',
} as const;

/**
 * Horizontal padding, split from SIZE. The arrow variant keeps the left side untouched and only
 * widens the right side by roughly one icon's width, so the reserved space for the arrow reads
 * as "part of the button's padding" rather than a second element that changes the pill's width.
 */
const PADDING = {
  sm: { plain: 'px-6', arrow: 'pl-6 pr-11' },
  md: { plain: 'px-6', arrow: 'pl-6 pr-11' },
  lg: { plain: 'px-10', arrow: 'pl-10 pr-16' },
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
  'group relative inline-flex items-center justify-center gap-4 rounded-pill font-sans font-medium ' +
  'whitespace-nowrap transition-[background-color,color,box-shadow,transform] ' +
  'duration-300 ease-[var(--ease-out-soft)] active:translate-y-px ' +
  'disabled:pointer-events-none disabled:opacity-60';

function Inner({
  children,
  withArrow,
  size,
}: {
  children: ReactNode;
  withArrow: boolean;
  size: keyof typeof SIZE;
}) {
  if (!withArrow) return <>{children}</>;
  return (
    <>
      <span>{children}</span>
      {/*
        Absolutely positioned inside the button's own right padding, so it never takes part in the
        layout — the button's width is set by the label alone, exactly like the arrow-less design,
        and hover only fades and nudges the arrow a couple of pixels within that existing space.
      */}
      <span
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute inset-y-0 flex items-center',
          size === 'lg' ? 'right-6' : 'right-4'
        )}
      >
        <span
          className={cn(
            'grid -translate-x-1 place-items-center opacity-0',
            'transition-[opacity,transform] duration-300 ease-[var(--ease-out-soft)]',
            'group-hover:translate-x-0 group-hover:opacity-100',
            'group-focus-visible:translate-x-0 group-focus-visible:opacity-100',
            size === 'lg' ? 'size-6 text-[24px]' : 'size-4 text-[16px]'
          )}
        >
          <ArrowRight />
        </span>
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
  const classes = cn(
    base,
    VARIANT[variant],
    SIZE[size],
    PADDING[size][withArrow ? 'arrow' : 'plain'],
    className
  );

  if (external) {
    return (
      <a href={href} className={classes} rel="noreferrer noopener" target="_blank">
        <Inner withArrow={withArrow} size={size}>
          {children}
        </Inner>
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...rest}>
      <Inner withArrow={withArrow} size={size}>
        {children}
      </Inner>
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
    <button
      type={type}
      className={cn(
        base,
        VARIANT[variant],
        SIZE[size],
        PADDING[size][withArrow ? 'arrow' : 'plain'],
        className
      )}
      {...rest}
    >
      <Inner withArrow={withArrow} size={size}>
        {children}
      </Inner>
    </button>
  );
}

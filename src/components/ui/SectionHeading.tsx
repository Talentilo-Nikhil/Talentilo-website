import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';

type SectionHeadingProps = {
  title: ReactNode;
  lede?: ReactNode;
  eyebrow?: ReactNode;
  align?: 'left' | 'center';
  /** `display` is the 65px hero size; `section` is the 52px used by every other heading. */
  level?: 'display' | 'section';
  as?: 'h1' | 'h2' | 'h3';
  tone?: 'light' | 'dark';
  className?: string;
  children?: ReactNode;
};

export function SectionHeading({
  title,
  lede,
  eyebrow,
  align = 'center',
  level = 'section',
  as: Tag = 'h2',
  tone = 'light',
  className,
  children,
}: SectionHeadingProps) {
  const centered = align === 'center';

  return (
    <div
      className={cn(
        'flex flex-col gap-6',
        centered ? 'items-center text-center' : 'items-start text-left',
        className
      )}
    >
      {eyebrow ? (
        <p
          className={cn(
            'font-sans text-small font-medium tracking-[0.08em] uppercase',
            tone === 'dark' ? 'text-white/70' : 'text-muted'
          )}
        >
          {eyebrow}
        </p>
      ) : null}

      <Tag
        className={cn(
          // clamp() is anchored to the exact desktop size from the file.
          level === 'display'
            ? 'text-[clamp(2.25rem,1.35rem+3.9vw,4.0625rem)]'
            : 'text-[clamp(2rem,1.35rem+2.7vw,3.25rem)]',
          tone === 'dark' ? 'text-white' : 'text-ink',
          centered && 'max-w-[68rem]'
        )}
      >
        {title}
      </Tag>

      {lede ? (
        <p
          className={cn(
            'max-w-[56rem] text-body',
            tone === 'dark' ? 'text-white/85' : 'text-ink/85',
            centered ? 'text-center' : 'text-left'
          )}
        >
          {lede}
        </p>
      ) : null}

      {children}
    </div>
  );
}

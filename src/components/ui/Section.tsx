import type { ElementType, ReactNode } from 'react';

import { cn } from '@/lib/cn';
import { Container } from './Container';

const TONE = {
  light: 'bg-surface text-ink',
  dark: 'bg-ink text-white',
  mint: 'bg-surface-mint text-ink',
  none: '',
} as const;

/** Figma uses 40 / 80 / 150px of vertical padding; each scales down on smaller screens. */
const PADDING = {
  none: '',
  tight: 'py-10 lg:py-10',
  normal: 'py-14 md:py-16 lg:py-20',
  loose: 'py-20 md:py-28 lg:py-[150px]',
} as const;

type SectionProps = {
  children: ReactNode;
  id?: string;
  as?: ElementType;
  tone?: keyof typeof TONE;
  padding?: keyof typeof PADDING;
  width?: 'content' | 'narrow';
  className?: string;
  innerClassName?: string;
  /** Skip the container when a section needs to bleed to the viewport edge. */
  bleed?: boolean;
};

export function Section({
  children,
  id,
  as: Tag = 'section',
  tone = 'light',
  padding = 'normal',
  width = 'content',
  className,
  innerClassName,
  bleed = false,
}: SectionProps) {
  return (
    <Tag id={id} className={cn('relative overflow-hidden', TONE[tone], PADDING[padding], className)}>
      {bleed ? children : (
        <Container width={width} className={innerClassName}>
          {children}
        </Container>
      )}
    </Tag>
  );
}

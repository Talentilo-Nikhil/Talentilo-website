import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';

type ContainerProps = {
  children: ReactNode;
  className?: string;
  /** The footer sits on a 1216px measure rather than the 1312px used everywhere else. */
  width?: 'content' | 'narrow';
};

/**
 * The 1312px measure inside a 1440 frame, with the 64px desktop gutter tapering to 20px on
 * phones so text never runs to the edge of the screen.
 */
export function Container({ children, className, width = 'content' }: ContainerProps) {
  return (
    <div
      className={cn(
        'mx-auto w-full px-5 sm:px-8 lg:px-16',
        width === 'content' ? 'max-w-[1440px]' : 'max-w-[1440px] lg:px-28',
        className
      )}
    >
      {children}
    </div>
  );
}

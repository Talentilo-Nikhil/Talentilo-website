import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';

type ContainerProps = {
  children: ReactNode;
  className?: string;
};

/**
 * The one content measure on the site: 1312px inside a 1440 frame, with the 64px desktop gutter
 * tapering to 20px on phones so text never runs to the edge of the screen.
 *
 * Everything sits on this, header and footer included, so a vertical line drawn down the page
 * touches the left edge of every block. The file insets its footer to a 112px gutter instead;
 * that is deliberately not reproduced.
 */
export function Container({ children, className }: ContainerProps) {
  return (
    <div className={cn('mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-16', className)}>
      {children}
    </div>
  );
}

import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';

/**
 * The peach ground the Recruitment OS cuts have baked into them, rebuilt for the slots that draw
 * their own content.
 *
 * Every number here is read off `design/spec/platform-recruitment-os-owner.json`, where the
 * exported frame is a 1312-wide ground filled #ffcea8 — crusta-200 — carrying two white hairlines
 * of its own: `Polygon 28` and `Ellipse 50`, at their own coordinates and their own 1.19 stroke,
 * both starting halfway down and running out of the frame. The frame is 687 tall rather than the
 * file's 614; see `tallerGround` in tools/figma/illustrations.mjs for why the exports grew.
 *
 * It takes no aspect ratio of its own. The home page's slot holds the design's 1312/687 at every
 * width because it frames an image, which shrinks as one piece; the tracker illustration is
 * markup and reflows, so it holds that ratio only where the row layout fits and grows taller
 * underneath. Neither default would suit the other, so each caller says which it is.
 */
export function PastelGround({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn('relative isolate overflow-hidden rounded-card bg-crusta-200', className)}>
      <svg
        viewBox="0 25 1312 687"
        preserveAspectRatio="xMidYMid slice"
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full"
        fill="none"
        stroke="#ffffff"
        strokeWidth="1.19"
        aria-hidden="true"
      >
        <path d="M295.053 0L590.107 516.344L0 516.344L295.053 0Z" transform="translate(522.69 308.66)" />
        <circle cx="1112.79" cy="566.83" r="258.17" />
      </svg>
      {children}
    </div>
  );
}

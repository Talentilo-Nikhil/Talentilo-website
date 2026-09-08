import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';

/**
 * The ground the exported creatives sit on, rebuilt in CSS for the panels that are markup.
 *
 * Every artwork creative on the site is drawn on the same thing — a diagonal brand gradient with
 * a hairline white grid over it, and the content floating on that as an inset card (see
 * `backdrop()` in tools/figma/custom-creatives.mjs). The Platform pages that carry live panels
 * instead of exported artwork had no ground at all: their cards sat directly on the page's white,
 * so the same section on /platform/talent-intelligence and /platform/faster-operations did not
 * look like it came from the same site.
 *
 * The grid is the SVG pattern's geometry read back out: a 110px tile turned 45°, ruled at 1.5px in
 * white at 0.28. Two repeating gradients give the same two families of lines the rotated tile does.
 */
export type GroundTone = 'brand' | 'warm' | 'magenta';

/**
 * The page tokens run these ramps horizontally, for full-width bands. A creative's ground runs the
 * same ramp corner to corner — that is what `backdrop()` draws, and it is what gives the grid
 * something to cut across — so the angle is set here rather than borrowing the token.
 */
const GRADIENT: Record<GroundTone, string> = {
  brand: 'linear-gradient(135deg, #fdfcff 0%, #b1a4ff 46%, #4da8fd 100%)',
  warm: 'linear-gradient(135deg, #fdfcff 0%, #ffddb1 46%, #fe7c34 100%)',
  magenta: 'linear-gradient(135deg, #fdfcff 0%, #da8dff 46%, #ff3aaf 100%)',
};

const GRID =
  'repeating-linear-gradient(45deg, rgb(255 255 255 / 0.28) 0 1.5px, transparent 1.5px 110px), ' +
  'repeating-linear-gradient(135deg, rgb(255 255 255 / 0.28) 0 1.5px, transparent 1.5px 110px)';

export function CreativeGround({
  tone = 'brand',
  className,
  children,
}: {
  tone?: GroundTone;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn('rounded-card p-6 sm:p-10', className)}
      style={{ backgroundImage: `${GRID}, ${GRADIENT[tone]}` }}
    >
      {children}
    </div>
  );
}

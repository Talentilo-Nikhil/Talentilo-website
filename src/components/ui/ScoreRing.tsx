import type { CSSProperties } from 'react';

import { cn } from '@/lib/cn';

/**
 * A 0–100 figure drawn as a ring, with the number inside it.
 *
 * Shared, because three places now want one: the contact showcase's CV list, the talent-intelligence
 * scorecard, and whatever comes next. The geometry is a 32-unit box with a radius-14 circle, so the
 * stroke has room at either edge of the viewBox and the ring scales cleanly to whatever size the
 * caller asks for.
 *
 * `className` carries both the size and the hue, and it carries them because `cn` is a plain join
 * with no conflict resolution — a size baked into the base string would race a size passed in and
 * the winner would be whichever Tailwind emitted later. So the base sets no size at all and every
 * caller states one.
 *
 * The number is always drawn. A ring is a magnitude and its hue is a second reading of the same
 * thing, never the only one, so the figure never rests on colour alone.
 */
export function ScoreRing({
  value,
  label,
  className,
  trackOpacity = 0.15,
  stroke = 3,
  animated = false,
}: {
  /** The score, 0–100. Clamped, because a ring cannot draw more than its own circumference. */
  value: number;
  /** What is printed inside, when it should not simply be the value — e.g. `100%`. */
  label?: string;
  /** Required: the ring's size and its `currentColor` hue, e.g. `size-11 text-azure-600`. */
  className: string;
  trackOpacity?: number;
  stroke?: number;
  /**
   * Whether the arc fills to its value rather than arriving drawn. Off by default, so the two
   * callers that want a static ring are untouched.
   *
   * The animation only runs inside an element marked `data-active="true"`, because the one place
   * that asks for it is the contact showcase, where all four slides stay in the DOM and only the
   * one on show should be moving. Somewhere with nothing to gate on, mark the wrapper
   * `data-active="true"` and it runs on mount.
   *
   * The arc's own length is already in `strokeDasharray`, so filling it is a matter of walking
   * `stroke-dashoffset` back from that length to zero — which `--drawn` hands to the keyframe, and
   * is why one keyframe serves every score. See `draw-ring` in globals.css.
   */
  animated?: boolean;
}) {
  const circumference = 2 * Math.PI * 14;
  const drawn = (Math.min(Math.max(value, 0), 100) / 100) * circumference;

  return (
    <span className={cn('relative grid shrink-0 place-items-center', className)}>
      <svg viewBox="0 0 32 32" className="absolute inset-0 size-full -rotate-90" aria-hidden="true">
        <circle
          cx="16"
          cy="16"
          r="14"
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          opacity={trackOpacity}
        />
        <circle
          cx="16"
          cy="16"
          r="14"
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${drawn} ${circumference}`}
          className={animated ? 'group-data-[active=true]:animate-draw-ring' : undefined}
          style={animated ? ({ '--drawn': drawn } as CSSProperties) : undefined}
        />
      </svg>
      <span className="text-caption font-semibold text-ink">{label ?? value}</span>
    </span>
  );
}

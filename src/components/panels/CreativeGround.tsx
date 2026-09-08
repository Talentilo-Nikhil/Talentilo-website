import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';

/**
 * The ground the exported creatives sit on, rebuilt for the panels that are markup.
 *
 * Read off the design rather than approximated. In `design/spec/*.json` every creative slot is a
 * `Visual-n` frame at exactly 588x536 that clips its content, filled with one of the page
 * gradients, with a group of outlined squares hanging off its top-left corner and running out of
 * frame. The Platform pages built from live panels had no ground at all, so the same kind of
 * section looked unrelated next to a page whose artwork was exported.
 *
 * Three things here come straight from the spec and should not be "improved":
 *
 * - The frame is 588x536. That is the slot every creative on the site is drawn in, so a panel that
 *   wants to sit beside them has to keep the same ratio.
 * - The gradients are the page tokens, at the angles the tokens already carry. The design runs the
 *   saturated end toward the middle of the page and the pale end toward the outer edge, which is
 *   why `brand` and `warm` are 270deg and `magenta` is 90deg — so a section picks the tone whose
 *   direction suits the side its media sits on.
 * - The motif is four squares stroked in white at 1.2, no fill: a 419.53 container with three
 *   140.68 squares stepping its diagonal at 139.01. It is placed off the top-left corner and
 *   clipped, which is what gives a slot its partial squares rather than a tidy centred badge.
 *
 * The one value the spec does not carry is the corner radius — the extractor drops it — so 16 is
 * set here to match the rendered artwork.
 */
export type GroundTone = 'brand' | 'warm' | 'magenta';

const GRADIENT: Record<GroundTone, string> = {
  brand: 'var(--gradient-brand)',
  warm: 'var(--gradient-warm)',
  magenta: 'var(--gradient-magenta)',
};

/** Slot geometry, in the design's own units. The SVG below is drawn in this same space. */
const SLOT = { w: 588, h: 536 };
/** 536 / 588, as the percentage padding-top resolves against the box's own width. */
const RATIO = `${((536 / 588) * 100).toFixed(4)}%`;
const MOTIF = { x: -121.77, y: -87.8, size: 419.53, cell: 140.68, step: 139.01, radius: 16 };

function Motif() {
  const cells = [0, 1, 2].map((i) => ({
    x: MOTIF.x + i * MOTIF.step,
    y: MOTIF.y + i * MOTIF.step,
  }));

  return (
    <svg
      viewBox={`0 0 ${SLOT.w} ${SLOT.h}`}
      className="pointer-events-none absolute inset-0 h-full w-full"
      fill="none"
      stroke="#ffffff"
      strokeWidth="1.2"
      aria-hidden="true"
    >
      <rect
        x={MOTIF.x}
        y={MOTIF.y}
        width={MOTIF.size}
        height={MOTIF.size}
        rx={MOTIF.radius}
        vectorEffect="non-scaling-stroke"
      />
      {cells.map((c) => (
        <rect
          key={c.x}
          x={c.x}
          y={c.y}
          width={MOTIF.cell}
          height={MOTIF.cell}
          rx={MOTIF.radius}
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}

export function CreativeGround({
  tone = 'brand',
  fill = false,
  className,
  children,
}: {
  tone?: GroundTone;
  /**
   * Pin the content to the slot instead of letting it set the height. A panel that sizes itself
   * from its own height — the handset takes its width from a phone's proportion — needs something
   * definite to resolve against, and an auto grid row is not that: it grows to whatever the panel
   * asks for and the panel asks for whatever the row gave it.
   */
  fill?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn('relative grid overflow-hidden rounded-card', className)}
      style={{ backgroundImage: GRADIENT[tone] }}
    >
      {/*
        The slot's ratio as a spacer rather than `aspect-ratio` on the box itself. Both this and the
        content sit in the same grid cell, so the row takes whichever is taller: a short panel gets
        the design's 588x536, and one carrying more than a single card grows instead of being
        clipped by the overflow rule the motif needs.
      */}
      <div aria-hidden="true" className="col-start-1 row-start-1" style={{ paddingTop: RATIO }} />
      <Motif />
      {/* Positioned, so it paints above the motif. A static grid item would sit under an
          absolutely-positioned sibling however late it came in the DOM, and the outlines
          ran across the artwork instead of behind it. */}
      <div
        className={cn(
          // Both branches are positioned, so either paints above the motif. `relative` cannot be in
          // the base string: cn is a plain join, Tailwind emits .relative after .absolute, and the
          // base would silently win over the modifier.
          'col-start-1 row-start-1 grid place-items-center p-6 sm:p-10',
          fill ? 'absolute inset-0' : 'relative h-full'
        )}
      >
        {children}
      </div>
    </div>
  );
}

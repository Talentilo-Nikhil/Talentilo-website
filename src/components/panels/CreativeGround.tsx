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
/** The design's own padding between the slot edge and the panel inside it. */
const SLOT_PAD = 32;
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

/**
 * A creative built from markup has to behave the way an exported one does, because they sit in
 * the same row on the same pages: an exported creative is an image, so it holds its design's
 * proportions at every width and everything inside it shrinks by one factor. A panel laid out
 * against the slot's live width does not — it reflows, so the slot's own shape changes with the
 * viewport. Measured across the three pages that carry these: every exported slot held its ratio
 * from 1440 down to 375 exactly (1.804, 1.936, 1.097, 2.533, 3.051), while the eleven panel slots
 * each collapsed to a different arbitrary one (0.488 through 0.761) against the design's 1.097.
 *
 * So the panel is laid out once, in the design's own 588x536 space, and scaled to whatever width
 * the column gives it — the same single factor an image gets. `tan(atan2(...))` is the CSS cast
 * from a length ratio to the plain number `scale()` needs; `cqw` resolves against the slot, which
 * is why it carries `container-type: inline-size`.
 */
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
      className={cn('@container relative overflow-hidden rounded-card', className)}
      style={{ aspectRatio: `${SLOT.w} / ${SLOT.h}`, backgroundImage: GRADIENT[tone] }}
    >
      <Motif />
      {/* Positioned, so it paints above the motif. A static sibling would sit under an
          absolutely-positioned one however late it came in the DOM, and the outlines ran across
          the artwork instead of behind it. */}
      {/* A container in its own right, so a panel inside it sizes against the design's 588 rather
          than the phone the slot is drawn on — the layout is the same one at every width, which is
          the whole point of scaling it. Its own `cqw` above still resolves against the slot, since
          a container query always answers from an ancestor. */}
      <div
        className="@container absolute top-0 left-0 grid origin-top-left items-center"
        style={{
          width: `${SLOT.w}px`,
          height: `${SLOT.h}px`,
          padding: `${SLOT_PAD}px`,
          transform: `scale(tan(atan2(100cqw, ${SLOT.w}px)))`,
        }}
      >
        {children}
      </div>
    </div>
  );
}

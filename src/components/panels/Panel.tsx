import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';

/**
 * Shared shell for the Platform pages' data panels.
 *
 * These panels carry real content — comparisons, checklists, message threads — so they are built
 * as markup rather than exported as raster creatives, which keeps the text selectable,
 * translatable and visible to screen readers. `tools/figma/illustrations.mjs` documents the same
 * split: artwork is exported, content is not.
 *
 * `tone` describes the band the panel sits ON, not the panel itself: `light` gives a white card
 * for a white section, `dark` gives a translucent card for an ink section.
 */
export type PanelTone = 'light' | 'dark';

export type PanelProps = {
  tone?: PanelTone;
  /** Optional ink title bar across the top of the card. */
  title?: ReactNode;
  /** Right-aligned content inside the title bar, e.g. a status dot and label. */
  meta?: ReactNode;
  className?: string;
  children: ReactNode;
};

export function panelSurface(tone: PanelTone) {
  return tone === 'dark' ? 'bg-white/[0.04] border-white/10' : 'bg-surface border-ink/10';
}

export function panelText(tone: PanelTone) {
  return tone === 'dark' ? 'text-white' : 'text-ink';
}

export function panelMuted(tone: PanelTone) {
  return tone === 'dark' ? 'text-white/60' : 'text-muted';
}

export function Panel({ tone = 'light', title, meta, className, children }: PanelProps) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-card border shadow-[0_10px_30px_rgb(12_10_16/0.06)]',
        panelSurface(tone),
        className
      )}
    >
      {title ? (
        <div className="flex items-center justify-between gap-4 bg-ink px-5 py-4 sm:px-6">
          <p className="font-sans text-body font-semibold text-white">{title}</p>
          {meta ? <div className="shrink-0 text-small text-white/70">{meta}</div> : null}
        </div>
      ) : null}
      {children}
    </div>
  );
}

/** The small green "live" dot used in several panel headers. */
export function LiveDot({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span aria-hidden="true" className="size-1.5 rounded-full bg-emerald-400" />
      {label}
    </span>
  );
}

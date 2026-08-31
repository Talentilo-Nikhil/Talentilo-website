import { Check, Close } from '@/components/icons';
import { panelMuted, panelSurface, panelText, type PanelTone } from '@/components/panels/Panel';
import { cn } from '@/lib/cn';

export type CompareSide = {
  /** The column label, e.g. "Email (Legacy)" or "Talentilo Active Recall". */
  label: string;
  /** The headline figure, e.g. "4 Hours", "98%", "$0 / Hire". */
  value?: string;
  /** A short line under the figure. */
  caption?: string;
  /** Supporting lines listed under the figure. */
  items?: string[];
  /** A pill in the corner, e.g. "Failed Match". */
  badge?: string;
};

type ComparePanelProps = {
  tone?: PanelTone;
  /** The status-quo side — rendered muted, with a cross. */
  before: CompareSide;
  /** The Talentilo side — rendered in brand colour, with a check. */
  after: CompareSide;
  /** Brand colour for the winning side. */
  accent?: 'azure' | 'crusta';
  className?: string;
};

/**
 * The recurring "status quo vs Talentilo" pair: Boolean/Semantic, 4 hours/90 seconds,
 * 20%/98% open rate, 40hrs/1hr. One layout, seven placements across the Platform pages.
 */
export function ComparePanel({ tone = 'light', before, after, accent = 'azure', className }: ComparePanelProps) {
  const accentText = accent === 'crusta' ? 'text-crusta-500' : 'text-azure-600';
  const accentBorder = accent === 'crusta' ? 'border-crusta-300' : 'border-azure-300';
  const accentBadge =
    accent === 'crusta' ? 'bg-crusta-100 text-crusta-700' : 'bg-azure-100 text-azure-800';

  return (
    <div className={cn('grid gap-4 sm:grid-cols-2', className)}>
      <Side tone={tone} side={before} kind="before" />
      <Side
        tone={tone}
        side={after}
        kind="after"
        accentText={accentText}
        accentBorder={accentBorder}
        accentBadge={accentBadge}
      />
    </div>
  );
}

function Side({
  tone,
  side,
  kind,
  accentText,
  accentBorder,
  accentBadge,
}: {
  tone: PanelTone;
  side: CompareSide;
  kind: 'before' | 'after';
  accentText?: string;
  accentBorder?: string;
  accentBadge?: string;
}) {
  const winner = kind === 'after';

  return (
    <div
      className={cn(
        'flex flex-col gap-4 rounded-card border p-6',
        panelSurface(tone),
        winner && accentBorder
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className={cn(
              'grid size-5 shrink-0 place-items-center rounded-full text-[11px]',
              winner
                ? 'bg-emerald-100 text-emerald-700'
                : tone === 'dark'
                  ? 'bg-white/12 text-white/60'
                  : 'bg-ink/10 text-ink/50'
            )}
          >
            {winner ? <Check /> : <Close />}
          </span>
          <p className={cn('text-small font-semibold', panelText(tone))}>{side.label}</p>
        </div>

        {side.badge ? (
          <span
            className={cn(
              'shrink-0 rounded-pill px-2.5 py-1 text-caption font-semibold',
              winner
                ? accentBadge
                : tone === 'dark'
                  ? 'bg-white/10 text-white/65'
                  : 'bg-ink/8 text-ink/75'
            )}
          >
            {side.badge}
          </span>
        ) : null}
      </div>

      {side.value ? (
        <p
          className={cn(
            'font-figure text-[clamp(1.75rem,1.2rem+1.8vw,2.5rem)] leading-[1.1] font-semibold',
            winner ? accentText : panelMuted(tone)
          )}
        >
          {side.value}
        </p>
      ) : null}

      {side.caption ? <p className={cn('text-small', panelMuted(tone))}>{side.caption}</p> : null}

      {side.items?.length ? (
        <ul className={cn('flex flex-col gap-2 text-small', panelMuted(tone))}>
          {side.items.map((item) => (
            <li key={item} className="flex gap-2">
              <span aria-hidden="true" className="mt-1.5 size-1 shrink-0 rounded-full bg-current opacity-50" />
              {item}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

import { panelMuted, panelSurface, panelText, type PanelTone } from '@/components/panels/Panel';
import { cn } from '@/lib/cn';

type DashboardPanelProps = {
  tone?: PanelTone;
  /** The headline metric shown on the gauge, e.g. "CV Shortlist Rate". */
  gaugeLabel: string;
  /** 0–100. Drawn as a semicircle needle gauge. */
  gaugeValue: number;
  /** The trend line under the gauge, e.g. "+12% vs last month". */
  gaugeTrend: string;
  /** The quarter's fulfilment goal, e.g. "Q3 Fulfillment Goal". */
  goalLabel: string;
  /** e.g. "Annual Target: 1,070". */
  goalTarget: string;
  /** How much of the goal is done so far. */
  goalDone: number;
  /** The goal's denominator, e.g. 50 roles filled this quarter. */
  goalOf: number;
  /** The chart's own title, e.g. "CV Submissions". */
  chartLabel: string;
  /** The chart's period selector text, e.g. "This month". */
  chartPeriod: string;
  /** One value per week, oldest first. */
  chartValues: number[];
  chartWeekLabels: string[];
  className?: string;
};

const CARD_SHADOW = 'shadow-[0_10px_30px_rgb(12_10_16/0.06)]';

/** A semicircle needle gauge, drawn from a 0–100 value. */
function Gauge({ value, tone }: { value: number; tone: PanelTone }) {
  const clamped = Math.max(0, Math.min(100, value));
  const angle = -180 + (clamped / 100) * 180;
  const rad = (angle * Math.PI) / 180;
  const cx = 50;
  const cy = 50;
  const r = 34;
  const needleLen = 30;
  const nx = cx + needleLen * Math.cos(rad);
  const ny = cy + needleLen * Math.sin(rad);
  const circumference = Math.PI * r;

  return (
    <svg viewBox="0 0 100 58" className="h-auto w-full" aria-hidden="true">
      <path
        d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        fill="none"
        stroke={tone === 'dark' ? 'rgba(255,255,255,0.15)' : '#E5E7EB'}
        strokeWidth="9"
        strokeLinecap="round"
      />
      <path
        d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        fill="none"
        stroke="#3B82F6"
        strokeWidth="9"
        strokeLinecap="round"
        strokeDasharray={`${(clamped / 100) * circumference} ${circumference}`}
      />
      <line
        x1={cx}
        y1={cy}
        x2={nx}
        y2={ny}
        stroke={panelText(tone) === 'text-white' ? '#fff' : '#171319'}
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <circle cx={cx} cy={cy} r="2.6" fill={panelText(tone) === 'text-white' ? '#fff' : '#171319'} />
    </svg>
  );
}

/** A filled area trend line, drawn from an array of values. */
function AreaChart({ values }: { values: number[] }) {
  const w = 300;
  const h = 110;
  const max = Math.max(...values, 1);
  const step = w / (values.length - 1);
  const points = values.map((v, i) => [i * step, h - (v / max) * h] as const);
  const line = points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x} ${y}`).join(' ');
  const area = `${line} L ${w} ${h} L 0 ${h} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-full w-full" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="dashboard-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#34D399" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#34D399" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#dashboard-area)" />
      <path
        d={line}
        fill="none"
        stroke="#22C55E"
        strokeWidth="2"
        strokeDasharray="4 3"
        strokeLinecap="round"
      />
      {points.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2.2" fill="#22C55E" />
      ))}
    </svg>
  );
}

/**
 * The homepage's operations dashboard mockup, built as markup rather than an exported image.
 *
 * The exported version fixed the metrics into the artwork's pixels, so the copy beside it could
 * only ever describe "Agency Velocity Index" and "Recruitment Velocity" — renaming what the
 * product actually shows meant redrawing the creative in Figma. Live markup keeps the numbers and
 * their labels one edit away from the copy that explains them.
 */
export function DashboardPanel({
  tone = 'light',
  gaugeLabel,
  gaugeValue,
  gaugeTrend,
  goalLabel,
  goalTarget,
  goalDone,
  goalOf,
  chartLabel,
  chartPeriod,
  chartValues,
  chartWeekLabels,
  className,
}: DashboardPanelProps) {
  const goalPct = Math.max(4, Math.min(100, (goalDone / goalOf) * 100));

  return (
    <div className={cn('flex w-full flex-col gap-3', className)}>
      <div className="flex gap-3">
        <div className={cn('flex flex-1 flex-col rounded-card p-4', panelSurface(tone), CARD_SHADOW)}>
          <p className={cn('text-caption font-semibold', panelText(tone))}>{gaugeLabel}</p>
          <div className="mt-2 flex flex-1 items-end justify-center px-2">
            <Gauge value={gaugeValue} tone={tone} />
          </div>
          <p className={cn('-mt-2 text-center font-figure text-lede font-semibold', panelText(tone))}>
            <span className="text-azure-600">{gaugeValue}</span>
            <span className={panelMuted(tone)}>/100</span>
          </p>
          <p
            className={cn(
              'mt-2 border-t pt-2 text-center text-caption font-medium text-positive',
              tone === 'dark' ? 'border-white/10' : 'border-ink/8'
            )}
          >
            {gaugeTrend}
          </p>
        </div>

        <div className={cn('flex flex-1 flex-col rounded-card p-4', panelSurface(tone), CARD_SHADOW)}>
          <p className={cn('text-caption font-semibold', panelText(tone))}>{goalLabel}</p>
          <p className={cn('mt-1 text-caption', panelMuted(tone))}>{goalTarget}</p>
          <p className={cn('mt-3 font-figure text-h4 leading-none font-semibold', panelText(tone))}>
            <span className="text-crusta-500">{goalDone}</span>
            <span className={cn('text-small', panelMuted(tone))}> /{goalOf}</span>
          </p>
          <div
            aria-hidden="true"
            className={cn('mt-3 h-1.5 rounded-pill', tone === 'dark' ? 'bg-white/15' : 'bg-ink/10')}
          >
            <div className="h-full rounded-pill bg-crusta-400" style={{ width: `${goalPct}%` }} />
          </div>
        </div>
      </div>

      <div className={cn('flex flex-1 flex-col rounded-card p-4', panelSurface(tone), CARD_SHADOW)}>
        <div className="flex items-center justify-between gap-3">
          <p className={cn('text-caption font-semibold', panelText(tone))}>{chartLabel}</p>
          <p className={cn('text-caption', panelMuted(tone))}>{chartPeriod}</p>
        </div>
        <div className="mt-2 h-[110px]">
          <AreaChart values={chartValues} />
        </div>
        <div className={cn('mt-1 flex justify-between text-caption', panelMuted(tone))}>
          {chartWeekLabels.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

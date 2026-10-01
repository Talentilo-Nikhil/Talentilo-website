import { E, mix } from '../engine';
import { abs, Av, Card, Pill } from '../parts';
import { B, GRAD, HD, SANS, SB, SERIF } from '../theme';

/**
 * Scene 10 — live targets for one recruiter.
 *
 * Three target cards count up with their bars, the shortlist gauge sweeps, and the monthly bars
 * grow left to right with the last month on the brand gradient.
 */
const CARDS: [string, string, number, string, string][] = [
  ['Revenue', 'Target ₹2,50,000', 112, '₹2,80,000 achieved', B.green],
  ['Interviews Conducted', 'Target 40', 85, '34 of 40', B.blue],
  ['Resume Submission', 'Target 140', 101, '142 of 140', B.orange],
];

const MONTHS = [22, 30, 26, 38, 44, 36, 52, 61];

/**
 * The bars share one scale, with a tick where target sits.
 *
 * The handoff clamped every fill to `Math.min(100, pct)`, so Revenue at 112% and Resume Submission
 * at 101% both rendered as a completely full bar with no track showing — two different numbers,
 * one identical mark, and no way to see that either had passed its target. A dashboard whose
 * figures and bars disagree is the thing that reads as invented.
 *
 * So the track runs 0 to `SCALE` for all three, and a tick marks 100%. Over-target bars now run
 * visibly past the tick and short ones stop before it, which is what the numbers were already
 * saying.
 */
const SCALE = Math.ceil(Math.max(...[112, 85, 101]) / 20) * 20;
const TARGET_AT = (100 / SCALE) * 100;
const LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];

export function Targets({ r }: { r: number }) {
  const g = E.io(1.2, 2.4)(r);

  return (
    <>
      <div style={abs({ left: SB + 36, top: HD + 30, display: 'flex', alignItems: 'center', gap: 16 })}>
        <Av n="Riya Kapoor" c="#fde3cf" f="#a0441b" />
        <div style={{ fontFamily: SERIF, fontSize: 44, color: B.ink }}>Recruiter Performance</div>
      </div>
      <div
        style={abs({
          left: SB + 36, top: HD + 92, display: 'flex', gap: 10, fontFamily: SANS, fontSize: 16,
          color: B.muted, alignItems: 'center',
        })}
      >
        Riya Kapoor · Recruiter <Pill bg="#e3f3dc" fg="#3d7a2b">On Track</Pill>
      </div>

      {CARDS.map(([l, tgt, pct, sub, c], i) => {
        const k = E.pop(0.3 + i * 0.15, 0.8 + i * 0.15)(r);
        const b = E.io(0.6 + i * 0.15, 1.8 + i * 0.15)(r);
        return (
          <Card
            key={l}
            style={{
              left: SB + 36 + i * 340, top: HD + 140, width: 322, height: 210, padding: 24,
              boxSizing: 'border-box', opacity: k, transform: `scale(${mix(0.94, 1, k)})`,
            }}
          >
            <div style={{ fontFamily: SANS, fontSize: 18, fontWeight: 600, color: B.ink }}>{l}</div>
            <div style={{ fontFamily: SANS, fontSize: 16, color: B.muted, marginTop: 2 }}>{tgt}</div>
            <div
              style={{
                marginTop: 18, fontFamily: SANS, fontSize: 44, fontWeight: 600, color: c,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {Math.round(pct * b)}%
            </div>
            <div
              style={{
                position: 'relative', marginTop: 8, height: 8, borderRadius: 4,
                background: '#f0eff4',
              }}
            >
              <div
                style={{
                  height: '100%', width: `${(pct / SCALE) * 100 * b}%`, background: c,
                  borderRadius: 4,
                }}
              />
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute', left: `${TARGET_AT}%`, top: -3, width: 2, height: 14,
                  borderRadius: 1, background: '#9a94ad',
                }}
              />
            </div>
            <div style={{ marginTop: 10, fontFamily: SANS, fontSize: 16, color: B.muted }}>{sub}</div>
          </Card>
        );
      })}

      <Card
        style={{
          left: SB + 36, top: HD + 370, width: 322, height: 330, padding: 24, boxSizing: 'border-box',
        }}
      >
        <div style={{ fontFamily: SANS, fontSize: 18, fontWeight: 600, color: B.ink }}>Shortlist Ratio</div>
        <div style={{ fontFamily: SANS, fontSize: 16, color: B.muted }}>Target 40%</div>
        <svg width="274" height="170" viewBox="0 0 274 170" style={{ marginTop: 14 }}>
          <path
            d="M27,150 A110,110 0 0 1 247,150" fill="none" stroke="#f0eff4" strokeWidth="22"
            strokeLinecap="round"
          />
          <path
            d="M27,150 A110,110 0 0 1 247,150" fill="none" stroke="url(#promo-gauge)" strokeWidth="22"
            strokeLinecap="round" strokeDasharray="346"
            strokeDashoffset={346 * (1 - (0.46 / 0.6) * 0.6 * g * 1.6)}
          />
          <defs>
            <linearGradient id="promo-gauge">
              <stop offset="0" stopColor={B.purple} />
              <stop offset="1" stopColor={B.blue} />
            </linearGradient>
          </defs>
          <text
            x="137" y="140" textAnchor="middle" fontFamily="Outfit" fontSize="44" fontWeight="600"
            fill={B.ink}
          >
            {Math.round(46 * g)}%
          </text>
        </svg>
        <div style={{ fontFamily: SANS, fontSize: 16, fontWeight: 600, color: B.green, textAlign: 'center' }}>
          Target achieved
        </div>
      </Card>

      <Card
        style={{
          left: SB + 376, top: HD + 370, width: 662, height: 330, padding: 24, boxSizing: 'border-box',
        }}
      >
        <div style={{ fontFamily: SANS, fontSize: 18, fontWeight: 600, color: B.ink }}>
          Monthly Performance
        </div>
        <div
          style={abs({
            left: 24, right: 24, bottom: 48, height: 210, display: 'flex', alignItems: 'flex-end',
            gap: 26, borderBottom: `1px solid ${B.line}`,
          })}
        >
          {MONTHS.map((v, i) => {
            const k = E.io(0.8 + i * 0.1, 1.8 + i * 0.1)(r);
            return (
              <div
                key={LABELS[i]}
                style={{
                  flex: 1, height: (v / 64) * 210 * k, borderRadius: '8px 8px 0 0',
                  background: i === MONTHS.length - 1 ? GRAD.replace('90deg', '180deg') : '#dcd7ff',
                }}
              />
            );
          })}
        </div>
        <div style={abs({ left: 24, right: 24, bottom: 18, display: 'flex', gap: 26 })}>
          {LABELS.map((m) => (
            <span
              key={m}
              style={{ flex: 1, textAlign: 'center', fontFamily: SANS, fontSize: 16, color: B.muted }}
            >
              {m}
            </span>
          ))}
        </div>
      </Card>
    </>
  );
}

import type { CSSProperties, ReactNode } from 'react';

import { E, mix } from './engine';
import { B, GRAD, GROUND, HD, SANS, SB, SERIF } from './theme';

export const abs = (s: CSSProperties): CSSProperties => ({ position: 'absolute', ...s });

const NAV = [
  'Jobs',
  'Calling Performance',
  'Offers',
  'Users',
  'Targets',
  'Clients',
  'All Candidates',
  'Emails',
  'WhatsApp',
];

/** The app's header and sidebar, behind every product scene. Unchanged from the handoff. */
export function Shell({ nav, tab }: { nav: string | null; tab: number }) {
  return (
    <>
      <div
        style={abs({
          left: 0, top: 0, right: 0, height: HD, background: B.card,
          borderBottom: `1px solid ${B.line}`, display: 'flex', alignItems: 'center',
        })}
      >
        <div style={{ width: SB, paddingLeft: 26 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/promo/logo-color.png" alt="" style={{ height: 22, width: 'auto', display: 'block' }} />
        </div>
        {['My Workspace', 'Reports & Analytics'].map((t, i) => (
          <div
            key={t}
            style={{
              height: HD, display: 'flex', alignItems: 'center', margin: '0 22px', fontFamily: SANS,
              fontSize: 19, fontWeight: 500, color: tab === i ? B.ink : B.muted,
              borderBottom: tab === i ? `3px solid ${B.purple}` : '3px solid transparent',
              boxSizing: 'border-box',
            }}
          >
            {t}
          </div>
        ))}
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginRight: 28 }}>
          <div
            style={{
              width: 40, height: 40, borderRadius: 20, background: '#fde3cf', display: 'flex',
              alignItems: 'center', justifyContent: 'center', fontFamily: SANS, fontWeight: 600,
              fontSize: 16, color: '#a0521d',
            }}
          >
            AM
          </div>
          <div style={{ fontFamily: SANS, lineHeight: 1.2 }}>
            <div style={{ fontSize: 16, fontWeight: 600, color: B.ink }}>Alex Morgan</div>
            <div style={{ fontSize: 16, color: B.muted }}>Consulting Owner</div>
          </div>
        </div>
      </div>
      <div
        style={abs({
          left: 0, top: HD, width: SB, bottom: 0, background: B.card,
          borderRight: `1px solid ${B.line}`, padding: '72px 14px 0', boxSizing: 'border-box',
          display: 'flex', flexDirection: 'column', gap: 6,
        })}
      >
        {NAV.map((n) => (
          <div
            key={n}
            style={{
              height: 44, display: 'flex', alignItems: 'center', gap: 12, padding: '0 14px',
              borderRadius: 10, background: n === nav ? B.soft : 'transparent', fontFamily: SANS,
              fontSize: 16, whiteSpace: 'nowrap', fontWeight: n === nav ? 600 : 400,
              color: n === nav ? B.ink : B.muted,
            }}
          >
            <span
              style={{
                width: 16, height: 16, borderRadius: 4,
                border: `1.6px solid ${n === nav ? B.purple : B.faint}`,
              }}
            />
            {n}
          </div>
        ))}
      </div>
    </>
  );
}

export const Card = ({ style, children }: { style: CSSProperties; children?: ReactNode }) => (
  <div style={abs({ background: B.card, borderRadius: 18, border: `1px solid ${B.line}`, ...style })}>
    {children}
  </div>
);

export const CardTitle = ({ children }: { children: ReactNode }) => (
  <div style={{ fontFamily: SANS, fontSize: 21, fontWeight: 600, color: B.ink }}>{children}</div>
);

export const Pill = ({
  children, bg, fg, style,
}: { children: ReactNode; bg: string; fg: string; style?: CSSProperties }) => (
  <span
    style={{
      display: 'inline-flex', alignItems: 'center', padding: '4px 12px', borderRadius: 999,
      background: bg, color: fg, fontFamily: SANS, fontSize: 16, fontWeight: 600, ...style,
    }}
  >
    {children}
  </span>
);

/**
 * A headline revealed word by word, each rising out of its own clipped box.
 *
 * The accent words are the reversal's one real casualty and its one real decision. In the handoff
 * they are filled with a light `#9b8cff → #5aa7ff` gradient, which measures 1.10:1 on our ground —
 * invisible, not dim. They keep the gradient device and reverse its lightness instead; see
 * GROUND.accent.
 */
export function Words({
  text, T, at, size = 120, color = GROUND.ink, serifWords = [], stagger = 0.08,
}: {
  text: string; T: number; at: number; size?: number; color?: string;
  serifWords?: number[]; stagger?: number;
}) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: `0 ${size * 0.26}px`, justifyContent: 'center' }}>
      {text.split(' ').map((w, i) => {
        const k = E.in(at + i * stagger, at + 0.55 + i * stagger)(T);
        const s = serifWords.includes(i);
        return (
          <span key={i} style={{ display: 'inline-block', overflow: 'hidden', paddingBottom: size * 0.12 }}>
            <span
              style={{
                display: 'inline-block', fontFamily: s ? SERIF : SANS,
                fontStyle: s ? 'italic' : 'normal', fontWeight: s ? 400 : 600,
                fontSize: s ? size * 1.12 : size, lineHeight: 1,
                letterSpacing: s ? 0 : '-0.03em',
                color: s ? 'transparent' : color,
                backgroundImage: s ? GROUND.accent : 'none',
                WebkitBackgroundClip: s ? 'text' : 'border-box',
                backgroundClip: s ? 'text' : 'border-box',
                transform: `translateY(${(1 - k) * 110}%)`,
              }}
            >
              {w}
            </span>
          </span>
        );
      })}
    </div>
  );
}

/** The kicker and three-line headline left of the window, cross-fading on every cut. */
export function SideCopy({
  T, a, b, kicker, title, serif,
}: { T: number; a: number; b: number; kicker: string; title: string[]; serif: number }) {
  if (T < a - 0.1 || T > b + 0.1) return null;
  const k = E.in(a, a + 0.45)(T);
  const out = E.io(b - 0.3, b)(T);
  return (
    <div
      style={abs({
        left: 90, top: 0, bottom: 0, width: 450, display: 'flex', flexDirection: 'column',
        justifyContent: 'center', opacity: 1 - out, transform: `translateY(${-out * 20}px)`,
      })}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, opacity: k, marginBottom: 22 }}>
        <span style={{ width: 28, height: 3, borderRadius: 2, background: GRAD }} />
        <span
          style={{
            fontFamily: SANS, fontSize: 22, fontWeight: 500, color: GROUND.kicker,
            letterSpacing: '0.04em',
          }}
        >
          {kicker}
        </span>
      </div>
      {title.map((l, i) => {
        const kk = E.in(a + 0.1 + i * 0.12, a + 0.7 + i * 0.12)(T);
        const isS = i === serif;
        return (
          <div key={l} style={{ overflow: 'hidden', paddingBottom: 12 }}>
            <div
              style={{
                fontFamily: isS ? SERIF : SANS, fontStyle: isS ? 'italic' : 'normal',
                fontWeight: isS ? 400 : 600, fontSize: isS ? 76 : 66, lineHeight: 1.08,
                whiteSpace: 'nowrap', letterSpacing: isS ? 0 : '-0.03em',
                color: isS ? 'transparent' : GROUND.ink,
                backgroundImage: isS ? GROUND.accent : 'none',
                WebkitBackgroundClip: isS ? 'text' : 'border-box',
                backgroundClip: isS ? 'text' : 'border-box',
                transform: `translateY(${(1 - kk) * 105}%)`,
              }}
            >
              {l}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * The scripted pointer.
 *
 * Kept dark-filled with a light stroke, which is the handoff's own drawing and happens to be the
 * right way round on our ground too: a dark arrow reads on the pale foot of the wash, and the
 * stroke is the halo that keeps it off the blue at the top.
 */
export function Cursor({ x, y, T, clicks }: { x: number; y: number; T: number; clicks: number[] }) {
  return (
    <div style={abs({ left: x, top: y, zIndex: 30 })}>
      {clicks.map((t, i) => {
        if (T < t || T > t + 0.5) return null;
        const k = E.in(t, t + 0.5)(T);
        return (
          <div
            key={i}
            style={abs({
              left: -30 * k, top: -30 * k, width: 60 * k, height: 60 * k, borderRadius: '50%',
              background: `rgba(80,29,186,${0.3 * (1 - k)})`,
            })}
          />
        );
      })}
      <svg
        width="34" height="40" viewBox="0 0 30 36"
        style={{ position: 'absolute', left: -4, top: -3, filter: 'drop-shadow(0 4px 8px rgba(12,10,16,0.3))' }}
      >
        <polygon
          points="3,2 3,30 10,23 15,34 20,32 15,21 25,21"
          fill={GROUND.ink} stroke="#fff" strokeWidth="2" strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

export { mix };

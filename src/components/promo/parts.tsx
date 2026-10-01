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
 * they are filled with a light `#9b8cff → #5aa7ff` gradient, which measures 1.39:1 on our ground —
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

/** A page's serif title and its meta line, in the window's content area. */
export const PageTitle = ({ title, meta }: { title: string; meta: ReactNode }) => (
  <div style={abs({ left: SB + 36, top: HD + 34 })}>
    <div style={{ fontFamily: SERIF, fontSize: 48, lineHeight: 1, color: B.ink }}>{title}</div>
    <div
      style={{ marginTop: 12, fontFamily: SANS, fontSize: 17, color: B.muted, display: 'flex', gap: 24 }}
    >
      {meta}
    </div>
  </div>
);

/** Initials in a tinted disc, the film's stand-in for a candidate photo. */
export const Av = ({ n, c = '#e8e4ff', f = '#5b4fc4' }: { n: string; c?: string; f?: string }) => (
  <span
    style={{
      width: 36, height: 36, borderRadius: 18, background: c, color: f, display: 'inline-flex',
      alignItems: 'center', justifyContent: 'center', fontFamily: SANS, fontWeight: 600,
      fontSize: 16, flexShrink: 0,
    }}
  >
    {n
      .split(' ')
      .map((w) => w[0])
      .join('')}
  </span>
);

/** An unticked checkbox — decoration in the candidate tables, never toggled. */
export const Box = () => (
  <span
    style={{
      width: 20, height: 20, borderRadius: 5, border: '1.6px solid #c9c9d2',
      display: 'inline-block', boxSizing: 'border-box',
    }}
  />
);

/** The portal's outlined action pill. */
export const OutPill = ({ children, style }: { children: ReactNode; style?: CSSProperties }) => (
  <div
    style={{
      height: 50, display: 'inline-flex', alignItems: 'center', gap: 10, padding: '0 22px',
      borderRadius: 999, border: '1.4px solid #1f1f24', fontFamily: SANS, fontSize: 18,
      fontWeight: 500, color: B.ink, boxSizing: 'border-box', ...style,
    }}
  >
    {children}
  </div>
);

/** The job header the scoring, pipeline and WhatsApp scenes all open under. */
export const JobHead = () => (
  <div style={abs({ left: SB + 36, top: HD + 28 })}>
    <div style={{ fontFamily: SERIF, fontSize: 48, lineHeight: 1, color: B.ink }}>Junior Accountant</div>
    <div style={{ marginTop: 10, fontFamily: SANS, fontSize: 18, color: B.muted }}>
      Job-001380 · Northwind Retail
    </div>
  </div>
);

/** A score dial: green at 85, blue at 70, orange below. Drawn by dash length, so it animates. */
export function Ring({
  v, size = 44, stroke = 5, font = 15, pct,
}: { v: number; size?: number; stroke?: number; font?: number; pct?: boolean }) {
  const rr = (size - stroke) / 2;
  const L = 2 * Math.PI * rr;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ flexShrink: 0 }}>
      <circle cx={size / 2} cy={size / 2} r={rr} fill="none" stroke="#f0eff4" strokeWidth={stroke} />
      <circle
        cx={size / 2} cy={size / 2} r={rr} fill="none"
        stroke={v >= 85 ? '#3fa35a' : v >= 70 ? B.blue : B.orange}
        strokeWidth={stroke} strokeLinecap="round" strokeDasharray={`${(v / 100) * L} ${L}`}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text
        x="50%" y="50%" dy="0.35em" textAnchor="middle" fontFamily="Outfit" fontWeight="600"
        fontSize={font} fill={B.ink}
      >
        {Math.round(v)}
        {pct ? '%' : ''}
      </text>
    </svg>
  );
}

/** A labelled form field, optionally mid-type with a caret. */
export const Field = ({
  label, value, req, k = 1, typed, focus, select, tint,
}: {
  label: string; value: string; req?: boolean; k?: number; typed?: number; focus?: boolean;
  select?: true | 'soft'; tint?: boolean;
}) => (
  <div style={{ fontFamily: SANS }}>
    <div style={{ fontSize: 19, color: B.ink, marginBottom: 10 }}>
      {label}
      {req && <span style={{ color: '#d0312d' }}> *</span>}
    </div>
    <div
      style={{
        height: 58, borderRadius: 29, border: `1px solid ${focus ? '#9cc4ff' : '#dcdce3'}`,
        background: tint ? '#e6efff' : select === 'soft' ? '#f6f7f9' : '#fff', display: 'flex',
        alignItems: 'center', justifyContent: 'space-between', padding: '0 22px', fontSize: 18,
        color: B.ink, opacity: k, boxShadow: focus ? '0 0 0 3px rgba(90,167,255,0.18)' : 'none',
      }}
    >
      <span>
        {typed != null ? value.slice(0, typed) : value}
        {focus && (
          <span
            style={{
              display: 'inline-block', width: 2, height: 20, marginLeft: 1,
              verticalAlign: 'middle', background: B.ink,
            }}
          />
        )}
      </span>
      {select === true && (
        <svg width="14" height="9" viewBox="0 0 14 9">
          <path d="M1 1l6 6 6-6" fill="none" stroke={B.ink} strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      )}
    </div>
  </div>
);

/** The pale-blue secondary button the JD scene's two AI actions sit on. */
export const SoftBtn = ({ children, press = 0 }: { children: ReactNode; press?: number }) => (
  <div
    style={{
      display: 'inline-flex', padding: '13px 22px', borderRadius: 999, background: '#bfe0ff',
      color: '#0e1a2b', fontFamily: SANS, fontSize: 17, fontWeight: 600,
      transform: `scale(${1 - press * 0.06})`,
      boxShadow: press ? '0 0 0 4px rgba(90,167,255,0.25)' : 'none',
    }}
  >
    {children}
  </div>
);

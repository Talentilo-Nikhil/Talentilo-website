import { E, mix } from '../engine';
import { abs, Card, CardTitle, Pill } from '../parts';
import { B, HD, SANS, SB, SERIF } from '../theme';

/**
 * Scene 3 — the dashboard the window opens on.
 *
 * Untouched from the handoff: this is inside the app window, which was already light, so the
 * reversal had nothing to do here. Every figure is the demo data the README says to keep.
 */
const CARDS: [string, number, string, string, string, string][] = [
  ['Offers Released (MTD)', 14, '', 'Sep 2026', 'linear-gradient(160deg,#fde6d2,#fbcfa9)', '#a0441b'],
  ['Offer Accept Rate', 82, '%', '118 / 144 accepted', 'linear-gradient(160deg,#e3edff,#c9dcff)', '#2f55b8'],
  ['Offers Released (FY)', 146, '', 'Apr 2026 – Mar 2027', 'linear-gradient(160deg,#e8f5dc,#cfeab8)', '#3d7a2b'],
];

const NEWS: [string, string][] = [
  ['Offer released for Rahul Verma — CTC ₹25 LPA', 'Revenue Win'],
  ['Offer released for Sneha Iyer — CTC ₹28 LPA', 'Revenue Win'],
  ['Kabir Shah joined Northwind as SAP FICO Lead', 'Joined'],
  ['Offer released for Meera Nair — CTC ₹22 LPA', 'Revenue Win'],
];

export function Workspace({ r }: { r: number }) {
  const lift = E.pop(2.1, 2.7)(r);
  return (
    <>
      <div style={abs({ left: SB + 36, top: HD + 30, fontFamily: SERIF, fontSize: 44, color: B.ink })}>
        Hello, Alex
      </div>

      <Card style={{ left: SB + 36, top: HD + 100, width: 560, height: 470, padding: 28, boxSizing: 'border-box' }}>
        <CardTitle>In the News</CardTitle>
        <div style={{ marginTop: 16 }}>
          {NEWS.map(([t, tag], i) => {
            const k = E.in(0.4 + i * 0.18, 0.9 + i * 0.18)(r);
            return (
              <div
                key={t}
                style={{
                  padding: '14px 0', borderBottom: `1px solid ${B.line}`, opacity: k,
                  transform: `translateY(${(1 - k) * 14}px)`,
                }}
              >
                <Pill
                  bg={tag === 'Joined' ? '#e3f3dc' : '#fff4c2'}
                  fg={tag === 'Joined' ? '#3d7a2b' : '#7a5a00'}
                >
                  {tag}
                </Pill>
                <div style={{ marginTop: 8, fontFamily: SANS, fontSize: 17, color: B.ink }}>{t}</div>
              </div>
            );
          })}
        </div>
      </Card>

      {CARDS.map(([l, v, suf, sub, bg, fg], i) => {
        const k = E.pop(0.3 + i * 0.15, 0.8 + i * 0.15)(r);
        const L = i === 1 ? lift : 0;
        return (
          <div
            key={l}
            style={abs({
              left: SB + 620 + i * 150, top: HD + 100, width: 138, height: 210, borderRadius: 18,
              background: bg, padding: '18px 16px', boxSizing: 'border-box', zIndex: i === 1 ? 3 : 1,
              opacity: k,
              transform: `scale(${mix(0.9, 1, k) * mix(1, 1.45, L)}) translateY(${-L * 30}px)`,
              transformOrigin: '50% 30%',
              boxShadow: L ? `0 ${30 * L}px ${60 * L}px rgba(40,50,120,${0.28 * L})` : 'none',
            })}
          >
            <div style={{ fontFamily: SANS, fontSize: 16, fontWeight: 500, color: fg, lineHeight: 1.3 }}>{l}</div>
            <div
              style={{
                marginTop: 14, fontFamily: SANS, fontSize: 44, fontWeight: 600, color: fg,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {Math.round(v * E.io(0.5, 1.8)(r))}
              {suf}
            </div>
            <div style={{ marginTop: 6, fontFamily: SANS, fontSize: 16, color: fg, opacity: 0.85 }}>{sub}</div>
          </div>
        );
      })}

      <Card style={{ left: SB + 620, top: HD + 330, width: 438, height: 240, padding: 24, boxSizing: 'border-box' }}>
        <CardTitle>Recruitment Velocity</CardTitle>
        <svg width="390" height="150" viewBox="0 0 390 150" style={{ marginTop: 10 }}>
          {[0, 1, 2, 3].map((g) => (
            <line key={g} x1="0" x2="390" y1={20 + g * 38} y2={20 + g * 38} stroke={B.line} />
          ))}
          <path
            d="M0,130 C60,120 90,90 140,80 S230,40 280,36 S360,18 390,14"
            fill="none" stroke={B.green} strokeWidth="3.5" strokeDasharray="600"
            strokeDashoffset={600 * (1 - E.io(0.6, 2.0)(r))} strokeLinecap="round"
          />
        </svg>
      </Card>
    </>
  );
}

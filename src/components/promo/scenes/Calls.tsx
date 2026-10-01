import { E, mix } from '../engine';
import { abs, Av, Card, PageTitle } from '../parts';
import { B, HD, SANS, SB } from '../theme';

/**
 * Scene 9 — calling performance, logged and scored.
 *
 * The recruiter table fills, every target bar fills with it, then the top row's call-by-call
 * breakdown opens over the page.
 */
const CALLS: [string, number, number, string, string, number][] = [
  ['Riya Kapoor', 42, 31, '1h 12m', '2m 19s', 92],
  ['Arjun Nair', 36, 24, '58m 40s', '2m 26s', 78],
  ['Maya Rao', 28, 22, '51m 05s', '2m 19s', 71],
  ['Neha Joshi', 6, 4, '8m 54s', '2m 13s', 20],
];

const COLS = '60px 250px 110px 110px 130px 120px 1fr';

const DETAIL: [string, string, string, number][] = [
  ['10:25 AM', '10:28 AM', '3m 12s', 1],
  ['10:29 AM', '10:31 AM', '2m 04s', 1],
  ['10:32 AM', '10:36 AM', '3m 54s', 1],
  ['10:38 AM', '10:39 AM', '0m 48s', 0],
  ['10:41 AM', '10:44 AM', '2m 51s', 1],
  ['10:46 AM', '10:49 AM', '3m 20s', 1],
];

export function Calls({ r }: { r: number }) {
  const modal = E.in(2.9, 3.4)(r);

  return (
    <>
      <PageTitle
        title="Calling Performance"
        meta={
          <>
            <span>
              Team Total: <b style={{ color: B.ink }}>{Math.round(112 * E.io(0.3, 1.4)(r))} Calls</b>
            </span>
            <span>
              Avg target achieved: <b style={{ color: B.green }}>65%</b>
            </span>
          </>
        }
      />

      <Card style={{ left: SB + 36, top: HD + 150, width: 1010, height: 520, overflow: 'hidden' }}>
        <div
          style={{
            display: 'grid', gridTemplateColumns: COLS, alignItems: 'center', height: 56,
            padding: '0 22px', background: '#fafafc', borderBottom: `1px solid ${B.line}`,
            fontFamily: SANS, fontSize: 16, fontWeight: 500, color: B.muted,
          }}
        >
          {['S.No', 'Recruiter', 'Total Calls', 'Answered', 'Duration', 'Avg/Call', 'Target Achieved'].map(
            (h) => <span key={h}>{h}</span>
          )}
        </div>
        {CALLS.map(([n, t, a, d, avg, pct], i) => {
          const k = E.in(0.4 + i * 0.15, 0.9 + i * 0.15)(r);
          const bar = E.io(0.9 + i * 0.15, 2.0 + i * 0.15)(r);
          return (
            <div
              key={n}
              style={{
                display: 'grid', gridTemplateColumns: COLS, alignItems: 'center', height: 86,
                padding: '0 22px', borderBottom: `1px solid ${B.line}`, fontFamily: SANS,
                fontSize: 17, color: B.ink, opacity: k, transform: `translateY(${(1 - k) * 16}px)`,
                background: i === 0 && r > 2.6 ? '#f7f6ff' : 'transparent',
              }}
            >
              <span>{i + 1}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 12, fontWeight: 500 }}>
                <Av n={n} />
                {n}
              </span>
              <span>{t}</span>
              <span>{a}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 10, height: 10, borderRadius: 5, background: B.green }} />
                {d}
              </span>
              <span>{avg}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span
                  style={{
                    width: 110, height: 8, borderRadius: 4, background: '#f0eff4',
                    overflow: 'hidden',
                  }}
                >
                  <span
                    style={{
                      display: 'block', height: '100%', width: `${pct * bar}%`,
                      background: pct > 60 ? B.green : B.orange, borderRadius: 4,
                    }}
                  />
                </span>
                <b style={{ color: pct > 60 ? B.green : B.orange, fontWeight: 600 }}>
                  {Math.round(pct * bar)}%
                </b>
              </span>
            </div>
          );
        })}
      </Card>

      {modal > 0 && (
        <div style={abs({ inset: 0, background: `rgba(20,18,30,${0.38 * modal})` })}>
          <div
            style={abs({
              left: SB + 120, top: HD + 70, width: 840, height: 610, background: '#fff',
              borderRadius: 22, padding: 36, boxSizing: 'border-box',
              boxShadow: '0 40px 90px rgba(0,0,0,0.3)', opacity: modal,
              transform: `translateY(${(1 - modal) * 40}px) scale(${mix(0.96, 1, modal)})`,
            })}
          >
            <div style={{ fontFamily: SANS, fontSize: 28, fontWeight: 600, color: B.ink }}>
              Call Details – Riya Kapoor
            </div>
            <div style={{ marginTop: 6, fontFamily: SANS, fontSize: 16, color: B.muted }}>
              Total Calls: 42 · Duration: 1h 12m · Target: 92%
            </div>
            <div
              style={{
                marginTop: 24, display: 'grid', gridTemplateColumns: '80px 1fr 1fr 1fr 1fr',
                padding: '0 16px', height: 48, alignItems: 'center', background: '#fafafc',
                fontFamily: SANS, fontSize: 16, color: B.muted,
              }}
            >
              {['Calls', 'Call Started', 'Call Ended', 'Duration', 'Target'].map((h) => (
                <span key={h}>{h}</span>
              ))}
            </div>
            {DETAIL.map(([s, e, d, ok], i) => {
              const k = E.in(3.4 + i * 0.12, 3.8 + i * 0.12)(r);
              return (
                <div
                  key={s}
                  style={{
                    display: 'grid', gridTemplateColumns: '80px 1fr 1fr 1fr 1fr', padding: '0 16px',
                    height: 64, alignItems: 'center', borderBottom: `1px solid ${B.line}`,
                    fontFamily: SANS, fontSize: 17, color: B.ink, opacity: k,
                  }}
                >
                  <span>{i + 1}</span>
                  <span>{s}</span>
                  <span>{e}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span
                      style={{
                        width: 10, height: 10, borderRadius: 5, background: ok ? B.green : B.orange,
                      }}
                    />
                    {d}
                  </span>
                  <span style={{ fontWeight: 600, color: ok ? B.green : B.red }}>
                    {ok ? 'Achieved' : 'Short call'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}

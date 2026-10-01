import { E } from '../engine';
import { DocIco, I, ic } from '../icons';
import { abs } from '../parts';
import { B, HD, SANS, SB, SERIF } from '../theme';

/**
 * Scene 11 — the pre-built report library.
 *
 * Eight cards stagger in, then Recruiter Performance is clicked: its button goes to "Preparing…"
 * and lands on a green "Downloaded".
 */
const RPTS: [string, string][] = [
  ['Client Activity', 'Active vs. dormant client accounts and engagement levels.'],
  ['Recruiter Performance', 'Individual recruiter performance, metrics, and targets.'],
  ['Closure Database', 'Every closed position with joining dates and billing.'],
  ['Client-Wise Open Jobs', 'All active openings, broken down by client.'],
  ['Recruitment Pipeline', 'Candidates tracked across every interview stage.'],
  ['Manager Performance', 'Placements and deliveries under each account manager.'],
  ['Client Performance', 'Revenue and position closure rate per client.'],
  ['Candidate Decline', 'Reason codes and stages where offers were declined.'],
];

export function Reports({ r }: { r: number }) {
  const cl = 1.45;
  const press = E.io(cl - 0.05, cl)(r) * (1 - E.io(cl + 0.02, cl + 0.2)(r));
  const done = r > cl + 0.7;

  return (
    <>
      <div style={abs({ left: SB + 36, top: HD + 28 })}>
        <div style={{ fontFamily: SERIF, fontSize: 48, lineHeight: 1, color: B.ink }}>
          Reports &amp; Analytics
        </div>
        <div style={{ marginTop: 10, fontFamily: SANS, fontSize: 18, color: B.muted }}>
          Pre-built performance, billing and client data.
        </div>
      </div>

      <div
        style={abs({
          left: SB + 36, top: HD + 132, width: 998, height: 56,
          borderBottom: `1px solid ${B.line}`, display: 'flex', alignItems: 'center', gap: 14,
          fontFamily: SANS,
        })}
      >
        <div
          style={{
            height: 56, display: 'flex', alignItems: 'center', padding: '0 16px', fontSize: 18,
            fontWeight: 600, color: B.ink, borderBottom: `3px solid ${B.ink}`, boxSizing: 'border-box',
          }}
        >
          All Reports
        </div>
        <div style={{ flex: 1 }} />
        <div
          style={{
            height: 46, display: 'flex', alignItems: 'center', gap: 22, padding: '0 20px',
            whiteSpace: 'nowrap', flexShrink: 0, borderRadius: 23, border: '1px solid #e3e3ea',
            background: '#fff', fontSize: 16, fontWeight: 500, color: B.ink,
          }}
        >
          {/*
            Was the literal glyph `▦` in orange — a box-drawing character standing in for an icon,
            which no product ships. The set already carries a calendar.
          */}
          Select Date Range{ic(I.calendar, 18, '#e8742f')}
        </div>
        <div
          style={{
            width: 230, flexShrink: 0, whiteSpace: 'nowrap', height: 46, display: 'flex',
            alignItems: 'center', gap: 12, padding: '0 18px', borderRadius: 23,
            border: '1px solid #e3e3ea', background: '#fff', fontSize: 16, color: B.faint,
            boxSizing: 'border-box',
          }}
        >
          {ic(I.search, 18, B.ink)}Search report…
        </div>
      </div>

      <div
        style={abs({
          left: SB + 36, top: HD + 210, width: 998, display: 'grid',
          gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: 16,
        })}
      >
        {RPTS.map(([t, d], i) => {
          const k = E.in(0.05 + i * 0.06, 0.45 + i * 0.06)(r);
          const me = i === 1;
          return (
            <div
              key={t}
              style={{
                height: 270, borderRadius: 14, background: '#fff',
                border: `1px solid ${me && r > 1.1 ? '#cfc8ff' : B.line}`,
                boxShadow: me && r > 1.1 ? '0 10px 28px rgba(110,100,220,0.14)' : 'none',
                padding: '18px 20px', boxSizing: 'border-box', position: 'relative',
                fontFamily: SANS, opacity: k, transform: `translateY(${(1 - k) * 16}px)`,
              }}
            >
              <DocIco />
              <div style={{ fontSize: 19, fontWeight: 500, color: B.ink, marginTop: 16 }}>{t}</div>
              <div style={{ fontSize: 16, lineHeight: 1.55, color: B.muted, marginTop: 10, textWrap: 'pretty' }}>
                {d}
              </div>
              <div
                style={abs({
                  left: 20, bottom: 20, height: 42, padding: '0 18px', borderRadius: 21,
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: me && done ? '#2e8b3e' : '#0b0b10', color: '#fff', fontSize: 16,
                  fontWeight: 600, transform: `scale(${1 - (me ? press : 0) * 0.08})`,
                })}
              >
                {me && done ? '✓ Downloaded' : me && r > cl ? 'Preparing…' : 'Download'}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

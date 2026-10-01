import { E, mix } from '../engine';
import { I, ic } from '../icons';
import { abs, Box, Card, JobHead, OutPill, Pill, Ring } from '../parts';
import { B, HD, SANS, SB, WH, WW } from '../theme';

/**
 * Scene 5 — every resume scored against the JD.
 *
 * The candidate table counts its scores up, the matched row highlights, then the scoring breakdown
 * opens over it with four criteria dials and the matched/missing skill chips.
 */
const ROWS: [string, string, number, string][] = [
  ['Aditi Sharma', 'Pune', 48, 'Unreviewed'],
  ['Rahul Pillai', 'Mumbai', 93, 'Unreviewed'],
  ['Farah Qureshi', 'Pune', 57, 'Unreviewed'],
  ['Nikhil Jain', 'Nagpur', 86, 'Manager Review'],
  ['Tanvi Gupta', 'Thane', 79, 'Unreviewed'],
];

const COLS = '56px 60px 300px 150px 170px 1fr';

const CRIT: [string, number, string][] = [
  ['Location', 100, 'Based in Mumbai — matches the job location.'],
  ['Experience', 90, '3 yrs in accounts payable and GST returns.'],
  ['Skills Score', 92, 'Strong Tally Prime and Excel; good SAP.'],
  ['Education', 100, 'B.Com — meets the JD requirement.'],
];

const MATCHED = ['tally prime', 'bank reconciliation', 'gst returns', 'advanced excel', 'accounts payable'];
const MISSING = ['payroll processing', 'fixed asset register'];

export function Scoring({ r }: { r: number }) {
  const m = E.io(1.35, 1.75)(r);
  const hl = E.in(1.1, 1.3)(r);

  return (
    <>
      <JobHead />

      <div
        style={abs({
          left: SB + 36, top: HD + 128, width: 998, height: 52,
          borderBottom: `1px solid ${B.line}`, display: 'flex', gap: 30, fontFamily: SANS,
          fontSize: 19,
        })}
      >
        {['Summary', 'Candidates', 'Notes', 'Attachments'].map((t, i) => (
          <div
            key={t}
            style={{
              height: 52, display: 'flex', alignItems: 'center', padding: '0 10px',
              color: i === 1 ? B.ink : B.muted, fontWeight: i === 1 ? 600 : 400,
              borderBottom: i === 1 ? `2px solid ${B.purple}` : '2px solid transparent',
              boxSizing: 'border-box',
            }}
          >
            {t}
          </div>
        ))}
      </div>

      <div
        style={abs({
          left: SB + 36, top: HD + 200, width: 998, display: 'flex', alignItems: 'center', gap: 14,
        })}
      >
        <div
          style={{
            width: 340, height: 50, borderRadius: 25, border: '1px solid #e3e3ea',
            background: '#fff', display: 'flex', alignItems: 'center', gap: 12, padding: '0 20px',
            boxSizing: 'border-box', fontFamily: SANS, fontSize: 17, color: B.faint,
          }}
        >
          {ic(I.search, 18, B.faint)}Search for candidate…
        </div>
        <div style={{ flex: 1 }} />
        <OutPill>Tracker data</OutPill>
        <OutPill style={{ width: 50, padding: 0, justifyContent: 'center' }}>{ic(I.dl, 18, B.ink)}</OutPill>
        <OutPill style={{ background: '#0b0b10', color: '#fff', borderColor: '#0b0b10' }}>
          + Add Candidate
        </OutPill>
      </div>

      <Card
        style={{
          left: SB + 36, top: HD + 272, width: 998, height: 456, borderRadius: 14,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            display: 'grid', gridTemplateColumns: COLS, alignItems: 'center', height: 56,
            background: '#fafafc', borderBottom: `1px solid ${B.line}`, fontFamily: SANS,
            fontSize: 16, color: B.muted,
          }}
        >
          <span style={{ paddingLeft: 20 }}><Box /></span>
          <span>Sr.No</span>
          <span>Candidate ↓</span>
          <span style={{ paddingLeft: 20 }}>Scoring</span>
          <span>Submitted</span>
          <span>Candidate Status</span>
        </div>
        {ROWS.map(([n, loc, v, st], i) => {
          const k = E.in(i * 0.05, 0.3 + i * 0.05)(r);
          const sc = Math.round(v * E.io(0.1 + i * 0.06, 0.8 + i * 0.06)(r));
          return (
            <div
              key={n}
              style={{
                display: 'grid', gridTemplateColumns: COLS, alignItems: 'center', height: 80,
                borderBottom: `1px solid ${B.line}`, fontFamily: SANS, fontSize: 18, color: B.ink,
                opacity: k, background: i === 1 ? `rgba(239,238,254,${hl})` : 'transparent',
              }}
            >
              <span style={{ paddingLeft: 20 }}><Box /></span>
              <span style={{ fontWeight: 600, paddingLeft: 14 }}>{i + 1}</span>
              <div>
                <div style={{ fontWeight: 600 }}>{n}</div>
                <div style={{ fontSize: 15, color: B.muted, marginTop: 2 }}>{loc}</div>
              </div>
              <div
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '0 20px', fontWeight: 600,
                }}
              >
                {sc}%{ic(I.info, 22, '#3b82f6')}
              </div>
              <span>27 Sep 2026</span>
              <span>
                <Pill bg="#f1f1f4" fg={B.muted} style={{ fontWeight: 500, padding: '7px 16px' }}>{st}</Pill>
              </span>
            </div>
          );
        })}
      </Card>

      {m > 0 && (
        <div
          style={abs({
            left: 0, top: 0, width: WW, height: WH,
            background: `rgba(20,18,30,${0.38 * m})`, zIndex: 5,
          })}
        >
          <div
            style={abs({
              left: (WW - 820) / 2, top: 36, width: 820, height: 788, background: '#fff',
              borderRadius: 22, boxShadow: '0 30px 80px rgba(0,0,0,0.25)', padding: '30px 36px',
              boxSizing: 'border-box', opacity: m,
              transform: `translateY(${(1 - m) * 24}px) scale(${mix(0.97, 1, m)})`,
              fontFamily: SANS,
            })}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 30, fontWeight: 600, color: B.ink }}>Scoring</span>
              {ic(I.x, 22, B.ink)}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 22 }}>
              <span
                style={{
                  width: 52, height: 52, borderRadius: 26, background: '#cfe3ff', color: '#1f4f9a',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600,
                  fontSize: 18,
                }}
              >
                RP
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 21, fontWeight: 600, color: B.ink }}>Rahul Pillai</div>
                <div style={{ fontSize: 15, color: B.muted, letterSpacing: '0.04em' }}>MUMBAI</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 46, fontWeight: 600, color: '#2e8b3e', lineHeight: 1 }}>
                  {Math.round(93 * E.io(1.5, 2.4)(r))}%
                </div>
                <div style={{ fontSize: 15, color: B.muted, marginTop: 4 }}>Overall Score</div>
              </div>
            </div>
            <div
              style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 24 }}
            >
              {CRIT.map(([t, v, d], i) => {
                const k = E.io(1.6 + i * 0.1, 2.5 + i * 0.1)(r);
                return (
                  <div
                    key={t}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 16, padding: '18px 18px',
                      borderRadius: 16, border: `1px solid ${B.line}`, opacity: Math.min(1, k * 2),
                    }}
                  >
                    <Ring v={v * k} size={68} stroke={6} font={16} pct />
                    <div>
                      <div style={{ fontSize: 19, fontWeight: 600, color: B.ink }}>{t}</div>
                      <div style={{ fontSize: 16, color: B.muted, lineHeight: 1.4, marginTop: 3 }}>{d}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ fontSize: 19, fontWeight: 600, color: B.ink, margin: '26px 0 12px' }}>
              Skills Match
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {MATCHED.map((c, i) => {
                const k = E.pop(2.4 + i * 0.07, 2.7 + i * 0.07)(r);
                return (
                  <span
                    key={c}
                    style={{
                      padding: '7px 14px', borderRadius: 999, background: '#dff2e3',
                      color: '#2b6b37', fontSize: 16, fontWeight: 600,
                      opacity: Math.min(1, k * 1.3), transform: `scale(${mix(0.7, 1, k)})`,
                    }}
                  >
                    ✓ {c}
                  </span>
                );
              })}
            </div>
            <div style={{ fontSize: 19, fontWeight: 600, color: B.ink, margin: '22px 0 12px' }}>
              Missing Skills
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {MISSING.map((c, i) => {
                const k = E.pop(2.8 + i * 0.07, 3.1 + i * 0.07)(r);
                return (
                  <span
                    key={c}
                    style={{
                      padding: '7px 14px', borderRadius: 999, background: '#fde4e1',
                      color: '#b3261e', fontSize: 16, fontWeight: 600,
                      opacity: Math.min(1, k * 1.3), transform: `scale(${mix(0.7, 1, k)})`,
                    }}
                  >
                    × {c}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

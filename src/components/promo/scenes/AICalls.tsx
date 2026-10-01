import { E, mix } from '../engine';
import { abs, Av, Card, CardTitle, PageTitle, Pill } from '../parts';
import { B, GRAD, HD, SANS, SB } from '../theme';

/**
 * Scene 6 — the AI voice agent working a passive list.
 *
 * The queue fills in one candidate at a time, the dial counter runs to 500, the waveform runs off
 * `r` rather than a keyframe, and the one candidate who passes gets a booked meeting.
 */
const QUEUE: [string, string, number][] = [
  ['Rohit M.', 'Voicemail — no callback', 0],
  ['Sneha K.', 'Not looking right now', 0],
  ['Imran S.', 'Salary out of range', 0],
  ['Sarah J.', 'Interested · salary matched', 1],
  ['Divya R.', 'Number unreachable', 0],
  ['Karan B.', 'Wrong stack', 0],
];

const LINES: [string, string][] = [
  ['Talentilo AI', 'Hi Sarah, quick check on the Senior Developer role. Is ₹32 LPA within your range?'],
  ['Sarah', 'Yes, that works. I’d like to hear more about the team.'],
  ['Talentilo AI', 'Great. I’ve booked you with Daniel on Oct 14 at 11 AM.'],
];

export function AICalls({ r }: { r: number }) {
  const dialled = Math.round(500 * E.io(0.2, 4.6)(r));
  const booked = E.pop(4.2, 4.7)(r);

  return (
    <>
      <PageTitle
        title="AI Screening"
        meta={
          <>
            <span>Senior React Developer</span>
            <span>
              Passive list · <b style={{ color: B.ink }}>{dialled}</b> / 500 dialled
            </span>
          </>
        }
      />

      <Card style={{ left: SB + 36, top: HD + 150, width: 440, height: 560, padding: 24, boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <CardTitle>Call queue</CardTitle>
          <Pill bg={B.soft} fg="#5b4fc4">● AI working the list</Pill>
        </div>
        <div style={{ marginTop: 10 }}>
          {QUEUE.map(([n, why, ok], i) => {
            const k = E.in(0.4 + i * 0.35, 0.8 + i * 0.35)(r);
            return (
              <div
                key={n}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '13px 10px',
                  borderBottom: `1px solid ${B.line}`, borderRadius: ok ? 12 : 0,
                  background: ok ? '#eef8ea' : 'transparent', opacity: ok ? k : k * 0.8,
                  fontFamily: SANS,
                }}
              >
                <Av n={n} c={ok ? '#d6efcc' : '#f0eff4'} f={ok ? '#3d7a2b' : B.muted} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 17, fontWeight: 600, color: B.ink }}>{n}</div>
                  <div style={{ fontSize: 16, color: ok ? '#3d7a2b' : B.muted }}>{why}</div>
                </div>
                {ok ? (
                  <Pill bg="#3d7a2b" fg="#fff">Passed</Pill>
                ) : (
                  <Pill bg="#f3f3f6" fg={B.muted}>Filtered</Pill>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      <Card style={{ left: SB + 500, top: HD + 150, width: 546, height: 560, padding: 26, boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              width: 52, height: 52, borderRadius: 26, background: GRAD, display: 'flex',
              alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: SANS,
              fontWeight: 700, fontSize: 18,
            }}
          >
            AI
          </div>
          <div style={{ flex: 1, fontFamily: SANS }}>
            <div style={{ fontSize: 19, fontWeight: 600, color: B.ink }}>AI Voice Agent</div>
            <div style={{ fontSize: 16, color: B.muted }}>Calling Sarah J. · Sr. Developer</div>
          </div>
          <span
            style={{
              fontFamily: SANS, fontSize: 18, fontWeight: 600, color: B.ink,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            0{Math.floor((20 + r * 12) / 60)}:{String(Math.floor(20 + r * 12) % 60).padStart(2, '0')}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, height: 54, margin: '18px 0 8px' }}>
          {Array.from({ length: 60 }, (_, i) => (
            <div
              key={i}
              style={{
                width: 4, borderRadius: 2,
                height: 6 + Math.abs(Math.sin(r * 7 + i * 0.8) * Math.cos(r * 2.9 + i * 0.33)) * 46,
                background: i % 5 === 0 ? B.orange : i % 2 ? B.purple : B.blue,
              }}
            />
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {LINES.map(([who, t], i) => {
            const k = E.in(1.0 + i * 1.0, 1.5 + i * 1.0)(r);
            const ai = who !== 'Sarah';
            return (
              <div
                key={t}
                style={{
                  alignSelf: ai ? 'flex-start' : 'flex-end', maxWidth: 400, padding: '12px 16px',
                  borderRadius: 16, background: ai ? B.soft : '#f3f3f6', fontFamily: SANS,
                  fontSize: 16, lineHeight: 1.4, color: B.ink, opacity: k,
                  transform: `translateY(${(1 - k) * 12}px)`,
                }}
              >
                <div
                  style={{
                    fontSize: 16, fontWeight: 600, color: ai ? '#5b4fc4' : B.muted, marginBottom: 3,
                  }}
                >
                  {who}
                </div>
                {t}
              </div>
            );
          })}
        </div>
        <div
          style={abs({
            left: 26, right: 26, bottom: 24, display: 'flex', alignItems: 'center', gap: 12,
            padding: '14px 18px', borderRadius: 14, background: '#eef8ea', opacity: booked,
            transform: `scale(${mix(0.85, 1, booked)})`,
          })}
        >
          <span
            style={{
              width: 30, height: 30, borderRadius: 15, background: '#3d7a2b', display: 'flex',
              alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14">
              <path
                d="M3 7.5l2.5 2.5L11 4.5" fill="none" stroke="#fff" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round"
              />
            </svg>
          </span>
          <div style={{ fontFamily: SANS, flex: 1 }}>
            <div style={{ fontSize: 17, fontWeight: 600, color: '#2e6b20' }}>
              Meeting booked · Oct 14, 11:00 AM
            </div>
            <div style={{ fontSize: 16, color: '#3d7a2b' }}>
              Salary matched · interest verified · fit 94/100
            </div>
          </div>
        </div>
      </Card>
    </>
  );
}

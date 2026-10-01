import { E, mix } from '../engine';
import { I, ic } from '../icons';
import { abs, Av, JobHead, OutPill } from '../parts';
import { B, HD, SANS, SB, WH, WW } from '../theme';

/**
 * Scene 7 — the pipeline, then the WhatsApp invite.
 *
 * A card is dragged from Manager Review to Interview (lifting and rotating as it goes), the column
 * counts move with it, and the WhatsApp panel slides in with a templated invite, the candidate's
 * slot pick and the confirmation.
 */
const WA = { head: '#075e54', bg: '#efeae2', out: '#d9fdd3', tick: '#53bdeb', btn: '#25d366' } as const;

const KCOLS: [string, number, number, string, string, string][] = [
  ['Manager Review', 20, 220, '#f1f1f4', '#e3e3ea', '#e3e3ea'],
  ['Client Review', 260, 300, '#eef5ff', '#cfe0fb', '#cfe0fb'],
  ['Shortlisted', 580, 60, '#f0edff', '#d6cffb', '#d6cffb'],
  ['Interview', 660, 318, '#fdf0f6', '#f6cfe2', '#f8d3e6'],
];

const MSGS: [number, string, number][] = [
  [
    0,
    'Hi Rahul, you’re shortlisted for Junior Accountant at Northwind Retail. Interview on Thu, 2 Oct — which slot suits you?',
    1.95,
  ],
  [1, '11 AM works for me, thanks!', 2.85],
  [0, 'Confirmed ✓ Invite sent for Thu, 11:00 AM.', 3.4],
];

/** One candidate card on the board. `lift` raises and tilts it while it is being dragged. */
function KCard({
  n, loc, ph, v, x, y, lift = 0, tag = 0, press = 0,
}: {
  n: string; loc: string; ph: string; v: number; x: number; y: number; lift?: number;
  tag?: number; press?: number;
}) {
  const btn = (d: React.ReactNode, bg: string, bd?: string, p = 0) => (
    <span
      style={{
        width: 46, height: 46, borderRadius: 23, background: bg,
        border: bd ? `1px solid ${bd}` : 'none', display: 'flex', alignItems: 'center',
        justifyContent: 'center', boxSizing: 'border-box', transform: `scale(${1 - p * 0.12})`,
        boxShadow: p ? `0 0 0 6px rgba(37,211,102,${0.25 * p})` : 'none',
      }}
    >
      {d}
    </span>
  );
  return (
    <div
      style={abs({
        left: x, top: y, width: 276, height: 228, borderRadius: 16, background: '#fff',
        boxShadow: `0 ${2 + lift * 18}px ${6 + lift * 30}px rgba(30,30,60,${0.06 + lift * 0.12})`,
        transform: `rotate(${lift * 2}deg)`, fontFamily: SANS, zIndex: lift > 0 ? 3 : 1,
      })}
    >
      <div style={abs({ left: 16, top: 16, right: 16, display: 'flex', alignItems: 'center', gap: 10 })}>
        <Av n={n} c="#dbe9ff" f="#1f4f9a" />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 18, fontWeight: 600, color: B.ink }}>{n}</div>
          <div style={{ fontSize: 14, color: B.muted }}>{loc}</div>
        </div>
        {tag > 0 && (
          <span
            style={{
              padding: '3px 10px', borderRadius: 6, background: '#fbd3e6', color: '#9c2a5f',
              fontSize: 13, fontWeight: 600, opacity: tag, transform: `scale(${mix(0.7, 1, tag)})`,
            }}
          >
            Interview
          </span>
        )}
      </div>
      <div style={abs({ left: 16, top: 72, fontSize: 15, color: B.muted, lineHeight: 1.6 })}>
        <div>Contact: <span style={{ color: B.ink }}>{ph}</span></div>
        <div>Scoring: <span style={{ color: B.ink, fontWeight: 600 }}>{v}%</span></div>
      </div>
      <div
        style={abs({
          left: 16, right: 16, top: 128, display: 'flex', justifyContent: 'center', gap: 12,
        })}
      >
        {btn(ic(I.mail, 18, B.muted), '#fff', '#e3e3ea')}
        {btn(ic(I.phone, 18, '#3b82f6'), '#fff', '#e3e3ea')}
        {btn(ic(I.wa, 22, '#fff', 1.7), WA.btn, undefined, press)}
        {btn(ic(I.ban, 18, '#d0312d'), '#fdecea')}
      </div>
      <div
        style={abs({
          left: 16, right: 16, bottom: 12, paddingTop: 10, borderTop: `1px solid ${B.line}`,
          display: 'flex', justifyContent: 'space-between', fontSize: 14, color: B.muted,
        })}
      >
        <span>By Daniel Reyes</span>
        <span>0 day</span>
      </div>
    </div>
  );
}

export function WhatsApp({ r }: { r: number }) {
  const press = (t: number) => E.io(t - 0.05, t)(r) * (1 - E.io(t + 0.02, t + 0.2)(r));
  const mv = E.io(0.55, 1.2)(r);
  const up = E.io(0.8, 1.35)(r);
  const pan = E.io(1.6, 1.95)(r);
  const pick = E.io(2.6, 2.67)(r) * (1 - E.io(2.7, 2.85)(r));
  const cnt = (a: number, b: number) => (mv > 0.5 ? b : a);

  return (
    <>
      <JobHead />

      <div style={abs({ left: SB + 36, top: HD + 132, display: 'flex', alignItems: 'center', gap: 12 })}>
        <OutPill
          style={{ border: 'none', background: '#eef5e6', transform: `scale(${1 - press(0.45) * 0.06})` }}
        >
          {ic(I.move, 18, B.ink)}Move Stage
        </OutPill>
        <OutPill style={{ border: 'none', background: '#fdecea', color: '#c0392b' }}>
          {ic(I.ban, 18, '#c0392b')}Reject
        </OutPill>
        <span
          style={{
            width: 50, height: 50, borderRadius: 25, background: WA.btn, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
          }}
        >
          {ic(I.wa, 24, '#fff', 1.7)}
        </span>
        <OutPill style={{ borderColor: '#e3e3ea' }}>{ic(I.refresh, 18, B.ink)}Scoring</OutPill>
        <OutPill style={{ borderColor: '#e3e3ea' }}>{ic(I.mail, 18, B.ink)}Send Email</OutPill>
      </div>

      <div
        style={abs({
          left: SB + 36, top: HD + 212, width: 998, height: 560, borderRadius: 18,
          background: '#f7f7fa', overflow: 'hidden',
        })}
      >
        {KCOLS.map(([t, x, w, bg, bd, badge], i) => (
          <div
            key={t}
            style={abs({
              left: x, top: 20, width: w, height: 520, borderRadius: 16, background: bg,
              border: `1.5px solid ${bd}`, boxSizing: 'border-box',
            })}
          >
            {i === 2 ? (
              <div
                style={abs({
                  left: 0, right: 0, top: 18, display: 'flex', flexDirection: 'column',
                  alignItems: 'center', gap: 12, fontFamily: SANS,
                })}
              >
                <span style={{ fontSize: 18, color: B.ink }}>›</span>
                <span
                  style={{
                    writingMode: 'vertical-rl', fontSize: 18, fontWeight: 600, color: B.ink,
                  }}
                >
                  Shortlisted
                </span>
                <span
                  style={{ padding: '1px 8px', borderRadius: 6, background: badge, fontSize: 14, fontWeight: 600 }}
                >
                  0
                </span>
              </div>
            ) : (
              <div
                style={abs({
                  left: 18, top: 16, display: 'flex', alignItems: 'center', gap: 10,
                  fontFamily: SANS, fontSize: 18, fontWeight: 600, color: B.ink,
                })}
              >
                {ic(I.chev, 16, B.ink)}
                {t}
                <span style={{ padding: '1px 9px', borderRadius: 6, background: badge, fontSize: 14 }}>
                  {i === 0 ? 0 : i === 1 ? cnt(3, 2) : cnt(0, 1)}
                </span>
              </div>
            )}
          </div>
        ))}
        <KCard n="Aditi Sharma" loc="Pune" ph="98450 21873" v={48} x={272} y={mix(72 + 242, 72, up)} />
        <KCard n="Nikhil Jain" loc="Nagpur" ph="97302 55610" v={86} x={272} y={mix(72 + 484, 72 + 242, up)} />
        <KCard
          n="Rahul Pillai" loc="Mumbai" ph="98201 44517" v={93}
          x={mix(272, 681, mv)} y={72 - Math.sin(mv * Math.PI) * 18}
          lift={Math.sin(mv * Math.PI)} tag={E.pop(1.15, 1.45)(r)} press={press(1.55)}
        />
      </div>

      {pan > 0 && (
        <div
          style={abs({
            left: WW - 24 - 480, top: HD + 20, width: 480, height: WH - HD - 44, borderRadius: 18,
            overflow: 'hidden', background: WA.bg, boxShadow: '0 30px 70px rgba(0,0,0,0.22)',
            opacity: pan, transform: `translateX(${(1 - pan) * 60}px)`, zIndex: 5,
          })}
        >
          <div
            style={{
              height: 76, background: WA.head, display: 'flex', alignItems: 'center', gap: 14,
              padding: '0 20px',
            }}
          >
            <Av n="Rahul Pillai" c="#dff3e6" f={WA.head} />
            <div style={{ fontFamily: SANS, color: '#fff', flex: 1 }}>
              <div style={{ fontSize: 18, fontWeight: 600 }}>Rahul Pillai</div>
              <div style={{ fontSize: 14, opacity: 0.85 }}>+91 98201 44517 · WhatsApp Business</div>
            </div>
            {ic(I.x, 20, '#fff')}
          </div>
          <div style={{ padding: '14px 20px 0', textAlign: 'center' }}>
            <span
              style={{
                padding: '5px 12px', borderRadius: 8, background: '#fff', fontFamily: SANS,
                fontSize: 13, color: '#54656f',
              }}
            >
              Template · Interview invite
            </span>
          </div>
          <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            {MSGS.map(([me, t, at], i) => {
              const k = E.pop(at, at + 0.4)(r);
              const out = me === 0;
              if (k <= 0) return null;
              return (
                <div
                  key={t}
                  style={{
                    alignSelf: out ? 'flex-end' : 'flex-start', maxWidth: 380,
                    opacity: Math.min(1, k * 1.3), transform: `scale(${mix(0.85, 1, k)})`,
                    transformOrigin: out ? '100% 100%' : '0 100%',
                  }}
                >
                  <div
                    style={{
                      padding: '12px 14px 8px', borderRadius: 12, background: out ? WA.out : '#fff',
                      boxShadow: '0 1px 1px rgba(0,0,0,0.08)', fontFamily: SANS, fontSize: 17,
                      lineHeight: 1.4, color: '#111b21',
                    }}
                  >
                    {t}
                    <div style={{ textAlign: 'right', fontSize: 13, color: '#667781', marginTop: 4 }}>
                      11:0{i + 2}{' '}
                      {out && <span style={{ color: WA.tick, fontWeight: 700 }}>✓✓</span>}
                    </div>
                  </div>
                  {i === 0 && (
                    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                      {['11:00 AM', '3:00 PM'].map((o, j) => (
                        <div
                          key={o}
                          style={{
                            flex: 1, textAlign: 'center', padding: '10px 0', borderRadius: 10,
                            background: '#fff', color: '#027eb5', fontFamily: SANS, fontSize: 16,
                            fontWeight: 600, boxShadow: '0 1px 1px rgba(0,0,0,0.08)',
                            transform: j === 0 ? `scale(${1 - pick * 0.06})` : 'none',
                          }}
                        >
                          {o}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}

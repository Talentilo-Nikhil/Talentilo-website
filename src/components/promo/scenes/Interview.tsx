import { E } from '../engine';
import { I, ic } from '../icons';
import { abs } from '../parts';
import { B, SANS, WH, WW } from '../theme';

/**
 * Scene 8 — the candidate call sheet.
 *
 * Questions with ideal answers scroll up the left while the enquiry fields fill themselves one at a
 * time on the right, then Submit is pressed and the capture is saved to the profile.
 */
const CQ: [string, string][] = [
  [
    'Walk me through posting daily vouchers in Tally Prime while keeping ledgers accurate.',
    'Collect source documents, check them against policy, choose the right voucher type and ledger, run Tally’s validation checks, then post and share a daily summary with the finance lead.',
  ],
  [
    'How do you reconcile bank statements in Tally and resolve mismatches?',
    'Import the statement, auto-match entries, investigate unmatched items for timing or fee differences, and pass adjusting journal entries.',
  ],
  [
    'How do you handle GST input credit that doesn’t match GSTR-2B?',
    'Compare the purchase register with 2B, chase vendors for missing invoices, and hold the credit until it reflects.',
  ],
];

const ENQ: [string, string][] = [
  ['Current Organization', 'Ledgerline Pvt Ltd'],
  ['Education', 'B.Com'],
  ['Total Experience', '3 years'],
  ['Current Compensation', '₹4.2 LPA'],
  ['Expected Compensation', '₹5.5 LPA'],
  ['Notice Period', '30 days'],
];

export function Interview({ r }: { r: number }) {
  const press = E.io(3.65, 3.7)(r) * (1 - E.io(3.72, 3.9)(r));
  const saved = E.pop(3.8, 4.15)(r);
  const scroll = E.io(2.0, 3.0)(r) * 190;

  return (
    <div
      style={abs({
        left: 0, top: 0, width: WW, height: WH, background: 'rgba(20,18,30,0.38)', zIndex: 5,
      })}
    >
      <div
        style={abs({
          left: 30, top: 30, width: WW - 60, height: WH - 60, background: '#fff', borderRadius: 22,
          boxShadow: '0 30px 80px rgba(0,0,0,0.25)', overflow: 'hidden', fontFamily: SANS,
        })}
      >
        <div style={abs({ left: 44, top: 34 })}>
          <div style={{ fontSize: 32, fontWeight: 600, color: B.ink }}>Candidate Call</div>
          <div style={{ fontSize: 18, color: B.muted, marginTop: 6 }}>
            Capture candidate details during the call
          </div>
        </div>
        <div style={abs({ right: 44, top: 44 })}>{ic(I.x, 24, B.ink)}</div>

        <div
          style={abs({
            left: 36, top: 140, width: 640, bottom: 36, borderRadius: 18, background: '#f6f6f9',
            overflow: 'hidden',
          })}
        >
          <div style={abs({ left: 28, top: 24, fontSize: 22, fontWeight: 600, color: B.ink })}>
            Candidate Questions
          </div>
          <div
            style={abs({
              left: 20, right: 20, top: 74, transform: `translateY(${-scroll}px)`, display: 'flex',
              flexDirection: 'column', gap: 16,
            })}
          >
            {CQ.map(([q, a], i) => {
              const k = E.in(0.1 + i * 0.15, 0.5 + i * 0.15)(r);
              return (
                <div
                  key={q}
                  style={{
                    background: '#fff', borderRadius: 14, padding: '20px 22px', opacity: k,
                    transform: `translateY(${(1 - k) * 14}px)`,
                  }}
                >
                  <div style={{ fontSize: 18, fontWeight: 600, color: B.ink, lineHeight: 1.45 }}>
                    Q{i + 1}. {q}
                  </div>
                  <div style={{ fontSize: 16, color: B.muted, lineHeight: 1.6, marginTop: 12 }}>
                    <span style={{ color: '#2e9e4f', fontWeight: 600 }}>Ideal Answer: </span>
                    {a}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={abs({ left: 720, top: 140, right: 44 })}>
          <div style={{ fontSize: 22, fontWeight: 600, color: B.ink, marginBottom: 18 }}>
            Enquiry Questions
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '22px 26px' }}>
            {ENQ.map(([l, v], i) => {
              const a = 0.5 + i * 0.45;
              const k = E.io(a, a + 0.35)(r);
              const n = Math.floor(v.length * k);
              const focus = r > a - 0.05 && r < a + 0.45;
              return (
                <div key={l}>
                  <div style={{ fontSize: 17, fontWeight: 600, color: B.ink, marginBottom: 8 }}>{l}</div>
                  <div
                    style={{
                      height: 54, borderRadius: 27,
                      border: `1px solid ${focus ? '#9cc4ff' : '#dcdce3'}`,
                      boxShadow: focus ? '0 0 0 3px rgba(90,167,255,0.18)' : 'none',
                      display: 'flex', alignItems: 'center', padding: '0 22px', fontSize: 17,
                      color: n ? B.ink : B.faint, whiteSpace: 'nowrap', overflow: 'hidden',
                    }}
                  >
                    {n
                      ? v.slice(0, n)
                      : l.includes('Compensation')
                        ? 'Enter amount'
                        : `Enter ${l.toLowerCase()}`}
                    {focus && (
                      <span
                        style={{
                          display: 'inline-block', width: 2, height: 20, marginLeft: 1,
                          background: B.ink,
                        }}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div
          style={abs({
            left: 720, bottom: 40, padding: '14px 20px', borderRadius: 12, background: '#eef0f5',
            fontSize: 17, fontWeight: 500, color: B.ink, display: 'flex', alignItems: 'center',
            gap: 10,
          })}
        >
          {ic(I.phone, 18, '#3b82f6')}98201 44517 · Rahul Pillai
        </div>
        <div
          style={abs({
            right: 44, bottom: 110, padding: '9px 16px', borderRadius: 999, background: '#e3f3dc',
            color: '#3d7a2b', fontSize: 16, fontWeight: 600, opacity: Math.min(1, saved * 1.3),
            transform: `translateY(${(1 - saved) * 10}px)`,
          })}
        >
          ✓ Saved to candidate profile
        </div>
        <div
          style={abs({
            right: 44, bottom: 36, padding: '15px 44px', borderRadius: 999, background: '#0b0b10',
            color: '#fff', fontSize: 18, fontWeight: 600, transform: `scale(${1 - press * 0.06})`,
          })}
        >
          Submit
        </div>
      </div>
    </div>
  );
}

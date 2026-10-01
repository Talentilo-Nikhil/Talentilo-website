import { E, mix } from '../engine';
import { Av, Card, PageTitle, Pill } from '../parts';
import { B, HD, SANS, SB } from '../theme';

/**
 * Scene 12 — from offer to joining day.
 *
 * The offer table fills, then each row's "Offer Accepted" and "Resigned" selects flip to a ticked
 * pill in turn — one stays Pending, which is the point of the row.
 */
const OFFERS: [string, string, string, string, string][] = [
  ['Rahul Mehra', 'SAP FICO Lead', 'Northwind', '₹24 L', '24 Sep 2026'],
  ['Sneha Iyer', 'Oracle HCM', 'Globex', '₹18.5 L', '03 Oct 2026'],
  ['Aman Gupta', 'Data Engineer', 'Vertex Labs', '₹21 L', '07 Oct 2026'],
  ['Pooja Nair', 'Reg. Reporting', 'Acme Corp', '₹16 L', '23 Oct 2026'],
  ['Vivek Menon', 'Java Full Stack', 'Initech', '₹19 L', '01 Nov 2026'],
];

const COLS = '270px 170px 110px 150px 150px 1fr';

export function Offers({ r }: { r: number }) {
  return (
    <>
      <PageTitle
        title="Offers"
        meta={
          <span>
            Total Candidates: <b style={{ color: B.ink }}>{Math.round(225 * E.io(0.3, 1.4)(r))}</b>
          </span>
        }
      />

      <Card style={{ left: SB + 36, top: HD + 150, width: 1010, height: 560, overflow: 'hidden' }}>
        <div
          style={{
            display: 'grid', gridTemplateColumns: COLS, alignItems: 'center', height: 56,
            padding: '0 22px', background: '#fafafc', borderBottom: `1px solid ${B.line}`,
            fontFamily: SANS, fontSize: 16, fontWeight: 500, color: B.muted,
          }}
        >
          {['Candidate', 'Client', 'CTC', 'Joining Date', 'Offer Accepted', 'Resigned'].map((h) => (
            <span key={h}>{h}</span>
          ))}
        </div>
        {OFFERS.map(([n, role, cl, ctc, jd], i) => {
          const k = E.in(0.4 + i * 0.12, 0.9 + i * 0.12)(r);
          const yes = E.pop(1.4 + i * 0.35, 1.7 + i * 0.35)(r);
          const res = E.pop(2.4 + i * 0.3, 2.7 + i * 0.3)(r);
          const resOk = i !== 3;
          return (
            <div
              key={n}
              style={{
                display: 'grid', gridTemplateColumns: COLS, alignItems: 'center', height: 96,
                padding: '0 22px', borderBottom: `1px solid ${B.line}`, fontFamily: SANS,
                fontSize: 17, color: B.ink, opacity: k, transform: `translateY(${(1 - k) * 16}px)`,
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Av n={n} c="#e3edff" f="#2f55b8" />
                <span>
                  <div style={{ fontWeight: 600 }}>{n}</div>
                  <div style={{ fontSize: 16, color: B.muted }}>{role}</div>
                </span>
              </span>
              <span>{cl}</span>
              <span>{ctc}</span>
              <span>{jd}</span>
              <span>
                {yes > 0.5 ? (
                  <Pill bg="#e3f3dc" fg="#3d7a2b" style={{ transform: `scale(${mix(0.6, 1, yes)})` }}>
                    ✓ Yes
                  </Pill>
                ) : (
                  <Pill bg="#f3f3f6" fg={B.muted}>Select</Pill>
                )}
              </span>
              <span>
                {res > 0.5 ? (
                  <Pill
                    bg={resOk ? '#e3f3dc' : '#fff1e4'} fg={resOk ? '#3d7a2b' : '#a0441b'}
                    style={{ transform: `scale(${mix(0.6, 1, res)})` }}
                  >
                    {resOk ? '✓ Yes' : 'Pending'}
                  </Pill>
                ) : (
                  <Pill bg="#f3f3f6" fg={B.muted}>Select</Pill>
                )}
              </span>
            </div>
          );
        })}
      </Card>
    </>
  );
}

import { E, mix } from '../engine';
import { abs, Field, SoftBtn } from '../parts';
import { B, HD, SANS, SB } from '../theme';

/**
 * Scene 4 — creating a job, then letting the AI write its description.
 *
 * A modal over a dimmed window, in two steps: the details form types and fills itself, the
 * stepper advances, then the second step pops the skills, writes the JD character by character and
 * pops the recommended keywords. Inside the window, so nothing here was re-themed.
 */
const MX = SB + 16;
const MY = HD + 16;
const MW = 1038;
const MH = 760;

const JD_TEXT = [
  'Job Title: Java Developer',
  'Location: PAN India, Remote',
  'Experience: 4–6 Years',
  'Education: M.Tech, Masters/Post-Graduation',
  'Requirements:',
  '– Design and build high-throughput RESTful services with Java 11 and Spring Boot',
  '– Write clean, tested code with JUnit and Mockito',
];

const SKILLS = [
  '4-6 Year', 'Java Developer', 'M.Tech', 'Masters/Post-Graduation', 'PAN India', 'Remote',
  'full-time',
];

const KEYS = [
  'java 11', 'spring boot', 'restful services', 'clean architecture', 'pagination',
  'error handling', 'sql', 'hibernate', 'junit', 'mockito',
];

const STEPS = ['Job Details', 'Requirements', 'Job Description'];

/** The description box, and the line box the text inside it sets on. */
const JD_BOX = 140;
const JD_LINE = 16.5 * 1.55;
const JD_CHARS = JD_TEXT.join('\n').length;

/**
 * Where each JD line starts in the joined text, so the typewriter can be a pure lookup.
 *
 * The handoff carried a running total mutated inside the map. That is the same arithmetic, but a
 * `let` reassigned while JSX renders is exactly what the compiler's immutability rule exists to
 * catch, and the sums never change, so they are computed once up here instead.
 */
const JD_OFFSETS = JD_TEXT.reduce<number[]>((acc, l, i) => {
  acc.push(i === 0 ? 0 : acc[i - 1] + JD_TEXT[i - 1].length + 1);
  return acc;
}, []);

export function JD({ r }: { r: number }) {
  const step = r < 2.2 ? 1 : 3;
  const sw = E.io(2.1, 2.5)(r);
  const press = (t: number) => E.io(t - 0.05, t)(r) * (1 - E.io(t + 0.02, t + 0.18)(r));
  const title = 'Java Developer';
  const typed = Math.floor(title.length * E.io(0.2, 0.9)(r));
  const jdChars = E.io(3.3, 4.6)(r) * JD_CHARS;
  /*
    How far the text has slid up so the line being written stays in view. Clamped at both ends, so
    it does not move until the text is taller than the box and never runs past the last line.
  */
  const jdScroll = Math.max(
    0,
    Math.min(JD_TEXT.length * JD_LINE - (JD_BOX - 28), (jdChars / JD_CHARS) * JD_TEXT.length * JD_LINE - (JD_BOX - 28))
  );

  return (
    <div style={abs({ inset: 0, background: 'rgba(20,18,30,0.35)' })}>
      <div
        style={abs({
          left: MX, top: MY, width: MW, height: MH, background: '#fff', borderRadius: 20,
          boxShadow: '0 30px 80px rgba(0,0,0,0.25)', overflow: 'hidden',
        })}
      >
        <div style={abs({ left: 28, top: 22, fontFamily: SANS })}>
          <div style={{ fontSize: 30, fontWeight: 600, color: B.ink }}>Create New Job</div>
          <div style={{ fontSize: 17, color: B.muted, marginTop: 4 }}>Fill your Job details here.</div>
        </div>
        <svg width="20" height="20" viewBox="0 0 20 20" style={{ position: 'absolute', right: 28, top: 30 }}>
          <path d="M3 3l14 14M17 3L3 17" stroke={B.ink} strokeWidth="1.8" strokeLinecap="round" />
        </svg>

        <div
          style={abs({
            left: 28, top: 104, width: 240, bottom: 28, borderRadius: 18, background: '#f5f4f9',
            padding: '28px 18px', boxSizing: 'border-box',
          })}
        >
          {STEPS.map((l, i) => {
            const done = step === 3 && i < 2;
            const act = (step === 1 && i === 0) || (step === 3 && i === 2);
            return (
              <div
                key={l}
                style={{
                  position: 'relative', height: 80, display: 'flex', alignItems: 'flex-start',
                  gap: 14,
                }}
              >
                {i < 2 && (
                  <div
                    style={abs({
                      left: 19, top: 42, width: 2, height: 38,
                      background: done || (step === 1 && i === 0) ? '#3b82f6' : '#dcdce3',
                    })}
                  />
                )}
                <div
                  style={{
                    width: 40, height: 40, borderRadius: 20, flexShrink: 0, display: 'flex',
                    alignItems: 'center', justifyContent: 'center', fontFamily: SANS, fontSize: 16,
                    fontWeight: 600,
                    background: act ? '#9cc9ff' : done ? '#3b82f6' : '#fff',
                    color: act || done ? '#fff' : B.muted,
                    border: act ? '2px solid #3b82f6' : '1px solid #e3e3ea',
                    boxSizing: 'border-box',
                  }}
                >
                  {done ? '✓' : i + 1}
                </div>
                <span
                  style={{
                    marginTop: 9, fontFamily: SANS, fontSize: 18, fontWeight: act ? 600 : 400,
                    color: act ? B.ink : B.muted,
                  }}
                >
                  {l}
                </span>
              </div>
            );
          })}
        </div>

        <div
          style={abs({
            left: 300, top: 104, right: 28, bottom: 28, opacity: 1 - sw,
            transform: `translateX(${-sw * 30}px)`,
          })}
        >
          <div style={{ fontFamily: SANS, fontSize: 21, fontWeight: 600, color: B.ink, marginBottom: 26 }}>
            Job Details
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px 32px' }}>
            <Field label="Job Title" req value={title} typed={typed} focus={r < 1.0} tint />
            <Field label="Openings" value="3" k={E.in(0.9, 1.1)(r)} />
            <Field label="SPOC" value="Priya Menon" select="soft" k={E.in(1.0, 1.2)(r)} />
            <Field label="Assign Recruiter(s)" value="Riya Kapoor (Recruiter)" select k={E.in(1.1, 1.3)(r)} />
            <Field label="Client" req value="Northwind Retail" select k={E.in(1.2, 1.4)(r)} />
            <Field label="Client Tracker" value="TRACKER" select k={E.in(1.3, 1.5)(r)} />
          </div>
          <div
            style={abs({
              right: 0, bottom: 0, padding: '15px 44px', borderRadius: 999, background: '#0b0b10',
              color: '#fff', fontFamily: SANS, fontSize: 18, fontWeight: 600,
              transform: `scale(${1 - press(1.9) * 0.06})`,
            })}
          >
            Next
          </div>
        </div>

        {sw > 0 && (
          <div
            style={abs({
              left: 300, top: 104, right: 28, bottom: 28, opacity: sw,
              transform: `translateX(${(1 - sw) * 30}px)`,
            })}
          >
            <div style={{ fontFamily: SANS, fontSize: 19, color: B.ink, marginBottom: 10 }}>Add Skills</div>
            <div
              style={{
                minHeight: 96, borderRadius: 18, border: '1px solid #e3e3ea', padding: 14,
                display: 'flex', flexWrap: 'wrap', gap: 10, alignContent: 'flex-start',
                boxSizing: 'border-box',
              }}
            >
              {SKILLS.map((c, i) => {
                const k = E.pop(2.4 + i * 0.07, 2.7 + i * 0.07)(r);
                return (
                  <span
                    key={c}
                    style={{
                      padding: '7px 14px', borderRadius: 999, background: '#fde6d4',
                      fontFamily: SANS, fontSize: 16, color: B.ink, opacity: Math.min(1, k * 1.3),
                      transform: `scale(${mix(0.7, 1, k)})`,
                    }}
                  >
                    {c} ✕
                  </span>
                );
              })}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '10px 0 10px' }}>
              <SoftBtn press={press(3.1)}>Generate JD</SoftBtn>
            </div>
            <div style={{ fontFamily: SANS, fontSize: 19, color: B.ink, marginBottom: 10 }}>
              Job Description <span style={{ color: '#d0312d' }}>*</span>
            </div>
            <div
              style={{
                height: JD_BOX, borderRadius: 18,
                border: `1px solid ${r > 3.2 && r < 4.7 ? '#9cc4ff' : '#e3e3ea'}`,
                padding: '14px 20px', boxSizing: 'border-box', overflow: 'hidden',
                fontFamily: SANS, fontSize: 16.5, lineHeight: 1.55, color: B.ink,
              }}
            >
              {/*
                The text tracks the caret, the way a textarea does.

                The handoff wrote seven lines into a fixed box with `overflow: hidden` and never
                moved them, so the last two requirements were simply cut off and stayed cut — text
                truncated by its container, which is not something a real form does. Growing the box
                is not the fix either: the pane has 628px and already wants 670. A textarea being
                typed into scrolls to keep the caret in view, so this does that, and the reader sees
                the JD finish writing itself.
              */}
              <div style={{ transform: `translateY(${-jdScroll}px)` }}>
                {JD_TEXT.map((l, i) => {
                  const show = Math.max(0, Math.min(l.length, Math.floor(jdChars - JD_OFFSETS[i])));
                  return show > 0 ? (
                    <div key={l} style={{ fontWeight: i === 4 ? 600 : 400 }}>{l.slice(0, show)}</div>
                  ) : null;
                })}
                {r > 3.2 && r < 3.4 && <span style={{ color: B.muted }}>Generating…</span>}
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '10px 0 10px' }}>
              <SoftBtn press={press(4.8)}>Generate JD Keyword</SoftBtn>
            </div>
            <div
              style={{
                fontFamily: SANS, fontSize: 19, color: B.ink, marginBottom: 10,
                opacity: E.in(4.9, 5.1)(r),
              }}
            >
              Recommended Keywords
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {KEYS.map((c, i) => {
                const k = E.pop(5.0 + i * 0.05, 5.3 + i * 0.05)(r);
                return (
                  <span
                    key={c}
                    style={{
                      padding: '3px 8px', borderRadius: 4, whiteSpace: 'nowrap',
                      border: '1px solid #e0955a', background: '#fdebdc', fontFamily: SANS,
                      fontSize: 16, color: B.ink, opacity: Math.min(1, k * 1.3),
                      transform: `scale(${mix(0.6, 1, k)})`,
                    }}
                  >
                    {c}
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/** The modal's own box, exported so the cursor plan can aim at its controls. */
export const JD_MODAL = { MX, MY, MW, MH } as const;

(function () {
const W = 1920, H = 1080;
const B = { dark: '#0c0a10', dark2: '#15121c', purple: '#9b8cff', blue: '#5aa7ff', orange: '#ff9a4d', green: '#5fb35f', red: '#d0512f',
  app: '#f6f6f9', card: '#ffffff', line: '#ececf1', ink: '#1f1f24', muted: '#55555f', faint: '#a3a3ad', soft: '#efeefe' };
const SANS = "'Outfit', system-ui, sans-serif", SERIF = "'Instrument Serif', Georgia, serif";
const GRAD = `linear-gradient(90deg, ${B.purple}, ${B.blue})`;
const E = {
  in: (a, b) => animate({ from: 0, to: 1, start: a, end: b, ease: Easing.easeOutCubic }),
  io: (a, b) => animate({ from: 0, to: 1, start: a, end: b, ease: Easing.easeInOutCubic }),
  pop: (a, b) => animate({ from: 0, to: 1, start: a, end: b, ease: Easing.easeOutBack }),
};
const mix = (a, b, k) => a + (b - a) * k;
const abs = (s) => ({ position: 'absolute', ...s });
const WX = 580, WY = 150, WW = 1290, WH = 860, SB = 220, HD = 68;

function path(keys, T) {
  if (T <= keys[0][0]) return keys[0].slice(1);
  for (let i = 1; i < keys.length; i++) { const a = keys[i - 1], b = keys[i]; if (T <= b[0]) { const k = E.io(a[0], b[0])(T); return a.slice(1).map((v, j) => mix(v, b[j + 1], k)); } }
  return keys[keys.length - 1].slice(1);
}

// ---------- shared app shell (recreated from the real portal) ----------
const NAV = ['Jobs', 'Calling Performance', 'Offers', 'Users', 'Targets', 'Clients', 'All Candidates', 'Emails', 'WhatsApp'];
function Shell({ nav, tab }) {
  return <>
    <div style={abs({ left: 0, top: 0, right: 0, height: HD, background: B.card, borderBottom: `1px solid ${B.line}`, display: 'flex', alignItems: 'center' })}>
      <div style={{ width: SB, paddingLeft: 26 }}><img src="assets/logo-color.png" alt="Talentilo.ai" style={{ height: 22, width: 'auto', display: 'block' }} /></div>
      {['My Workspace', 'Reports & Analytics'].map((t, i) => <div key={t} style={{ height: HD, display: 'flex', alignItems: 'center', margin: '0 22px', fontFamily: SANS, fontSize: 19, fontWeight: 500,
        color: tab === i ? B.ink : B.muted, borderBottom: tab === i ? `3px solid ${B.purple}` : '3px solid transparent', boxSizing: 'border-box' }}>{t}</div>)}
      <div style={{ flex: 1 }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginRight: 28 }}>
        <div style={{ width: 40, height: 40, borderRadius: 20, background: '#fde3cf', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SANS, fontWeight: 600, fontSize: 16, color: '#a0521d' }}>AM</div>
        <div style={{ fontFamily: SANS, lineHeight: 1.2 }}><div style={{ fontSize: 16, fontWeight: 600, color: B.ink }}>Alex Morgan</div><div style={{ fontSize: 16, color: B.muted }}>Consulting Owner</div></div>
      </div>
    </div>
    <div style={abs({ left: 0, top: HD, width: SB, bottom: 0, background: B.card, borderRight: `1px solid ${B.line}`, padding: '72px 14px 0', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 6 })}>
      {NAV.map((n) => <div key={n} style={{ height: 44, display: 'flex', alignItems: 'center', gap: 12, padding: '0 14px', borderRadius: 10, background: n === nav ? B.soft : 'transparent',
        fontFamily: SANS, fontSize: 16, whiteSpace: 'nowrap', fontWeight: n === nav ? 600 : 400, color: n === nav ? B.ink : B.muted }}>
        <span style={{ width: 16, height: 16, borderRadius: 4, border: `1.6px solid ${n === nav ? B.purple : B.faint}` }} />{n}</div>)}
    </div>
  </>;
}
const Card = ({ style, children }) => <div style={abs({ background: B.card, borderRadius: 18, border: `1px solid ${B.line}`, ...style })}>{children}</div>;
const CardTitle = ({ children }) => <div style={{ fontFamily: SANS, fontSize: 21, fontWeight: 600, color: B.ink }}>{children}</div>;
const Pill = ({ children, bg, fg, style }) => <span style={{ display: 'inline-flex', alignItems: 'center', padding: '4px 12px', borderRadius: 999, background: bg, color: fg, fontFamily: SANS, fontSize: 16, fontWeight: 600, ...style }}>{children}</span>;
const PageTitle = ({ title, meta }) => <div style={abs({ left: SB + 36, top: HD + 34 })}>
  <div style={{ fontFamily: SERIF, fontSize: 48, lineHeight: 1, color: B.ink }}>{title}</div>
  <div style={{ marginTop: 12, fontFamily: SANS, fontSize: 17, color: B.muted, display: 'flex', gap: 24 }}>{meta}</div></div>;
const Av = ({ n, c = '#e8e4ff', f = '#5b4fc4' }) => <span style={{ width: 36, height: 36, borderRadius: 18, background: c, color: f, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: SANS, fontWeight: 600, fontSize: 16, flexShrink: 0 }}>{n.split(' ').map((w) => w[0]).join('')}</span>;

// ---------- screens ----------
function Workspace({ r }) {
  const cards = [['Offers Released (MTD)', 14, '', 'Sep 2026', 'linear-gradient(160deg,#fde6d2,#fbcfa9)', '#a0441b'], ['Offer Accept Rate', 82, '%', '118 / 144 accepted', 'linear-gradient(160deg,#e3edff,#c9dcff)', '#2f55b8'], ['Offers Released (FY)', 146, '', 'Apr 2026 – Mar 2027', 'linear-gradient(160deg,#e8f5dc,#cfeab8)', '#3d7a2b']];
  const news = [['Offer released for Rahul Verma — CTC ₹25 LPA', 'Revenue Win'], ['Offer released for Sneha Iyer — CTC ₹28 LPA', 'Revenue Win'], ['Kabir Shah joined Northwind as SAP FICO Lead', 'Joined'], ['Offer released for Meera Nair — CTC ₹22 LPA', 'Revenue Win']];
  const lift = E.pop(2.1, 2.7)(r);
  return <>
    <div style={abs({ left: SB + 36, top: HD + 30, fontFamily: SERIF, fontSize: 44, color: B.ink })}>Hello, Alex</div>
    <Card style={{ left: SB + 36, top: HD + 100, width: 560, height: 470, padding: 28, boxSizing: 'border-box' }}>
      <CardTitle>In the News</CardTitle>
      <div style={{ marginTop: 16 }}>{news.map(([t, tag], i) => { const k = E.in(0.4 + i * 0.18, 0.9 + i * 0.18)(r); return (
        <div key={t} style={{ padding: '14px 0', borderBottom: `1px solid ${B.line}`, opacity: k, transform: `translateY(${(1 - k) * 14}px)` }}>
          <Pill bg={tag === 'Joined' ? '#e3f3dc' : '#fff4c2'} fg={tag === 'Joined' ? '#3d7a2b' : '#7a5a00'}>{tag}</Pill>
          <div style={{ marginTop: 8, fontFamily: SANS, fontSize: 17, color: B.ink }}>{t}</div></div>); })}</div>
    </Card>
    {cards.map(([l, v, suf, sub, bg, fg], i) => { const k = E.pop(0.3 + i * 0.15, 0.8 + i * 0.15)(r), L = i === 1 ? lift : 0; return (
      <div key={l} style={abs({ left: SB + 620 + i * 150, top: HD + 100, width: 138, height: 210, borderRadius: 18, background: bg, padding: '18px 16px', boxSizing: 'border-box', zIndex: i === 1 ? 3 : 1,
        opacity: k, transform: `scale(${mix(0.9, 1, k) * mix(1, 1.45, L)}) translateY(${-L * 30}px)`, transformOrigin: '50% 30%', boxShadow: L ? `0 ${30 * L}px ${60 * L}px rgba(40,50,120,${0.28 * L})` : 'none' })}>
        <div style={{ fontFamily: SANS, fontSize: 16, fontWeight: 500, color: fg, lineHeight: 1.3 }}>{l}</div>
        <div style={{ marginTop: 14, fontFamily: SANS, fontSize: 44, fontWeight: 600, color: fg, fontVariantNumeric: 'tabular-nums' }}>{Math.round(v * E.io(0.5, 1.8)(r))}{suf}</div>
        <div style={{ marginTop: 6, fontFamily: SANS, fontSize: 16, color: fg, opacity: 0.85 }}>{sub}</div></div>); })}
    <Card style={{ left: SB + 620, top: HD + 330, width: 438, height: 240, padding: 24, boxSizing: 'border-box' }}>
      <CardTitle>Recruitment Velocity</CardTitle>
      <svg width="390" height="150" viewBox="0 0 390 150" style={{ marginTop: 10 }}>
        {[0, 1, 2, 3].map((g) => <line key={g} x1="0" x2="390" y1={20 + g * 38} y2={20 + g * 38} stroke={B.line} />)}
        <path d="M0,130 C60,120 90,90 140,80 S230,40 280,36 S360,18 390,14" fill="none" stroke={B.green} strokeWidth="3.5" strokeDasharray="600" strokeDashoffset={600 * (1 - E.io(0.6, 2.0)(r))} strokeLinecap="round" />
      </svg>
    </Card>
  </>;
}

const TEAM = [['Sara L.', 60, 8, 2], ['Dev A.', 120, 14, 4], ['Ishaan K.', 400, 82, 12], ['Meera D.', 270, 20, 6], ['Kavya P.', 260, 30, 5], ['Rohan T.', 660, 44, 18]];
function Team({ r }) {
  const tip = E.pop(2.2, 2.6)(r);
  return <>
    <Card style={{ left: SB + 36, top: HD + 36, width: 640, height: 640, padding: 28, boxSizing: 'border-box' }}>
      <CardTitle>How’s My Team Doing?</CardTitle>
      <div style={{ display: 'flex', gap: 22, marginTop: 12, fontFamily: SANS, fontSize: 16, color: B.ink }}>
        {[['Submitted', B.purple], ['Shortlisted', B.orange], ['Offered', B.green]].map(([l, c]) => <span key={l} style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ width: 12, height: 12, borderRadius: 3, background: c }} />{l}</span>)}</div>
      <div style={abs({ left: 28, right: 28, top: 130, height: 400, borderBottom: `1px solid ${B.line}` })}>
        {[0, 1, 2, 3].map((g) => <div key={g} style={abs({ left: 0, right: 0, top: g * 100, height: 1, background: B.line })} />)}
        {TEAM.map(([n, s, sh, o], i) => { const k = E.io(0.3 + i * 0.12, 1.3 + i * 0.12)(r); return (
          <div key={n} style={abs({ left: 16 + i * 96, bottom: 0, width: 80, height: 400, display: 'flex', alignItems: 'flex-end', gap: 4 })}>
            <div style={{ width: 28, height: (s / 700) * 400 * k, borderRadius: '6px 6px 0 0', background: `linear-gradient(180deg, ${B.purple}, ${B.blue})` }} />
            <div style={{ width: 20, height: (sh / 700) * 400 * k, borderRadius: '5px 5px 0 0', background: B.orange }} />
            <div style={{ width: 20, height: (o / 700) * 400 * k, borderRadius: '5px 5px 0 0', background: B.green }} />
            {i === 5 && <div style={abs({ left: -60, top: 400 - (s / 700) * 400 - 96, width: 170, padding: '12px 14px', borderRadius: 12, background: B.ink, color: '#fff', fontFamily: SANS, fontSize: 16, lineHeight: 1.45, opacity: tip, transform: `scale(${mix(0.7, 1, tip)})`, transformOrigin: '50% 100%', boxShadow: '0 12px 30px rgba(0,0,0,0.25)' })}>
              <div style={{ fontWeight: 600, fontSize: 16 }}>Rohan T.</div>660 submitted · 18 offered</div>}
          </div>); })}
      </div>
      <div style={abs({ left: 28, right: 28, top: 544, display: 'flex' })}>{TEAM.map(([n]) => <span key={n} style={{ width: 96, fontFamily: SANS, fontSize: 16, fontWeight: 500, color: B.ink, textAlign: 'center' }}>{n}</span>)}</div>
    </Card>
    <Card style={{ left: SB + 700, top: HD + 36, width: 344, height: 640, padding: 26, boxSizing: 'border-box' }}>
      <CardTitle>All Interviews</CardTitle>
      <div style={{ display: 'flex', gap: 18, margin: '14px 0 6px', fontFamily: SANS, fontSize: 16 }}><span style={{ fontWeight: 600, borderBottom: `2px solid ${B.purple}`, paddingBottom: 6 }}>Today <Pill bg={B.purple} fg="#fff" style={{ padding: '1px 8px', fontSize: 16 }}>12</Pill></span><span style={{ color: B.muted }}>Upcoming 4</span></div>
      {[['10:30 AM', 'Vikram S.', 'SAP FI & CFIN'], ['12:00 PM', 'Ananya B.', 'Regulatory Reporting'], ['01:00 PM', 'Karthik R.', 'Oracle HCM Functional'], ['03:30 PM', 'Zoya M.', 'Java Full Stack']].map(([t, n, role], i) => { const k = E.in(0.8 + i * 0.2, 1.3 + i * 0.2)(r); return (
        <div key={n} style={{ display: 'flex', gap: 16, padding: '16px 0', borderBottom: `1px solid ${B.line}`, fontFamily: SANS, opacity: k, transform: `translateX(${(1 - k) * 20}px)` }}>
          <div style={{ width: 80, fontSize: 16, color: B.muted }}>Today<br /><span style={{ color: B.ink, fontWeight: 500, fontSize: 16 }}>{t}</span></div>
          <div><div style={{ fontSize: 16, fontWeight: 600, color: B.ink }}>{n}</div><div style={{ fontSize: 16, color: B.muted }}>{role}</div></div></div>); })}
    </Card>
  </>;
}

const CALLS = [['Riya Kapoor', 42, 31, '1h 12m', '2m 19s', 92], ['Arjun Nair', 36, 24, '58m 40s', '2m 26s', 78], ['Maya Rao', 28, 22, '51m 05s', '2m 19s', 71], ['Neha Joshi', 6, 4, '8m 54s', '2m 13s', 20]];
const COLS_C = '60px 250px 110px 110px 130px 120px 1fr';
function Calls({ r }) {
  const modal = E.in(2.9, 3.4)(r);
  return <>
    <PageTitle title="Calling Performance" meta={<><span>Team Total: <b style={{ color: B.ink }}>{Math.round(112 * E.io(0.3, 1.4)(r))} Calls</b></span><span>Avg target achieved: <b style={{ color: B.green }}>65%</b></span></>} />
    <Card style={{ left: SB + 36, top: HD + 150, width: 1010, height: 520, overflow: 'hidden' }}>
      <div style={{ display: 'grid', gridTemplateColumns: COLS_C, alignItems: 'center', height: 56, padding: '0 22px', background: '#fafafc', borderBottom: `1px solid ${B.line}`, fontFamily: SANS, fontSize: 16, fontWeight: 500, color: B.muted }}>
        {['S.No', 'Recruiter', 'Total Calls', 'Answered', 'Duration', 'Avg/Call', 'Target Achieved'].map((h) => <span key={h}>{h}</span>)}</div>
      {CALLS.map(([n, t, a, d, avg, pct], i) => { const k = E.in(0.4 + i * 0.15, 0.9 + i * 0.15)(r), bar = E.io(0.9 + i * 0.15, 2.0 + i * 0.15)(r); return (
        <div key={n} style={{ display: 'grid', gridTemplateColumns: COLS_C, alignItems: 'center', height: 86, padding: '0 22px', borderBottom: `1px solid ${B.line}`, fontFamily: SANS, fontSize: 17, color: B.ink, opacity: k, transform: `translateY(${(1 - k) * 16}px)`, background: i === 0 && r > 2.6 ? '#f7f6ff' : 'transparent' }}>
          <span>{i + 1}</span><span style={{ display: 'flex', alignItems: 'center', gap: 12, fontWeight: 500 }}><Av n={n} />{n}</span><span>{t}</span><span>{a}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ width: 10, height: 10, borderRadius: 5, background: B.green }} />{d}</span><span>{avg}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}><span style={{ width: 110, height: 8, borderRadius: 4, background: '#f0eff4', overflow: 'hidden' }}><span style={{ display: 'block', height: '100%', width: `${pct * bar}%`, background: pct > 60 ? B.green : B.orange, borderRadius: 4 }} /></span>
            <b style={{ color: pct > 60 ? B.green : B.orange, fontWeight: 600 }}>{Math.round(pct * bar)}%</b></span></div>); })}
    </Card>
    {modal > 0 && <div style={abs({ inset: 0, background: `rgba(20,18,30,${0.38 * modal})` })}>
      <div style={abs({ left: SB + 120, top: HD + 70, width: 840, height: 610, background: '#fff', borderRadius: 22, padding: 36, boxSizing: 'border-box', boxShadow: '0 40px 90px rgba(0,0,0,0.3)', opacity: modal, transform: `translateY(${(1 - modal) * 40}px) scale(${mix(0.96, 1, modal)})` })}>
        <div style={{ fontFamily: SANS, fontSize: 28, fontWeight: 600, color: B.ink }}>Call Details – Riya Kapoor</div>
        <div style={{ marginTop: 6, fontFamily: SANS, fontSize: 16, color: B.muted }}>Total Calls: 42 · Duration: 1h 12m · Target: 92%</div>
        <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: '80px 1fr 1fr 1fr 1fr', padding: '0 16px', height: 48, alignItems: 'center', background: '#fafafc', fontFamily: SANS, fontSize: 16, color: B.muted }}>
          {['Calls', 'Call Started', 'Call Ended', 'Duration', 'Target'].map((h) => <span key={h}>{h}</span>)}</div>
        {[['10:25 AM', '10:28 AM', '3m 12s', 1], ['10:29 AM', '10:31 AM', '2m 04s', 1], ['10:32 AM', '10:36 AM', '3m 54s', 1], ['10:38 AM', '10:39 AM', '0m 48s', 0], ['10:41 AM', '10:44 AM', '2m 51s', 1], ['10:46 AM', '10:49 AM', '3m 20s', 1]].map(([s, e, d, ok], i) => { const k = E.in(3.4 + i * 0.12, 3.8 + i * 0.12)(r); return (
          <div key={s} style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr 1fr 1fr', padding: '0 16px', height: 64, alignItems: 'center', borderBottom: `1px solid ${B.line}`, fontFamily: SANS, fontSize: 17, color: B.ink, opacity: k }}>
            <span>{i + 1}</span><span>{s}</span><span>{e}</span><span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ width: 10, height: 10, borderRadius: 5, background: ok ? B.green : B.orange }} />{d}</span>
            <span style={{ fontWeight: 600, color: ok ? B.green : B.red }}>{ok ? 'Achieved' : 'Short call'}</span></div>); })}
      </div>
    </div>}
  </>;
}

const OFFERS = [['Rahul Mehra', 'SAP FICO Lead', 'Northwind', '₹24 L', '24 Sep 2026'], ['Sneha Iyer', 'Oracle HCM', 'Globex', '₹18.5 L', '03 Oct 2026'], ['Aman Gupta', 'Data Engineer', 'Vertex Labs', '₹21 L', '07 Oct 2026'], ['Pooja Nair', 'Reg. Reporting', 'Acme Corp', '₹16 L', '23 Oct 2026'], ['Vivek Menon', 'Java Full Stack', 'Initech', '₹19 L', '01 Nov 2026']];
const COLS_O = '270px 170px 110px 150px 150px 1fr';
function Offers({ r }) {
  return <>
    <PageTitle title="Offers" meta={<span>Total Candidates: <b style={{ color: B.ink }}>{Math.round(225 * E.io(0.3, 1.4)(r))}</b></span>} />
    <Card style={{ left: SB + 36, top: HD + 150, width: 1010, height: 560, overflow: 'hidden' }}>
      <div style={{ display: 'grid', gridTemplateColumns: COLS_O, alignItems: 'center', height: 56, padding: '0 22px', background: '#fafafc', borderBottom: `1px solid ${B.line}`, fontFamily: SANS, fontSize: 16, fontWeight: 500, color: B.muted }}>
        {['Candidate', 'Client', 'CTC', 'Joining Date', 'Offer Accepted', 'Resigned'].map((h) => <span key={h}>{h}</span>)}</div>
      {OFFERS.map(([n, role, cl, ctc, jd], i) => { const k = E.in(0.4 + i * 0.12, 0.9 + i * 0.12)(r), yes = E.pop(1.4 + i * 0.35, 1.7 + i * 0.35)(r), res = E.pop(2.4 + i * 0.3, 2.7 + i * 0.3)(r); const resOk = i !== 3;
        return <div key={n} style={{ display: 'grid', gridTemplateColumns: COLS_O, alignItems: 'center', height: 96, padding: '0 22px', borderBottom: `1px solid ${B.line}`, fontFamily: SANS, fontSize: 17, color: B.ink, opacity: k, transform: `translateY(${(1 - k) * 16}px)` }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}><Av n={n} c="#e3edff" f="#2f55b8" /><span><div style={{ fontWeight: 600 }}>{n}</div><div style={{ fontSize: 16, color: B.muted }}>{role}</div></span></span>
          <span>{cl}</span><span>{ctc}</span><span>{jd}</span>
          <span>{yes > 0.5 ? <Pill bg="#e3f3dc" fg="#3d7a2b" style={{ transform: `scale(${mix(0.6, 1, yes)})` }}>✓ Yes</Pill> : <Pill bg="#f3f3f6" fg={B.muted}>Select</Pill>}</span>
          <span>{res > 0.5 ? <Pill bg={resOk ? '#e3f3dc' : '#fff1e4'} fg={resOk ? '#3d7a2b' : '#a0441b'} style={{ transform: `scale(${mix(0.6, 1, res)})` }}>{resOk ? '✓ Yes' : 'Pending'}</Pill> : <Pill bg="#f3f3f6" fg={B.muted}>Select</Pill>}</span></div>; })}
    </Card>
  </>;
}


// ---------- new: AI calling, Targets, BI ----------
const QUEUE = [['Rohit M.', 'Voicemail — no callback', 0], ['Sneha K.', 'Not looking right now', 0], ['Imran S.', 'Salary out of range', 0], ['Sarah J.', 'Interested · salary matched', 1], ['Divya R.', 'Number unreachable', 0], ['Karan B.', 'Wrong stack', 0]];
const LINES = [['Talentilo AI', 'Hi Sarah, quick check on the Senior Developer role. Is ₹32 LPA within your range?'], ['Sarah', 'Yes, that works. I’d like to hear more about the team.'], ['Talentilo AI', 'Great. I’ve booked you with Daniel on Oct 14 at 11 AM.']];
function AICalls({ r }) {
  const dialled = Math.round(500 * E.io(0.2, 4.6)(r)), booked = E.pop(4.2, 4.7)(r);
  return <>
    <PageTitle title="AI Screening" meta={<><span>Senior React Developer</span><span>Passive list · <b style={{ color: B.ink }}>{dialled}</b> / 500 dialled</span></>} />
    <Card style={{ left: SB + 36, top: HD + 150, width: 440, height: 560, padding: 24, boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><CardTitle>Call queue</CardTitle><Pill bg={B.soft} fg="#5b4fc4">● AI working the list</Pill></div>
      <div style={{ marginTop: 10 }}>{QUEUE.map(([n, why, ok], i) => { const k = E.in(0.4 + i * 0.35, 0.8 + i * 0.35)(r); return (
        <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 10px', borderBottom: `1px solid ${B.line}`, borderRadius: ok ? 12 : 0, background: ok ? '#eef8ea' : 'transparent', opacity: ok ? k : k * 0.8, fontFamily: SANS }}>
          <Av n={n} c={ok ? '#d6efcc' : '#f0eff4'} f={ok ? '#3d7a2b' : B.muted} />
          <div style={{ flex: 1 }}><div style={{ fontSize: 17, fontWeight: 600, color: B.ink }}>{n}</div><div style={{ fontSize: 16, color: ok ? '#3d7a2b' : B.muted }}>{why}</div></div>
          {ok ? <Pill bg="#3d7a2b" fg="#fff">Passed</Pill> : <Pill bg="#f3f3f6" fg={B.muted}>Filtered</Pill>}</div>); })}</div>
    </Card>
    <Card style={{ left: SB + 500, top: HD + 150, width: 546, height: 560, padding: 26, boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ width: 52, height: 52, borderRadius: 26, background: GRAD, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: SANS, fontWeight: 700, fontSize: 18 }}>AI</div>
        <div style={{ flex: 1, fontFamily: SANS }}><div style={{ fontSize: 19, fontWeight: 600, color: B.ink }}>AI Voice Agent</div><div style={{ fontSize: 16, color: B.muted }}>Calling Sarah J. · Sr. Developer</div></div>
        <span style={{ fontFamily: SANS, fontSize: 18, fontWeight: 600, color: B.ink, fontVariantNumeric: 'tabular-nums' }}>0{Math.floor((20 + r * 12) / 60)}:{String(Math.floor(20 + r * 12) % 60).padStart(2, '0')}</span></div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, height: 54, margin: '18px 0 8px' }}>
        {Array.from({ length: 60 }, (_, i) => <div key={i} style={{ width: 4, borderRadius: 2, height: 6 + Math.abs(Math.sin(r * 7 + i * 0.8) * Math.cos(r * 2.9 + i * 0.33)) * 46, background: i % 5 === 0 ? B.orange : i % 2 ? B.purple : B.blue }} />)}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>{LINES.map(([who, t], i) => { const k = E.in(1.0 + i * 1.0, 1.5 + i * 1.0)(r), ai = who !== 'Sarah'; return (
        <div key={i} style={{ alignSelf: ai ? 'flex-start' : 'flex-end', maxWidth: 400, padding: '12px 16px', borderRadius: 16, background: ai ? B.soft : '#f3f3f6', fontFamily: SANS, fontSize: 16, lineHeight: 1.4, color: B.ink, opacity: k, transform: `translateY(${(1 - k) * 12}px)` }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: ai ? '#5b4fc4' : B.muted, marginBottom: 3 }}>{who}</div>{t}</div>); })}</div>
      <div style={abs({ left: 26, right: 26, bottom: 24, display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', borderRadius: 14, background: '#eef8ea', opacity: booked, transform: `scale(${mix(0.85, 1, booked)})` })}>
        <span style={{ width: 30, height: 30, borderRadius: 15, background: '#3d7a2b', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><svg width="14" height="14" viewBox="0 0 14 14"><path d="M3 7.5l2.5 2.5L11 4.5" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></span><div style={{ fontFamily: SANS, flex: 1 }}><div style={{ fontSize: 17, fontWeight: 600, color: '#2e6b20' }}>Meeting booked · Oct 14, 11:00 AM</div><div style={{ fontSize: 16, color: '#3d7a2b' }}>Salary matched · interest verified · fit 94/100</div></div></div>
    </Card>
  </>;
}

function Targets({ r }) {
  const cards = [['Revenue', 'Target ₹2,50,000', 112, '₹2,80,000 achieved', B.green], ['Interviews Conducted', 'Target 40', 85, '34 of 40', B.blue], ['Resume Submission', 'Target 140', 101, '142 of 140', B.orange]];
  const g = E.io(1.2, 2.4)(r), months = [22, 30, 26, 38, 44, 36, 52, 61];
  return <>
    <div style={abs({ left: SB + 36, top: HD + 30, display: 'flex', alignItems: 'center', gap: 16 })}>
      <Av n="Riya Kapoor" c="#fde3cf" f="#a0441b" /><div style={{ fontFamily: SERIF, fontSize: 44, color: B.ink }}>Recruiter Performance</div></div>
    <div style={abs({ left: SB + 36, top: HD + 92, display: 'flex', gap: 10, fontFamily: SANS, fontSize: 16, color: B.muted, alignItems: 'center' })}>Riya Kapoor · Recruiter <Pill bg="#e3f3dc" fg="#3d7a2b">On Track</Pill></div>
    {cards.map(([l, tgt, pct, sub, c], i) => { const k = E.pop(0.3 + i * 0.15, 0.8 + i * 0.15)(r), b = E.io(0.6 + i * 0.15, 1.8 + i * 0.15)(r); return (
      <Card key={l} style={{ left: SB + 36 + i * 340, top: HD + 140, width: 322, height: 210, padding: 24, boxSizing: 'border-box', opacity: k, transform: `scale(${mix(0.94, 1, k)})` }}>
        <div style={{ fontFamily: SANS, fontSize: 18, fontWeight: 600, color: B.ink }}>{l}</div><div style={{ fontFamily: SANS, fontSize: 16, color: B.muted, marginTop: 2 }}>{tgt}</div>
        <div style={{ marginTop: 18, fontFamily: SANS, fontSize: 44, fontWeight: 600, color: c, fontVariantNumeric: 'tabular-nums' }}>{Math.round(pct * b)}%</div>
        <div style={{ marginTop: 8, height: 8, borderRadius: 4, background: '#f0eff4', overflow: 'hidden' }}><div style={{ height: '100%', width: `${Math.min(100, pct) * b}%`, background: c, borderRadius: 4 }} /></div>
        <div style={{ marginTop: 10, fontFamily: SANS, fontSize: 16, color: B.muted }}>{sub}</div></Card>); })}
    <Card style={{ left: SB + 36, top: HD + 370, width: 322, height: 330, padding: 24, boxSizing: 'border-box' }}>
      <div style={{ fontFamily: SANS, fontSize: 18, fontWeight: 600, color: B.ink }}>Shortlist Ratio</div><div style={{ fontFamily: SANS, fontSize: 16, color: B.muted }}>Target 40%</div>
      <svg width="274" height="170" viewBox="0 0 274 170" style={{ marginTop: 14 }}>
        <path d="M27,150 A110,110 0 0 1 247,150" fill="none" stroke="#f0eff4" strokeWidth="22" strokeLinecap="round" />
        <path d="M27,150 A110,110 0 0 1 247,150" fill="none" stroke="url(#gg)" strokeWidth="22" strokeLinecap="round" strokeDasharray="346" strokeDashoffset={346 * (1 - 0.46 / 0.6 * 0.6 * g * 1.6)} />
        <defs><linearGradient id="gg"><stop offset="0" stopColor={B.purple} /><stop offset="1" stopColor={B.blue} /></linearGradient></defs>
        <text x="137" y="140" textAnchor="middle" fontFamily="Outfit" fontSize="44" fontWeight="600" fill={B.ink}>{Math.round(46 * g)}%</text></svg>
      <div style={{ fontFamily: SANS, fontSize: 16, fontWeight: 600, color: B.green, textAlign: 'center' }}>Target achieved</div>
    </Card>
    <Card style={{ left: SB + 376, top: HD + 370, width: 662, height: 330, padding: 24, boxSizing: 'border-box' }}>
      <div style={{ fontFamily: SANS, fontSize: 18, fontWeight: 600, color: B.ink }}>Monthly Performance</div>
      <div style={abs({ left: 24, right: 24, bottom: 48, height: 210, display: 'flex', alignItems: 'flex-end', gap: 26, borderBottom: `1px solid ${B.line}` })}>
        {months.map((v, i) => { const k = E.io(0.8 + i * 0.1, 1.8 + i * 0.1)(r); return <div key={i} style={{ flex: 1, height: (v / 64) * 210 * k, borderRadius: '8px 8px 0 0', background: i === months.length - 1 ? GRAD.replace('90deg', '180deg') : '#dcd7ff' }} />; })}</div>
      <div style={abs({ left: 24, right: 24, bottom: 18, display: 'flex', gap: 26 })}>{['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'].map((m) => <span key={m} style={{ flex: 1, textAlign: 'center', fontFamily: SANS, fontSize: 16, color: B.muted }}>{m}</span>)}</div>
    </Card>
  </>;
}

const RPTS = [['Client Activity', 'Active vs. dormant client accounts and engagement levels.'], ['Recruiter Performance', 'Individual recruiter performance, metrics, and targets.'], ['Closure Database', 'Every closed position with joining dates and billing.'], ['Client-Wise Open Jobs', 'All active openings, broken down by client.'],
  ['Recruitment Pipeline', 'Candidates tracked across every interview stage.'], ['Manager Performance', 'Placements and deliveries under each account manager.'], ['Client Performance', 'Revenue and position closure rate per client.'], ['Candidate Decline', 'Reason codes and stages where offers were declined.']];
const DocIco = () => <svg width="30" height="34" viewBox="0 0 24 28" fill="none" stroke="#1aa3b8" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round"><path d="M4 2h11l5 5v17a2 2 0 01-2 2H4a2 2 0 01-2-2V4a2 2 0 012-2z" /><path d="M15 2v5h5M7 13h2M12 13h5M7 18h2M12 18h5" /></svg>;
function Reports({ r }) {
  const cl = 1.45, press = E.io(cl - 0.05, cl)(r) * (1 - E.io(cl + 0.02, cl + 0.2)(r)), done = r > cl + 0.7;
  return <>
    <div style={abs({ left: SB + 36, top: HD + 28 })}>
      <div style={{ fontFamily: SERIF, fontSize: 48, lineHeight: 1, color: B.ink }}>Reports & Analytics</div>
      <div style={{ marginTop: 10, fontFamily: SANS, fontSize: 18, color: B.muted }}>Pre-built performance, billing and client data.</div></div>
    <div style={abs({ left: SB + 36, top: HD + 132, width: 998, height: 56, borderBottom: '1px solid ' + B.line, display: 'flex', alignItems: 'center', gap: 14, fontFamily: SANS })}>
      <div style={{ height: 56, display: 'flex', alignItems: 'center', padding: '0 16px', fontSize: 18, fontWeight: 600, color: B.ink, borderBottom: '3px solid ' + B.ink, boxSizing: 'border-box' }}>All Reports</div>
      <div style={{ flex: 1 }} />
      <div style={{ height: 46, display: 'flex', alignItems: 'center', gap: 22, padding: '0 20px', whiteSpace: 'nowrap', flexShrink: 0, borderRadius: 23, border: '1px solid #e3e3ea', background: '#fff', fontSize: 16, fontWeight: 500, color: B.ink }}>Select Date Range<span style={{ color: '#e8742f' }}>▦</span></div>
      <div style={{ width: 230, flexShrink: 0, whiteSpace: 'nowrap', height: 46, display: 'flex', alignItems: 'center', gap: 12, padding: '0 18px', borderRadius: 23, border: '1px solid #e3e3ea', background: '#fff', fontSize: 16, color: B.faint, boxSizing: 'border-box' }}>{ic(I.search, 18, B.ink)}Search report…</div>
    </div>
    <div style={abs({ left: SB + 36, top: HD + 210, width: 998, display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: 16 })}>
      {RPTS.map(([t, d], i) => { const k = E.in(0.05 + i * 0.06, 0.45 + i * 0.06)(r), me = i === 1; return (
        <div key={t} style={{ height: 270, borderRadius: 14, background: '#fff', border: '1px solid ' + (me && r > 1.1 ? '#cfc8ff' : B.line), boxShadow: me && r > 1.1 ? '0 10px 28px rgba(110,100,220,0.14)' : 'none', padding: '18px 20px', boxSizing: 'border-box', position: 'relative', fontFamily: SANS, opacity: k, transform: 'translateY(' + (1 - k) * 16 + 'px)' }}>
          <DocIco />
          <div style={{ fontSize: 19, fontWeight: 500, color: B.ink, marginTop: 16 }}>{t}</div>
          <div style={{ fontSize: 16, lineHeight: 1.55, color: B.muted, marginTop: 10, textWrap: 'pretty' }}>{d}</div>
          <div style={abs({ left: 20, bottom: 20, height: 42, padding: '0 18px', borderRadius: 21, display: 'flex', alignItems: 'center', gap: 8, background: me && done ? '#2e8b3e' : '#0b0b10', color: '#fff', fontSize: 16, fontWeight: 600, transform: 'scale(' + (1 - (me ? press : 0) * 0.08) + ')' })}>
            {me && done ? '✓ Downloaded' : me && r > cl ? 'Preparing…' : 'Download'}</div>
        </div>); })}
    </div>
  </>;
}


// ---------- v9: JD, scoring, WhatsApp, interview assistant ----------
const Btn = ({ children, press = 0, style }) => <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '12px 22px', borderRadius: 12, background: GRAD, color: '#fff', fontFamily: SANS, fontSize: 17, fontWeight: 600, transform: `scale(${1 - press * 0.06})`, boxShadow: '0 6px 18px rgba(110,110,255,0.3)', ...style }}>{children}</div>;
const MX = SB + 16, MY = HD + 16, MW = 1038, MH = 760;
const Field = ({ label, value, req, k = 1, typed, focus, select, tint }) => <div style={{ fontFamily: SANS }}>
  <div style={{ fontSize: 19, color: B.ink, marginBottom: 10 }}>{label}{req && <span style={{ color: '#d0312d' }}> *</span>}</div>
  <div style={{ height: 58, borderRadius: 29, border: `1px solid ${focus ? '#9cc4ff' : '#dcdce3'}`, background: tint ? '#e6efff' : select === 'soft' ? '#f6f7f9' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 22px', fontSize: 18, color: B.ink, opacity: k, boxShadow: focus ? '0 0 0 3px rgba(90,167,255,0.18)' : 'none' }}>
    <span>{typed != null ? value.slice(0, typed) : value}{focus && <span style={{ display: 'inline-block', width: 2, height: 20, marginLeft: 1, verticalAlign: 'middle', background: B.ink }} />}</span>
    {select === true && <svg width="14" height="9" viewBox="0 0 14 9"><path d="M1 1l6 6 6-6" fill="none" stroke={B.ink} strokeWidth="1.8" strokeLinecap="round" /></svg>}</div></div>;
const SoftBtn = ({ children, press = 0 }) => <div style={{ display: 'inline-flex', padding: '13px 22px', borderRadius: 999, background: '#bfe0ff', color: '#0e1a2b', fontFamily: SANS, fontSize: 17, fontWeight: 600, transform: `scale(${1 - press * 0.06})`, boxShadow: press ? '0 0 0 4px rgba(90,167,255,0.25)' : 'none' }}>{children}</div>;
const JD_TEXT = ['Job Title: Java Developer', 'Location: PAN India, Remote', 'Experience: 4–6 Years', 'Education: M.Tech, Masters/Post-Graduation', 'Requirements:', '– Design and build high-throughput RESTful services with Java 11 and Spring Boot', '– Write clean, tested code with JUnit and Mockito'];
const SKILLS = ['4-6 Year', 'Java Developer', 'M.Tech', 'Masters/Post-Graduation', 'PAN India', 'Remote', 'full-time'];
const KEYS = ['java 11', 'spring boot', 'restful services', 'clean architecture', 'pagination', 'error handling', 'sql', 'hibernate', 'junit', 'mockito'];
function JD({ r }) {
  const step = r < 2.2 ? 1 : 3, sw = E.io(2.1, 2.5)(r);
  const press = (t) => E.io(t - 0.05, t)(r) * (1 - E.io(t + 0.02, t + 0.18)(r));
  const title = 'Java Developer', typed = Math.floor(title.length * E.io(0.2, 0.9)(r));
  const jdChars = E.io(3.3, 4.6)(r) * JD_TEXT.join('\n').length;
  let used = 0;
  return <div style={abs({ inset: 0, background: 'rgba(20,18,30,0.35)' })}>
    <div style={abs({ left: MX, top: MY, width: MW, height: MH, background: '#fff', borderRadius: 20, boxShadow: '0 30px 80px rgba(0,0,0,0.25)', overflow: 'hidden' })}>
      <div style={abs({ left: 28, top: 22, fontFamily: SANS })}><div style={{ fontSize: 30, fontWeight: 600, color: B.ink }}>Create New Job</div><div style={{ fontSize: 17, color: B.muted, marginTop: 4 }}>Fill your Job details here.</div></div>
      <svg width="20" height="20" viewBox="0 0 20 20" style={{ position: 'absolute', right: 28, top: 30 }}><path d="M3 3l14 14M17 3L3 17" stroke={B.ink} strokeWidth="1.8" strokeLinecap="round" /></svg>
      <div style={abs({ left: 28, top: 104, width: 240, bottom: 28, borderRadius: 18, background: '#f5f4f9', padding: '28px 18px', boxSizing: 'border-box' })}>
        {['Job Details', 'Requirements', 'Job Description'].map((l, i) => { const done = step === 3 && i < 2, act = (step === 1 && i === 0) || (step === 3 && i === 2); return (
          <div key={l} style={{ position: 'relative', height: 80, display: 'flex', alignItems: 'flex-start', gap: 14 }}>
            {i < 2 && <div style={abs({ left: 19, top: 42, width: 2, height: 38, background: done || (step === 1 && i === 0) ? '#3b82f6' : '#dcdce3' })} />}
            <div style={{ width: 40, height: 40, borderRadius: 20, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SANS, fontSize: 16, fontWeight: 600,
              background: act ? '#9cc9ff' : done ? '#3b82f6' : '#fff', color: act || done ? '#fff' : B.muted, border: act ? '2px solid #3b82f6' : '1px solid #e3e3ea', boxSizing: 'border-box' }}>{done ? '✓' : i + 1}</div>
            <span style={{ marginTop: 9, fontFamily: SANS, fontSize: 18, fontWeight: act ? 600 : 400, color: act ? B.ink : B.muted }}>{l}</span></div>); })}
      </div>
      <div style={abs({ left: 300, top: 104, right: 28, bottom: 28, opacity: 1 - sw, transform: `translateX(${-sw * 30}px)` })}>
        <div style={{ fontFamily: SANS, fontSize: 21, fontWeight: 600, color: B.ink, marginBottom: 26 }}>Job Details</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px 32px' }}>
          <Field label="Job Title" req value={title} typed={typed} focus={r < 1.0} tint />
          <Field label="Openings" value="3" k={E.in(0.9, 1.1)(r)} />
          <Field label="SPOC" value="Priya Menon" select="soft" k={E.in(1.0, 1.2)(r)} />
          <Field label="Assign Recruiter(s)" value="Riya Kapoor (Recruiter)" select k={E.in(1.1, 1.3)(r)} />
          <Field label="Client" req value="Northwind Retail" select k={E.in(1.2, 1.4)(r)} />
          <Field label="Client Tracker" value="TRACKER" select k={E.in(1.3, 1.5)(r)} />
        </div>
        <div style={abs({ right: 0, bottom: 0, padding: '15px 44px', borderRadius: 999, background: '#0b0b10', color: '#fff', fontFamily: SANS, fontSize: 18, fontWeight: 600, transform: `scale(${1 - press(1.9) * 0.06})` })}>Next</div>
      </div>
      {sw > 0 && <div style={abs({ left: 300, top: 104, right: 28, bottom: 28, opacity: sw, transform: `translateX(${(1 - sw) * 30}px)` })}>
        <div style={{ fontFamily: SANS, fontSize: 19, color: B.ink, marginBottom: 10 }}>Add Skills</div>
        <div style={{ minHeight: 96, borderRadius: 18, border: '1px solid #e3e3ea', padding: 14, display: 'flex', flexWrap: 'wrap', gap: 10, alignContent: 'flex-start', boxSizing: 'border-box' }}>
          {SKILLS.map((c, i) => { const k = E.pop(2.4 + i * 0.07, 2.7 + i * 0.07)(r); return <span key={c} style={{ padding: '7px 14px', borderRadius: 999, background: '#fde6d4', fontFamily: SANS, fontSize: 16, color: B.ink, opacity: Math.min(1, k * 1.3), transform: `scale(${mix(0.7, 1, k)})` }}>{c} ✕</span>; })}</div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '10px 0 10px' }}><SoftBtn press={press(3.1)}>Generate JD</SoftBtn></div>
        <div style={{ fontFamily: SANS, fontSize: 19, color: B.ink, marginBottom: 10 }}>Job Description <span style={{ color: '#d0312d' }}>*</span></div>
        <div style={{ height: 140, borderRadius: 18, border: `1px solid ${r > 3.2 && r < 4.7 ? '#9cc4ff' : '#e3e3ea'}`, padding: '14px 20px', boxSizing: 'border-box', overflow: 'hidden', fontFamily: SANS, fontSize: 16.5, lineHeight: 1.55, color: B.ink }}>
          {JD_TEXT.map((l, i) => { const show = Math.max(0, Math.min(l.length, Math.floor(jdChars - used))); used += l.length + 1; return show > 0 ? <div key={i} style={{ fontWeight: i === 4 ? 600 : 400 }}>{l.slice(0, show)}</div> : null; })}
          {r > 3.2 && r < 3.4 && <span style={{ color: B.muted }}>Generating…</span>}</div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '10px 0 10px' }}><SoftBtn press={press(4.8)}>Generate JD Keyword</SoftBtn></div>
        <div style={{ fontFamily: SANS, fontSize: 19, color: B.ink, marginBottom: 10, opacity: E.in(4.9, 5.1)(r) }}>Recommended Keywords</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>{KEYS.map((c, i) => { const k = E.pop(5.0 + i * 0.05, 5.3 + i * 0.05)(r); return <span key={c} style={{ padding: '3px 8px', borderRadius: 4, whiteSpace: 'nowrap', border: '1px solid #e0955a', background: '#fdebdc', fontFamily: SANS, fontSize: 16, color: B.ink, opacity: Math.min(1, k * 1.3), transform: `scale(${mix(0.6, 1, k)})` }}>{c}</span>; })}</div>
      </div>}
    </div>
  </div>;
}

const ic = (d, sz = 18, c = B.muted, w = 1.8) => <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round">{d}</svg>;
const I = {
  info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 7.5h.01" /></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></>,
  phone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" />,
  wa: <><path d="M4 20l1.3-4A8.3 8.3 0 1112 20.3a8.3 8.3 0 01-4.1-1.1z" /><path d="M9.2 8.8c0 2.8 3 5.9 6 6l.9-1.5-1.9-.9-.8.8c-1-.4-2.2-1.6-2.6-2.6l.8-.8-.9-1.9z" /></>,
  ban: <><circle cx="12" cy="12" r="9" /><path d="M5.7 5.7l12.6 12.6" /></>,
  move: <path d="M4 12h14M13 7l5 5-5 5" />,
  refresh: <path d="M4 12a8 8 0 1 0 2.3-5.7M4 4v4h4" />,
  dl: <path d="M12 4v11M7 11l5 5 5-5M5 20h14" />,
  search: <><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></>,
  x: <path d="M5 5l14 14M19 5L5 19" />,
  chev: <path d="M6 9l6 6 6-6" />,
};
const Box = () => <span style={{ width: 20, height: 20, borderRadius: 5, border: '1.6px solid #c9c9d2', display: 'inline-block', boxSizing: 'border-box' }} />;
const OutPill = ({ children, style }) => <div style={{ height: 50, display: 'inline-flex', alignItems: 'center', gap: 10, padding: '0 22px', borderRadius: 999, border: '1.4px solid #1f1f24', fontFamily: SANS, fontSize: 18, fontWeight: 500, color: B.ink, boxSizing: 'border-box', ...style }}>{children}</div>;
const JobHead = () => <div style={abs({ left: SB + 36, top: HD + 28 })}>
  <div style={{ fontFamily: SERIF, fontSize: 48, lineHeight: 1, color: B.ink }}>Junior Accountant</div>
  <div style={{ marginTop: 10, fontFamily: SANS, fontSize: 18, color: B.muted }}>Job-001380 · Northwind Retail</div></div>;
function Ring({ v, size = 44, stroke = 5, font = 15, pct }) {
  const rr = (size - stroke) / 2, L = 2 * Math.PI * rr;
  return <svg width={size} height={size} viewBox={'0 0 ' + size + ' ' + size} style={{ flexShrink: 0 }}><circle cx={size / 2} cy={size / 2} r={rr} fill="none" stroke="#f0eff4" strokeWidth={stroke} />
    <circle cx={size / 2} cy={size / 2} r={rr} fill="none" stroke={v >= 85 ? '#3fa35a' : v >= 70 ? B.blue : B.orange} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={(v / 100) * L + ' ' + L} transform={'rotate(-90 ' + size / 2 + ' ' + size / 2 + ')'} />
    <text x="50%" y="50%" dy="0.35em" textAnchor="middle" fontFamily="Outfit" fontWeight="600" fontSize={font} fill={B.ink}>{Math.round(v)}{pct ? '%' : ''}</text></svg>;
}

const ROWS = [['Aditi Sharma', 'Pune', 48, 'Unreviewed'], ['Rahul Pillai', 'Mumbai', 93, 'Unreviewed'], ['Farah Qureshi', 'Pune', 57, 'Unreviewed'], ['Nikhil Jain', 'Nagpur', 86, 'Manager Review'], ['Tanvi Gupta', 'Thane', 79, 'Unreviewed']];
const COLS_S = '56px 60px 300px 150px 170px 1fr';
const CRIT = [['Location', 100, 'Based in Mumbai — matches the job location.'], ['Experience', 90, '3 yrs in accounts payable and GST returns.'], ['Skills Score', 92, 'Strong Tally Prime and Excel; good SAP.'], ['Education', 100, 'B.Com — meets the JD requirement.']];
function Scoring({ r }) {
  const m = E.io(1.35, 1.75)(r), hl = E.in(1.1, 1.3)(r);
  return <>
    <JobHead />
    <div style={abs({ left: SB + 36, top: HD + 128, width: 998, height: 52, borderBottom: '1px solid ' + B.line, display: 'flex', gap: 30, fontFamily: SANS, fontSize: 19 })}>
      {['Summary', 'Candidates', 'Notes', 'Attachments'].map((t, i) => <div key={t} style={{ height: 52, display: 'flex', alignItems: 'center', padding: '0 10px', color: i === 1 ? B.ink : B.muted, fontWeight: i === 1 ? 600 : 400, borderBottom: i === 1 ? '2px solid ' + B.purple : '2px solid transparent', boxSizing: 'border-box' }}>{t}</div>)}
    </div>
    <div style={abs({ left: SB + 36, top: HD + 200, width: 998, display: 'flex', alignItems: 'center', gap: 14 })}>
      <div style={{ width: 340, height: 50, borderRadius: 25, border: '1px solid #e3e3ea', background: '#fff', display: 'flex', alignItems: 'center', gap: 12, padding: '0 20px', boxSizing: 'border-box', fontFamily: SANS, fontSize: 17, color: B.faint }}>{ic(I.search, 18, B.faint)}Search for candidate…</div>
      <div style={{ flex: 1 }} />
      <OutPill>Tracker data</OutPill>
      <OutPill style={{ width: 50, padding: 0, justifyContent: 'center' }}>{ic(I.dl, 18, B.ink)}</OutPill>
      <OutPill style={{ background: '#0b0b10', color: '#fff', borderColor: '#0b0b10' }}>+ Add Candidate</OutPill>
    </div>
    <Card style={{ left: SB + 36, top: HD + 272, width: 998, height: 456, borderRadius: 14, overflow: 'hidden' }}>
      <div style={{ display: 'grid', gridTemplateColumns: COLS_S, alignItems: 'center', height: 56, background: '#fafafc', borderBottom: '1px solid ' + B.line, fontFamily: SANS, fontSize: 16, color: B.muted }}>
        <span style={{ paddingLeft: 20 }}><Box /></span><span>Sr.No</span><span>Candidate ↓</span><span style={{ paddingLeft: 20 }}>Scoring</span><span>Submitted</span><span>Candidate Status</span></div>
      {ROWS.map(([n, loc, v, st], i) => { const k = E.in(i * 0.05, 0.3 + i * 0.05)(r), sc = Math.round(v * E.io(0.1 + i * 0.06, 0.8 + i * 0.06)(r)); return (
        <div key={n} style={{ display: 'grid', gridTemplateColumns: COLS_S, alignItems: 'center', height: 80, borderBottom: '1px solid ' + B.line, fontFamily: SANS, fontSize: 18, color: B.ink, opacity: k, background: i === 1 ? 'rgba(239,238,254,' + hl + ')' : 'transparent' }}>
          <span style={{ paddingLeft: 20 }}><Box /></span><span style={{ fontWeight: 600, paddingLeft: 14 }}>{i + 1}</span>
          <div><div style={{ fontWeight: 600 }}>{n}</div><div style={{ fontSize: 15, color: B.muted, marginTop: 2 }}>{loc}</div></div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', fontWeight: 600 }}>{sc}%{ic(I.info, 22, '#3b82f6')}</div>
          <span>27 Sep 2026</span>
          <span><Pill bg="#f1f1f4" fg={B.muted} style={{ fontWeight: 500, padding: '7px 16px' }}>{st}</Pill></span></div>); })}
    </Card>
    {m > 0 && <div style={abs({ left: 0, top: 0, width: WW, height: WH, background: 'rgba(20,18,30,' + 0.38 * m + ')', zIndex: 5 })}>
      <div style={abs({ left: (WW - 820) / 2, top: 36, width: 820, height: 788, background: '#fff', borderRadius: 22, boxShadow: '0 30px 80px rgba(0,0,0,0.25)', padding: '30px 36px', boxSizing: 'border-box', opacity: m, transform: 'translateY(' + (1 - m) * 24 + 'px) scale(' + mix(0.97, 1, m) + ')', fontFamily: SANS })}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span style={{ fontSize: 30, fontWeight: 600, color: B.ink }}>Scoring</span>{ic(I.x, 22, B.ink)}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 22 }}>
          <span style={{ width: 52, height: 52, borderRadius: 26, background: '#cfe3ff', color: '#1f4f9a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: 18 }}>RP</span>
          <div style={{ flex: 1 }}><div style={{ fontSize: 21, fontWeight: 600, color: B.ink }}>Rahul Pillai</div><div style={{ fontSize: 15, color: B.muted, letterSpacing: '0.04em' }}>MUMBAI</div></div>
          <div style={{ textAlign: 'right' }}><div style={{ fontSize: 46, fontWeight: 600, color: '#2e8b3e', lineHeight: 1 }}>{Math.round(93 * E.io(1.5, 2.4)(r))}%</div><div style={{ fontSize: 15, color: B.muted, marginTop: 4 }}>Overall Score</div></div></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 24 }}>
          {CRIT.map(([t, v, d], i) => { const k = E.io(1.6 + i * 0.1, 2.5 + i * 0.1)(r); return (
            <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '18px 18px', borderRadius: 16, border: '1px solid ' + B.line, opacity: Math.min(1, k * 2) }}>
              <Ring v={v * k} size={68} stroke={6} font={16} pct />
              <div><div style={{ fontSize: 19, fontWeight: 600, color: B.ink }}>{t}</div><div style={{ fontSize: 16, color: B.muted, lineHeight: 1.4, marginTop: 3 }}>{d}</div></div></div>); })}
        </div>
        <div style={{ fontSize: 19, fontWeight: 600, color: B.ink, margin: '26px 0 12px' }}>Skills Match</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>{['tally prime', 'bank reconciliation', 'gst returns', 'advanced excel', 'accounts payable'].map((c, i) => { const k = E.pop(2.4 + i * 0.07, 2.7 + i * 0.07)(r); return <span key={c} style={{ padding: '7px 14px', borderRadius: 999, background: '#dff2e3', color: '#2b6b37', fontSize: 16, fontWeight: 600, opacity: Math.min(1, k * 1.3), transform: 'scale(' + mix(0.7, 1, k) + ')' }}>✓ {c}</span>; })}</div>
        <div style={{ fontSize: 19, fontWeight: 600, color: B.ink, margin: '22px 0 12px' }}>Missing Skills</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>{['payroll processing', 'fixed asset register'].map((c, i) => { const k = E.pop(2.8 + i * 0.07, 3.1 + i * 0.07)(r); return <span key={c} style={{ padding: '7px 14px', borderRadius: 999, background: '#fde4e1', color: '#b3261e', fontSize: 16, fontWeight: 600, opacity: Math.min(1, k * 1.3), transform: 'scale(' + mix(0.7, 1, k) + ')' }}>× {c}</span>; })}</div>
      </div>
    </div>}
  </>;
}

const WA = { head: '#075e54', bg: '#efeae2', out: '#d9fdd3', tick: '#53bdeb', btn: '#25d366' };
const KCOLS = [['Manager Review', 20, 220, '#f1f1f4', '#e3e3ea', '#e3e3ea'], ['Client Review', 260, 300, '#eef5ff', '#cfe0fb', '#cfe0fb'], ['Shortlisted', 580, 60, '#f0edff', '#d6cffb', '#d6cffb'], ['Interview', 660, 318, '#fdf0f6', '#f6cfe2', '#f8d3e6']];
function KCard({ n, loc, ph, v, x, y, lift = 0, tag = 0, press = 0 }) {
  const btn = (d, bg, c, bd, p) => <span style={{ width: 46, height: 46, borderRadius: 23, background: bg, border: bd ? '1px solid ' + bd : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box', transform: 'scale(' + (1 - (p || 0) * 0.12) + ')', boxShadow: p ? '0 0 0 6px rgba(37,211,102,' + 0.25 * p + ')' : 'none' }}>{d}</span>;
  return <div style={abs({ left: x, top: y, width: 276, height: 228, borderRadius: 16, background: '#fff', boxShadow: '0 ' + (2 + lift * 18) + 'px ' + (6 + lift * 30) + 'px rgba(30,30,60,' + (0.06 + lift * 0.12) + ')', transform: 'rotate(' + lift * 2 + 'deg)', fontFamily: SANS, zIndex: lift > 0 ? 3 : 1 })}>
    <div style={abs({ left: 16, top: 16, right: 16, display: 'flex', alignItems: 'center', gap: 10 })}><Av n={n} c="#dbe9ff" f="#1f4f9a" />
      <div style={{ flex: 1 }}><div style={{ fontSize: 18, fontWeight: 600, color: B.ink }}>{n}</div><div style={{ fontSize: 14, color: B.muted }}>{loc}</div></div>
      {tag > 0 && <span style={{ padding: '3px 10px', borderRadius: 6, background: '#fbd3e6', color: '#9c2a5f', fontSize: 13, fontWeight: 600, opacity: tag, transform: 'scale(' + mix(0.7, 1, tag) + ')' }}>Interview</span>}</div>
    <div style={abs({ left: 16, top: 72, fontSize: 15, color: B.muted, lineHeight: 1.6 })}><div>Contact: <span style={{ color: B.ink }}>{ph}</span></div><div>Scoring: <span style={{ color: B.ink, fontWeight: 600 }}>{v}%</span></div></div>
    <div style={abs({ left: 16, right: 16, top: 128, display: 'flex', justifyContent: 'center', gap: 12 })}>
      {btn(ic(I.mail, 18, B.muted), '#fff', 0, '#e3e3ea')}{btn(ic(I.phone, 18, '#3b82f6'), '#fff', 0, '#e3e3ea')}{btn(ic(I.wa, 22, '#fff', 1.7), WA.btn, 0, 0, press)}{btn(ic(I.ban, 18, '#d0312d'), '#fdecea')}</div>
    <div style={abs({ left: 16, right: 16, bottom: 12, paddingTop: 10, borderTop: '1px solid ' + B.line, display: 'flex', justifyContent: 'space-between', fontSize: 14, color: B.muted })}><span>By Daniel Reyes</span><span>0 day</span></div>
  </div>;
}
function WhatsApp({ r }) {
  const press = (t) => E.io(t - 0.05, t)(r) * (1 - E.io(t + 0.02, t + 0.2)(r));
  const mv = E.io(0.55, 1.2)(r), up = E.io(0.8, 1.35)(r), pan = E.io(1.6, 1.95)(r);
  const msgs = [[0, 'Hi Rahul, you’re shortlisted for Junior Accountant at Northwind Retail. Interview on Thu, 2 Oct — which slot suits you?', 1.95], [1, '11 AM works for me, thanks!', 2.85], [0, 'Confirmed ✓ Invite sent for Thu, 11:00 AM.', 3.4]];
  const pick = E.io(2.6, 2.67)(r) * (1 - E.io(2.7, 2.85)(r));
  const cnt = (a, b) => mv > 0.5 ? b : a;
  return <>
    <JobHead />
    <div style={abs({ left: SB + 36, top: HD + 132, display: 'flex', alignItems: 'center', gap: 12 })}>
      <OutPill style={{ border: 'none', background: '#eef5e6', transform: 'scale(' + (1 - press(0.45) * 0.06) + ')' }}>{ic(I.move, 18, B.ink)}Move Stage</OutPill>
      <OutPill style={{ border: 'none', background: '#fdecea', color: '#c0392b' }}>{ic(I.ban, 18, '#c0392b')}Reject</OutPill>
      <span style={{ width: 50, height: 50, borderRadius: 25, background: WA.btn, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{ic(I.wa, 24, '#fff', 1.7)}</span>
      <OutPill style={{ borderColor: '#e3e3ea' }}>{ic(I.refresh, 18, B.ink)}Scoring</OutPill>
      <OutPill style={{ borderColor: '#e3e3ea' }}>{ic(I.mail, 18, B.ink)}Send Email</OutPill>
    </div>
    <div style={abs({ left: SB + 36, top: HD + 212, width: 998, height: 560, borderRadius: 18, background: '#f7f7fa', overflow: 'hidden' })}>
      {KCOLS.map(([t, x, w, bg, bd, badge], i) => <div key={t} style={abs({ left: x, top: 20, width: w, height: 520, borderRadius: 16, background: bg, border: '1.5px solid ' + bd, boxSizing: 'border-box' })}>
        {i === 2 ? <div style={abs({ left: 0, right: 0, top: 18, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, fontFamily: SANS })}><span style={{ fontSize: 18, color: B.ink }}>›</span>
          <span style={{ writingMode: 'vertical-rl', fontSize: 18, fontWeight: 600, color: B.ink }}>Shortlisted</span><span style={{ padding: '1px 8px', borderRadius: 6, background: badge, fontSize: 14, fontWeight: 600 }}>0</span></div>
        : <div style={abs({ left: 18, top: 16, display: 'flex', alignItems: 'center', gap: 10, fontFamily: SANS, fontSize: 18, fontWeight: 600, color: B.ink })}>{ic(I.chev, 16, B.ink)}{t}
          <span style={{ padding: '1px 9px', borderRadius: 6, background: badge, fontSize: 14 }}>{i === 0 ? 0 : i === 1 ? cnt(3, 2) : cnt(0, 1)}</span></div>}
      </div>)}
      <KCard n="Aditi Sharma" loc="Pune" ph="98450 21873" v={48} x={272} y={mix(72 + 242, 72, up)} />
      <KCard n="Nikhil Jain" loc="Nagpur" ph="97302 55610" v={86} x={272} y={mix(72 + 484, 72 + 242, up)} />
      <KCard n="Rahul Pillai" loc="Mumbai" ph="98201 44517" v={93} x={mix(272, 681, mv)} y={72 - Math.sin(mv * Math.PI) * 18} lift={Math.sin(mv * Math.PI)} tag={E.pop(1.15, 1.45)(r)} press={press(1.55)} />
    </div>
    {pan > 0 && <div style={abs({ left: WW - 24 - 480, top: HD + 20, width: 480, height: WH - HD - 44, borderRadius: 18, overflow: 'hidden', background: WA.bg, boxShadow: '0 30px 70px rgba(0,0,0,0.22)', opacity: pan, transform: 'translateX(' + (1 - pan) * 60 + 'px)', zIndex: 5 })}>
      <div style={{ height: 76, background: WA.head, display: 'flex', alignItems: 'center', gap: 14, padding: '0 20px' }}>
        <Av n="Rahul Pillai" c="#dff3e6" f={WA.head} /><div style={{ fontFamily: SANS, color: '#fff', flex: 1 }}><div style={{ fontSize: 18, fontWeight: 600 }}>Rahul Pillai</div><div style={{ fontSize: 14, opacity: 0.85 }}>+91 98201 44517 · WhatsApp Business</div></div>{ic(I.x, 20, '#fff')}</div>
      <div style={{ padding: '14px 20px 0', textAlign: 'center' }}><span style={{ padding: '5px 12px', borderRadius: 8, background: '#fff', fontFamily: SANS, fontSize: 13, color: '#54656f' }}>Template · Interview invite</span></div>
      <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {msgs.map(([me, t, at], i) => { const k = E.pop(at, at + 0.4)(r); const out = me === 0; if (k <= 0) return null; return (
          <div key={i} style={{ alignSelf: out ? 'flex-end' : 'flex-start', maxWidth: 380, opacity: Math.min(1, k * 1.3), transform: 'scale(' + mix(0.85, 1, k) + ')', transformOrigin: out ? '100% 100%' : '0 100%' }}>
            <div style={{ padding: '12px 14px 8px', borderRadius: 12, background: out ? WA.out : '#fff', boxShadow: '0 1px 1px rgba(0,0,0,0.08)', fontFamily: SANS, fontSize: 17, lineHeight: 1.4, color: '#111b21' }}>{t}
              <div style={{ textAlign: 'right', fontSize: 13, color: '#667781', marginTop: 4 }}>11:0{i + 2} {out && <span style={{ color: WA.tick, fontWeight: 700 }}>✓✓</span>}</div></div>
            {i === 0 && <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>{['11:00 AM', '3:00 PM'].map((o, j) => <div key={o} style={{ flex: 1, textAlign: 'center', padding: '10px 0', borderRadius: 10, background: '#fff', color: '#027eb5', fontFamily: SANS, fontSize: 16, fontWeight: 600, boxShadow: '0 1px 1px rgba(0,0,0,0.08)', transform: j === 0 ? 'scale(' + (1 - pick * 0.06) + ')' : 'none' }}>{o}</div>)}</div>}
          </div>); })}
      </div>
    </div>}
  </>;
}

const CQ = [
  ['Walk me through posting daily vouchers in Tally Prime while keeping ledgers accurate.', 'Collect source documents, check them against policy, choose the right voucher type and ledger, run Tally’s validation checks, then post and share a daily summary with the finance lead.'],
  ['How do you reconcile bank statements in Tally and resolve mismatches?', 'Import the statement, auto-match entries, investigate unmatched items for timing or fee differences, and pass adjusting journal entries.'],
  ['How do you handle GST input credit that doesn’t match GSTR-2B?', 'Compare the purchase register with 2B, chase vendors for missing invoices, and hold the credit until it reflects.'],
];
const ENQ = [['Current Organization', 'Ledgerline Pvt Ltd'], ['Education', 'B.Com'], ['Total Experience', '3 years'], ['Current Compensation', '₹4.2 LPA'], ['Expected Compensation', '₹5.5 LPA'], ['Notice Period', '30 days']];
function Interview({ r }) {
  const press = E.io(3.65, 3.7)(r) * (1 - E.io(3.72, 3.9)(r)), saved = E.pop(3.8, 4.15)(r), scroll = E.io(2.0, 3.0)(r) * 190;
  return <div style={abs({ left: 0, top: 0, width: WW, height: WH, background: 'rgba(20,18,30,0.38)', zIndex: 5 })}>
    <div style={abs({ left: 30, top: 30, width: WW - 60, height: WH - 60, background: '#fff', borderRadius: 22, boxShadow: '0 30px 80px rgba(0,0,0,0.25)', overflow: 'hidden', fontFamily: SANS })}>
      <div style={abs({ left: 44, top: 34 })}><div style={{ fontSize: 32, fontWeight: 600, color: B.ink }}>Candidate Call</div><div style={{ fontSize: 18, color: B.muted, marginTop: 6 }}>Capture candidate details during the call</div></div>
      <div style={abs({ right: 44, top: 44 })}>{ic(I.x, 24, B.ink)}</div>
      <div style={abs({ left: 36, top: 140, width: 640, bottom: 36, borderRadius: 18, background: '#f6f6f9', overflow: 'hidden' })}>
        <div style={abs({ left: 28, top: 24, fontSize: 22, fontWeight: 600, color: B.ink })}>Candidate Questions</div>
        <div style={abs({ left: 20, right: 20, top: 74, transform: 'translateY(' + -scroll + 'px)', display: 'flex', flexDirection: 'column', gap: 16 })}>
          {CQ.map(([q, a], i) => { const k = E.in(0.1 + i * 0.15, 0.5 + i * 0.15)(r); return (
            <div key={i} style={{ background: '#fff', borderRadius: 14, padding: '20px 22px', opacity: k, transform: 'translateY(' + (1 - k) * 14 + 'px)' }}>
              <div style={{ fontSize: 18, fontWeight: 600, color: B.ink, lineHeight: 1.45 }}>Q{i + 1}. {q}</div>
              <div style={{ fontSize: 16, color: B.muted, lineHeight: 1.6, marginTop: 12 }}><span style={{ color: '#2e9e4f', fontWeight: 600 }}>Ideal Answer: </span>{a}</div></div>); })}
        </div>
      </div>
      <div style={abs({ left: 720, top: 140, right: 44 })}>
        <div style={{ fontSize: 22, fontWeight: 600, color: B.ink, marginBottom: 18 }}>Enquiry Questions</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '22px 26px' }}>
          {ENQ.map(([l, v], i) => { const a = 0.5 + i * 0.45, k = E.io(a, a + 0.35)(r), n = Math.floor(v.length * k), focus = r > a - 0.05 && r < a + 0.45;
            return <div key={l}><div style={{ fontSize: 17, fontWeight: 600, color: B.ink, marginBottom: 8 }}>{l}</div>
              <div style={{ height: 54, borderRadius: 27, border: '1px solid ' + (focus ? '#9cc4ff' : '#dcdce3'), boxShadow: focus ? '0 0 0 3px rgba(90,167,255,0.18)' : 'none', display: 'flex', alignItems: 'center', padding: '0 22px', fontSize: 17, color: n ? B.ink : B.faint, whiteSpace: 'nowrap', overflow: 'hidden' }}>
                {n ? v.slice(0, n) : l.includes('Compensation') ? 'Enter amount' : 'Enter ' + l.toLowerCase()}{focus && <span style={{ display: 'inline-block', width: 2, height: 20, marginLeft: 1, background: B.ink }} />}</div></div>; })}
        </div>
      </div>
      <div style={abs({ left: 720, bottom: 40, padding: '14px 20px', borderRadius: 12, background: '#eef0f5', fontSize: 17, fontWeight: 500, color: B.ink, display: 'flex', alignItems: 'center', gap: 10 })}>{ic(I.phone, 18, '#3b82f6')}98201 44517 · Rahul Pillai</div>
      <div style={abs({ right: 44, bottom: 110, padding: '9px 16px', borderRadius: 999, background: '#e3f3dc', color: '#3d7a2b', fontSize: 16, fontWeight: 600, opacity: Math.min(1, saved * 1.3), transform: 'translateY(' + (1 - saved) * 10 + 'px)' })}>✓ Saved to candidate profile</div>
      <div style={abs({ right: 44, bottom: 36, padding: '15px 44px', borderRadius: 999, background: '#0b0b10', color: '#fff', fontSize: 18, fontWeight: 600, transform: 'scale(' + (1 - press * 0.06) + ')' })}>Submit</div>
    </div>
  </div>;
}

// ---------- film ----------
function Words({ text, T, at, size = 120, color = '#fff', serifWords = [], stagger = 0.08 }) {
  return <div style={{ display: 'flex', flexWrap: 'wrap', gap: `0 ${size * 0.26}px`, justifyContent: 'center' }}>
    {text.split(' ').map((w, i) => { const k = E.in(at + i * stagger, at + 0.55 + i * stagger)(T); const s = serifWords.includes(i);
      return <span key={i} style={{ display: 'inline-block', overflow: 'hidden', paddingBottom: size * 0.12 }}>
        <span style={{ display: 'inline-block', fontFamily: s ? SERIF : SANS, fontStyle: s ? 'italic' : 'normal', fontWeight: s ? 400 : 600, fontSize: s ? size * 1.12 : size, lineHeight: 1, letterSpacing: s ? 0 : '-0.03em',
          color: s ? 'transparent' : color, backgroundImage: s ? GRAD : 'none', WebkitBackgroundClip: s ? 'text' : 'border-box', backgroundClip: s ? 'text' : 'border-box', transform: `translateY(${(1 - k) * 110}%)` }}>{w}</span></span>; })}
  </div>;
}

function SideCopy({ T, a, b, kicker, title, serif }) {
  if (T < a - 0.1 || T > b + 0.1) return null;
  const k = E.in(a, a + 0.45)(T), out = E.io(b - 0.3, b)(T);
  return <div style={abs({ left: 90, top: 0, bottom: 0, width: 450, display: 'flex', flexDirection: 'column', justifyContent: 'center', opacity: 1 - out, transform: `translateY(${-out * 20}px)` })}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, opacity: k, marginBottom: 22 }}>
      <span style={{ width: 28, height: 3, borderRadius: 2, background: GRAD }} />
      <span style={{ fontFamily: SANS, fontSize: 22, fontWeight: 500, color: '#b9b4cc', letterSpacing: '0.04em' }}>{kicker}</span></div>
    {title.map((l, i) => { const kk = E.in(a + 0.1 + i * 0.12, a + 0.7 + i * 0.12)(T); const isS = i === serif; return (
      <div key={i} style={{ overflow: 'hidden', paddingBottom: 12 }}><div style={{ fontFamily: isS ? SERIF : SANS, fontStyle: isS ? 'italic' : 'normal', fontWeight: isS ? 400 : 600, fontSize: isS ? 76 : 66, lineHeight: 1.08, whiteSpace: 'nowrap', letterSpacing: isS ? 0 : '-0.03em',
        color: isS ? 'transparent' : '#fff', backgroundImage: isS ? GRAD : 'none', WebkitBackgroundClip: isS ? 'text' : 'border-box', backgroundClip: isS ? 'text' : 'border-box', transform: `translateY(${(1 - kk) * 105}%)` }}>{l}</div></div>); })}
  </div>;
}

function Cursor({ x, y, T, clicks }) {
  return <div style={abs({ left: x, top: y, zIndex: 30 })}>
    {clicks.map((t, i) => { if (T < t || T > t + 0.5) return null; const k = E.in(t, t + 0.5)(T);
      return <div key={i} style={abs({ left: -30 * k, top: -30 * k, width: 60 * k, height: 60 * k, borderRadius: '50%', background: `rgba(155,140,255,${0.35 * (1 - k)})` })} />; })}
    <svg width="34" height="40" viewBox="0 0 30 36" style={{ position: 'absolute', left: -4, top: -3, filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.35))' }}>
      <polygon points="3,2 3,30 10,23 15,34 20,32 15,21 25,21" fill="#111" stroke="#fff" strokeWidth="2" strokeLinejoin="round" /></svg></div>;
}

const blobSrc = {};
function useBlobSrc(url) {
  const [src, setSrc] = React.useState(blobSrc[url] && blobSrc[url].url);
  React.useEffect(() => { if (!blobSrc[url]) blobSrc[url] = { p: fetch(url).then((r) => r.blob()).then((b) => (blobSrc[url].url = URL.createObjectURL(b))) };
    let live = true; blobSrc[url].p.then((u) => live && setSrc(u)); return () => { live = false; }; }, [url]);
  return src;
}
function Music({ T, on }) {
  const ref = React.useRef(null), last = React.useRef({ T: -1, at: 0 }); const src = useBlobSrc('assets/talentilo-music-v14-calm.wav');
  if (T !== last.current.T) last.current = { T, at: performance.now() };
  React.useEffect(() => { const m = ref.current; if (!m || !src) return; const playing = performance.now() - last.current.at < 120;
    if (!on) { if (!m.paused) m.pause(); return; }
    if (Math.abs(m.currentTime - T) > (playing ? 0.4 : 0.05)) m.currentTime = T; if (playing && m.paused) m.play().catch(() => {}); });
  React.useEffect(() => { const id = setInterval(() => { const m = ref.current; if (m && !m.paused && performance.now() - last.current.at > 150) m.pause(); }, 100); return () => clearInterval(id); }, []);
  return <audio ref={ref} src={src} preload="auto" />;
}

function Piece({ music }) {
  const { T, CUES: C, authoredTotal } = useComposition();
  const total = authoredTotal || 29;
  const Ws = C.Workspace, Jd = C.JD, Sc = C.Scoring, Ai = C.AICalling, Wa = C.WhatsApp, Iv = C.Interview, Ca = C.Calls, Tg = C.Targets, Rp = C.Reports, Of = C.Offers, Ou = C.Outro, Tm = Jd;
  const screens = [[Workspace, Ws, Jd, null, 0], [JD, Jd, Sc, 'Jobs', -1], [Scoring, Sc, Ai, 'Jobs', -1], [AICalls, Ai, Wa, 'Jobs', -1], [WhatsApp, Wa, Iv, 'Jobs', -1], [Interview, Iv, Ca, 'Jobs', -1], [Calls, Ca, Tg, 'Calling Performance', -1], [Targets, Tg, Rp, 'Targets', -1], [Reports, Rp, Of, null, 1], [Offers, Of, 1e9, 'Offers', -1]];
  const cur = screens.findIndex((s) => T < s[2]); const scr = screens[Math.max(0, cur)];
  const winIn = E.io(Ws - 0.9, Ws + 0.5)(T), winOut = E.io(Ou - 0.1, Ou + 0.7)(T);
  // camera (window-local focus)
  const toStage = (x, y) => [WX + x, WY + y];
  const navY = (i) => HD + 72 + 22 + i * 50;
  const plan = [
    [Jd, 0, [[1.7, MX + 1010 - 28 - 60, MY + 706, 1.9], [2.95, MX + 935, MY + 104 + 29 + 96 + 10 + 23, 3.1], [4.6, MX + 905, MY + 104 + 29 + 96 + 10 + 46 + 10 + 29 + 140 + 10 + 23, 4.8]]],
    [Sc, 0, [[1.2, SB + 571, HD + 448, 1.3]]], [Ai, 0, [[1.2, SB + 700, HD + 560, null]]], [Wa, 0, [[0.35, SB + 121, HD + 157, 0.45], [1.45, SB + 884, HD + 447, 1.55]]],
    [Iv, null, [[0.4, 860, 272, 0.45], [3.5, 1142, 767, 3.7]]], [Ca, 1, [[2.65, 700, HD + 249, 2.75]]], [Tg, 4, [[1.2, SB + 200, HD + 520, null]]], [Rp, 'tab', [[1.3, SB + 36 + 253 + 20 + 55, HD + 210 + 270 - 20 - 21, 1.45]]], [Of, 2, [[1.9, 1030, HD + 254, 2.0]]]];
  const cp = [[Jd - 1.2, ...toStage(600, 500)]], clickTimes = [];
  plan.forEach(([st, nav, stops], i) => { const nx = nav === 'tab' ? 470 : 110, ny = nav === 'tab' ? 34 : navY(nav); const end = i + 1 < plan.length ? plan[i + 1][0] : Ou;
    if (nav !== null) { cp.push([st - 0.35, ...toStage(nx, ny)]); clickTimes.push(st - 0.35); }
    stops.forEach(([t, x, y, ct]) => { cp.push([st + t, ...toStage(x, y)]); if (ct) { cp.push([st + ct + 0.05, ...toStage(x, y)]); clickTimes.push(st + ct); } });
    const last = stops[stops.length - 1]; cp.push([end - 0.9, ...toStage(last[1], last[2])]); });
  const [px, py] = path(cp, T);
  const showCursor = T > Jd - 1.2 && T < Ou - 0.1;
  const hookOut = E.io(C.Logo - 0.3, C.Logo + 0.1)(T);
  const lg = E.pop(C.Logo + 0.1, C.Logo + 0.9)(T), lgWipe = E.io(C.Logo + 0.5, C.Logo + 1.3)(T), lgOut = E.io(Ws - 1.0, Ws - 0.4)(T);
  const oK = E.in(Ou + 0.6, Ou + 1.3)(T), fade = E.io(total - 0.5, total)(T);
  return (
    <div data-screen-label={`t=${Math.floor(T)}s`} style={abs({ inset: 0, background: B.dark, overflow: 'hidden', WebkitFontSmoothing: 'antialiased', textRendering: 'geometricPrecision' })}>
      <div style={abs({ left: -300, top: -400, width: 1400, height: 1400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(155,140,255,0.22), transparent 62%)', transform: `translate(${Math.sin(T * 0.35) * 80}px, ${Math.cos(T * 0.3) * 60}px)` })} />
      <div style={abs({ right: -400, bottom: -500, width: 1400, height: 1400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(90,167,255,0.18), transparent 62%)', transform: `translate(${Math.cos(T * 0.3) * 80}px, ${Math.sin(T * 0.25) * 60}px)` })} />
      {hookOut < 1 && <div style={abs({ inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 6, opacity: 1 - hookOut, transform: `scale(${mix(1, 0.94, hookOut)})` })}>
        <Words text="Recruiters lose 40 hours a week" T={T} at={0.2} size={112} serifWords={[3, 4, 5]} />
        <Words text="to calls, chasing and spreadsheets." T={T} at={0.9} size={80} color="#b9b4cc" stagger={0.06} />
      </div>}
      {T > C.Logo - 0.1 && lgOut < 1 && <div style={abs({ inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 34, opacity: 1 - lgOut, transform: `scale(${mix(1, 1.06, lgOut)})` })}>
        <div style={{ transform: `scale(${mix(0.7, 1, lg)})`, opacity: Math.min(1, lg * 1.4), clipPath: `inset(0 ${(1 - lgWipe) * 88}% 0 0)` }}><img src="assets/logo-color-on-dark.png" alt="Talentilo.ai" style={{ height: 110, width: 'auto', display: 'block' }} /></div>
        <div style={{ fontFamily: SANS, fontSize: 36, color: '#b9b4cc', opacity: E.in(C.Logo + 1.1, C.Logo + 1.6)(T) }}>The AI-native recruitment OS</div>
      </div>}
      <SideCopy T={T} a={Ws + 0.3} b={Jd} kicker="My Workspace" title={['Every offer,', 'interview, win.', 'One screen.']} serif={2} />
      <SideCopy T={T} a={Jd - 0.05} b={Sc} kicker="AI JD creation" title={['Fill the basics.', 'AI writes', 'the JD.']} serif={2} />
      <SideCopy T={T} a={Sc - 0.05} b={Ai} kicker="Candidate scoring" title={['Every resume', 'scored against', 'the JD.']} serif={2} />
      <SideCopy T={T} a={Ai - 0.05} b={Wa} kicker="AI voice screening" title={['AI calls', 'every candidate.', 'You meet the fit.']} serif={2} />
      <SideCopy T={T} a={Wa - 0.05} b={Iv} kicker="Pipeline + WhatsApp" title={['Shortlist,', 'then invite on', 'WhatsApp.']} serif={2} />
      <SideCopy T={T} a={Iv - 0.05} b={Ca} kicker="Candidate call" title={['Questions', 'and answers,', 'ready to ask.']} serif={2} />
      <SideCopy T={T} a={Ca - 0.05} b={Tg} kicker="Calling performance" title={['Every call', 'logged,', '& scored.']} serif={2} />
      <SideCopy T={T} a={Tg - 0.05} b={Rp} kicker="Targets" title={['Live targets', 'for every', 'recruiter.']} serif={2} />
      <SideCopy T={T} a={Rp - 0.05} b={Of} kicker="Reports & Analytics" title={['Every report,', 'one click', 'away.']} serif={2} />
      <SideCopy T={T} a={Of - 0.05} b={Ou} kicker="Offers" title={['From offer', 'to', 'joining day.']} serif={2} />
      {winIn > 0 && winOut < 1 && <div style={abs({ left: 0, top: 0, width: W, height: H, perspective: winIn < 1 ? 2400 : 'none' })}>
        <div style={abs({ left: WX, top: WY, width: WW, height: WH, transformOrigin: '50% 50%',
          transform: winIn < 1 ? `translateX(${(1 - winIn) * 900}px) rotateY(${(1 - winIn) * -18}deg)` : winOut > 0 ? `translateY(${winOut * 80}px) scale(${mix(1, 0.9, winOut)})` : 'none', opacity: Math.min(1, winIn * 1.5) * (1 - winOut) })}>
          <div style={abs({ inset: 0, borderRadius: 22, overflow: 'hidden', background: B.app, boxShadow: '0 50px 120px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.08)' })}>
            <Shell nav={scr[3]} tab={scr[4]} />
            {screens.map(([S, a, b], i) => { const o = (i === 0 ? 1 : E.io(a - 0.15, a + 0.25)(T)) * (1 - E.io(b - 0.15, b + 0.25)(T)); if (o <= 0.001) return null;
              return <div key={i} style={abs({ inset: 0, opacity: o, transform: T - a > 0.3 ? 'none' : `translateY(${Math.round((1 - Math.min(1, (T - a + 0.15) / 0.4)) * 20)}px)` })}><S r={T - a} /></div>; })}
          </div>
        </div>
      </div>}
      {showCursor && <Cursor x={px} y={py} T={T} clicks={clickTimes} />}
      {oK > 0 && <div style={abs({ inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, opacity: 1 - fade })}>
        <Words text="Bring back the human" T={T} at={Ou + 0.6} size={128} serifWords={[3]} />
        <Words text="in recruitment." T={T} at={Ou + 0.95} size={128} />
        <div style={{ marginTop: 56, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 34, opacity: E.in(Ou + 1.7, Ou + 2.3)(T), transform: `translateY(${(1 - E.in(Ou + 1.7, Ou + 2.3)(T)) * 16}px)` }}>
          <img src="assets/logo-color-on-dark.png" alt="Talentilo.ai" style={{ height: 44, width: 'auto', display: 'block' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
            <div style={{ position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', gap: 18, padding: '10px 10px 10px 28px', borderRadius: 999, background: '#fff', boxShadow: '0 10px 40px rgba(155,140,255,0.35), inset 0 0 0 1px rgba(255,255,255,0.6)', transform: `scale(${mix(0.94, 1, E.pop(Ou + 2.0, Ou + 2.6)(T))})` }}>
              <span style={{ fontFamily: SANS, fontSize: 22, fontWeight: 500, color: B.ink, letterSpacing: '-0.01em' }}>Book a demo</span>
              <span style={{ width: 40, height: 40, borderRadius: 20, background: GRAD, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="16" height="16" viewBox="0 0 16 16" style={{ transform: `translateX(${Math.sin(T * 3) * 1.5}px)` }}><path d="M3 8h9M8.5 4l4 4-4 4" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
              <span style={{ position: 'absolute', top: 0, bottom: 0, width: 60, left: `${-20 + ((T - Ou - 2.4) % 2.4) / 1.2 * 140}%`, background: 'linear-gradient(90deg, transparent, rgba(155,140,255,0.18), transparent)', transform: 'skewX(-20deg)' }} />
            </div>
          </div>
        </div>
      </div>}
      <div style={abs({ inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.45) 100%)' })} />
      <Music T={T} on={music} />
    </div>
  );
}

function TalentiloVideoV10() {
  const [t, setTweak] = useTweaks(window.TWEAK_DEFAULTS);
  React.useEffect(() => { const f = () => window.dispatchEvent(new Event('resize')); requestAnimationFrame(f); const ids = [100, 400, 1000].map((ms) => setTimeout(f, ms)); return () => ids.forEach(clearTimeout); }, []);
  return (
    <div style={{ position: 'fixed', inset: 0, background: '#000' }}>
      <CompositionStage width={W} height={H} scenes={window.OM_SCENES} playback={window.OM_PLAYBACK} bg={B.dark}>
        <Piece music={t.music} />
      </CompositionStage>
      <TweaksPanel>
        <TweakToggle label="Motion editor" value={t.motionEditor} onChange={(v) => setTweak('motionEditor', v)} />
        <TweakToggle label="Music" value={t.music} onChange={(v) => setTweak('music', v)} />
      </TweaksPanel>
    </div>
  );
}
window.TalentiloVideoV10 = TalentiloVideoV10;
})();

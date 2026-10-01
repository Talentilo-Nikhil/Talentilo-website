'use client';

import type { ReactElement } from 'react';

import { CreativeZoom } from '@/components/ui/CreativeZoom';

import { CUES, E, mix, path, TOTAL } from './engine';
import { abs, Cursor, SideCopy, Shell, Words } from './parts';
import { AICalls } from './scenes/AICalls';
import { Calls } from './scenes/Calls';
import { Interview } from './scenes/Interview';
import { JD, JD_MODAL } from './scenes/JD';
import { Offers } from './scenes/Offers';
import { Reports } from './scenes/Reports';
import { Scoring } from './scenes/Scoring';
import { Targets } from './scenes/Targets';
import { WhatsApp } from './scenes/WhatsApp';
import { Workspace } from './scenes/Workspace';
import { B, GRAD, GROUND, H, HD, SANS, SB, W, WH, WW, WX, WY } from './theme';
import { useFilmClock } from './useFilmClock';

/**
 * The Talentilo promo film, re-themed onto our ground.
 *
 * The handoff is a 53.4-second, 1920x1080 piece built for a `#0c0a10` canvas. Three things changed
 * bringing it here and nothing else did: the canvas became our wash, every piece of type sitting
 * on that canvas reversed, and the logo swapped to the light-ground cut the bundle already ships.
 * Inside the app window nothing moved — those scenes were drawn light to begin with, and a white
 * window on a blue wash keeps exactly the separation the dark canvas was giving it. All thirteen
 * scenes, their copy, their timing, their figures and their choreography are the film's own.
 *
 * It is laid out once at 1920x1080 and scaled by a single factor, the same device CreativeGround
 * uses for every other markup creative on the site, so it cannot reflow: an exported image and
 * this behave identically at every width.
 *
 * Everything is a pure function of `T`. No component holds animation state, so the film can be
 * pinned to an exact second and screenshotted — which is how the port is checked against the
 * original, and how the QA suite asserts a frame.
 */

type Scene = (p: { r: number }) => ReactElement;
/** `[scene, in, out, highlighted sidebar item, highlighted top tab]`. `-1` means neither tab. */
type ScreenRow = [Scene, number, number, string | null, number];

/** Where in the window a cursor stop is, in stage coordinates. */
const toStage = (x: number, y: number): [number, number] => [WX + x, WY + y];
/** The vertical centre of sidebar item `i`. */
const navY = (i: number) => HD + 72 + 22 + i * 50;

const { MX, MY } = JD_MODAL;

export function PromoFilm({ at }: { at?: number }) {
  const { T, still } = useFilmClock(at);
  const C = CUES;

  const Ws = C.Workspace;
  const Jd = C.JD;
  const Sc = C.Scoring;
  const Ai = C.AICalling;
  const Wa = C.WhatsApp;
  const Iv = C.Interview;
  const Ca = C.Calls;
  const Tg = C.Targets;
  const Rp = C.Reports;
  const Of = C.Offers;
  const Ou = C.Outro;

  const screens: ScreenRow[] = [
    [Workspace, Ws, Jd, null, 0],
    [JD, Jd, Sc, 'Jobs', -1],
    [Scoring, Sc, Ai, 'Jobs', -1],
    [AICalls, Ai, Wa, 'Jobs', -1],
    [WhatsApp, Wa, Iv, 'Jobs', -1],
    [Interview, Iv, Ca, 'Jobs', -1],
    [Calls, Ca, Tg, 'Calling Performance', -1],
    [Targets, Tg, Rp, 'Targets', -1],
    [Reports, Rp, Of, null, 1],
    [Offers, Of, 1e9, 'Offers', -1],
  ];
  const current = screens.findIndex((s) => T < s[2]);
  const scr = screens[Math.max(0, current)];

  /*
    The pointer's script.

    Each row is `[scene start, which nav item it clicks first, [[at, x, y, click at?], …]]`, in
    window-local coordinates. The loop below turns that into a keyframe list the easing walks: a
    stop before the nav click, a stop per target, a held position while a click lands, and a hold at
    the last target until just before the cut. Both the path and the click rings come out of the
    same list, so a ripple can never appear anywhere the cursor is not.
  */
  const plan: [number, number | 'tab' | null, [number, number, number, number | null][]][] = [
    /*
      The three JD targets are measured off the rendered buttons, not stacked up from assumed
      heights.

      The handoff built them by adding guessed box heights — `104 + 29 + 96 + 10 + 23` for the
      first — and two of the three guesses were wrong: the label renders 40px (30 plus a 10
      margin), not 29, and the skills box renders 119px, not 96, because seven chips wrap to two
      rows. The errors compound down the column, so "Generate JD" was clicked 38px above the
      button and "Generate JD Keyword" 57px above it — both landing on empty panel. Measured
      centres, modal-local: (939, 300), (903, 554), and the Next button at (950, 705).
    */
    [Jd, 0, [
      [1.7, MX + 950, MY + 705, 1.9],
      [2.95, MX + 939, MY + 300, 3.1],
      [4.6, MX + 903, MY + 554, 4.8],
    ]],
    [Sc, 0, [[1.2, SB + 571, HD + 448, 1.3]]],
    [Ai, 0, [[1.2, SB + 700, HD + 560, null]]],
    [Wa, 0, [[0.35, SB + 121, HD + 157, 0.45], [1.45, SB + 884, HD + 447, 1.55]]],
    [Iv, null, [[0.4, 860, 272, 0.45], [3.5, 1142, 767, 3.7]]],
    [Ca, 1, [[2.65, 700, HD + 249, 2.75]]],
    [Tg, 4, [[1.2, SB + 200, HD + 520, null]]],
    [Rp, 'tab', [[1.3, SB + 36 + 253 + 20 + 55, HD + 210 + 270 - 20 - 21, 1.45]]],
    [Of, 2, [[1.9, 1030, HD + 254, 2.0]]],
  ];

  const cp: number[][] = [[Jd - 1.2, ...toStage(600, 500)]];
  const clickTimes: number[] = [];
  plan.forEach(([st, nav, stops], i) => {
    const nx = nav === 'tab' ? 470 : 110;
    const ny = nav === 'tab' ? 34 : navY(nav ?? 0);
    const end = i + 1 < plan.length ? plan[i + 1][0] : Ou;
    if (nav !== null) {
      cp.push([st - 0.35, ...toStage(nx, ny)]);
      clickTimes.push(st - 0.35);
    }
    stops.forEach(([t, x, y, ct]) => {
      cp.push([st + t, ...toStage(x, y)]);
      if (ct) {
        cp.push([st + ct + 0.05, ...toStage(x, y)]);
        clickTimes.push(st + ct);
      }
    });
    const last = stops[stops.length - 1];
    cp.push([end - 0.9, ...toStage(last[1], last[2])]);
  });
  const [px, py] = path(cp, T);
  const showCursor = T > Jd - 1.2 && T < Ou - 0.1;

  const winIn = E.io(Ws - 0.9, Ws + 0.5)(T);
  const winOut = E.io(Ou - 0.1, Ou + 0.7)(T);
  const hookOut = E.io(C.Logo - 0.3, C.Logo + 0.1)(T);
  const lg = E.pop(C.Logo + 0.1, C.Logo + 0.9)(T);
  const lgWipe = E.io(C.Logo + 0.5, C.Logo + 1.3)(T);
  const lgOut = E.io(Ws - 1.0, Ws - 0.4)(T);
  const oK = E.in(Ou + 0.6, Ou + 1.3)(T);
  const oIn = E.in(Ou + 1.7, Ou + 2.3)(T);
  const fade = E.io(TOTAL - 0.5, TOTAL)(T);

  return (
    <div
      aria-hidden="true"
      data-promo-film
      data-still={still}
      style={abs({
        inset: 0, background: GROUND.wash, overflow: 'hidden',
        WebkitFontSmoothing: 'antialiased', textRendering: 'geometricPrecision',
      })}
    >
      {/*
        The two drifting glows. On the dark canvas they were a lavender and a blue lift; on a wash
        that is already both, the same colours would be mud, so they are the light they were doing
        the job of — the motion is what they were for and the motion is kept.
      */}
      <div
        style={abs({
          left: -300, top: -400, width: 1400, height: 1400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.38), transparent 62%)',
          transform: `translate(${Math.sin(T * 0.35) * 80}px, ${Math.cos(T * 0.3) * 60}px)`,
        })}
      />
      <div
        style={abs({
          right: -400, bottom: -500, width: 1400, height: 1400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.30), transparent 62%)',
          transform: `translate(${Math.cos(T * 0.3) * 80}px, ${Math.sin(T * 0.25) * 60}px)`,
        })}
      />

      {hookOut < 1 && (
        <div
          style={abs({
            inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center',
            alignItems: 'center', gap: 6, opacity: 1 - hookOut,
            transform: `scale(${mix(1, 0.94, hookOut)})`,
          })}
        >
          <Words text="Recruiters lose 40 hours a week" T={T} at={0.2} size={112} serifWords={[3, 4, 5]} />
          <Words
            text="to calls, chasing and spreadsheets."
            T={T} at={0.9} size={80} color={GROUND.kicker} stagger={0.06}
          />
        </div>
      )}

      {T > C.Logo - 0.1 && lgOut < 1 && (
        <div
          style={abs({
            inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center',
            alignItems: 'center', gap: 34, opacity: 1 - lgOut,
            transform: `scale(${mix(1, 1.06, lgOut)})`,
          })}
        >
          <div
            style={{
              transform: `scale(${mix(0.7, 1, lg)})`, opacity: Math.min(1, lg * 1.4),
              clipPath: `inset(0 ${(1 - lgWipe) * 88}% 0 0)`,
            }}
          >
            {/* The light-ground cut, which the bundle already shipped. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/promo/logo-color.png" alt="" style={{ height: 110, width: 'auto', display: 'block' }} />
          </div>
          <div
            style={{
              fontFamily: SANS, fontSize: 36, color: GROUND.kicker,
              opacity: E.in(C.Logo + 1.1, C.Logo + 1.6)(T),
            }}
          >
            The AI-native recruitment OS
          </div>
        </div>
      )}

      {/* One per product scene, cross-fading on every cut — the film's own copy, unchanged. */}
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

      {winIn > 0 && winOut < 1 && (
        <div style={abs({ left: 0, top: 0, width: W, height: H, perspective: winIn < 1 ? 2400 : 'none' })}>
          <div
            style={abs({
              left: WX, top: WY, width: WW, height: WH, transformOrigin: '50% 50%',
              transform:
                winIn < 1
                  ? `translateX(${(1 - winIn) * 900}px) rotateY(${(1 - winIn) * -18}deg)`
                  : winOut > 0
                    ? `translateY(${winOut * 80}px) scale(${mix(1, 0.9, winOut)})`
                    : 'none',
              opacity: Math.min(1, winIn * 1.5) * (1 - winOut),
            })}
          >
            {/*
              The window's own edge. On the dark canvas its separation came from a 0.55-alpha black
              shadow and a white hairline; on the wash that reads as grime, so it is the same two
              devices in the other direction — a softer ink shadow and a hairline that darkens
              rather than lightens.
            */}
            <div
              style={abs({
                inset: 0, borderRadius: 22, overflow: 'hidden', background: B.app,
                boxShadow: '0 40px 90px rgba(12,10,16,0.22), 0 0 0 1px rgba(12,10,16,0.06)',
              })}
            >
              <Shell nav={scr[3]} tab={scr[4]} />
              {screens.map(([S, a, b], i) => {
                const o = (i === 0 ? 1 : E.io(a - 0.15, a + 0.25)(T)) * (1 - E.io(b - 0.15, b + 0.25)(T));
                if (o <= 0.001) return null;
                return (
                  <div
                    key={a}
                    style={abs({
                      inset: 0, opacity: o,
                      transform:
                        T - a > 0.3
                          ? 'none'
                          : `translateY(${Math.round((1 - Math.min(1, (T - a + 0.15) / 0.4)) * 20)}px)`,
                    })}
                  >
                    <S r={T - a} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {showCursor && <Cursor x={px} y={py} T={T} clicks={clickTimes} />}

      {oK > 0 && (
        <div
          style={abs({
            inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', gap: 20, opacity: 1 - fade,
          })}
        >
          <Words text="Bring back the human" T={T} at={Ou + 0.6} size={128} serifWords={[3]} />
          <Words text="in recruitment." T={T} at={Ou + 0.95} size={128} />
          <div
            style={{
              marginTop: 56, display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: 34, opacity: oIn, transform: `translateY(${(1 - oIn) * 16}px)`,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/promo/logo-color.png" alt="" style={{ height: 44, width: 'auto', display: 'block' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
              {/*
                The closing pill. On the dark canvas a white pill needed no edge and got a lavender
                bloom; on the pale foot of the wash white-on-white has none, so it takes the same
                hairline-and-shadow treatment as the window. The sheen that sweeps it is the
                handoff's own and is kept — on white it still reads.
              */}
              <div
                style={{
                  position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center',
                  gap: 18, padding: '10px 10px 10px 28px', borderRadius: 999, background: '#fff',
                  boxShadow: '0 10px 40px rgba(12,10,16,0.16), inset 0 0 0 1px rgba(12,10,16,0.08)',
                  transform: `scale(${mix(0.94, 1, E.pop(Ou + 2.0, Ou + 2.6)(T))})`,
                }}
              >
                <span
                  style={{
                    fontFamily: SANS, fontSize: 22, fontWeight: 500, color: B.ink,
                    letterSpacing: '-0.01em',
                  }}
                >
                  Book a demo
                </span>
                <span
                  style={{
                    width: 40, height: 40, borderRadius: 20, background: GRAD, display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <svg
                    width="16" height="16" viewBox="0 0 16 16"
                    style={{ transform: `translateX(${Math.sin(T * 3) * 1.5}px)` }}
                  >
                    <path
                      d="M3 8h9M8.5 4l4 4-4 4" fill="none" stroke="#fff" strokeWidth="1.8"
                      strokeLinecap="round" strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span
                  style={{
                    position: 'absolute', top: 0, bottom: 0, width: 60,
                    left: `${-20 + (((T - Ou - 2.4) % 2.4) / 1.2) * 140}%`,
                    background: 'linear-gradient(90deg, transparent, rgba(155,140,255,0.18), transparent)',
                    transform: 'skewX(-20deg)',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* The dark vignette the handoff closed with is gone: it existed to sink a black canvas's
          edges, and on the wash it would be a grey ring round a bright picture. */}
    </div>
  );
}

/**
 * The film in the homepage hero.
 *
 * Laid out at its authored 1920x1080 and scaled to whatever width the column gives it, which is
 * the device CreativeGround already uses for every markup creative on this site: one factor over a
 * fixed design space, so the composition cannot reflow and an exported image and this behave the
 * same at every width. `tan(atan2(...))` is the CSS cast from a length ratio to the plain number
 * `scale()` wants, and `cqw` resolves against the slot, which is why the slot is a container.
 *
 * The slot is 16:9, not the 2.018 the static creative set. That ratio existed because the image
 * had it; the film is 1.778, and taking the slot to the film's own ratio is what avoids both
 * cropping it and letterboxing it.
 */
export function PromoHero({ at }: { at?: number }) {
  const scaled = (
    <div
      className="@container relative overflow-hidden rounded-card"
      style={{ aspectRatio: `${W} / ${H}` }}
    >
      <div
        className="absolute top-0 left-0 origin-top-left"
        style={{
          width: `${W}px`,
          height: `${H}px`,
          transform: `scale(tan(atan2(100cqw, ${W}px)))`,
        }}
      >
        <PromoFilm at={at} />
      </div>
    </div>
  );

  /*
    Below `lg` the film gets the same treatment every wide mockup on this site gets.

    It is authored at 1920 across. In a 335px phone column that is a 0.17 scale, which puts the
    app window's 16px body type at under 3px — a picture of a film rather than something anyone
    can watch. The still creative this replaced had exactly that problem and the site's answer was
    already built, so the film uses it: a tap opens it at its design width in the pannable dialog,
    and above `lg`, where it reads on its own, no control is added at all.
  */
  return (
    <CreativeZoom
      alt="The Talentilo platform, scene by scene: creating a job, scoring candidates, AI screening calls, the pipeline, targets and offers"
      zoomed={() => (
        <div
          className="relative overflow-hidden rounded-card"
          style={{ width: `${W}px`, height: `${H}px`, maxWidth: 'none' }}
        >
          <PromoFilm at={at} />
        </div>
      )}
    >
      {scaled}
    </CreativeZoom>
  );
}

'use client';

import { CUES, E, mix, TOTAL } from './engine';
import { abs, Cursor, SideCopy, Shell, Words } from './parts';
import { Workspace } from './scenes/Workspace';
import { B, GROUND, H, SANS, W, WH, WW, WX, WY } from './theme';
import { useFilmClock } from './useFilmClock';

/**
 * The Talentilo promo film, re-themed onto our ground.
 *
 * The handoff is a 53.4-second, 1920x1080 piece built for a `#0c0a10` canvas. Three things changed
 * bringing it here and nothing else did: the canvas became our wash, every piece of type sitting
 * on that canvas reversed, and the logo swapped to the light-ground cut the bundle already ships.
 * Inside the app window nothing moved — those scenes were drawn light to begin with, and a white
 * window on a blue wash keeps exactly the separation the dark canvas was giving it.
 *
 * It is laid out once at 1920x1080 and scaled by a single factor, the same device CreativeGround
 * uses for every other markup creative on the site, so it cannot reflow: an exported image and
 * this behave identically at every width.
 *
 * Everything is a pure function of `T`. No component holds animation state, so the film can be
 * pinned to an exact second and screenshotted — which is how the port is checked against the
 * original, and how the QA suite asserts a frame.
 */
export function PromoFilm({ at }: { at?: number }) {
  const { T, still } = useFilmClock(at);
  const C = CUES;

  const Ws = C.Workspace;
  const Jd = C.JD;
  const Ou = C.Outro;

  // Scene 3 is the only product screen ported so far; the rest land in the same table.
  const screens: [(p: { r: number }) => React.ReactElement, number, number, string | null, number][] = [
    [Workspace, Ws, Jd, null, 0],
  ];
  const current = screens.findIndex((s) => T < s[2]);
  const scr = screens[Math.max(0, current)];

  const winIn = E.io(Ws - 0.9, Ws + 0.5)(T);
  const winOut = E.io(Ou - 0.1, Ou + 0.7)(T);
  const hookOut = E.io(C.Logo - 0.3, C.Logo + 0.1)(T);
  const lg = E.pop(C.Logo + 0.1, C.Logo + 0.9)(T);
  const lgWipe = E.io(C.Logo + 0.5, C.Logo + 1.3)(T);
  const lgOut = E.io(Ws - 1.0, Ws - 0.4)(T);
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
            {/* The light-ground cut, which the bundle already shipped. eslint-disable-next-line @next/next/no-img-element */}
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

      <SideCopy
        T={T} a={Ws + 0.3} b={Jd} kicker="My Workspace"
        title={['Every offer,', 'interview, win.', 'One screen.']} serif={2}
      />

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

      {/* The dark vignette the handoff closed with is gone: it existed to sink a black canvas's
          edges, and on the wash it would be a grey ring round a bright picture. */}
      <div style={abs({ inset: 0, opacity: fade, background: GROUND.wash })} />
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
  return (
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
}

export { Cursor };

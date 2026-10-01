'use client';

import { useEffect, useState } from 'react';

import { CUES, TOTAL } from './engine';

/**
 * The frame the film holds when motion is switched off.
 *
 * A 53-second sequential timeline has no useful "last frame" — the way every other animation on
 * this site resolves under `prefers-reduced-motion` is to land where it was heading, and here that
 * is the outro, which is a logo and a button rather than a picture of the product. So the film
 * stops instead on the workspace scene fully settled: the dashboard, cards counted up, which is
 * the nearest thing to the still creative this replaces. Someone who has asked for no motion sees
 * the hero the page used to have, not a frozen fragment of a film they are not being shown.
 */
const STILL = CUES.Workspace + 3.3;

/**
 * Seconds since the loop began, or the still frame when motion is off.
 *
 * `requestAnimationFrame` rather than a CSS animation because the whole film is a function of one
 * number and nothing else: scenes read `T`, derive everything from it, and hold no state. That is
 * also what makes it testable — the QA suite can pin `T` and assert an exact frame.
 *
 * The clock is wall-time based (`performance.now()` modulo the total) rather than accumulated per
 * frame, so a dropped frame or a backgrounded tab cannot make the film drift out of step with
 * itself.
 */
export function useFilmClock(at?: number): { T: number; still: boolean } {
  const [still, setStill] = useState(true);
  const [running, setRunning] = useState(STILL);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setStill(query.matches);
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  /*
    `?film=<seconds>` freezes the hero on one frame.
    
    It is read here rather than with `useSearchParams` so the server render is untouched — the
    param changes nothing that is sent, only what the client draws after hydration, so it cannot
    affect caching or what a crawler sees. It exists because this is a 53-second film whose
    verification is "does second 19.1 look like second 19.1", and the only way to answer that is to
    ask for second 19.1 rather than race a running clock with a timer.
  */
  const [pinned, setPinned] = useState<number | undefined>(undefined);
  useEffect(() => {
    const raw = new URLSearchParams(window.location.search).get('film');
    const seconds = raw === null ? NaN : Number(raw);
    if (Number.isFinite(seconds)) setPinned(((seconds % TOTAL) + TOTAL) % TOTAL);
  }, []);

  useEffect(() => {
    if (still || at !== undefined || pinned !== undefined) return;
    const began = performance.now();
    let frame = requestAnimationFrame(function tick(now) {
      setRunning(((now - began) / 1000) % TOTAL);
      frame = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(frame);
  }, [still, at, pinned]);

  /*
    Derived rather than written back when motion is off. Setting state inside the effect for the
    still case would be a synchronous setState in an effect — a cascading render, which React
    rightly complains about — and the value is a constant anyway, so there is nothing to store.

    It also starts on the still frame before the first animation frame lands, which means the
    server and the first client paint agree: a film that began at T=0 on the client would hydrate
    against a server render of the hook scene and flash.
  */
  /*
    `at` pins the film to one second and stops the clock. Nothing in the product passes it — it
    exists so the port can be checked and so the QA suite can assert an exact frame, which only
    works because every scene is a pure function of `T` and holds no state of its own. Chasing a
    running clock with a timer races the page's own load and screenshots whatever happened to be
    on screen.
  */
  if (at !== undefined) return { T: at, still: true };
  if (pinned !== undefined) return { T: pinned, still: true };
  return { T: still ? STILL : running, still };
}

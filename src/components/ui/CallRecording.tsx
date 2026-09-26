'use client';

import { useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/cn';

/**
 * A bar per slice of the recording, at heights that read as speech rather than as a chart.
 *
 * Fixed rather than measured: reading real levels means decoding the file in the browser, which
 * costs a fetch and a decode before anything can be drawn. What this has to say is "this is a
 * recording, and you are this far through it" — a shape does that, and the elapsed time beside it
 * carries the part that has to be accurate.
 */
const LEVELS = [
  22, 48, 76, 40, 62, 88, 34, 70, 52, 94, 30, 58, 82, 44, 66, 38, 90, 56, 28, 74, 46, 84, 36, 60,
  50, 96, 32, 68, 42, 78, 54, 26, 72, 86, 40, 64, 48, 92, 34, 58,
];

const clock = (seconds: number) => {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const whole = Math.floor(seconds);
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, '0')}`;
};

/**
 * A recording of one of the calls, playable where it is.
 *
 * The section it sits under claims the voice agent holds a real conversation — verifying interest,
 * checking salary, booking a slot. That is a claim about how something *sounds*, and no screenshot
 * of a call screen can settle it. So the call itself is on the page, under the screen that
 * captured it.
 *
 * Built rather than left to `<audio controls>`: the native control is a browser-drawn bar that
 * looks like a different product on every platform, and this one sits inside a brand creative. It
 * keeps the parts that matter — a real `<audio>` element underneath, a labelled play button, and a
 * range input for the scrubber, so it works from the keyboard and reports position to a screen
 * reader — and replaces only the drawing.
 *
 * The audio never autoplays and carries `preload="metadata"`, so arriving at the page costs the
 * length of the file and nothing more.
 */
export function CallRecording({
  src,
  label,
  caption,
  className,
}: {
  /** Path to the audio file, e.g. `/audio/ai-call.mp3`. */
  src: string;
  /** What the recording is, for the button's accessible name. */
  label: string;
  /** The line under the scrubber. */
  caption?: string;
  className?: string;
}) {
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const el = audio.current;
    if (!el) return;

    const onTime = () => setElapsed(el.currentTime);
    const onMeta = () => setDuration(Number.isFinite(el.duration) ? el.duration : 0);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onEnded = () => {
      setPlaying(false);
      // The element is left sitting at its own duration, so rewinding it here as well as in state
      // keeps the scrubber's value and the audio's position the same number — otherwise the next
      // drag seeks from a base the bars never showed.
      el.currentTime = 0;
      setElapsed(0);
    };

    // Metadata can land before this effect runs, in which case no event follows.
    if (el.readyState > 0) onMeta();

    el.addEventListener('timeupdate', onTime);
    el.addEventListener('loadedmetadata', onMeta);
    el.addEventListener('durationchange', onMeta);
    el.addEventListener('play', onPlay);
    el.addEventListener('pause', onPause);
    el.addEventListener('ended', onEnded);
    return () => {
      el.removeEventListener('timeupdate', onTime);
      el.removeEventListener('loadedmetadata', onMeta);
      el.removeEventListener('durationchange', onMeta);
      el.removeEventListener('play', onPlay);
      el.removeEventListener('pause', onPause);
      el.removeEventListener('ended', onEnded);
    };
  }, []);

  const toggle = () => {
    const el = audio.current;
    if (!el) return;
    if (el.paused) {
      // A rejected play() leaves the element paused, so the state stays honest either way.
      void el.play().catch(() => setPlaying(false));
    } else {
      el.pause();
    }
  };

  const seek = (to: number) => {
    const el = audio.current;
    if (!el) return;
    el.currentTime = to;
    setElapsed(to);
  };

  const played = duration > 0 ? elapsed / duration : 0;

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <audio ref={audio} src={src} preload="metadata" />

      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? `Pause ${label}` : `Play ${label}`}
        className="grid size-10 shrink-0 place-items-center rounded-full bg-ink text-white
                   transition-transform duration-200 ease-[var(--ease-out-soft)] hover:scale-105
                   focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
      >
        {playing ? <Pause /> : <Play />}
      </button>

      <div className="min-w-0 flex-1">
        <div className="relative h-8">
          {/* The drawing. The control that does the work is the range input over it. */}
          <div aria-hidden="true" className="flex h-full items-center gap-[3px]">
            {LEVELS.map((level, index) => (
              <span
                key={index}
                className={cn(
                  'w-full rounded-pill transition-colors duration-150',
                  index / LEVELS.length <= played ? 'bg-ink' : 'bg-ink/20'
                )}
                style={{ height: `${level}%` }}
              />
            ))}
          </div>
          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={elapsed}
            onChange={(event) => seek(Number(event.target.value))}
            aria-label={`Seek within ${label}`}
            aria-valuetext={`${clock(elapsed)} of ${clock(duration)}`}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
        </div>
        {caption ? <p className="mt-1 text-caption text-muted">{caption}</p> : null}
      </div>

      <p className="shrink-0 font-figure text-caption text-muted tabular-nums">
        {clock(elapsed)} / {clock(duration)}
      </p>
    </div>
  );
}

function Play() {
  return (
    <svg viewBox="0 0 16 16" className="size-4 translate-x-px" fill="currentColor" aria-hidden="true">
      <path d="M4.5 2.9a.8.8 0 0 1 1.22-.68l7 5.1a.8.8 0 0 1 0 1.36l-7 5.1A.8.8 0 0 1 4.5 13.1V2.9Z" />
    </svg>
  );
}

function Pause() {
  return (
    <svg viewBox="0 0 16 16" className="size-4" fill="currentColor" aria-hidden="true">
      <rect x="4" y="3" width="3" height="10" rx="1" />
      <rect x="9" y="3" width="3" height="10" rx="1" />
    </svg>
  );
}

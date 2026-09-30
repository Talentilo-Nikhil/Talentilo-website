'use client';

import Script from 'next/script';
import { useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/cn';

const WIDGET_SCRIPT = 'https://assets.calendly.com/assets/external/widget.js';

/**
 * The booking calendar, embedded.
 *
 * Calendly hands out two kinds of embed: a popup that takes over the window, and this one — an
 * iframe that lives inside a container on the page. This is the inline kind, so the page around it
 * keeps its header, its footer and its own URL, and the booking is part of the site rather than a
 * departure from it.
 *
 * `next/script` rather than the raw `<script async>` the snippet ships with, per AGENTS.md; the
 * App Router API is in `node_modules/next/dist/docs/01-app/03-api-reference/02-components/script.md`.
 * `afterInteractive` is its default and the right one here: the calendar is the point of the page
 * but it is an iframe either way, and blocking hydration on a third-party script to save it a few
 * hundred milliseconds is a bad trade.
 *
 * The part that is easy to get wrong: `widget.js` scans the document for `.calendly-inline-widget`
 * once, when it executes, and never again. Arriving here from one of the site's own buttons is a
 * client-side navigation, so on every visit after the first the script is already parsed, does not
 * re-run, and the container would sit empty. So the component initialises the widget itself —
 * `onLoad` covers the first visit, and the effect covers every one after it, by which time
 * `window.Calendly` is already there. Guarded by a ref, because in development React mounts every
 * effect twice and two calls would stack two iframes.
 */
export function CalendlyInline({
  url,
  className,
}: {
  /** The full Calendly URL, query string and all — it carries the embed's options. */
  url: string;
  className?: string;
}) {
  const host = useRef<HTMLDivElement>(null);
  const started = useRef(false);
  const [failed, setFailed] = useState(false);

  const start = () => {
    if (started.current || !host.current || !window.Calendly) return;
    started.current = true;
    window.Calendly.initInlineWidget({ url, parentElement: host.current });
  };

  useEffect(start);

  return (
    <div className={cn('flex flex-col items-center gap-4', className)}>
      {/*
        `min-width: 320px` is Calendly's own floor, kept because a widget squeezed below the width
        its author supports is a broken widget. It binds only under a 360px viewport — the page's
        gutters leave 335 at 375 and exactly 320 at 360 — and below that `Section`'s `overflow-hidden`
        clips the right edge rather than giving the whole page a horizontal scrollbar. Measured at
        1440, 768, 390, 375, 360 and 320: no viewport scrolls sideways. The clip below 360 is the
        accepted cost, on widths no device in the QA matrix has.

        The height is Calendly's 700px, which is what its month view needs; shorter and the widget
        scrolls inside its own iframe, which is a worse place to scroll than the page.

        Capped at 920 rather than run to the page's full 1312px measure. A month grid and a column
        of times stop gaining anything past about 900px and start looking like a booking system
        someone forgot to lay out; centred at 920 it reads as a panel on the page.
      */}
      <div
        ref={host}
        className="calendly-inline-widget h-[700px] w-full max-w-[920px] min-w-[320px]"
        data-url={url}
      />

      <Script src={WIDGET_SCRIPT} strategy="afterInteractive" onLoad={start} onError={() => setFailed(true)} />

      {/*
        Always drawn, not only on failure. An embedded third-party iframe is the single most
        blockable thing on a page — a content blocker, a locked-down work laptop or a corporate
        proxy will each take it out silently, and the visitor is left looking at a blank rectangle
        with no idea what was meant to be there. One line beneath it means nobody who wants to book
        a call is stopped by their own browser.
      */}
      <p className="text-small text-ink/70">
        {failed ? 'The calendar could not load. ' : 'Calendar not loading? '}
        <a
          href={url}
          target="_blank"
          rel="noreferrer noopener"
          className="underline underline-offset-4 hover:text-brand-blue"
        >
          Open it in a new tab
        </a>
        .
      </p>
    </div>
  );
}

declare global {
  interface Window {
    Calendly?: { initInlineWidget: (options: { url: string; parentElement: HTMLElement }) => void };
  }
}

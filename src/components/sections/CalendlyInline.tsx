'use client';

import Script from 'next/script';
import { useCallback, useEffect, useRef, useState } from 'react';

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
 * The part that is easy to get wrong, and that this got wrong once: `widget.js` scans the document
 * for `.calendly-inline-widget` when it executes and initialises every one it finds. That scan is
 * a second initialiser, and it does not know about this component's. Mounting the widget on an
 * element carrying that class while also calling `initInlineWidget` on it therefore built the
 * calendar twice — two 700px iframes in a 700px box, the second spilling out over the page and
 * into the footer.
 *
 * So the element deliberately does NOT carry `calendly-inline-widget`. The scan finds nothing,
 * this component is the only initialiser, and the count is one on a first load and one after a
 * client-side navigation — which is the case that made an explicit `initInlineWidget` necessary in
 * the first place, since the script does not re-run and the scan never happens again.
 *
 * Three things hold that: the missing class, a guard that refuses to build into a container that
 * already has something in it, and a cleanup that empties the container so a remount — React's
 * double mount in development, or coming back to the page — starts from nothing.
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
  const [failed, setFailed] = useState(false);

  const start = useCallback(() => {
    const el = host.current;
    if (!el || !window.Calendly || el.childElementCount > 0) return;
    window.Calendly.initInlineWidget({ url, parentElement: el });
  }, [url]);

  useEffect(() => {
    start();
    const el = host.current;
    return () => el?.replaceChildren();
  }, [start]);

  return (
    <div className={cn('flex flex-col items-center gap-4', className)}>
      {/*
        No maximum width, and that is the whole point of this element.
        
        Calendly chooses its layout from the width of the element the widget is mounted in, in
        three bands: 1100px and up gets the side-by-side view, with the event's details beside the
        calendar; 650 to 1099 gets a narrower one; under 650 it stacks. So a `max-w` here is not
        styling, it decides what the booking page looks like. This carried `max-w-[920px]` for a
        release — picked by eye, because a calendar running the full measure looked unlaid-out —
        and 920 is in the middle band, so the widget rendered stacked on every desktop. Anything
        added here has to clear 1100 or it changes the layout.

        The page's own measure gives it 1312px at a 1440 viewport, comfortably over. The gutters
        are 64px a side at `lg`, so the side-by-side view starts at roughly a 1230px viewport;
        below that there is not 1100px of content width to hand it, whatever this element says.

        `min-width: 320px` is Calendly's own floor for the small layout, kept because a widget
        squeezed below the width its author supports is a broken widget. It binds only under a
        360px viewport, and there `Section`'s `overflow-hidden` clips the right edge rather than
        giving the whole page a horizontal scrollbar.

        The height is Calendly's 700px, which is what its month view needs; shorter and the widget
        scrolls inside its own iframe, which is a worse place to scroll than the page.
      */}
      <div
        ref={host}
        data-calendly="inline"
        data-url={url}
        className="h-[700px] w-full min-w-[320px] overflow-hidden"
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

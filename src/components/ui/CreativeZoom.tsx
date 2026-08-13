'use client';

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';

import { Close, Plus } from '@/components/icons';
import type { creatives } from '@/data/creatives';

type Asset = (typeof creatives)[keyof typeof creatives];

const FOCUSABLE = 'a[href], button:not([disabled])';

const noop = () => () => {};

/** False during server rendering, true once the client owns the tree. */
function useMounted() {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false
  );
}

/**
 * True from `lg` up, where the artwork is already rendered large enough to read.
 *
 * The server snapshot is `false` so the markup ships with the button a phone needs; React
 * re-renders once with the real match after hydration, which is what `useSyncExternalStore` is
 * for — no mismatch, and no flash of a control desktop users can tab into.
 */
function useDesktop() {
  const subscribe = useCallback((onChange: () => void) => {
    const query = window.matchMedia('(min-width: 1024px)');
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia('(min-width: 1024px)').matches,
    () => false
  );
}

type CreativeZoomProps = {
  asset: Asset;
  alt: string;
  children: React.ReactNode;
};

/**
 * Lets a phone open a wide product mockup at full size.
 *
 * The dashboards are authored 1312px across. Squeezed into a 335px column they are a picture of
 * a product rather than something anyone can read, so below `lg` the artwork becomes a button
 * that opens it at its design width in a pannable dialog. Above `lg` nothing is added: the plain
 * artwork renders on its own, with no control in the tab order.
 */
export function CreativeZoom({ asset, alt, children }: CreativeZoomProps) {
  const [open, setOpen] = useState(false);
  const mounted = useMounted();
  const desktop = useDesktop();
  const dialog = useRef<HTMLDivElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const { body } = document;
    const previousOverflow = body.style.overflow;
    body.style.overflow = 'hidden';

    // Open on the middle of the artwork rather than its left edge.
    const pane = viewport.current;
    if (pane) pane.scrollLeft = (pane.scrollWidth - pane.clientWidth) / 2;
    dialog.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        return;
      }
      if (event.key !== 'Tab' || !dialog.current) return;

      const items = [...dialog.current.querySelectorAll<HTMLElement>(FOCUSABLE)];
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      body.style.overflow = previousOverflow;
    };
  }, [open]);

  // A wider viewport renders the artwork legibly already, so the control is not offered at all.
  if (desktop) return <>{children}</>;

  const close = () => {
    setOpen(false);
    trigger.current?.focus();
  };

  return (
    <>
      <button
        ref={trigger}
        type="button"
        onClick={() => setOpen(true)}
        // An explicit label, so the name is this control's job rather than the artwork's alt text
        // concatenated with it.
        aria-label={`Enlarge: ${alt || 'artwork'}`}
        className="group relative block w-full cursor-zoom-in"
      >
        {children}
        <span
          aria-hidden="true"
          className="absolute right-3 bottom-3 inline-flex size-9 items-center justify-center rounded-full
                     bg-ink/80 text-[18px] text-white shadow-[0_2px_8px_rgb(12_10_16/0.3)]
                     transition-transform duration-200 group-active:scale-95"
        >
          <Plus />
        </span>
      </button>

      {mounted
        ? createPortal(
            <div
              ref={dialog}
              role="dialog"
              aria-modal="true"
              aria-label={alt || 'Enlarged artwork'}
              className={`fixed inset-0 z-[70] flex flex-col bg-ink transition-opacity duration-200 lg:hidden ${
                open ? 'visible opacity-100' : 'pointer-events-none invisible opacity-0'
              }`}
            >
              <div className="flex shrink-0 items-center justify-between gap-4 px-4 py-3">
                <p className="text-small text-white/70">Drag to explore</p>
                <button
                  type="button"
                  onClick={close}
                  className="inline-flex size-11 items-center justify-center rounded-full text-[24px] text-white
                             transition-colors duration-200 hover:bg-white/10"
                >
                  <Close />
                  <span className="sr-only">Close</span>
                </button>
              </div>

              <div ref={viewport} className="flex-1 overflow-auto overscroll-contain p-4">
                <picture>
                  <source srcSet={asset.src} type="image/webp" />
                  {/* Its design width, so the mockup is exactly as readable as it is on a desktop. */}
                  <img
                    src={asset.fallback}
                    alt={alt}
                    width={asset.width}
                    height={asset.height}
                    style={{ width: `${asset.designWidth}px`, maxWidth: 'none' }}
                    className="h-auto rounded-card"
                  />
                </picture>
              </div>
            </div>,
            document.body
          )
        : null}
    </>
  );
}

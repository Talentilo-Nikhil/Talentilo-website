'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';

import { ChevronDown, Close, Menu } from '@/components/icons';
import { ButtonLink } from '@/components/ui/Button';
import { headerActions, primaryNav } from '@/config/navigation';
import { cn } from '@/lib/cn';

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

/** The drawer that replaces the desktop nav below 1024px. */
export function MobileNav({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const mounted = useMounted();

  // Navigating anywhere — including via the browser's back button — closes the drawer.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;

    const { body } = document;
    const previousOverflow = body.style.overflow;
    body.style.overflow = 'hidden';

    panel.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        trigger.current?.focus();
        return;
      }
      if (event.key !== 'Tab' || !panel.current) return;

      // Keep Tab inside the drawer while it covers the page.
      const items = [...panel.current.querySelectorAll<HTMLElement>(FOCUSABLE)];
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

  const overlay = (
    <div
      className={cn(
        // `overflow-hidden` keeps the off-canvas panel from widening the document, and
        // `invisible` takes its links out of the tab order and the accessibility tree.
        'fixed inset-0 z-[60] overflow-hidden lg:hidden',
        open ? 'pointer-events-auto visible' : 'pointer-events-none invisible delay-300'
      )}
      aria-hidden={!open}
    >
      <div
        className={cn(
          'absolute inset-0 bg-ink/40 backdrop-blur-sm transition-opacity duration-300',
          open ? 'opacity-100' : 'opacity-0'
        )}
        onClick={() => setOpen(false)}
      />

      <div
        ref={panel}
        id="mobile-nav"
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        className={cn(
          'absolute inset-y-0 right-0 flex w-full max-w-sm flex-col overflow-y-auto bg-white',
          'transition-transform duration-300 ease-[var(--ease-out-soft)]',
          open ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex h-[79px] shrink-0 items-center justify-end px-5">
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              trigger.current?.focus();
            }}
            className="inline-flex size-11 items-center justify-center rounded-full text-[24px] text-ink
                       transition-colors duration-200 hover:bg-ink/5"
          >
            <Close />
            <span className="sr-only">Close menu</span>
          </button>
        </div>

        <nav aria-label="Mobile" className="flex-1 px-5 pb-8">
          <ul className="flex flex-col gap-2">
            {primaryNav.map((item) => (
              <li key={item.label}>
                {item.groups ? (
                  <details className="group" open>
                    <summary
                      className="flex cursor-pointer list-none items-center justify-between rounded-xl
                                 px-3 py-3 font-sans text-lede text-ink marker:hidden"
                    >
                      {item.label}
                      <ChevronDown className="text-[20px] text-muted transition-transform duration-200 group-open:-scale-y-100" />
                    </summary>
                    <div className="mt-1 flex flex-col gap-4 pl-3">
                      {item.groups.map((group) => (
                        <div key={group.heading ?? 'links'}>
                          {group.heading ? (
                            <p
                              className="px-3 pb-1 font-sans text-caption font-semibold tracking-[0.1em]
                                         text-brand-violet uppercase"
                            >
                              {group.heading}
                            </p>
                          ) : null}
                          <ul className="flex flex-col gap-1">
                            {group.links.map((child) => (
                              <li key={child.href}>
                                <Link
                                  href={child.href}
                                  className={cn(
                                    'block rounded-xl px-3 py-2.5 text-body text-ink/80 transition-colors duration-200 hover:bg-surface-tint',
                                    pathname === child.href && 'bg-surface-tint text-ink'
                                  )}
                                >
                                  {child.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </details>
                ) : (
                  <Link
                    href={item.href ?? '/'}
                    aria-current={pathname === item.href ? 'page' : undefined}
                    className={cn(
                      'block rounded-xl px-3 py-3 font-sans text-lede text-ink transition-colors duration-200 hover:bg-surface-tint',
                      pathname === item.href && 'bg-surface-tint'
                    )}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-col gap-3">
            <ButtonLink href={headerActions.signIn.href} variant="outline" withArrow={false}>
              {headerActions.signIn.label}
            </ButtonLink>
            <ButtonLink href={headerActions.demo.href} variant="gradient">
              {headerActions.demo.label}
            </ButtonLink>
          </div>
        </nav>
      </div>
    </div>
  );

  return (
    <>
      <button
        ref={trigger}
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls="mobile-nav"
        className="inline-flex size-11 items-center justify-center rounded-full text-[24px] text-ink
                   transition-colors duration-200 hover:bg-ink/5 lg:hidden"
      >
        <Menu />
        <span className="sr-only">Open menu</span>
      </button>

      {/*
       * The drawer is portalled to <body> on purpose. It lives inside a sticky header that carries
       * `backdrop-blur`, and a backdrop-filter makes its element the containing block for fixed
       * descendants — which pinned this overlay inside the 79px header strip instead of the
       * viewport, leaving the menu as an empty white bar with only a close button.
       */}
      {mounted ? createPortal(overlay, document.body) : null}
    </>
  );
}

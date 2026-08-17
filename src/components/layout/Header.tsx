'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useId, useRef, useState } from 'react';

import { ChevronDown } from '@/components/icons';
import { Logo } from '@/components/layout/Logo';
import { MobileNav } from '@/components/layout/MobileNav';
import { ButtonLink } from '@/components/ui/Button';
import { headerActions, linksOf, primaryNav, type NavItem } from '@/config/navigation';
import { cn } from '@/lib/cn';

/** True when the current route is the item or lives underneath it. */
function isActive(item: NavItem, pathname: string) {
  if (item.href) return pathname === item.href;
  return linksOf(item).some((link) => pathname === link.href);
}

/**
 * The file draws every nav item the same — plain ink, no pill, no active state. A background pill
 * meant two items could look emphasised at once (the hovered one and the current page), so the
 * emphasis is carried by the label's colour instead: ink on hover, azure for the page you are on.
 */
const linkClasses = 'rounded-full px-2 py-1 font-figure text-small transition-colors duration-200';

/**
 * `cn` is a plain join, so a colour here would have to beat the base one on stylesheet order
 * rather than on intent. The two are mutually exclusive instead.
 */
const toneClasses = (active: boolean) => (active ? 'text-azure-700' : 'text-ink/80 hover:text-ink');

function NavDropdown({ item, pathname }: { item: NavItem; pathname: string }) {
  const groups = item.groups ?? [];
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const wrapper = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Navigating anywhere — including via the browser's back button — dismisses the menu.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  const cancelClose = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = null;
  }, []);

  // A short grace period keeps the menu open while the pointer crosses the gap below the trigger.
  const scheduleClose = useCallback(() => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  }, [cancelClose]);

  useEffect(() => cancelClose, [cancelClose]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        wrapper.current?.querySelector('button')?.focus();
      }
    };
    const onPointer = (event: PointerEvent) => {
      if (!wrapper.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
    };
  }, [open]);

  return (
    <div
      ref={wrapper}
      className="relative"
      onPointerEnter={() => {
        cancelClose();
        setOpen(true);
      }}
      onPointerLeave={scheduleClose}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node)) setOpen(false);
      }}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={menuId}
        aria-haspopup="true"
        onClick={() => setOpen((value) => !value)}
        className={cn(
          linkClasses,
          toneClasses(isActive(item, pathname)),
          'inline-flex items-center gap-1.5'
        )}
      >
        {item.label}
        <ChevronDown
          className={cn('text-[16px] transition-transform duration-200', open && '-scale-y-100')}
        />
      </button>

      <div
        id={menuId}
        className={cn(
          'absolute top-full left-1/2 z-50 -translate-x-1/2 pt-3',
          groups.length > 1 ? 'w-[34rem]' : 'w-[22rem]',
          'transition-[opacity,transform] duration-200 ease-[var(--ease-out-soft)]',
          open ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-1 opacity-0'
        )}
      >
        <div className="relative rounded-2xl border border-hairline bg-white p-4 shadow-[0_16px_48px_rgb(12_10_16/0.12)]">
          {/* The pointer that ties the panel back to its trigger. */}
          <span
            aria-hidden="true"
            className="absolute -top-[7px] left-1/2 size-3 -translate-x-1/2 rotate-45 rounded-tl-[3px]
                       border-t border-l border-hairline bg-white"
          />
          <div className={cn('grid gap-x-4 gap-y-5', groups.length > 1 && 'sm:grid-cols-2')}>
            {groups.map((group) => (
              <div key={group.heading ?? 'links'}>
                {group.heading ? (
                  <p
                    className="px-3 pb-2 font-sans text-caption font-semibold tracking-[0.1em] text-brand-violet
                               uppercase"
                  >
                    {group.heading}
                  </p>
                ) : null}
                <ul className="flex flex-col gap-1">
                  {group.links.map((child) => (
                    <li key={child.href}>
                      <Link
                        href={child.href}
                        tabIndex={open ? undefined : -1}
                        className={cn(
                          'block rounded-xl px-3 py-2.5 transition-colors duration-200 hover:bg-surface-tint',
                          pathname === child.href && 'bg-surface-tint'
                        )}
                      >
                        <span className="block font-sans text-body font-medium text-ink">{child.label}</span>
                        {child.description ? (
                          <span className="mt-0.5 block text-small text-muted">{child.description}</span>
                        ) : null}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 bg-white/95 backdrop-blur-md transition-shadow duration-300',
        scrolled ? 'shadow-[0_1px_0_var(--color-hairline),0_8px_24px_rgb(12_10_16/0.06)]' : 'shadow-none'
      )}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-4 focus:z-50
                   focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-small focus:text-white"
      >
        Skip to content
      </a>

      <div className="mx-auto flex h-[79px] w-full max-w-[1440px] items-center justify-between gap-6 px-5 sm:px-8 lg:px-16">
        <Logo />

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-6">
            {primaryNav.map((item) => (
              <li key={item.label}>
                {item.groups ? (
                  <NavDropdown item={item} pathname={pathname} />
                ) : (
                  <Link
                    href={item.href ?? '/'}
                    aria-current={isActive(item, pathname) ? 'page' : undefined}
                    className={cn(linkClasses, toneClasses(isActive(item, pathname)))}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <ButtonLink href={headerActions.signIn.href} variant="outline" size="sm" withArrow={false}>
            {headerActions.signIn.label}
          </ButtonLink>
          <ButtonLink href={headerActions.demo.href} variant="gradient" size="sm">
            {headerActions.demo.label}
          </ButtonLink>
        </div>

        <MobileNav pathname={pathname} />
      </div>
    </header>
  );
}

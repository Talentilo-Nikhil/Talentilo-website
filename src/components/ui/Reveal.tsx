'use client';

import { useEffect, useRef, useState, type ElementType, type ReactNode } from 'react';

import { cn } from '@/lib/cn';

type RevealProps = {
  children: ReactNode;
  as?: ElementType;
  /** Stagger successive items in a group, in milliseconds. */
  delay?: number;
  className?: string;
};

/**
 * Fades and lifts content into place the first time it scrolls into view.
 *
 * The transition itself is defined by the `.reveal` utility, which the reduced-motion media
 * query neutralises — so this stays a no-op for anyone who has asked for less movement.
 */
export function Reveal({ children, as: Tag = 'div', delay = 0, className }: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Without an observer there is nothing to wait for, so reveal on the next frame.
    if (typeof IntersectionObserver === 'undefined') {
      const frame = requestAnimationFrame(() => setShown(true));
      return () => cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          setShown(true);
          observer.disconnect();
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.05 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={cn('reveal', shown && 'reveal-in', className)}
    >
      {children}
    </Tag>
  );
}

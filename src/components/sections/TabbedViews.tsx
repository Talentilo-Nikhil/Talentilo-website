'use client';

import { useId, useRef, useState } from 'react';

import { Creative } from '@/components/ui/Creative';
import type { CreativeName } from '@/data/creatives';
import { cn } from '@/lib/cn';

export type ViewTab = {
  label: string;
  title: string;
  detail: string;
  creative: CreativeName;
  creativeAlt: string;
};

/**
 * The "Tailored Views" switcher: one pill group, one persona panel.
 *
 * Follows the ARIA tabs pattern — arrow keys move between tabs and only the selected tab is in
 * the tab order, so a keyboard user tabs past the whole group in one step.
 */
export function TabbedViews({ tabs }: { tabs: ViewTab[] }) {
  const [active, setActive] = useState(0);
  const id = useId();
  const list = useRef<HTMLDivElement>(null);

  const move = (delta: number) => {
    const next = (active + delta + tabs.length) % tabs.length;
    setActive(next);
    list.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus();
  };

  return (
    <div className="flex flex-col items-center gap-7">
      <div
        ref={list}
        role="tablist"
        aria-label="Choose a view"
        className="flex flex-wrap items-center justify-center gap-2 rounded-full bg-surface-tint p-1"
        onKeyDown={(event) => {
          if (event.key === 'ArrowRight') {
            event.preventDefault();
            move(1);
          } else if (event.key === 'ArrowLeft') {
            event.preventDefault();
            move(-1);
          }
        }}
      >
        {tabs.map((tab, index) => (
          <button
            key={tab.label}
            role="tab"
            type="button"
            id={`${id}-t${index}`}
            aria-selected={active === index}
            aria-controls={`${id}-p${index}`}
            tabIndex={active === index ? 0 : -1}
            onClick={() => setActive(index)}
            className={cn(
              'rounded-full px-4 py-2.5 text-small font-medium transition-colors duration-200',
              active === index ? 'bg-ink text-white' : 'text-ink/80 hover:text-ink'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {tabs.map((tab, index) => (
        <div
          key={tab.label}
          role="tabpanel"
          id={`${id}-p${index}`}
          aria-labelledby={`${id}-t${index}`}
          hidden={active !== index}
          className="flex w-full flex-col items-center gap-7"
        >
          <div className="text-center">
            <p className="font-sans text-[clamp(1.5rem,1.2rem+1.2vw,2.0625rem)] font-semibold text-ink">
              {tab.title}
            </p>
            <p className="mt-1 text-body text-ink/80">{tab.detail}</p>
          </div>
          <div className="w-full overflow-hidden rounded-card">
            <Creative name={tab.creative} alt={tab.creativeAlt} sizes="(min-width: 1440px) 1312px, 100vw" />
          </div>
        </div>
      ))}
    </div>
  );
}

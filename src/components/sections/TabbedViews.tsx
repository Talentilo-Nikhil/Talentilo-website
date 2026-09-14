'use client';

import { useId, useRef, useState } from 'react';

import { ViewPanel, type ViewTab } from '@/components/sections/ViewPanel';
import { cn } from '@/lib/cn';

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
        className="flex max-w-full items-center gap-2 self-stretch overflow-x-auto rounded-full
                   bg-surface-tint p-1 [-ms-overflow-style:none] [scrollbar-width:none]
                   [&::-webkit-scrollbar]:hidden
                   sm:max-w-none sm:flex-wrap sm:justify-center sm:self-auto sm:overflow-visible"
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
              'shrink-0 rounded-full px-4 py-2.5 text-small font-medium whitespace-nowrap transition-colors duration-200',
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
          <ViewPanel tab={tab} />
        </div>
      ))}
    </div>
  );
}

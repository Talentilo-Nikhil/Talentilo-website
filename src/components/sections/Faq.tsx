'use client';

import { useId, useState } from 'react';

import { ChevronDown } from '@/components/icons';
import { cn } from '@/lib/cn';

export type FaqItem = {
  question: string;
  answer: string;
};

/**
 * Single-open accordion, first item expanded — the state the Figma frame shows.
 *
 * Height is animated with a grid track rather than `max-height`, so the transition matches the
 * real content height however long the answer is.
 */
export function Faq({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState(0);
  const id = useId();

  return (
    <div className="flex flex-col">
      {items.map((item, index) => {
        const expanded = open === index;
        return (
          // The file draws every item as an open row divided by a hairline, not a boxed card.
          <div key={item.question} className="border-b border-hairline first:border-t">
            <h3>
              <button
                type="button"
                id={`${id}-t${index}`}
                aria-expanded={expanded}
                aria-controls={`${id}-p${index}`}
                onClick={() => setOpen(expanded ? -1 : index)}
                className="flex w-full items-center justify-between gap-8 px-6 py-6 text-left"
              >
                {/* The heading element inherits the display serif; questions are set in the UI face. */}
                <span className="font-sans text-body font-semibold text-ink">{item.question}</span>
                <ChevronDown
                  className={cn(
                    'shrink-0 text-[24px] text-ink transition-transform duration-300',
                    expanded && '-scale-y-100'
                  )}
                />
              </button>
            </h3>

            <div
              id={`${id}-p${index}`}
              role="region"
              aria-labelledby={`${id}-t${index}`}
              className={cn(
                'grid transition-[grid-template-rows,opacity] duration-300 ease-[var(--ease-out-soft)]',
                expanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
              )}
            >
              {/* `visibility` (unlike opacity) also takes the collapsed answer out of the
                  accessibility tree; the delay lets it stay readable while it animates shut. */}
              <div className={cn('overflow-hidden', expanded ? 'visible' : 'invisible delay-300')}>
                <p className="max-w-[830px] px-6 pb-6 text-body text-ink/85">{item.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

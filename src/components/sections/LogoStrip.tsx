import { Creative } from '@/components/ui/Creative';
import { Section } from '@/components/ui/Section';
import type { CreativeName } from '@/data/creatives';

type LogoStripProps = {
  title: string;
  logos: { name: CreativeName; label: string }[];
};

/**
 * The client wall. On desktop it is the static row from the file; below that the row scrolls
 * horizontally rather than shrinking the logos into illegibility.
 */
export function LogoStrip({ title, logos }: LogoStripProps) {
  return (
    <Section padding="tight" aria-label={title}>
      <p className="text-center text-body text-ink-soft">{title}</p>

      {/* The row scrolls below `lg`, so it needs to be reachable — and scrollable — from the
          keyboard rather than by pointer drag alone. */}
      <ul
        tabIndex={0}
        aria-label={title}
        className="mt-10 flex snap-x items-center gap-10 overflow-x-auto pb-2
                   [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
                   md:gap-14 lg:justify-between lg:gap-20 lg:overflow-visible"
      >
        {logos.map((logo) => (
          <li key={logo.name} className="w-[130px] shrink-0 snap-start lg:w-[170px]">
            <Creative
              name={logo.name}
              alt={logo.label}
              className="opacity-70 transition-opacity duration-300 hover:opacity-100"
              sizes="170px"
            />
          </li>
        ))}
      </ul>
    </Section>
  );
}

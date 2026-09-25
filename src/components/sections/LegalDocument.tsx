import type { ReactNode } from 'react';

import { Section } from '@/components/ui/Section';

export type LegalSection = {
  /** What the section is called in the document: `1`, `E1`. Also forms its anchor. */
  number: string;
  title: string;
  body: ReactNode;
};

export type LegalGroup = {
  /** Names the run of sections in the contents list. */
  label: string;
  sections: LegalSection[];
};

type LegalDocumentProps = {
  eyebrow: string;
  title: string;
  /** Rendered under the title, e.g. `Last updated: 27 April 2026`. */
  revised: string;
  /** The opening paragraphs, above the contents list. */
  preamble: ReactNode;
  groups: LegalGroup[];
  /** Sits between the two groups, introducing the second. */
  interlude?: ReactNode;
  children?: ReactNode;
};

const anchor = (number: string) => `section-${number.toLowerCase()}`;

/**
 * A long-form legal document: heading, contents, numbered sections.
 *
 * The sections are passed as data rather than markup so that the contents list, the headings and
 * the anchors all read from one title and one number. A policy is amended a section at a time,
 * and those drifting apart is the failure that would go unnoticed longest.
 */
export function LegalDocument({
  eyebrow,
  title,
  revised,
  preamble,
  groups,
  interlude,
  children,
}: LegalDocumentProps) {
  return (
    <Section padding="loose">
      <article className="mx-auto flex max-w-[820px] flex-col">
        <p className="font-sans text-small font-semibold tracking-[0.08em] text-brand-ember uppercase">
          {eyebrow}
        </p>
        <h1 className="mt-4 text-[clamp(2rem,1.35rem+2.7vw,3.25rem)] text-ink">{title}</h1>
        <p className="mt-3 text-body text-muted">{revised}</p>

        <div className="mt-10 flex flex-col gap-4">{preamble}</div>

        <nav
          aria-label="Contents"
          className="mt-12 rounded-card border border-woodsmoke-100 bg-surface-tint p-6 md:p-8"
        >
          <h2 className="font-sans text-h5 font-semibold text-ink">Table of Contents</h2>
          <div className="mt-6 grid gap-x-10 gap-y-8 md:grid-cols-2">
            {groups.map((group) => (
              <div key={group.label}>
                <p className="font-sans text-small font-semibold tracking-[0.08em] text-ink uppercase">
                  {group.label}
                </p>
                <ol className="mt-3 flex flex-col gap-1.5 text-small text-ink/85">
                  {group.sections.map((section) => (
                    <li key={section.number} className="flex gap-2">
                      <span className="shrink-0 text-muted tabular-nums">{section.number}.</span>
                      <a
                        href={`#${anchor(section.number)}`}
                        className="underline-offset-4 transition-colors duration-200 hover:text-brand-blue hover:underline"
                      >
                        {section.title}
                      </a>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </nav>

        {groups.map((group, index) => (
          <div key={group.label} className="contents">
            {index > 0 && interlude ? interlude : null}
            <div className="mt-12 flex flex-col gap-12">
              {group.sections.map((section) => (
                // The sticky header is 64px tall, so an anchored section clears it by that plus air.
                <section key={section.number} id={anchor(section.number)} className="scroll-mt-28">
                  <h2 className="font-sans text-h5 font-semibold text-ink">
                    {section.number}. {section.title}
                  </h2>
                  <div className="mt-4 flex flex-col gap-3">{section.body}</div>
                </section>
              ))}
            </div>
          </div>
        ))}

        {children}
      </article>
    </Section>
  );
}

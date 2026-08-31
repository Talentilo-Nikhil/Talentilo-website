import { ButtonLink } from '@/components/ui/Button';
import { Section } from '@/components/ui/Section';

type CtaCenteredProps = {
  title: string;
  /** The sub-line between the heading and the button, e.g. "Create a bulletproof hiring pipeline." */
  lede?: string;
  cta: { label: string; href: string };
  note?: string;
};

/** The closing call to action on the inner pages: one line, one button, plenty of air. */
export function CtaCentered({ title, lede, cta, note }: CtaCenteredProps) {
  return (
    <Section padding="loose">
      <div className="mx-auto flex max-w-[681px] flex-col items-center gap-6 text-center">
        <h2 className="font-sans text-[clamp(2rem,1.35rem+2.7vw,3.25rem)] font-medium whitespace-pre-line text-ink">
          {title}
        </h2>
        {lede ? <p className="text-body text-ink/85">{lede}</p> : null}
        <div className="mt-4">
          <ButtonLink href={cta.href} variant="dark">
            {cta.label}
          </ButtonLink>
        </div>
        {note ? <p className="text-small text-ink/70 italic">{note}</p> : null}
      </div>
    </Section>
  );
}

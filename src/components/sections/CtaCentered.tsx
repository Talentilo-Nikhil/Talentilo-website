import { ButtonLink } from '@/components/ui/Button';
import { Section } from '@/components/ui/Section';

type CtaCenteredProps = {
  title: string;
  cta: { label: string; href: string };
  note?: string;
};

/** The closing call to action on the inner pages: one line, one button, plenty of air. */
export function CtaCentered({ title, cta, note }: CtaCenteredProps) {
  return (
    <Section padding="loose">
      <div className="mx-auto flex max-w-[681px] flex-col items-center gap-10 text-center">
        <h2 className="font-sans text-[clamp(2rem,1.35rem+2.7vw,3.25rem)] font-medium whitespace-pre-line text-ink">{title}</h2>
        <ButtonLink href={cta.href} variant="dark">
          {cta.label}
        </ButtonLink>
        {note ? <p className="text-small text-ink/70 italic">{note}</p> : null}
      </div>
    </Section>
  );
}

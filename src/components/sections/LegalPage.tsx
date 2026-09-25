import { ButtonLink } from '@/components/ui/Button';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { site } from '@/config/site';

type LegalPageProps = {
  title: string;
  summary: string;
  /** What the finished document will cover, so the page says something concrete today. */
  covers: string[];
};

/**
 * Placeholder shell for the privacy policy.
 *
 * The Figma file links to the document but contains no page for it, and legal copy is not
 * something to invent — so the route resolves to a real page that says where the document stands
 * and how to ask for it. It comes out once the published policy lands here.
 */
export function LegalPage({ title, summary, covers }: LegalPageProps) {
  return (
    <Section padding="loose">
      <div className="mx-auto flex max-w-[820px] flex-col gap-8">
        <SectionHeading as="h1" align="left" title={title} lede={summary} />

        <div className="flex flex-col gap-4">
          <h2 className="font-sans text-h5 font-semibold text-ink">What this document will cover</h2>
          <ul className="flex list-disc flex-col gap-2 pl-5 text-body text-ink/85">
            {covers.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <p className="text-body text-ink/85">
          Need the current version before it is published here? Email{' '}
          <a
            href={`mailto:${site.email.support}`}
            className="underline underline-offset-4 hover:text-brand-blue"
          >
            {site.email.support}
          </a>{' '}
          and we will send it over.
        </p>

        <div>
          <ButtonLink href="/contact" variant="dark">
            Request the document
          </ButtonLink>
        </div>
      </div>
    </Section>
  );
}

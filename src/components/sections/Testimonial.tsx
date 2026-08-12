import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';

type TestimonialProps = {
  quote: string;
  name: string;
  role: string;
};

/** The pull quote the audience pages open with, set at the file's 33px. */
export function Testimonial({ quote, name, role }: TestimonialProps) {
  return (
    <Section padding="normal">
      <Reveal>
        <figure className="mx-auto flex max-w-[1088px] flex-col gap-10">
          <blockquote className="font-sans text-[clamp(1.375rem,1rem+1.5vw,2.0625rem)] leading-[1.4] font-medium text-ink">
            &ldquo;{quote}&rdquo;
          </blockquote>
          <figcaption className="text-body text-ink/80">
            <span className="block font-medium text-ink">{name}</span>
            {role}
          </figcaption>
        </figure>
      </Reveal>
    </Section>
  );
}

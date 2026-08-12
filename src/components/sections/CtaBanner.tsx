import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { FigmaImage } from '@/components/ui/Creative';

/** The photographic call to action: 1400×486 cover, ink scrim, headline left, button right. */
const COVER = '8b4fc046b6a14ec7293f0af2b03e2519cec94957' as const;

type CtaBannerProps = {
  title: string;
  cta: { label: string; href: string };
};

export function CtaBanner({ title, cta }: CtaBannerProps) {
  return (
    <section className="py-10">
      <Container>
        <div className="relative isolate overflow-hidden rounded-card">
          <div className="absolute inset-0 -z-10 [&_img]:size-full [&_img]:object-cover [&_picture]:block [&_picture]:size-full">
            <FigmaImage hash={COVER} alt="" sizes="(min-width: 1440px) 1312px, 100vw" />
          </div>
          {/* The scrim from the file: ink at both edges, clear through the middle. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-[linear-gradient(270deg,rgb(12_10_16/0.5)_0%,rgb(12_10_16/0)_47.96%,rgb(12_10_16/0.5)_100%)]"
          />

          <div className="flex min-h-[320px] flex-col justify-between gap-10 p-8 sm:p-12 lg:min-h-[486px] lg:flex-row lg:items-end lg:p-16">
            <h2 className="max-w-[681px] font-sans text-[clamp(2rem,1.35rem+2.7vw,3.25rem)] font-medium whitespace-pre-line text-white">
              {title}
            </h2>
            <ButtonLink href={cta.href} variant="light" className="self-start lg:self-end">
              {cta.label}
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}

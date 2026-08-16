import { ButtonLink } from '@/components/ui/Button';
import { FigmaImage } from '@/components/ui/Creative';
import type { figmaImages } from '@/data/images';

type CtaPhotoProps = {
  title: string;
  lede?: string;
  cta: { label: string; href: string };
  note?: string;
  /** Content hash of the background photo, lifted straight from the Figma file. */
  imageHash: keyof typeof figmaImages;
};

/**
 * The full-bleed photographic close used where the section sits directly above the (also ink)
 * footer — the file's own scrim runs from a light wash at the top to fully opaque ink at the
 * bottom, so the photo dissolves into the footer with no seam rather than ending on a hard edge.
 */
export function CtaPhoto({ title, lede, cta, note, imageHash }: CtaPhotoProps) {
  return (
    <section className="relative isolate flex min-h-[360px] flex-col items-center justify-center overflow-hidden px-6 py-16 text-center sm:px-12 lg:min-h-[510px] lg:px-28">
      <div className="absolute inset-0 -z-20 [&_img]:size-full [&_img]:object-cover [&_picture]:block [&_picture]:size-full">
        <FigmaImage hash={imageHash} alt="" sizes="100vw" />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(12_10_16/0.2)_0%,rgb(12_10_16/1)_100%)]"
      />

      <div className="mx-auto flex max-w-[681px] flex-col items-center gap-6">
        <h2 className="font-sans text-[clamp(2rem,1.35rem+2.7vw,3.25rem)] font-medium whitespace-pre-line text-white">
          {title}
        </h2>
        {lede ? <p className="text-body text-white/85">{lede}</p> : null}
        <ButtonLink href={cta.href} variant="light">
          {cta.label}
        </ButtonLink>
        {note ? <p className="text-small text-white/70 italic">{note}</p> : null}
      </div>
    </section>
  );
}

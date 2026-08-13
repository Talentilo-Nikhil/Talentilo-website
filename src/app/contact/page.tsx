import type { Metadata } from 'next';

import { ContactForm } from '@/components/sections/ContactForm';
import { FigmaImage } from '@/components/ui/Creative';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { site } from '@/config/site';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Questions, support or a demo — the Talentilo team is here to help. Send a message and we reply from marketing@talentilo.ai, usually within one working day.',
  alternates: { canonical: '/contact' },
};

/** The photograph behind the testimonial panel, from the file's image fill. */
const PANEL_IMAGE = '8b4fc046b6a14ec7293f0af2b03e2519cec94957' as const;
/** The reviewer's headshot, also an image fill rather than an initial or icon. */
const AVATAR_IMAGE = '3d81068413f1faecb4c870bb763d0dae05babf7d' as const;

const desks = [
  {
    name: 'Support',
    email: site.email.support,
    detail: 'Need help? Our support team is available 24/7 to assist with any issues.',
  },
  {
    name: 'Sales',
    email: site.email.sales,
    detail: 'Interested in Talentilo.ai for your business? Reach out to discuss pricing and solutions.',
  },
];

export default function ContactPage() {
  return (
    <>
      <Section padding="normal">
        <SectionHeading
          as="h1"
          level="display"
          title="Get in touch with us"
          lede="Whether you have a question, need support, or just want to learn more about Talentilo.ai, our team is here to help."
        />

        <div className="mt-10 grid gap-5 lg:grid-cols-[740px_552px] lg:justify-center">
          <div className="relative isolate flex min-h-[420px] flex-col justify-end overflow-hidden rounded-card bg-ink p-6 sm:p-8">
            <div className="absolute inset-0 -z-10 [&_img]:size-full [&_img]:object-cover [&_picture]:block [&_picture]:size-full">
              <FigmaImage hash={PANEL_IMAGE} alt="" sizes="(min-width: 1024px) 740px, 100vw" />
            </div>
            <div aria-hidden="true" className="absolute inset-0 -z-10 bg-ink/45" />

            <figure className="max-w-[360px] rounded-card bg-white p-5">
              <blockquote className="text-body font-medium text-ink">
                &ldquo;Finally, a platform that honors intentional Recruitment&rdquo;
              </blockquote>
              <figcaption className="mt-4 flex flex-col gap-2">
                <span className="text-body text-ink">Sana&rsquo;s Member</span>
                <span className="flex items-center gap-1">
                  {/*
                    Sized by the wrapper rather than by overriding FigmaImage's own w-full/h-auto:
                    the source photo is square, so h-auto already resolves to a 32px square once
                    the wrapper fixes the width — no competing height utility to fight over.
                  */}
                  <span className="size-8 shrink-0 overflow-hidden rounded-full">
                    <FigmaImage hash={AVATAR_IMAGE} alt="" />
                  </span>
                  <span className="text-body font-semibold text-ink">Alissa Josh</span>
                </span>
              </figcaption>
            </figure>
          </div>

          <div>
            <ContactForm />
          </div>
        </div>
      </Section>

      <Section padding="normal">
        {/* Every line in this block is centered in the file — heading, email and body alike. */}
        <ul className="mx-auto grid max-w-[843px] gap-10 text-center sm:grid-cols-2">
          {desks.map((desk) => (
            <li key={desk.name} className="flex flex-col items-center gap-3">
              <h2 className="font-sans text-[clamp(1.5rem,1.25rem+0.9vw,1.75rem)] font-semibold text-ink">
                {desk.name}
              </h2>
              <a
                href={`mailto:${desk.email}`}
                className="text-body text-ink underline-offset-4 transition-colors duration-200 hover:text-brand-blue hover:underline"
              >
                {desk.email}
              </a>
              <p className="text-body text-ink/80">{desk.detail}</p>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}

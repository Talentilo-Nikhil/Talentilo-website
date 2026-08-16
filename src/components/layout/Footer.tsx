import Link from 'next/link';

import { ArrowUpRight, Instagram, LinkedIn, X } from '@/components/icons';
import { Logo } from '@/components/layout/Logo';
import { footerNav, legalNav } from '@/config/navigation';
import { site } from '@/config/site';

const socials = [
  { label: 'LinkedIn', href: site.social.linkedin, Icon: LinkedIn },
  { label: 'X', href: site.social.x, Icon: X },
  { label: 'Instagram', href: site.social.instagram, Icon: Instagram },
];

export function Footer() {
  return (
    <footer className="bg-ink text-white">
      {/*
        The file insets the footer to a 112px gutter while every page section sits at 64. Talentilo
        asked for one content edge down the whole page, so the footer follows the site's measure and
        lines up with the header rather than reproducing that inset.
      */}
      <div className="mx-auto w-full max-w-[1440px] px-5 pt-16 pb-10 sm:px-8 lg:px-16 lg:pt-25">
        <div className="flex flex-col gap-16 lg:flex-row lg:justify-between lg:gap-[155px]">
          <div className="flex flex-col gap-10 lg:gap-20">
            <h2 className="max-w-[642px] text-[clamp(2.25rem,1.35rem+3.9vw,4.0625rem)] text-white">
              Bring Back the
              <br />
              <span className="italic">Human</span> in Recruitment.
            </h2>

            {/* The oversized pill CTA from the file: ink fill inside a gradient hairline. */}
            <Link
              href="/contact"
              className="group block w-full max-w-[625px] rounded-[112px] p-px [background-image:var(--gradient-brand)]"
            >
              <span
                className="flex items-center justify-center gap-9 rounded-[112px] bg-ink px-8 py-6 text-center
                           transition-colors duration-300 group-hover:bg-ink/85 sm:px-13 sm:py-6.5"
              >
                <span className="font-sans text-[clamp(1.75rem,1.2rem+2.2vw,2.375rem)] font-medium text-white">
                  Let&rsquo;s Talk
                </span>
                {/* The file draws a bare diagonal arrow here, not the ringed one used elsewhere. */}
                <span
                  aria-hidden="true"
                  className="grid shrink-0 place-items-center text-[38px] text-white transition-transform
                             duration-300 ease-[var(--ease-out-soft)] group-hover:-translate-y-0.5
                             group-hover:translate-x-0.5"
                >
                  <ArrowUpRight />
                </span>
              </span>
            </Link>
          </div>

          <div className="flex flex-col gap-10 lg:gap-20">
            <nav aria-label="Footer">
              <ul className="flex flex-col gap-4 lg:gap-8">
                {footerNav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-body text-white/90 transition-colors duration-200 hover:text-white"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <ul className="flex items-center gap-6">
              {socials.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex size-6 items-center justify-center text-[24px] text-white/80
                               transition-colors duration-200 hover:text-white"
                  >
                    <Icon />
                    <span className="sr-only">{`${site.name} on ${label}`}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <hr className="mt-16 border-0 border-t border-divider/60 lg:mt-30" />

        <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
            <Logo tone="light" />
            <p className="text-small text-footer-text">
              &copy; {new Date().getFullYear()} {site.name}. All rights reserved.
            </p>
          </div>

          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {legalNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-small text-footer-text transition-colors duration-200 hover:text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}

import type { ReactNode } from 'react';

import { B } from './theme';

/**
 * The film's line icons, exactly as the handoff draws them.
 *
 * They are stroke-only paths on a 24x24 box, so every one takes its colour from the call site and
 * none of them needed anything doing in the reversal — they all live inside the app window.
 */
export const ic = (d: ReactNode, sz = 18, c: string = B.muted, w = 1.8) => (
  <svg
    width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={w}
    strokeLinecap="round" strokeLinejoin="round"
  >
    {d}
  </svg>
);

export const I = {
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 7.5h.01" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </>
  ),
  phone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" />,
  wa: (
    <>
      <path d="M4 20l1.3-4A8.3 8.3 0 1112 20.3a8.3 8.3 0 01-4.1-1.1z" />
      <path d="M9.2 8.8c0 2.8 3 5.9 6 6l.9-1.5-1.9-.9-.8.8c-1-.4-2.2-1.6-2.6-2.6l.8-.8-.9-1.9z" />
    </>
  ),
  ban: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M5.7 5.7l12.6 12.6" />
    </>
  ),
  move: <path d="M4 12h14M13 7l5 5-5 5" />,
  refresh: <path d="M4 12a8 8 0 1 0 2.3-5.7M4 4v4h4" />,
  dl: <path d="M12 4v11M7 11l5 5 5-5M5 20h14" />,
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-4-4" />
    </>
  ),
  x: <path d="M5 5l14 14M19 5L5 19" />,
  chev: <path d="M6 9l6 6 6-6" />,
  /*
   * The sidebar's nine. Drawn to the portal's own vocabulary, read off
   * reference/product-screen-1.png: a briefcase for Jobs, a clock for Calling Performance, a
   * clock variant for Offers. The rest follow the same 24-box, 1.8-stroke, rounded-join style so
   * the set reads as one family rather than nine borrowed marks.
   */
  briefcase: (
    <>
      <rect x="2.5" y="7" width="19" height="13" rx="2" />
      <path d="M9 7V5.5A1.5 1.5 0 0110.5 4h3A1.5 1.5 0 0115 5.5V7" />
      <path d="M2.5 12h19M12 12v2" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </>
  ),
  clockFlag: (
    <>
      <circle cx="12" cy="12.5" r="8.5" />
      <path d="M12 8v4.5l3 1.8" />
      <path d="M18.5 4.5l2 2" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="3.8" />
      <path d="M4.5 20a7.5 7.5 0 0115 0" />
    </>
  ),
  users: (
    <>
      <circle cx="9.5" cy="8.5" r="3.4" />
      <path d="M3 19.5a6.5 6.5 0 0113 0" />
      <path d="M16.5 5.6a3.4 3.4 0 010 5.8M18 14.2a6.5 6.5 0 013 5.3" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="0.6" />
    </>
  ),
  building: (
    <>
      <path d="M4 20.5V5.5A1.5 1.5 0 015.5 4h8A1.5 1.5 0 0115 5.5v15" />
      <path d="M15 10h3.5A1.5 1.5 0 0120 11.5v9M2.5 20.5h19" />
      <path d="M7.5 8h4M7.5 12h4M7.5 16h4" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </>
  ),
} as const;

/** The report-card document mark, the one icon the film draws filled rather than from `I`. */
export const DocIco = () => (
  <svg
    width="30" height="34" viewBox="0 0 24 28" fill="none" stroke="#1aa3b8" strokeWidth="1.8"
    strokeLinejoin="round" strokeLinecap="round"
  >
    <path d="M4 2h11l5 5v17a2 2 0 01-2 2H4a2 2 0 01-2-2V4a2 2 0 012-2z" />
    <path d="M15 2v5h5M7 13h2M12 13h5M7 18h2M12 18h5" />
  </svg>
);

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

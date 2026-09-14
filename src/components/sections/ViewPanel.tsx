import type { ReactNode } from 'react';

import { Creative } from '@/components/ui/Creative';
import type { CreativeName } from '@/data/creatives';

export type ViewTab = {
  label: string;
  title: string;
  detail: string;
  creative?: CreativeName;
  creativeAlt?: string;
  /** A hand-built panel in place of an exported creative. Takes precedence over `creative`. */
  media?: ReactNode;
};

/**
 * One persona's view: who it is, what they see, and the workspace as they see it.
 *
 * Sits apart from `TabbedViews` because the home page shows a single view with no switcher around
 * it — the panel is the part both places share, the tabs are not.
 */
export function ViewPanel({ tab }: { tab: ViewTab }) {
  return (
    <>
      <div className="text-center">
        <p className="font-sans text-[clamp(1.5rem,1.2rem+1.2vw,2.0625rem)] font-semibold text-ink">
          {tab.title}
        </p>
        <p className="mt-1 text-body text-ink/80">{tab.detail}</p>
      </div>
      {tab.media ? (
        <div className="w-full">{tab.media}</div>
      ) : tab.creative ? (
        <div className="w-full overflow-hidden rounded-card">
          <Creative name={tab.creative} alt={tab.creativeAlt} sizes="(min-width: 1440px) 1312px, 100vw" />
        </div>
      ) : null}
    </>
  );
}

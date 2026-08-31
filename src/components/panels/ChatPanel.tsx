import { LiveDot, Panel, panelMuted, type PanelTone } from '@/components/panels/Panel';
import { cn } from '@/lib/cn';

export type ChatMessage = {
  from: 'them' | 'us';
  text: string;
  time?: string;
  /** Rendered as a button-looking chip inside the bubble, e.g. "View Calendar". */
  action?: string;
};

type ChatPanelProps = {
  tone?: PanelTone;
  /** Header title, e.g. "Recruiter (Talentilo)". */
  title: string;
  /** Header status, e.g. "Online". */
  status?: string;
  messages: ChatMessage[];
  /** Caption under the thread, e.g. "Candidate: Sarah J.". */
  caption?: string;
  className?: string;
};

/** The WhatsApp-style thread used to show candidate conversation happening in-product. */
export function ChatPanel({ tone = 'light', title, status, messages, caption, className }: ChatPanelProps) {
  return (
    <Panel tone={tone} title={title} meta={status ? <LiveDot label={status} /> : undefined} className={className}>
      <div className="flex flex-col gap-3 p-5 sm:p-6">
        {messages.map((message, i) => {
          const us = message.from === 'us';
          return (
            <div key={`${message.text}-${i}`} className={cn('flex', us ? 'justify-end' : 'justify-start')}>
              <div
                className={cn(
                  'flex max-w-[85%] flex-col gap-2 rounded-2xl px-4 py-3',
                  us
                    ? 'rounded-br-sm bg-ink text-white'
                    : tone === 'dark'
                      ? 'rounded-bl-sm bg-white/10 text-white'
                      : 'rounded-bl-sm bg-surface-tint text-ink'
                )}
              >
                <p className="text-small">{message.text}</p>

                {message.action ? (
                  <span
                    className={cn(
                      'inline-flex w-fit rounded-pill px-3 py-1 text-caption font-semibold',
                      us ? 'bg-white/15 text-white' : 'bg-ink text-white'
                    )}
                  >
                    {message.action}
                  </span>
                ) : null}

                {message.time ? (
                  <span className={cn('text-caption', us ? 'text-white/60' : panelMuted(tone))}>
                    {message.time}
                  </span>
                ) : null}
              </div>
            </div>
          );
        })}

        {caption ? (
          <p className={cn('mt-1 text-caption', panelMuted(tone))}>{caption}</p>
        ) : null}
      </div>
    </Panel>
  );
}

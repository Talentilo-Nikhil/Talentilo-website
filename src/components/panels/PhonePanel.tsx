import type { ChatMessage } from '@/components/panels/ChatPanel';
import { cn } from '@/lib/cn';

/**
 * A WhatsApp thread on a phone, for the section that argues candidates answer messaging.
 *
 * That section used the generic ChatPanel — a white card with ink bubbles — which shows a
 * conversation but not *where* the conversation happens, and the whole claim is that it happens
 * somewhere the candidate already lives. On a handset with the channel's own colours it reads as
 * the candidate's screen rather than as another panel in the product.
 *
 * `us` is whoever holds the phone. The section's whole promise is the candidate's screen, so the
 * candidate holds it: the recruiter arrives as an incoming message and the tappable slot picker
 * lands on a received one, which is the only side of a thread a button can be tapped from.
 *
 * The colours here are literal rather than brand tokens on purpose: they are WhatsApp's, and a
 * mockup drawn in Talentilo's palette would stop being recognisable, which is the entire point.
 * It is a depiction of the channel, so it carries no WhatsApp wordmark or logo.
 */
const WA = {
  header: '#008069',
  chat: '#efeae2',
  incoming: '#ffffff',
  outgoing: '#d9fdd3',
  tick: '#53bdeb',
  meta: '#46545c',
};

function Ticks() {
  return (
    <svg viewBox="0 0 18 12" className="h-3 w-4 shrink-0" fill="none" aria-hidden="true">
      <path
        d="M1 6.4 4.2 9.6 10.4 2.6"
        stroke={WA.tick}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.8 6.4 10 9.6 16.2 2.6"
        stroke={WA.tick}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PhonePanel({
  name,
  status = 'online',
  initials,
  messages,
  className,
}: {
  name: string;
  status?: string;
  initials: string;
  messages: ChatMessage[];
  className?: string;
}) {
  return (
    <div className={cn('mx-auto flex h-full min-h-0 justify-center', className)}>
      {/*
        Sized off its own height at a handset's proportion rather than off a fixed width. At 302px
        wide the bezel came out at 1:1.39, which is a tablet; a phone is nearer 1:2.1, and taking
        the ratio from the height lets it fill the creative slot instead of floating in the middle
        of it.
      */}
      <div
        className="flex h-full min-h-0 flex-col rounded-[2.2rem] bg-ink p-2 shadow-[0_24px_60px_rgb(12_10_16/0.28)]"
        style={{ aspectRatio: '1 / 2' }}
      >
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[1.7rem] bg-white">
          <div className="flex items-center gap-2.5 px-4 pt-2.5 pb-2.5" style={{ backgroundColor: WA.header }}>
            <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="none" aria-hidden="true">
              <path
                d="M15 5 8 12l7 7"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white/25 text-small font-semibold text-white">
              {initials}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-small font-semibold text-white">{name}</span>
              <span className="block truncate text-caption text-white/85">{status}</span>
            </span>
          </div>

          <div className="flex min-h-0 flex-1 flex-col gap-2.5 px-2.5 py-1.5" style={{ backgroundColor: WA.chat }}>
            {messages.map((message, i) => {
              const us = message.from === 'us';
              return (
                <div
                  key={`${message.text}-${i}`}
                  className={cn('flex', us ? 'justify-end' : 'justify-start')}
                >
                  <div
                    className={cn(
                      'flex max-w-[94%] flex-col gap-0.5 px-3 py-1 shadow-[0_1px_1px_rgb(12_10_16/0.13)]',
                      us ? 'rounded-xl rounded-tr-sm' : 'rounded-xl rounded-tl-sm'
                    )}
                    style={{ backgroundColor: us ? WA.outgoing : WA.incoming }}
                  >
                    <p className="text-body leading-snug text-ink">{message.text}</p>

                    {message.action ? (
                      <span className="mt-0.5 block border-t border-ink/10 pt-1 text-center text-small font-semibold text-[#027eb5]">
                        {message.action}
                      </span>
                    ) : null}

                    <span className="flex items-center justify-end gap-1">
                      {message.time ? (
                        <span className="text-caption" style={{ color: WA.meta }}>
                          {message.time}
                        </span>
                      ) : null}
                      {us ? <Ticks /> : null}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* The composer, so the screen reads as a live thread rather than a transcript. */}
            <div className="mt-auto flex items-center gap-2 pt-1">
              <span
                className="flex-1 rounded-pill bg-white px-3 py-1.5 text-small"
                style={{ color: WA.meta }}
              >
                Message
              </span>
              <span
                className="grid size-8 shrink-0 place-items-center rounded-full"
                style={{ backgroundColor: WA.header }}
                aria-hidden="true"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="#fff">
                  <path d="M3 20.5 21 12 3 3.5 3 10l12 2-12 2Z" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

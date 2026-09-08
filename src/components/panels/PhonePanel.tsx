import type { ChatMessage } from '@/components/panels/ChatPanel';
import { cn } from '@/lib/cn';

/**
 * A WhatsApp thread on a phone, for the section that argues candidates answer messaging.
 *
 * That section used the generic ChatPanel — a white card with ink bubbles — which shows a
 * conversation but not *where* the conversation happens, and the whole claim is that it happens
 * somewhere the candidate already lives.
 *
 * `us` is whoever holds the phone. The section's promise is the candidate's screen, so the
 * candidate holds it: the recruiter arrives as an incoming message and the tappable slot picker
 * lands on a received one, which is the only side of a thread a button can be tapped from.
 *
 * What makes a screenshot of this app recognisable is mostly the furniture around the messages —
 * the status bar, the call icons, the date divider, the tails on the bubbles, the patterned
 * wallpaper, the composer's own icons, the home indicator. A thread drawn without them reads as a
 * chat component tinted green. Each of those is here.
 *
 * The colours are literal rather than brand tokens on purpose: they are WhatsApp's, and a mockup
 * drawn in Talentilo's palette would stop being recognisable, which is the entire point. It is a
 * depiction of the channel, so it carries no WhatsApp wordmark or logo.
 */
const WA = {
  header: '#008069',
  chat: '#efeae2',
  incoming: '#ffffff',
  outgoing: '#d9fdd3',
  tick: '#53bdeb',
  meta: '#667781',
  divider: '#e2dcd4',
  link: '#027eb5',
};

/** The doodle wallpaper, as a light scatter rather than a copy of theirs. */
const WALLPAPER =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='56' viewBox='0 0 56 56'%3E%3Cg fill='none' stroke='%23000' stroke-opacity='0.045' stroke-width='1.1'%3E%3Ccircle cx='11' cy='13' r='4.5'/%3E%3Cpath d='M33 8h8v7h-4l-2 3v-3h-2z'/%3E%3Cpath d='M8 38l4-5 4 5'/%3E%3Ccircle cx='42' cy='40' r='3.2'/%3E%3Cpath d='M24 26h6v5h-6z'/%3E%3C/g%3E%3C/svg%3E\")";

function StatusBar() {
  return (
    <div
      className="flex items-center justify-between px-4 pt-1.5 pb-0.5 text-[9px] font-semibold text-white"
      style={{ backgroundColor: WA.header }}
    >
      <span>9:41</span>
      <span className="flex items-center gap-1" aria-hidden="true">
        {/* signal, wifi, battery */}
        <svg viewBox="0 0 18 12" className="h-2.5 w-3.5" fill="#fff">
          <rect x="0" y="8" width="3" height="4" rx="0.6" />
          <rect x="5" y="5.5" width="3" height="6.5" rx="0.6" />
          <rect x="10" y="3" width="3" height="9" rx="0.6" />
          <rect x="15" y="0.5" width="3" height="11.5" rx="0.6" opacity="0.45" />
        </svg>
        <svg viewBox="0 0 16 12" className="h-2.5 w-3.5" fill="none" stroke="#fff" strokeWidth="1.4">
          <path d="M1 4.2a10 10 0 0 1 14 0" strokeLinecap="round" />
          <path d="M4 7.2a6 6 0 0 1 8 0" strokeLinecap="round" />
          <circle cx="8" cy="10.2" r="0.9" fill="#fff" stroke="none" />
        </svg>
        <svg viewBox="0 0 26 12" className="h-2.5 w-5" fill="none">
          <rect x="0.6" y="0.6" width="21" height="10.8" rx="2.6" stroke="#fff" strokeOpacity="0.65" />
          <rect x="2.2" y="2.2" width="15" height="7.6" rx="1.4" fill="#fff" />
          <path d="M23.4 4.4v3.2a2.2 2.2 0 0 0 0-3.2z" fill="#fff" fillOpacity="0.65" />
        </svg>
      </span>
    </div>
  );
}

/** The tail on the first bubble of each side, which is most of what makes the shape read. */
function Tail({ side }: { side: 'left' | 'right' }) {
  const left = side === 'left';
  return (
    <svg
      viewBox="0 0 8 13"
      className={cn('absolute top-0 h-[13px] w-2', left ? '-left-2' : '-right-2')}
      style={{ color: left ? WA.incoming : WA.outgoing }}
      aria-hidden="true"
    >
      <path
        d={left ? 'M8 0H1.6C0.7 0 0.2 1 0.8 1.7L8 10Z' : 'M0 0h6.4c0.9 0 1.4 1 0.8 1.7L0 10Z'}
        fill="currentColor"
      />
    </svg>
  );
}

function Ticks() {
  return (
    <svg viewBox="0 0 18 12" className="h-2.5 w-3.5 shrink-0" fill="none" aria-hidden="true">
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
  // The tail goes on the first bubble of each side, worked out before the map rather than by
  // tracking state through it — render must not mutate.
  const firstUs = messages.findIndex((m) => m.from === 'us');
  const firstThem = messages.findIndex((m) => m.from !== 'us');

  return (
    <div className={cn('mx-auto flex h-full min-h-0 justify-center', className)}>
      {/*
        Sized off its own height at a handset's proportion rather than off a fixed width: at 302px
        wide the bezel came out at 1:1.39, which is a tablet.
      */}
      <div
        className="flex h-full min-h-0 flex-col rounded-[2.1rem] bg-ink p-[5px] shadow-[0_24px_60px_rgb(12_10_16/0.28)]"
        style={{ aspectRatio: '1 / 2' }}
      >
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[1.75rem] bg-white">
          <StatusBar />

          <div className="flex items-center gap-2 px-2.5 pt-1 pb-2" style={{ backgroundColor: WA.header }}>
            <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" aria-hidden="true">
              <path
                d="M15 5 8 12l7 7"
                stroke="#fff"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-white/25 text-[10px] font-semibold text-white">
              {initials}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[11px] leading-tight font-semibold text-white">
                {name}
              </span>
              <span className="block text-[9px] leading-tight text-white/80">{status}</span>
            </span>
            <span className="flex shrink-0 items-center gap-3 pr-1" aria-hidden="true">
              {/* video and voice call, which sit in every real thread header */}
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="#fff">
                <path d="M3 6.5A1.5 1.5 0 0 1 4.5 5h9A1.5 1.5 0 0 1 15 6.5v11A1.5 1.5 0 0 1 13.5 19h-9A1.5 1.5 0 0 1 3 17.5zM16.5 9.5 21 7v10l-4.5-2.5z" />
              </svg>
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="#fff">
                <path d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.2.4 2.4.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.4c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.2 1z" />
              </svg>
            </span>
          </div>

          <div
            // Anchored to the bottom, which is where a thread sits when it is shorter than the
            // screen — and padded wide enough that the bubble tails are not clipped by the bezel.
            className="flex min-h-0 flex-1 flex-col justify-end gap-1.5 px-3.5 py-2"
            style={{ backgroundColor: WA.chat, backgroundImage: WALLPAPER }}
          >
            <span
              className="mx-auto rounded-md bg-white/85 px-2 py-0.5 text-[8px] font-medium tracking-wide uppercase"
              style={{ color: WA.meta }}
            >
              Today
            </span>

            {messages.map((message, i) => {
              const us = message.from === 'us';
              const firstOfSide = i === (us ? firstUs : firstThem);

              return (
                <div
                  key={`${message.text}-${i}`}
                  className={cn('flex', us ? 'justify-end' : 'justify-start')}
                >
                  <div
                    className={cn(
                      'relative max-w-[86%] rounded-lg px-1.5 py-1 shadow-[0_1px_0.5px_rgb(12_10_16/0.13)]',
                      firstOfSide && (us ? 'rounded-tr-none' : 'rounded-tl-none')
                    )}
                    style={{ backgroundColor: us ? WA.outgoing : WA.incoming }}
                  >
                    {firstOfSide ? <Tail side={us ? 'right' : 'left'} /> : null}

                    <p className="px-0.5 text-[11px] leading-[1.35] text-ink">
                      {message.text}
                      {/* The time rides the end of the last line the way it does in the app, and only
                          pushes to its own line when the text fills the width. */}
                      <span className="float-right ml-2 inline-flex translate-y-1 items-center gap-0.5">
                        {message.time ? (
                          <span className="text-[8px]" style={{ color: WA.meta }}>
                            {message.time}
                          </span>
                        ) : null}
                        {us ? <Ticks /> : null}
                      </span>
                    </p>

                    {message.action ? (
                      <span
                        className="mt-1 block border-t px-0.5 pt-1 text-center text-[10px] font-semibold"
                        style={{ borderColor: WA.divider, color: WA.link }}
                      >
                        {message.action}
                      </span>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>

          <div
            className="flex items-end gap-1.5 px-2 pb-1"
            style={{ backgroundColor: WA.chat, backgroundImage: WALLPAPER }}
          >
            <span className="flex flex-1 items-center gap-1.5 rounded-full bg-white px-2 py-1.5">
              <svg
                viewBox="0 0 24 24"
                className="h-3.5 w-3.5 shrink-0"
                fill="none"
                stroke={WA.meta}
                strokeWidth="1.7"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M8.5 14.5a4.5 4.5 0 0 0 7 0" strokeLinecap="round" />
                <circle cx="9" cy="10" r="0.9" fill={WA.meta} stroke="none" />
                <circle cx="15" cy="10" r="0.9" fill={WA.meta} stroke="none" />
              </svg>
              <span className="flex-1 text-[10px]" style={{ color: WA.meta }}>
                Message
              </span>
              <svg
                viewBox="0 0 24 24"
                className="h-3.5 w-3.5 shrink-0"
                fill="none"
                stroke={WA.meta}
                strokeWidth="1.7"
              >
                <path
                  d="M20 11.5 12.2 19.3a4.6 4.6 0 0 1-6.5-6.5l7.8-7.8a3 3 0 1 1 4.3 4.3l-7.6 7.6a1.4 1.4 0 0 1-2-2l7-7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <svg
                viewBox="0 0 24 24"
                className="h-3.5 w-3.5 shrink-0"
                fill="none"
                stroke={WA.meta}
                strokeWidth="1.7"
              >
                <path d="M3 8.5A1.5 1.5 0 0 1 4.5 7h2L8 5h8l1.5 2h2A1.5 1.5 0 0 1 21 8.5v9A1.5 1.5 0 0 1 19.5 19h-15A1.5 1.5 0 0 1 3 17.5z" />
                <circle cx="12" cy="12.8" r="3.2" />
              </svg>
            </span>
            <span
              className="grid size-7 shrink-0 place-items-center rounded-full"
              style={{ backgroundColor: WA.header }}
              aria-hidden="true"
            >
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="#fff">
                <path d="M12 15a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3z" />
                <path d="M18 11.5a.9.9 0 0 0-1.8 0 4.2 4.2 0 0 1-8.4 0 .9.9 0 0 0-1.8 0 6 6 0 0 0 5.1 5.9V19h-1.7a.9.9 0 0 0 0 1.8h5.2a.9.9 0 0 0 0-1.8h-1.7v-1.6a6 6 0 0 0 5.1-5.9z" />
              </svg>
            </span>
          </div>

          {/* The home indicator, which every modern handset screenshot ends on. */}
          <div className="flex justify-center pt-1 pb-1.5" style={{ backgroundColor: WA.chat }}>
            <span className="h-[3px] w-16 rounded-full bg-ink/30" />
          </div>
        </div>
      </div>
    </div>
  );
}

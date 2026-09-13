import { z } from 'zod';

/** Shared by the form and the route handler so both sides enforce the same rules. */
export const contactSchema = z.object({
  name: z
    .string('Please tell us your name.')
    .trim()
    .min(2, 'Please tell us your name.')
    .max(120, 'That name is too long.'),
  email: z.email('Enter a company email address we can reply to.').max(200),
  company: z
    .string('Please tell us which company you are with.')
    .trim()
    .min(2, 'Please tell us which company you are with.')
    .max(160, 'That company name is too long.'),
  message: z
    .string('A little more detail helps us route your message.')
    .trim()
    .min(10, 'A little more detail helps us route your message.')
    .max(4000, 'Please keep the message under 4000 characters.'),
  /**
   * Bots fill hidden fields; people leave them empty.
   *
   * Two things about this field are deliberate.
   *
   * It is named `website`, not `company`, because Company Name is a real required field now.
   * Sharing the name would have meant every genuine submission tripped the trap.
   *
   * And it accepts any string rather than `.max(0)`. Under max(0) a filled honeypot failed
   * validation, so the caller got a 422 naming the hidden field — which tells a bot exactly what
   * caught it, and left the route's "answer as if it worked" branch unreachable. Letting it parse
   * puts the decision back where the comment there says it is.
   */
  website: z.string().optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;

export type ContactFieldErrors = Partial<Record<keyof ContactInput, string>>;

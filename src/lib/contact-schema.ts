import { z } from 'zod';

/** Shared by the form and the route handler so both sides enforce the same rules. */
export const contactSchema = z.object({
  name: z.string().trim().min(2, 'Please tell us your name.').max(120, 'That name is too long.'),
  email: z.email('Enter an email address we can reply to.').max(200),
  message: z
    .string()
    .trim()
    .min(10, 'A little more detail helps us route your message.')
    .max(4000, 'Please keep the message under 4000 characters.'),
  /** Bots fill hidden fields; people leave them empty. */
  company: z.string().max(0).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;

export type ContactFieldErrors = Partial<Record<keyof ContactInput, string>>;

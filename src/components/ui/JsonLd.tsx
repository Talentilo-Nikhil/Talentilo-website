/**
 * Renders a structured-data block. Every caller passes a statically-built object, so nothing
 * user-supplied reaches this markup.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}

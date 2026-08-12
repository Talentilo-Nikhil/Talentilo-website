import { creatives, type CreativeName } from '@/data/creatives';
import { figmaImages } from '@/data/images';
import { cn } from '@/lib/cn';

type CreativeProps = {
  name: CreativeName;
  /** Override the exported alt text, or pass '' to mark the artwork decorative. */
  alt?: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
};

/**
 * Renders one of the artworks exported straight out of the Figma file.
 *
 * These are illustrations, product mockups and the wordmark — never rebuilt in code. WebP is
 * served first with the PNG as the fallback, and both carry the design's intrinsic aspect ratio
 * so the layout never shifts while they load.
 */
export function Creative({ name, alt, className, priority = false, sizes }: CreativeProps) {
  const asset = creatives[name];
  const label = alt ?? asset.alt;

  return (
    <picture className={cn('block', className)}>
      <source srcSet={asset.src} type="image/webp" sizes={sizes} />
      <img
        src={asset.fallback}
        alt={label}
        width={asset.width}
        height={asset.height}
        sizes={sizes}
        decoding={priority ? 'sync' : 'async'}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : undefined}
        className="h-auto w-full"
        aria-hidden={label === '' ? true : undefined}
      />
    </picture>
  );
}

type FigmaImageProps = {
  /** Content hash of an image fill in the Figma file. */
  hash: keyof typeof figmaImages;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
};

/** A raster asset lifted straight out of the `.fig` archive, WebP first. */
export function FigmaImage({ hash, alt, className, sizes, priority = false }: FigmaImageProps) {
  const asset: { src: string; width: number; height: number; webp?: string } = figmaImages[hash];

  return (
    <picture>
      {asset.webp ? <source srcSet={asset.webp} type="image/webp" sizes={sizes} /> : null}
      <img
        src={asset.src}
        alt={alt}
        width={asset.width}
        height={asset.height}
        sizes={sizes}
        decoding={priority ? 'sync' : 'async'}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : undefined}
        className={cn('h-auto w-full', className)}
        aria-hidden={alt === '' ? true : undefined}
      />
    </picture>
  );
}

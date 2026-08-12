/** Conversions from Figma node properties to CSS-shaped values. */

const clamp255 = (n) => Math.max(0, Math.min(255, Math.round((n ?? 0) * 255)));

export function toHex(color) {
  if (!color) return null;
  const hex = (n) => clamp255(n).toString(16).padStart(2, '0');
  const base = `#${hex(color.r)}${hex(color.g)}${hex(color.b)}`;
  return color.a !== undefined && color.a < 0.999 ? `${base}${hex(color.a)}` : base;
}

export function toRgba(color, extraOpacity = 1) {
  if (!color) return null;
  const a = (color.a ?? 1) * extraOpacity;
  return `rgba(${clamp255(color.r)}, ${clamp255(color.g)}, ${clamp255(color.b)}, ${+a.toFixed(3)})`;
}

export function imageHash(paint) {
  const hash = paint?.image?.hash;
  return hash ? Buffer.from(hash).toString('hex') : null;
}

/**
 * Figma expresses a gradient as a unit-square transform. The gradient line runs from the
 * transformed origin along the transformed x-axis, so inverting the matrix recovers the angle.
 */
function gradientAngle(transform) {
  if (!transform) return 180;
  const { m00 = 1, m01 = 0, m10 = 0, m11 = 1 } = transform;
  const det = m00 * m11 - m01 * m10;
  if (!det) return 180;
  // Direction of the gradient line in layout space.
  const dx = m11 / det;
  const dy = -m10 / det;
  const deg = (Math.atan2(dx, -dy) * 180) / Math.PI;
  return +((deg + 360) % 360).toFixed(2);
}

export function paintToCss(paint) {
  if (!paint || paint.visible === false) return null;
  const opacity = paint.opacity ?? 1;

  switch (paint.type) {
    case 'SOLID':
      return { kind: 'solid', color: toRgba(paint.color, opacity), hex: toHex(paint.color) };

    case 'GRADIENT_LINEAR':
    case 'GRADIENT_RADIAL':
    case 'GRADIENT_ANGULAR':
    case 'GRADIENT_DIAMOND': {
      const stops = (paint.stops ?? []).map((s) => ({
        color: toRgba(s.color, opacity),
        position: +(s.position ?? 0).toFixed(4),
      }));
      const list = stops.map((s) => `${s.color} ${+(s.position * 100).toFixed(2)}%`).join(', ');
      const css =
        paint.type === 'GRADIENT_LINEAR'
          ? `linear-gradient(${gradientAngle(paint.transform)}deg, ${list})`
          : `radial-gradient(circle, ${list})`;
      return { kind: 'gradient', gradientType: paint.type, stops, css };
    }

    case 'IMAGE':
      return {
        kind: 'image',
        hash: imageHash(paint),
        scaleMode: paint.imageScaleMode ?? 'FILL',
        opacity,
      };

    default:
      return { kind: paint.type?.toLowerCase() ?? 'unknown' };
  }
}

export function paintsToCss(paints) {
  return (paints ?? []).map(paintToCss).filter(Boolean);
}

export function effectsToCss(effects) {
  const shadows = [];
  // Figma keeps layer blur (blurs the node itself) and background blur (blurs what shows
  // through it) apart; they map to `filter` and `backdrop-filter` respectively.
  let layerBlur = null;
  let backdropBlur = null;
  for (const e of effects ?? []) {
    if (e.visible === false) continue;
    const x = e.offset?.x ?? 0;
    const y = e.offset?.y ?? 0;
    const color = toRgba(e.color) ?? 'rgba(0,0,0,0.1)';
    if (e.type === 'DROP_SHADOW') {
      shadows.push(`${x}px ${y}px ${e.radius ?? 0}px ${e.spread ?? 0}px ${color}`);
    } else if (e.type === 'INNER_SHADOW') {
      shadows.push(`inset ${x}px ${y}px ${e.radius ?? 0}px ${e.spread ?? 0}px ${color}`);
    } else if (e.type === 'FOREGROUND_BLUR') {
      layerBlur = e.radius ?? 0;
    } else if (e.type === 'BACKGROUND_BLUR') {
      backdropBlur = e.radius ?? 0;
    }
  }
  return { boxShadow: shadows.length ? shadows.join(', ') : null, layerBlur, backdropBlur };
}

export function cornerRadius(node) {
  if (node.rectangleCornerRadiiIndependent) {
    return {
      topLeft: node.rectangleTopLeftCornerRadius ?? 0,
      topRight: node.rectangleTopRightCornerRadius ?? 0,
      bottomRight: node.rectangleBottomRightCornerRadius ?? 0,
      bottomLeft: node.rectangleBottomLeftCornerRadius ?? 0,
    };
  }
  const r = node.cornerRadius ?? 0;
  return r ? { topLeft: r, topRight: r, bottomRight: r, bottomLeft: r } : null;
}

/** Auto-layout → flexbox. Returns null for nodes that don't use auto-layout. */
export function autoLayout(node) {
  if (!node.stackMode || node.stackMode === 'NONE') return null;
  const align = {
    MIN: 'flex-start',
    CENTER: 'center',
    MAX: 'flex-end',
    STRETCH: 'stretch',
    BASELINE: 'baseline',
    SPACE_EVENLY: 'space-between',
  };
  return {
    direction: node.stackMode === 'HORIZONTAL' ? 'row' : 'column',
    gap: node.stackSpacing ?? 0,
    padding: {
      top: node.stackVerticalPadding ?? 0,
      right: node.stackPaddingRight ?? 0,
      bottom: node.stackPaddingBottom ?? 0,
      left: node.stackHorizontalPadding ?? 0,
    },
    justifyContent: align[node.stackPrimaryAlignItems] ?? 'flex-start',
    alignItems: align[node.stackCounterAlignItems] ?? 'flex-start',
    wrap: node.stackWrap === 'WRAP',
    primarySizing: node.stackPrimarySizing ?? null,
    counterSizing: node.stackCounterSizing ?? null,
  };
}

export function textStyle(node) {
  if (node.fontSize === undefined && !node.fontName) return null;
  const lh = node.lineHeight;
  let lineHeight = null;
  if (lh) {
    if (lh.units === 'PIXELS' || lh.units === 'RAW') {
      // RAW is a unitless multiplier; PIXELS is absolute.
      lineHeight = lh.units === 'RAW' ? +lh.value.toFixed(3) : `${+lh.value.toFixed(2)}px`;
    } else if (lh.units === 'PERCENT') {
      lineHeight = +(lh.value / 100).toFixed(3);
    }
  }
  const ls = node.letterSpacing;
  let letterSpacing = null;
  if (ls && ls.value) {
    letterSpacing = ls.units === 'PERCENT' ? `${+(ls.value / 100).toFixed(4)}em` : `${+ls.value.toFixed(3)}px`;
  }
  return {
    family: node.fontName?.family ?? null,
    style: node.fontName?.style ?? null,
    size: node.fontSize ?? null,
    lineHeight,
    letterSpacing,
    align: node.textAlignHorizontal ?? 'LEFT',
    verticalAlign: node.textAlignVertical ?? 'TOP',
    case: node.textCase ?? null,
    decoration: node.textDecoration ?? null,
    autoResize: node.textAutoResize ?? null,
  };
}

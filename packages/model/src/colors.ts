export function parseColor(color?: string): [number, number, number] {
  if (!color) {
    return [255, 255, 255];
  }
  const hex = color.match(/#([\da-f]{2})([\da-f]{2})([\da-f]{2})/i);
  if (hex) {
    return [Number.parseInt(hex[1], 16), Number.parseInt(hex[2], 16), Number.parseInt(hex[3], 16)];
  }
  const rgb = color.match(/\(([\d]+)[, ]([\d]+)[, ]([\d]+)\)/i);
  if (rgb) {
    return [Number.parseInt(rgb[1], 10), Number.parseInt(rgb[2], 10), Number.parseInt(rgb[3], 10)];
  }
  return [255, 255, 255];
}

export function mergeColors(colors: readonly (string | undefined)[]): string | undefined {
  if (colors.length === 1) {
    return colors[0];
  }
  if (colors.every((d) => d == null)) {
    return undefined;
  }
  const rgb = colors.map(parseColor);
  const r = Math.floor(rgb.reduce((acc, v) => acc + v[0], 0) / rgb.length);
  const g = Math.floor(rgb.reduce((acc, v) => acc + v[1], 0) / rgb.length);
  const b = Math.floor(rgb.reduce((acc, v) => acc + v[2], 0) / rgb.length);
  return `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`;
}

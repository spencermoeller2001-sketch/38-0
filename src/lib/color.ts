// Returns black or white, whichever is more readable on top of the given hex color.
export function readableTextColor(hex: string): string {
  const clean = hex.replace("#", "");
  if (clean.length !== 6) return "#ffffff";
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  // Perceived luminance (ITU-R BT.601)
  const luminance = (r * 299 + g * 587 + b * 114) / 1000;
  return luminance > 165 ? "#0b0f1a" : "#ffffff";
}

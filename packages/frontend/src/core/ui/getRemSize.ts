export function getRemSize(): number {
  return parseFloat(getComputedStyle(document.documentElement).fontSize);
}

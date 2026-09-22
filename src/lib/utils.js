/**
 * Class name concatenation utility
 */
export function cn(...inputs) {
  return inputs
    .flat()
    .filter(Boolean)
    .map(i => (typeof i === 'string' ? i.trim() : ''))
    .join(' ')
    .trim();
}

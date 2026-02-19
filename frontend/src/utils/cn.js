/**
 * Utility for merging Tailwind CSS classes
 * Helps with conditional classes and prevents conflicts
 */

export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default cn;
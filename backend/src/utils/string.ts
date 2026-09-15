/**
 * String manipulation and sanitization helpers for GitInsight AI.
 */

export const sanitizeString = (input: string): string => {
  if (!input) return '';
  return input.trim().replace(/[<>]/g, '');
};

export const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
};

export const truncateText = (text: string, maxLength: number): string => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength).trimEnd() + '...';
};

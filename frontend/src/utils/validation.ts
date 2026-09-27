/**
 * Client-side form input validation helpers.
 */

export const validateVanitySlug = (slug: string): { isValid: boolean; error?: string } => {
  if (!slug) return { isValid: false, error: 'Slug cannot be empty' };
  if (slug.length < 3) return { isValid: false, error: 'Slug must be at least 3 characters' };
  if (slug.length > 30) return { isValid: false, error: 'Slug cannot exceed 30 characters' };
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return { isValid: false, error: 'Slug may only contain lowercase letters, numbers, and hyphens' };
  }
  return { isValid: true };
};

export const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

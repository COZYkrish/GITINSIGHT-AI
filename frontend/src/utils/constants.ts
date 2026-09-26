/**
 * App-wide constants, color tiers, and route definitions.
 */

export const APP_NAME = 'GitInsight AI';
export const APP_TAGLINE = 'Supercharge your developer profile with AI insights';

export const SCORE_TIERS = {
  EXPERT: { label: 'Expert', minScore: 85, color: '#10B981', bg: 'rgba(16, 185, 129, 0.1)' },
  ADVANCED: { label: 'Advanced', minScore: 70, color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.1)' },
  INTERMEDIATE: { label: 'Intermediate', minScore: 50, color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.1)' },
  DEVELOPING: { label: 'Developing', minScore: 0, color: '#EF4444', bg: 'rgba(239, 68, 68, 0.1)' },
} as const;

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  DNA: '/features/developer-dna',
  RECRUITER: '/features/ai-recruiter',
  PORTFOLIO: '/features/portfolio-generator',
  WRAPPED: '/features/github-wrapped',
  SETTINGS: '/settings',
} as const;

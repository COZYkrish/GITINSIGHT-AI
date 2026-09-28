import { SCORE_TIERS } from './constants';

export const getScoreTierColor = (score: number): string => {
  if (score >= SCORE_TIERS.EXPERT.minScore) return SCORE_TIERS.EXPERT.color;
  if (score >= SCORE_TIERS.ADVANCED.minScore) return SCORE_TIERS.ADVANCED.color;
  if (score >= SCORE_TIERS.INTERMEDIATE.minScore) return SCORE_TIERS.INTERMEDIATE.color;
  return SCORE_TIERS.DEVELOPING.color;
};

export const hexToRgba = (hex: string, alpha = 1): string => {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

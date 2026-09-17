import { ScoreTier } from '../types/analysis.types';

/**
 * Normalizes an arbitrary value between 0 and 100.
 */
export const normalizeScore = (value: number, min = 0, max = 100): number => {
  if (max === min) return 50;
  const normalized = ((value - min) / (max - min)) * 100;
  return Math.round(Math.min(100, Math.max(0, normalized)));
};

/**
 * Derives the semantic tier badge from a numerical score.
 */
export const getScoreTier = (score: number): ScoreTier => {
  if (score >= 85) return 'EXPERT';
  if (score >= 70) return 'ADVANCED';
  if (score >= 50) return 'INTERMEDIATE';
  return 'DEVELOPING';
};

/**
 * Calculates weighted geometric or arithmetic mean.
 */
export const calculateWeightedScore = (
  items: Array<{ value: number; weight: number }>
): number => {
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  if (totalWeight === 0) return 0;
  const weightedSum = items.reduce((sum, item) => sum + item.value * item.weight, 0);
  return Math.round(weightedSum / totalWeight);
};

/**
 * UI display formatting helpers for numbers, scores, and file sizes.
 */

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US').format(num);
};

export const formatPercent = (val: number): string => {
  return `${Math.round(val)}%`;
};

export const formatScore = (score: number): string => {
  return Math.min(100, Math.max(0, Math.round(score))).toString();
};

export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

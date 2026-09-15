/**
 * Date calculation and timestamp utilities for analytics aggregation.
 */

export const formatDateISO = (date: Date = new Date()): string => {
  return date.toISOString();
};

export const getDaysDifference = (startDate: Date, endDate: Date = new Date()): number => {
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const isWithinDays = (date: Date, days: number): boolean => {
  const now = new Date();
  const target = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  return date >= target;
};

export const getStartOfYear = (year: number = new Date().getFullYear()): Date => {
  return new Date(year, 0, 1, 0, 0, 0, 0);
};

export const getEndOfYear = (year: number = new Date().getFullYear()): Date => {
  return new Date(year, 11, 31, 23, 59, 59, 999);
};

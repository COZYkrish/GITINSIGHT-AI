/**
 * Data transformation adapters for Recharts radar and activity bar charts.
 */

export interface RadarDataPoint {
  subject: string;
  score: number;
  fullMark: number;
}

export const transformRadarMetrics = (metrics: {
  codeQuality?: number;
  consistency?: number;
  architecture?: number;
  velocity?: number;
  collaboration?: number;
}): RadarDataPoint[] => {
  return [
    { subject: 'Code Quality', score: metrics.codeQuality ?? 0, fullMark: 100 },
    { subject: 'Consistency', score: metrics.consistency ?? 0, fullMark: 100 },
    { subject: 'Architecture', score: metrics.architecture ?? 0, fullMark: 100 },
    { subject: 'Velocity', score: metrics.velocity ?? 0, fullMark: 100 },
    { subject: 'Collaboration', score: metrics.collaboration ?? 0, fullMark: 100 },
  ];
};

/**
 * Analysis metrics and scoring interfaces for GitInsight AI backend.
 */

export type ScoreTier = 'EXPERT' | 'ADVANCED' | 'INTERMEDIATE' | 'DEVELOPING';

export interface RadarMetrics {
  codeQuality: number;
  consistency: number;
  architecture: number;
  velocity: number;
  collaboration: number;
}

export interface ScoreBreakdown {
  codeImpact: number;
  codeCraftsmanship: number;
  consistency: number;
  breadth: number;
}

export interface ArchetypeClassification {
  primary: 'Architect' | 'Speed Demon' | 'Craftsman' | 'Explorer' | 'Specialist';
  confidence: number;
  secondaryTraits: string[];
}

export interface LanguageStat {
  language: string;
  bytes: number;
  percentage: number;
}

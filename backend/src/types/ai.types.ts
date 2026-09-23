/**
 * Type definitions for AI prompt payloads and model completions.
 */

export interface ModelPromptOptions {
  temperature?: number;
  maxOutputTokens?: number;
  model?: 'gemini-1.5-pro' | 'gemini-1.5-flash';
}

export interface PromptContext {
  username: string;
  totalRepos: number;
  topLanguages: string[];
  totalCommits: number;
  totalStars: number;
}

export interface PromptExecutionResult<T = unknown> {
  data: T;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  latencyMs: number;
  model: string;
}

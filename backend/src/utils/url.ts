/**
 * URL parsing and repository path validation utilities.
 */

export interface ParsedGitHubRepo {
  owner: string;
  repo: string;
}

export const parseGitHubRepoUrl = (url: string): ParsedGitHubRepo | null => {
  if (!url) return null;
  const match = url.match(/github\.com\/([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)/);
  if (!match) return null;
  return {
    owner: match[1],
    repo: match[2].replace(/\.git$/, ''),
  };
};

export const isValidHttpUrl = (urlStr: string): boolean => {
  try {
    const url = new URL(urlStr);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

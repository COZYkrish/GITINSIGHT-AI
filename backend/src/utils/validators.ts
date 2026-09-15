/**
 * Input sanitization and validation helpers.
 */

export const isValidGitHubUsername = (username: string): boolean => {
  if (!username) return false;
  const githubUserRegex = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;
  return githubUserRegex.test(username);
};

export const isValidRepoName = (repo: string): boolean => {
  if (!repo) return false;
  const repoRegex = /^[a-zA-Z0-9_.-]+$/;
  return repoRegex.test(repo) && repo.length <= 100;
};

export const isValidMongoId = (id: string): boolean => {
  if (!id) return false;
  return /^[0-9a-fA-F]{24}$/.test(id);
};

export const clamp = (num: number, min: number, max: number): number => {
  return Math.min(Math.max(num, min), max);
};

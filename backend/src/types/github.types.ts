/**
 * GitHub GraphQL and REST API response types for ingestion service.
 */

export interface GitHubRepoNode {
  id: string;
  name: string;
  nameWithOwner: string;
  description: string | null;
  isPrivate: boolean;
  stargazerCount: number;
  forkCount: number;
  primaryLanguage: {
    name: string;
    color: string;
  } | null;
  languages: {
    edges: Array<{
      size: number;
      node: {
        name: string;
      };
    }>;
  };
  defaultBranchRef: {
    target: {
      history: {
        totalCount: number;
      };
    };
  } | null;
}

export interface GitHubUserNode {
  id: string;
  login: string;
  name: string | null;
  bio: string | null;
  avatarUrl: string;
  repositories: {
    totalCount: number;
    nodes: GitHubRepoNode[];
  };
}

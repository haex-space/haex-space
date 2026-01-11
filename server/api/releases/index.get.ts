import { Octokit } from "@octokit/rest";

const REPO_OWNER = "haex-space";
const REPO_NAME = "haex-vault";
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes cache

interface Release {
  tag_name: string;
  assets: Array<{
    name: string;
    browser_download_url: string;
    size: number;
  }>;
  prerelease: boolean;
  published_at: string;
}

interface CachedReleases {
  data: Release[] | null;
  timestamp: number;
}

// Simple in-memory cache
let cache: CachedReleases | null = null;

export default defineEventHandler(async () => {
  // Check cache
  if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
    return cache.data;
  }

  const octokit = new Octokit();

  try {
    const { data } = await octokit.repos.listReleases({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      per_page: 20,
    });

    const releases = data
      .filter((r) => !r.draft)
      .map((r) => ({
        tag_name: r.tag_name,
        assets: r.assets.map((a) => ({
          name: a.name,
          browser_download_url: a.browser_download_url,
          size: a.size,
        })),
        prerelease: r.prerelease,
        published_at: r.published_at,
      }));

    // Update cache
    cache = {
      data: releases,
      timestamp: Date.now(),
    };

    return releases;
  } catch (error: unknown) {
    // If we have stale cache, return it on error
    if (cache?.data) {
      console.warn("[releases] GitHub API error, returning stale cache:", error);
      return cache.data;
    }

    const message = error instanceof Error ? error.message : "Unknown error";
    throw createError({
      statusCode: 502,
      message: `Failed to fetch releases: ${message}`,
    });
  }
});

import { Octokit } from "@octokit/rest";

const REPO_OWNER = "haex-space";
const REPO_NAME = "haex-vault";
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes cache

interface CachedRelease {
  data: {
    tag_name: string;
    assets: Array<{
      name: string;
      browser_download_url: string;
      size: number;
    }>;
    prerelease: boolean;
    published_at: string;
  } | null;
  timestamp: number;
}

// Simple in-memory cache
let cache: CachedRelease | null = null;

export default defineEventHandler(async () => {
  // Check cache
  if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
    return cache.data;
  }

  const octokit = new Octokit();

  try {
    const { data } = await octokit.repos.getLatestRelease({
      owner: REPO_OWNER,
      repo: REPO_NAME,
    });

    const release = {
      tag_name: data.tag_name,
      assets: data.assets.map((a) => ({
        name: a.name,
        browser_download_url: a.browser_download_url,
        size: a.size,
      })),
      prerelease: data.prerelease,
      published_at: data.published_at,
    };

    // Update cache
    cache = {
      data: release,
      timestamp: Date.now(),
    };

    return release;
  } catch (error: unknown) {
    // If we have stale cache, return it on error
    if (cache?.data) {
      console.warn("[releases/latest] GitHub API error, returning stale cache:", error);
      return cache.data;
    }

    const message = error instanceof Error ? error.message : "Unknown error";
    throw createError({
      statusCode: 502,
      message: `Failed to fetch latest release: ${message}`,
    });
  }
});

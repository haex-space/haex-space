import { Octokit } from "@octokit/rest";
import { getLatestStableRelease } from "../../utils/release-storage";

const REPO_OWNER = "haex-space";
const REPO_NAME = "haex-vault";
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes cache

interface ReleaseData {
  tag_name: string;
  assets: Array<{
    name: string;
    browser_download_url: string;
    size: number;
  }>;
  prerelease: boolean;
  published_at: string;
}

interface CachedRelease {
  data: ReleaseData | null;
  timestamp: number;
}

// Simple in-memory cache for GitHub fallback
let githubCache: CachedRelease | null = null;

export default defineEventHandler(async () => {
  // First, try to get locally stored release
  const localRelease = getLatestStableRelease();
  if (localRelease) {
    return {
      tag_name: localRelease.tag_name,
      assets: localRelease.assets.map((a) => ({
        name: a.name,
        browser_download_url: a.downloadUrl,
        size: a.size,
      })),
      prerelease: localRelease.prerelease,
      published_at: localRelease.published_at,
    };
  }

  // Fallback to GitHub API if no local release
  // Check cache
  if (githubCache && Date.now() - githubCache.timestamp < CACHE_TTL) {
    return githubCache.data;
  }

  const octokit = new Octokit();

  try {
    const { data } = await octokit.repos.getLatestRelease({
      owner: REPO_OWNER,
      repo: REPO_NAME,
    });

    const release: ReleaseData = {
      tag_name: data.tag_name,
      assets: data.assets.map((a) => ({
        name: a.name,
        browser_download_url: a.browser_download_url,
        size: a.size,
      })),
      prerelease: data.prerelease,
      published_at: data.published_at || new Date().toISOString(),
    };

    // Update cache
    githubCache = {
      data: release,
      timestamp: Date.now(),
    };

    return release;
  } catch (error: unknown) {
    // If we have stale cache, return it on error
    if (githubCache?.data) {
      console.warn(
        "[releases/latest] GitHub API error, returning stale cache:",
        error
      );
      return githubCache.data;
    }

    const message = error instanceof Error ? error.message : "Unknown error";
    throw createError({
      statusCode: 502,
      message: `Failed to fetch latest release: ${message}`,
    });
  }
});

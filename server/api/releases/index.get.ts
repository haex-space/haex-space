import { Octokit } from "@octokit/rest";
import { loadReleaseMetadata } from "../../utils/release-storage";

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

interface CachedReleases {
  data: ReleaseData[] | null;
  timestamp: number;
}

// Simple in-memory cache for GitHub fallback
let githubCache: CachedReleases | null = null;

export default defineEventHandler(async () => {
  // First, try to get locally stored releases
  const localReleases = loadReleaseMetadata();
  if (localReleases.length > 0) {
    return localReleases.map((r) => ({
      tag_name: r.tag_name,
      assets: r.assets.map((a) => ({
        name: a.name,
        browser_download_url: a.downloadUrl,
        size: a.size,
      })),
      prerelease: r.prerelease,
      published_at: r.published_at,
    }));
  }

  // Fallback to GitHub API if no local releases
  // Check cache
  if (githubCache && Date.now() - githubCache.timestamp < CACHE_TTL) {
    return githubCache.data;
  }

  const octokit = new Octokit();

  try {
    const { data } = await octokit.repos.listReleases({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      per_page: 20,
    });

    const releases: ReleaseData[] = data
      .filter((r) => !r.draft)
      .map((r) => ({
        tag_name: r.tag_name,
        assets: r.assets.map((a) => ({
          name: a.name,
          browser_download_url: a.browser_download_url,
          size: a.size,
        })),
        prerelease: r.prerelease,
        published_at: r.published_at || new Date().toISOString(),
      }));

    // Update cache
    githubCache = {
      data: releases,
      timestamp: Date.now(),
    };

    return releases;
  } catch (error: unknown) {
    // If we have stale cache, return it on error
    if (githubCache?.data) {
      console.warn(
        "[releases] GitHub API error, returning stale cache:",
        error
      );
      return githubCache.data;
    }

    const message = error instanceof Error ? error.message : "Unknown error";
    throw createError({
      statusCode: 502,
      message: `Failed to fetch releases: ${message}`,
    });
  }
});

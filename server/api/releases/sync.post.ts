import { Octokit } from "@octokit/rest";
import {
  downloadAsset,
  upsertRelease,
  getReleasePath,
  getLatestStableRelease,
  getLatestNightlyRelease,
  assetExists,
  type StoredRelease,
  type StoredAsset,
} from "../../utils/release-storage";

const REPO_OWNER = "haex-space";
const REPO_NAME = "haex-vault";

/**
 * Manual sync endpoint to fetch latest releases from GitHub
 * Only syncs the latest stable and latest nightly release
 * Requires RELEASE_SYNC_SECRET header for authentication
 */
export default defineEventHandler(async (event) => {
  const syncSecret = process.env.RELEASE_SYNC_SECRET;

  if (!syncSecret) {
    throw createError({
      statusCode: 500,
      message: "RELEASE_SYNC_SECRET not configured",
    });
  }

  // Verify secret
  const providedSecret = getHeader(event, "x-sync-secret");
  if (providedSecret !== syncSecret) {
    throw createError({
      statusCode: 401,
      message: "Invalid sync secret",
    });
  }

  const octokit = new Octokit();
  const existingStable = getLatestStableRelease();
  const existingNightly = getLatestNightlyRelease();

  console.log("[Sync] Starting manual release sync...");

  try {
    const { data: releases } = await octokit.repos.listReleases({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      per_page: 20,
    });

    // Find latest stable and latest nightly
    const latestStable = releases.find(
      (r) => !r.draft && !r.prerelease && !r.tag_name.startsWith("nightly-")
    );
    const latestNightly = releases.find(
      (r) => !r.draft && r.tag_name.startsWith("nightly-")
    );

    const syncedReleases: string[] = [];

    // Sync stable release if newer or not exists
    if (latestStable) {
      if (
        !existingStable ||
        existingStable.tag_name !== latestStable.tag_name
      ) {
        const synced = await syncRelease(latestStable);
        if (synced) syncedReleases.push(latestStable.tag_name);
      } else {
        console.log(
          `[Sync] Stable ${latestStable.tag_name} already up to date`
        );
      }
    }

    // Sync nightly release if newer or not exists
    if (latestNightly) {
      if (
        !existingNightly ||
        existingNightly.tag_name !== latestNightly.tag_name
      ) {
        const synced = await syncRelease(latestNightly);
        if (synced) syncedReleases.push(latestNightly.tag_name);
      } else {
        console.log(
          `[Sync] Nightly ${latestNightly.tag_name} already up to date`
        );
      }
    }

    console.log(`[Sync] Completed. Synced ${syncedReleases.length} releases.`);

    return {
      status: "success",
      synced: syncedReleases,
      stable: getLatestStableRelease()?.tag_name || null,
      nightly: getLatestNightlyRelease()?.tag_name || null,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[Sync] Failed:", message);
    throw createError({
      statusCode: 502,
      message: `Sync failed: ${message}`,
    });
  }
});

async function syncRelease(release: {
  tag_name: string;
  prerelease: boolean;
  published_at: string | null;
  assets: Array<{
    name: string;
    browser_download_url: string;
    size: number;
  }>;
}): Promise<boolean> {
  console.log(`[Sync] Syncing release: ${release.tag_name}`);
  const storedAssets: StoredAsset[] = [];
  const releasePath = getReleasePath(release.tag_name);

  for (const asset of release.assets) {
    // Skip if asset already exists
    if (assetExists(release.tag_name, asset.name)) {
      console.log(`[Sync] Asset exists: ${asset.name}`);
      storedAssets.push({
        name: asset.name,
        size: asset.size,
        downloadUrl: `/api/releases/download/${release.tag_name}/${asset.name}`,
      });
      continue;
    }

    try {
      console.log(`[Sync] Downloading: ${asset.name}`);
      const destPath = `${releasePath}/${asset.name}`;
      const size = await downloadAsset(asset.browser_download_url, destPath);

      storedAssets.push({
        name: asset.name,
        size,
        downloadUrl: `/api/releases/download/${release.tag_name}/${asset.name}`,
      });
    } catch (error) {
      console.error(`[Sync] Failed to download ${asset.name}:`, error);
    }
  }

  if (storedAssets.length === 0) {
    console.error(`[Sync] No assets downloaded for ${release.tag_name}`);
    return false;
  }

  const storedRelease: StoredRelease = {
    tag_name: release.tag_name,
    prerelease: release.prerelease,
    published_at: release.published_at || new Date().toISOString(),
    assets: storedAssets,
  };

  upsertRelease(storedRelease);
  return true;
}

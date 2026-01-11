import * as fs from "node:fs";
import * as path from "node:path";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";

const RELEASES_DIR = process.env.RELEASES_STORAGE_PATH || "/data/releases";

export interface StoredAsset {
  name: string;
  size: number;
  downloadUrl: string;
}

export interface StoredRelease {
  tag_name: string;
  prerelease: boolean;
  published_at: string;
  assets: StoredAsset[];
}

/**
 * Ensures the releases directory exists
 */
export function ensureReleasesDir(): void {
  if (!fs.existsSync(RELEASES_DIR)) {
    fs.mkdirSync(RELEASES_DIR, { recursive: true });
  }
}

/**
 * Gets the path for a specific release version
 */
export function getReleasePath(tagName: string): string {
  return path.join(RELEASES_DIR, tagName);
}

/**
 * Gets the path for the releases metadata file
 */
export function getMetadataPath(): string {
  return path.join(RELEASES_DIR, "releases.json");
}

/**
 * Downloads a file from a URL and saves it locally
 */
export async function downloadAsset(
  url: string,
  destPath: string
): Promise<number> {
  const response = await fetch(url, {
    headers: {
      Accept: "application/octet-stream",
      "User-Agent": "haex-space-release-sync",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to download ${url}: ${response.statusText}`);
  }

  const destDir = path.dirname(destPath);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  const fileStream = fs.createWriteStream(destPath);
  await pipeline(Readable.fromWeb(response.body as any), fileStream);

  const stats = fs.statSync(destPath);
  return stats.size;
}

/**
 * Saves release metadata to the JSON file
 */
export function saveReleaseMetadata(releases: StoredRelease[]): void {
  ensureReleasesDir();
  fs.writeFileSync(getMetadataPath(), JSON.stringify(releases, null, 2));
}

/**
 * Loads release metadata from the JSON file
 */
export function loadReleaseMetadata(): StoredRelease[] {
  const metaPath = getMetadataPath();
  if (!fs.existsSync(metaPath)) {
    return [];
  }
  try {
    return JSON.parse(fs.readFileSync(metaPath, "utf-8"));
  } catch {
    return [];
  }
}

/**
 * Adds or updates a release in the metadata
 * Only keeps the latest stable and latest nightly release
 */
export function upsertRelease(release: StoredRelease): void {
  const releases = loadReleaseMetadata();
  const isNightly = release.tag_name.startsWith("nightly-");

  // Find and remove old release of same type
  const oldReleaseIndex = releases.findIndex((r) => {
    const rIsNightly = r.tag_name.startsWith("nightly-");
    return rIsNightly === isNightly;
  });

  // Delete old release files if exists
  if (oldReleaseIndex >= 0) {
    const oldRelease = releases[oldReleaseIndex]!;
    if (oldRelease.tag_name !== release.tag_name) {
      const oldPath = getReleasePath(oldRelease.tag_name);
      if (fs.existsSync(oldPath)) {
        fs.rmSync(oldPath, { recursive: true, force: true });
        console.log(`[Storage] Deleted old release: ${oldRelease.tag_name}`);
      }
    }
    releases.splice(oldReleaseIndex, 1);
  }

  // Add new release
  releases.unshift(release);

  saveReleaseMetadata(releases);
}

/**
 * Gets the latest stable release
 */
export function getLatestStableRelease(): StoredRelease | null {
  const releases = loadReleaseMetadata();
  return (
    releases.find(
      (r) => !r.prerelease && !r.tag_name.startsWith("nightly-")
    ) || null
  );
}

/**
 * Gets the latest nightly release
 */
export function getLatestNightlyRelease(): StoredRelease | null {
  const releases = loadReleaseMetadata();
  return releases.find((r) => r.tag_name.startsWith("nightly-")) || null;
}

/**
 * Gets the file path for a specific asset
 */
export function getAssetFilePath(tagName: string, assetName: string): string {
  return path.join(getReleasePath(tagName), assetName);
}

/**
 * Checks if an asset exists locally
 */
export function assetExists(tagName: string, assetName: string): boolean {
  return fs.existsSync(getAssetFilePath(tagName, assetName));
}


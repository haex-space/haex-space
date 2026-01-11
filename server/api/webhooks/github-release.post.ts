import * as crypto from "node:crypto";
import {
  downloadAsset,
  upsertRelease,
  getReleasePath,
  type StoredRelease,
  type StoredAsset,
} from "../../utils/release-storage";

interface GitHubAsset {
  name: string;
  browser_download_url: string;
  size: number;
}

interface GitHubRelease {
  tag_name: string;
  prerelease: boolean;
  published_at: string;
  assets: GitHubAsset[];
}

interface WebhookPayload {
  action: string;
  release: GitHubRelease;
}

/**
 * Verifies the GitHub webhook signature
 */
function verifySignature(
  payload: string,
  signature: string | undefined,
  secret: string
): boolean {
  if (!signature) return false;

  const hmac = crypto.createHmac("sha256", secret);
  const digest = "sha256=" + hmac.update(payload).digest("hex");

  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}

export default defineEventHandler(async (event) => {
  const webhookSecret = process.env.GITHUB_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("[Webhook] GITHUB_WEBHOOK_SECRET not configured");
    throw createError({
      statusCode: 500,
      message: "Webhook not configured",
    });
  }

  // Get raw body for signature verification
  const rawBody = await readRawBody(event);
  if (!rawBody) {
    throw createError({
      statusCode: 400,
      message: "Empty request body",
    });
  }

  // Verify GitHub signature
  const signature = getHeader(event, "x-hub-signature-256");
  if (!verifySignature(rawBody, signature, webhookSecret)) {
    console.warn("[Webhook] Invalid signature");
    throw createError({
      statusCode: 401,
      message: "Invalid signature",
    });
  }

  // Parse payload
  const payload: WebhookPayload = JSON.parse(rawBody);

  // Only handle published releases
  if (payload.action !== "published") {
    console.log(`[Webhook] Ignoring action: ${payload.action}`);
    return { status: "ignored", action: payload.action };
  }

  const release = payload.release;
  console.log(`[Webhook] Processing release: ${release.tag_name}`);

  // Download all assets
  const storedAssets: StoredAsset[] = [];
  const releasePath = getReleasePath(release.tag_name);

  for (const asset of release.assets) {
    try {
      console.log(`[Webhook] Downloading asset: ${asset.name}`);
      const destPath = `${releasePath}/${asset.name}`;
      const size = await downloadAsset(asset.browser_download_url, destPath);

      storedAssets.push({
        name: asset.name,
        size,
        downloadUrl: `/api/releases/download/${release.tag_name}/${asset.name}`,
      });

      console.log(`[Webhook] Downloaded: ${asset.name} (${size} bytes)`);
    } catch (error) {
      console.error(`[Webhook] Failed to download ${asset.name}:`, error);
      // Continue with other assets
    }
  }

  // Save release metadata
  const storedRelease: StoredRelease = {
    tag_name: release.tag_name,
    prerelease: release.prerelease,
    published_at: release.published_at,
    assets: storedAssets,
  };

  upsertRelease(storedRelease);

  console.log(
    `[Webhook] Release ${release.tag_name} synced with ${storedAssets.length} assets`
  );

  return {
    status: "success",
    tag_name: release.tag_name,
    assets_count: storedAssets.length,
  };
});

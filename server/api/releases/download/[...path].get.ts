import * as fs from "node:fs";
import * as path from "node:path";
import { getAssetFilePath } from "../../../utils/release-storage";

export default defineEventHandler(async (event) => {
  // Path format: /api/releases/download/{tag_name}/{asset_name}
  const pathParam = getRouterParam(event, "path");

  if (!pathParam) {
    throw createError({
      statusCode: 400,
      message: "Missing path parameter",
    });
  }

  // Split path into tag_name and asset_name
  const parts = pathParam.split("/");
  if (parts.length < 2) {
    throw createError({
      statusCode: 400,
      message: "Invalid path format. Expected: {tag_name}/{asset_name}",
    });
  }

  const tagName = parts[0]!;
  const assetName = parts.slice(1).join("/"); // Handle potential nested paths

  // Security: Prevent directory traversal
  if (
    tagName.includes("..") ||
    assetName.includes("..") ||
    assetName.includes("\\")
  ) {
    throw createError({
      statusCode: 400,
      message: "Invalid path",
    });
  }

  const filePath = getAssetFilePath(tagName, assetName);

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    throw createError({
      statusCode: 404,
      message: "Asset not found",
    });
  }

  // Get file stats
  const stats = fs.statSync(filePath);

  // Determine content type based on extension
  const ext = path.extname(assetName).toLowerCase();
  const contentTypes: Record<string, string> = {
    ".exe": "application/vnd.microsoft.portable-executable",
    ".msi": "application/x-msi",
    ".dmg": "application/x-apple-diskimage",
    ".deb": "application/vnd.debian.binary-package",
    ".rpm": "application/x-rpm",
    ".appimage": "application/x-executable",
    ".apk": "application/vnd.android.package-archive",
    ".zip": "application/zip",
    ".tar": "application/x-tar",
    ".gz": "application/gzip",
  };

  const contentType = contentTypes[ext] || "application/octet-stream";

  // Set headers
  setHeader(event, "Content-Type", contentType);
  setHeader(event, "Content-Length", stats.size);
  setHeader(
    event,
    "Content-Disposition",
    `attachment; filename="${assetName}"`
  );
  setHeader(event, "Cache-Control", "public, max-age=31536000, immutable");

  // Stream the file
  const stream = fs.createReadStream(filePath);
  return sendStream(event, stream);
});

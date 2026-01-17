/**
 * Format bytes to human-readable string
 * @param bytes - Number of bytes
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted string like "10 GB" or "1.5 TB"
 */
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return "0 B";

  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB", "PB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + " " + sizes[i];
}

/**
 * Format price in cents to display string
 * @param cents - Price in cents (e.g., 499 for €4.99)
 * @param freeLabel - Label to show when price is null/0 (default: "Free")
 * @returns Formatted string like "€4.99" or "Free"
 */
export function formatPrice(cents: number | null, freeLabel = "Free"): string {
  if (cents === null || cents === 0) return freeLabel;
  return `€${(cents / 100).toFixed(2)}`;
}

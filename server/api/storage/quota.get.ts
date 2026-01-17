import { serverSupabaseClient, serverSupabaseUser } from "#supabase/server";

interface StorageQuotaResponse {
  usedBytes: number;
  quotaBytes: number;
  tierName: string;
  tierSlug: string;
}

export default defineEventHandler(async (event): Promise<StorageQuotaResponse> => {
  // eslint-disable-next-line no-console
  console.log("[quota.get] Handler called");

  const user = await serverSupabaseUser(event);
  // eslint-disable-next-line no-console
  console.log("[quota.get] User:", user?.id ?? "none");

  if (!user) {
    throw createError({
      statusCode: 401,
      message: "Unauthorized",
    });
  }

  const supabase = await serverSupabaseClient(event);

  try {
    // eslint-disable-next-line no-console
    console.log("[quota.get] Calling RPC for user:", user.id);

    // Call the get_user_storage_quota function
    const { data, error } = await supabase.rpc("get_user_storage_quota", {
      p_user_id: user.id,
    });

    // eslint-disable-next-line no-console
    console.log("[quota.get] RPC response - error:", error, "data:", data);

    if (error) {
      console.error("[quota.get] RPC error:", error);
      throw createError({
        statusCode: 500,
        message: `Failed to fetch quota: ${error.message}`,
      });
    }

    // eslint-disable-next-line no-console
    console.log("[quota.get] RPC result for user", user.id, ":", data);

    // Function returns a single row
    const quota = data?.[0];

    return {
      usedBytes: quota?.used_bytes ?? 0,
      quotaBytes: quota?.quota_bytes ?? 10737418240, // 10 GB default
      tierName: quota?.tier_name ?? "Free",
      tierSlug: quota?.tier_slug ?? "free",
    };
  } catch (error: unknown) {
    if (error && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    const message = error instanceof Error ? error.message : "Unknown error";
    throw createError({
      statusCode: 500,
      message: `Failed to fetch storage quota: ${message}`,
    });
  }
});

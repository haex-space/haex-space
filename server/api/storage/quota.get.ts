import { serverSupabaseClient, serverSupabaseUser } from "#supabase/server";

interface StorageQuotaResponse {
  usedBytes: number;
  quotaBytes: number;
  tierName: string;
  tierSlug: string;
}

export default defineEventHandler(async (event): Promise<StorageQuotaResponse> => {
  const user = await serverSupabaseUser(event);

  if (!user) {
    throw createError({
      statusCode: 401,
      message: "Unauthorized",
    });
  }

  const supabase = await serverSupabaseClient(event);

  try {
    // Call the get_user_storage_quota function
    const { data, error } = await supabase.rpc("get_user_storage_quota", {
      p_user_id: user.id,
    });

    if (error) {
      console.error("RPC error:", error);
      throw createError({
        statusCode: 500,
        message: `Failed to fetch quota: ${error.message}`,
      });
    }

    console.log("RPC result for user", user.id, ":", data);

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

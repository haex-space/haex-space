import { serverSupabaseClient } from "#supabase/server";

interface StorageCredentials {
  endpoint: string;
  bucket: string;
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
}

const SYNC_SERVER_URL = "https://sync.haex.space";

export default defineEventHandler(async (event): Promise<StorageCredentials> => {
  const supabase = await serverSupabaseClient(event);

  // Get user session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    throw createError({
      statusCode: 401,
      message: "Unauthorized",
    });
  }

  try {
    // Fetch storage credentials from sync server
    // The sync server validates the token and returns per-user S3 credentials
    const response = await fetch(`${SYNC_SERVER_URL}/auth/storage-credentials`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw createError({
        statusCode: response.status,
        message: errorData.error || "Failed to fetch storage credentials",
      });
    }

    const data = await response.json();

    return {
      endpoint: data.endpoint,
      bucket: data.bucket,
      region: data.region,
      accessKeyId: data.accessKeyId,
      secretAccessKey: data.secretAccessKey,
    };
  } catch (error: unknown) {
    if (error && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    const message = error instanceof Error ? error.message : "Unknown error";
    throw createError({
      statusCode: 500,
      message: `Failed to fetch storage credentials: ${message}`,
    });
  }
});

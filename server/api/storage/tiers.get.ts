import { serverSupabaseClient } from "#supabase/server";

interface StorageTier {
  id: string;
  name: string;
  slug: string;
  quotaBytes: number;
  priceMonthlyEuroCents: number | null;
  isDefault: boolean;
  sortOrder: number;
}

interface StorageTiersResponse {
  tiers: StorageTier[];
}

export default defineEventHandler(async (event): Promise<StorageTiersResponse> => {
  const supabase = await serverSupabaseClient(event);

  try {
    const { data, error } = await supabase
      .from("storage_tiers")
      .select("*")
      .order("sort_order");

    if (error) {
      throw createError({
        statusCode: 500,
        message: `Failed to fetch tiers: ${error.message}`,
      });
    }

    const tiers: StorageTier[] = (data ?? []).map((tier) => ({
      id: tier.id,
      name: tier.name,
      slug: tier.slug,
      quotaBytes: tier.quota_bytes,
      priceMonthlyEuroCents: tier.price_monthly_euro_cents,
      isDefault: tier.is_default ?? false,
      sortOrder: tier.sort_order ?? 0,
    }));

    return { tiers };
  } catch (error: unknown) {
    if (error && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    const message = error instanceof Error ? error.message : "Unknown error";
    throw createError({
      statusCode: 500,
      message: `Failed to fetch storage tiers: ${message}`,
    });
  }
});

import { defineStore } from "pinia";

export interface StorageQuota {
  usedBytes: number;
  quotaBytes: number;
  tierName: string;
  tierSlug: string;
}

export interface StorageTier {
  id: string;
  name: string;
  slug: string;
  quotaBytes: number;
  priceMonthlyEuroCents: number | null;
  isDefault: boolean;
  sortOrder: number;
}

export const useStorageStore = defineStore("storage", () => {
  // State
  const quota = ref<StorageQuota | null>(null);
  const tiers = ref<StorageTier[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const hasFetched = ref(false);

  // Getters
  const usagePercent = computed(() =>
    quota.value ? (quota.value.usedBytes / quota.value.quotaBytes) * 100 : 0
  );

  const isAtLimit = computed(() => usagePercent.value >= 100);

  const isNearLimit = computed(() => usagePercent.value >= 90);

  const remainingBytes = computed(() =>
    quota.value ? quota.value.quotaBytes - quota.value.usedBytes : 0
  );

  // Actions
  async function fetchQuota(): Promise<StorageQuota> {
    loading.value = true;
    error.value = null;

    try {
      const data = await $fetch<StorageQuota>("/api/storage/quota");
      quota.value = data;
      hasFetched.value = true;
      return data;
    } catch (e) {
      error.value = e instanceof Error ? e.message : "Failed to fetch quota";
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function fetchTiers(): Promise<StorageTier[]> {
    try {
      const { tiers: data } = await $fetch<{ tiers: StorageTier[] }>(
        "/api/storage/tiers"
      );
      tiers.value = data;
      return data;
    } catch (e) {
      error.value = e instanceof Error ? e.message : "Failed to fetch tiers";
      throw e;
    }
  }

  function reset() {
    quota.value = null;
    tiers.value = [];
    error.value = null;
    hasFetched.value = false;
  }

  return {
    // State
    quota,
    tiers,
    loading,
    error,
    hasFetched,

    // Getters
    usagePercent,
    isAtLimit,
    isNearLimit,
    remainingBytes,

    // Actions
    fetchQuota,
    fetchTiers,
    reset,
  };
});

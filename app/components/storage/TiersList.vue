<script setup lang="ts">
import { Check, Sparkles } from "lucide-vue-next";
import type { StorageTier } from "~/stores/storage";

const props = defineProps<{
  tiers: StorageTier[];
  currentTierSlug?: string;
  loading?: boolean;
}>();

const { t } = useI18n();

// Format bytes to human-readable
function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(0)) + " " + sizes[i];
}

// Format price
function formatPrice(cents: number | null): string {
  if (cents === null) return t("storage.tiers.free");
  return `${(cents / 100).toFixed(2)} EUR/mo`;
}
</script>

<template>
  <div class="space-y-3">
    <div v-if="loading" class="flex items-center justify-center py-4">
      <div
        class="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"
      />
    </div>

    <div v-else class="grid gap-3">
      <div
        v-for="tier in tiers"
        :key="tier.id"
        class="flex items-center justify-between rounded-lg border p-4"
        :class="{
          'border-primary bg-primary/5': tier.slug === currentTierSlug,
        }"
      >
        <div class="flex items-center gap-3">
          <div
            class="flex h-10 w-10 items-center justify-center rounded-full"
            :class="
              tier.slug === currentTierSlug
                ? 'bg-primary/10 text-primary'
                : 'bg-muted text-muted-foreground'
            "
          >
            <Check
              v-if="tier.slug === currentTierSlug"
              class="h-5 w-5"
            />
            <Sparkles v-else class="h-5 w-5" />
          </div>
          <div>
            <p class="font-medium">{{ tier.name }}</p>
            <p class="text-sm text-muted-foreground">
              {{ formatBytes(tier.quotaBytes) }}
            </p>
          </div>
        </div>

        <div class="text-right">
          <p
            v-if="tier.slug === currentTierSlug"
            class="text-sm font-medium text-primary"
          >
            {{ t("storage.tiers.current") }}
          </p>
          <p v-else class="text-sm text-muted-foreground">
            {{ formatPrice(tier.priceMonthlyEuroCents) }}
          </p>
          <Button
            v-if="tier.slug !== currentTierSlug && tier.priceMonthlyEuroCents !== null"
            size="sm"
            variant="outline"
            class="mt-1"
            disabled
          >
            {{ t("storage.tiers.comingSoon") }}
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AlertCircle } from "lucide-vue-next";
import type { StorageQuota } from "~/stores/storage";

const props = defineProps<{
  quota: StorageQuota | null;
  loading?: boolean;
}>();

const { t } = useI18n();

// Format bytes to human-readable
function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

const usagePercent = computed(() =>
  props.quota
    ? Math.min((props.quota.usedBytes / props.quota.quotaBytes) * 100, 100)
    : 0
);

const isAtLimit = computed(() => usagePercent.value >= 100);
const isNearLimit = computed(() => usagePercent.value >= 90);

const progressColor = computed(() => {
  if (isAtLimit.value) return "bg-destructive";
  if (isNearLimit.value) return "bg-yellow-500";
  return "bg-primary";
});
</script>

<template>
  <div class="space-y-4">
    <div v-if="loading" class="flex items-center justify-center py-4">
      <div
        class="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"
      />
    </div>

    <template v-else-if="quota">
      <!-- Usage bar -->
      <div class="space-y-2">
        <div class="flex items-center justify-between text-sm">
          <span class="text-muted-foreground">
            {{
              t("storage.quota.used", {
                used: formatBytes(quota.usedBytes),
                total: formatBytes(quota.quotaBytes),
              })
            }}
          </span>
          <span class="font-medium">{{ usagePercent.toFixed(1) }}%</span>
        </div>

        <Progress :model-value="usagePercent" :class="progressColor" />

        <p class="text-sm text-muted-foreground">
          {{
            t("storage.quota.remaining", {
              remaining: formatBytes(quota.quotaBytes - quota.usedBytes),
            })
          }}
        </p>
      </div>

      <!-- At limit warning -->
      <div
        v-if="isAtLimit"
        class="flex items-start gap-2 rounded-md border border-destructive/50 bg-destructive/10 p-3"
      >
        <AlertCircle class="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
        <div>
          <p class="text-sm font-medium text-destructive">
            {{ t("storage.quota.atLimit") }}
          </p>
          <p class="text-sm text-muted-foreground">
            {{ t("storage.quota.atLimitHint") }}
          </p>
        </div>
      </div>

      <!-- Current tier -->
      <div class="flex items-center justify-between pt-2 border-t">
        <span class="text-sm text-muted-foreground">
          {{ t("storage.tiers.current") }}
        </span>
        <span class="text-sm font-medium">{{ quota.tierName }}</span>
      </div>
    </template>
  </div>
</template>

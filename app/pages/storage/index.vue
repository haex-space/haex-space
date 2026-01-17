<script setup lang="ts">
import { HardDrive, Cloud, Sparkles } from "lucide-vue-next";
import { useStorageStore } from "~/stores/storage";

definePageMeta({
  middleware: "auth",
});

const { t } = useI18n();
const store = useStorageStore();

useSeoMeta({
  title: () => `${t("storage.title")} - haex.space`,
  description: () => t("storage.description"),
});

onMounted(async () => {
  await Promise.all([store.fetchQuota(), store.fetchTiers()]);
});
</script>

<template>
  <div class="min-h-screen bg-background">
    <div class="container mx-auto px-4 py-8 max-w-4xl">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold">{{ t("storage.title") }}</h1>
        <p class="text-muted-foreground mt-1">
          {{ t("storage.description") }}
        </p>
      </div>

      <!-- Quota Card -->
      <Card class="mb-6">
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <HardDrive class="h-5 w-5" />
            {{ t("storage.quota.title") }}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <StorageQuotaDisplay :quota="store.quota" :loading="store.loading" />
        </CardContent>
      </Card>

      <!-- Setup Guide -->
      <Card class="mb-6">
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <Cloud class="h-5 w-5" />
            {{ t("storage.setup.title") }}
          </CardTitle>
          <CardDescription>
            {{ t("storage.setup.description") }}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <StorageSetupGuide />
        </CardContent>
      </Card>

      <!-- Storage Tiers -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <Sparkles class="h-5 w-5" />
            {{ t("storage.tiers.title") }}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <StorageTierSelector
            :tiers="store.tiers"
            :current-tier-slug="store.quota?.tierSlug"
            :loading="!store.hasFetched"
          />
        </CardContent>
      </Card>
    </div>
  </div>
</template>

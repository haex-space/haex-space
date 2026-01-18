<script setup lang="ts">
import { Copy, Check, Eye, EyeOff, RefreshCw } from "lucide-vue-next";
import { useClipboard } from "@vueuse/core";
import type { StorageConfig } from "@haex-space/vault-sdk";

const { t } = useI18n();

const { copy, copied } = useClipboard({ copiedDuring: 1500 });

// Fetch credentials from API
const {
  data: credentials,
  status,
  refresh,
} = await useFetch<StorageConfig>("/api/storage/credentials", {
  lazy: true,
});

const showSecretKey = ref(false);
const isRefreshing = ref(false);

// Masked secret key display
const maskedSecretKey = computed(() => {
  if (!credentials.value?.secretAccessKey) return "••••••••••••••••";
  if (showSecretKey.value) return credentials.value.secretAccessKey;
  return (
    credentials.value.secretAccessKey.slice(0, 8) +
    "••••••••" +
    credentials.value.secretAccessKey.slice(-4)
  );
});

const fullConfigJson = computed(() => {
  if (!credentials.value) return "";
  return JSON.stringify(
    {
      type: "s3",
      name: "haex Cloud Storage",
      config: {
        endpoint: credentials.value.endpoint,
        region: credentials.value.region,
        bucket: credentials.value.bucket,
        accessKeyId: credentials.value.accessKeyId,
        secretAccessKey: credentials.value.secretAccessKey,
        pathStyle: true,
      },
    },
    null,
    2
  );
});

async function handleRefresh() {
  isRefreshing.value = true;
  try {
    await refresh();
  } finally {
    isRefreshing.value = false;
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Steps -->
    <ol class="space-y-4 text-sm">
      <li class="flex gap-3">
        <span
          class="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium shrink-0"
        >
          1
        </span>
        <span class="text-muted-foreground pt-0.5">
          {{ t("storage.setup.step1") }}
        </span>
      </li>
      <li class="flex gap-3">
        <span
          class="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium shrink-0"
        >
          2
        </span>
        <span class="text-muted-foreground pt-0.5">
          {{ t("storage.setup.step2") }}
        </span>
      </li>
    </ol>

    <!-- Loading state -->
    <div v-if="status === 'pending'" class="flex items-center justify-center py-8">
      <RefreshCw class="h-5 w-5 animate-spin text-muted-foreground" />
    </div>

    <!-- Error state -->
    <div
      v-else-if="status === 'error'"
      class="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive"
    >
      {{ t("storage.setup.error") }}
    </div>

    <!-- Configuration details -->
    <div v-else-if="credentials" class="rounded-lg border bg-muted/50 p-4 space-y-3">
      <div class="grid gap-3 text-sm">
        <!-- Endpoint -->
        <div class="flex justify-between items-center gap-2">
          <span class="text-muted-foreground shrink-0">{{
            t("storage.setup.endpoint")
          }}</span>
          <div class="flex items-center gap-1">
            <code
              class="font-mono text-xs bg-background px-2 py-1 rounded break-all"
            >
              {{ credentials.endpoint }}
            </code>
            <Button
              variant="ghost"
              size="sm"
              class="h-7 w-7 p-0 shrink-0"
              @click="copy(credentials.endpoint)"
            >
              <Copy class="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        <!-- Bucket -->
        <div class="flex justify-between items-center gap-2">
          <span class="text-muted-foreground shrink-0">{{
            t("storage.setup.bucket")
          }}</span>
          <div class="flex items-center gap-1">
            <code
              class="font-mono text-xs bg-background px-2 py-1 rounded break-all"
            >
              {{ credentials.bucket }}
            </code>
            <Button
              variant="ghost"
              size="sm"
              class="h-7 w-7 p-0 shrink-0"
              @click="copy(credentials.bucket)"
            >
              <Copy class="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        <!-- Access Key -->
        <div class="flex justify-between items-center gap-2">
          <span class="text-muted-foreground shrink-0">{{
            t("storage.setup.accessKey")
          }}</span>
          <div class="flex items-center gap-1">
            <code class="font-mono text-xs bg-background px-2 py-1 rounded">
              {{ credentials.accessKeyId }}
            </code>
            <Button
              variant="ghost"
              size="sm"
              class="h-7 w-7 p-0 shrink-0"
              @click="copy(credentials.accessKeyId)"
            >
              <Copy class="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        <!-- Secret Key -->
        <div class="flex justify-between items-center gap-2">
          <span class="text-muted-foreground shrink-0">{{
            t("storage.setup.secretKey")
          }}</span>
          <div class="flex items-center gap-1">
            <code
              class="font-mono text-xs bg-background px-2 py-1 rounded break-all max-w-[200px] truncate"
            >
              {{ maskedSecretKey }}
            </code>
            <Button
              variant="ghost"
              size="sm"
              class="h-7 w-7 p-0 shrink-0"
              @click="showSecretKey = !showSecretKey"
            >
              <component
                :is="showSecretKey ? EyeOff : Eye"
                class="h-3.5 w-3.5"
              />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              class="h-7 w-7 p-0 shrink-0"
              @click="copy(credentials.secretAccessKey)"
            >
              <Copy class="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        <!-- Path Style -->
        <div class="flex justify-between items-center gap-2">
          <span class="text-muted-foreground shrink-0">{{
            t("storage.setup.pathStyle")
          }}</span>
          <code class="font-mono text-xs bg-background px-2 py-1 rounded">
            {{ t("storage.setup.pathStyleValue") }}
          </code>
        </div>
      </div>

      <!-- Info about credentials -->
      <p class="text-xs text-muted-foreground">
        {{ t("storage.setup.credentialsHint") }}
      </p>

      <div class="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          class="flex-1"
          @click="copy(fullConfigJson)"
        >
          <component :is="copied ? Check : Copy" class="h-4 w-4 mr-2" />
          {{ copied ? t("storage.setup.copied") : t("storage.setup.copyConfig") }}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          :disabled="isRefreshing"
          @click="handleRefresh"
        >
          <RefreshCw
            class="h-4 w-4"
            :class="{ 'animate-spin': isRefreshing }"
          />
        </Button>
      </div>
    </div>
  </div>
</template>

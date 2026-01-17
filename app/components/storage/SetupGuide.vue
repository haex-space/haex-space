<script setup lang="ts">
import { Copy, Check, Eye, EyeOff } from "lucide-vue-next";
import { useClipboard } from "@vueuse/core";

const { t } = useI18n();

const supabase = useSupabaseClient();

const showSecretKey = ref(false);
const userId = ref<string | null>(null);
const sessionToken = ref<string | null>(null);

const { copy, copied } = useClipboard({ copiedDuring: 1500 });

// Fetch user and session token on mount
onMounted(async () => {
  const { data } = await supabase.auth.getSession();
  userId.value = data.session?.user?.id || null;
  sessionToken.value = data.session?.access_token || null;
});

const config = computed(() => ({
  endpoint: "https://supabase.haex.space/storage/v1/s3",
  region: "auto",
  bucket: "user-files",
  accessKeyId: userId.value || "",
  secretAccessKey: sessionToken.value || "",
}));

// Masked secret key display
const maskedSecretKey = computed(() => {
  if (!sessionToken.value) return "••••••••••••••••";
  if (showSecretKey.value) return sessionToken.value;
  return sessionToken.value.slice(0, 10) + "••••••••" + sessionToken.value.slice(-4);
});

const fullConfigJson = computed(() =>
  JSON.stringify(
    {
      type: "s3",
      name: "haex Cloud Storage",
      config: {
        endpoint: config.value.endpoint,
        region: config.value.region,
        bucket: config.value.bucket,
        accessKeyId: config.value.accessKeyId,
        secretAccessKey: config.value.secretAccessKey,
        pathStyle: true,
      },
    },
    null,
    2
  )
);
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

    <!-- Configuration details -->
    <div class="rounded-lg border bg-muted/50 p-4 space-y-3">
      <div class="grid gap-3 text-sm">
        <!-- Endpoint -->
        <div class="flex justify-between items-center gap-2">
          <span class="text-muted-foreground shrink-0">{{ t("storage.setup.endpoint") }}</span>
          <div class="flex items-center gap-1">
            <code class="font-mono text-xs bg-background px-2 py-1 rounded break-all">
              {{ config.endpoint }}
            </code>
            <Button
              variant="ghost"
              size="sm"
              class="h-7 w-7 p-0 shrink-0"
              @click="copy(config.endpoint)"
            >
              <Copy class="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        <!-- Bucket -->
        <div class="flex justify-between items-center gap-2">
          <span class="text-muted-foreground shrink-0">{{ t("storage.setup.bucket") }}</span>
          <div class="flex items-center gap-1">
            <code class="font-mono text-xs bg-background px-2 py-1 rounded">
              {{ config.bucket }}
            </code>
            <Button
              variant="ghost"
              size="sm"
              class="h-7 w-7 p-0 shrink-0"
              @click="copy(config.bucket)"
            >
              <Copy class="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        <!-- Access Key -->
        <div class="flex justify-between items-center gap-2">
          <span class="text-muted-foreground shrink-0">{{ t("storage.setup.accessKey") }}</span>
          <div class="flex items-center gap-1">
            <code class="font-mono text-xs bg-background px-2 py-1 rounded truncate max-w-[200px]">
              {{ config.accessKeyId }}
            </code>
            <Button
              variant="ghost"
              size="sm"
              class="h-7 w-7 p-0 shrink-0"
              @click="copy(config.accessKeyId)"
            >
              <Copy class="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        <!-- Secret Key -->
        <div class="flex justify-between items-center gap-2">
          <span class="text-muted-foreground shrink-0">{{ t("storage.setup.secretKey") }}</span>
          <div class="flex items-center gap-1">
            <code class="font-mono text-xs bg-background px-2 py-1 rounded truncate max-w-[160px]">
              {{ maskedSecretKey }}
            </code>
            <Button
              variant="ghost"
              size="sm"
              class="h-7 w-7 p-0 shrink-0"
              @click="showSecretKey = !showSecretKey"
            >
              <component :is="showSecretKey ? EyeOff : Eye" class="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              class="h-7 w-7 p-0 shrink-0"
              @click="copy(config.secretAccessKey)"
            >
              <Copy class="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      <Button
        variant="outline"
        size="sm"
        class="w-full"
        @click="copy(fullConfigJson)"
      >
        <component :is="copied ? Check : Copy" class="h-4 w-4 mr-2" />
        {{ copied ? t("storage.setup.copied") : t("storage.setup.copyConfig") }}
      </Button>
    </div>
  </div>
</template>

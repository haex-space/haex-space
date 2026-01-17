<script setup lang="ts">
import { Copy, Check, ExternalLink } from "lucide-vue-next";

const { t } = useI18n();

const supabaseUser = useSupabaseUser();
const supabase = useSupabaseClient();

const copied = ref(false);

const config = computed(() => ({
  endpoint: "https://supabase.haex.space/storage/v1/s3",
  region: "auto",
  bucket: "user-files",
  accessKeyId: supabaseUser.value?.id || "<your-user-id>",
}));

async function copyConfig() {
  const session = await supabase.auth.getSession();
  const configText = JSON.stringify(
    {
      type: "s3",
      name: "haex Cloud Storage",
      config: {
        endpoint: config.value.endpoint,
        region: config.value.region,
        bucket: config.value.bucket,
        accessKeyId: config.value.accessKeyId,
        secretAccessKey: session.data.session?.access_token || "<your-session-token>",
        pathStyle: true,
      },
    },
    null,
    2
  );

  await navigator.clipboard.writeText(configText);
  copied.value = true;
  setTimeout(() => {
    copied.value = false;
  }, 2000);
}
</script>

<template>
  <div class="space-y-6">
    <!-- Steps -->
    <ol class="space-y-4 text-sm">
      <li class="flex gap-3">
        <span
          class="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium flex-shrink-0"
        >
          1
        </span>
        <span class="text-muted-foreground pt-0.5">
          {{ t("storage.setup.step1") }}
        </span>
      </li>
      <li class="flex gap-3">
        <span
          class="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium flex-shrink-0"
        >
          2
        </span>
        <span class="text-muted-foreground pt-0.5">
          {{ t("storage.setup.step2") }}
        </span>
      </li>
      <li class="flex gap-3">
        <span
          class="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium flex-shrink-0"
        >
          3
        </span>
        <span class="text-muted-foreground pt-0.5">
          {{ t("storage.setup.step3") }}
        </span>
      </li>
    </ol>

    <!-- Configuration details -->
    <div class="rounded-lg border bg-muted/50 p-4 space-y-3">
      <div class="grid gap-2 text-sm">
        <div class="flex justify-between">
          <span class="text-muted-foreground">{{ t("storage.setup.endpoint") }}</span>
          <code class="font-mono text-xs bg-background px-2 py-0.5 rounded">
            {{ config.endpoint }}
          </code>
        </div>
        <div class="flex justify-between">
          <span class="text-muted-foreground">{{ t("storage.setup.bucket") }}</span>
          <code class="font-mono text-xs bg-background px-2 py-0.5 rounded">
            {{ config.bucket }}
          </code>
        </div>
        <div class="flex justify-between">
          <span class="text-muted-foreground">{{ t("storage.setup.accessKey") }}</span>
          <code class="font-mono text-xs bg-background px-2 py-0.5 rounded truncate max-w-[200px]">
            {{ config.accessKeyId }}
          </code>
        </div>
        <div class="flex justify-between">
          <span class="text-muted-foreground">{{ t("storage.setup.secretKey") }}</span>
          <code class="font-mono text-xs bg-background px-2 py-0.5 rounded">
            &lt;session-token&gt;
          </code>
        </div>
      </div>

      <Button
        variant="outline"
        size="sm"
        class="w-full"
        @click="copyConfig"
      >
        <component :is="copied ? Check : Copy" class="h-4 w-4 mr-2" />
        {{ copied ? "Copied!" : t("storage.setup.copyConfig") }}
      </Button>
    </div>

    <!-- Download link -->
    <div class="text-center">
      <NuxtLink
        to="/download"
        class="inline-flex items-center gap-1 text-sm text-primary hover:underline"
      >
        {{ t("storage.setup.downloadVault") }}
        <ExternalLink class="h-3 w-3" />
      </NuxtLink>
    </div>
  </div>
</template>

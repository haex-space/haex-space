<script setup lang="ts">
import { Loader2, RefreshCw, Store } from "lucide-vue-next";
import { useMarketplaceStore } from "~/stores/marketplace";
import { useVaultSyncStore } from "~/stores/vaultSync";

definePageMeta({
  layout: "auth",
});

const { t } = useI18n();
const route = useRoute();
const localePath = useLocalePath();
const marketplaceStore = useMarketplaceStore();
const vaultSyncStore = useVaultSyncStore();

useSeoMeta({
  title: "Login - haex.space",
  description: "Sign in to your haex.space account.",
});

// Tab state - default to sync, update on client if query param is set
const activeTab = ref("sync");

onMounted(() => {
  if (route.query.tab === "marketplace") {
    activeTab.value = "marketplace";
  }
});

// Sync form state
const sync = reactive({
  email: "",
  password: "",
  loading: false,
  error: "",
});

// Marketplace form state
const marketplace = reactive({
  email: "",
  password: "",
  loading: false,
  error: "",
});

// Turnstile captcha
const turnstileToken = ref<string>("");
const turnstileRef = ref();

const supabase = useSupabaseClient();

async function handleSyncLogin() {
  if (!turnstileToken.value) {
    sync.error = t("auth.login.errors.captchaRequired");
    return;
  }

  sync.loading = true;
  sync.error = "";

  // Capture token before reset
  const captchaToken = turnstileToken.value;

  try {
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: sync.email,
      password: sync.password,
      options: {
        captchaToken,
      },
    });

    if (signInError) {
      throw signInError;
    }

    // Store password for vault name decryption
    vaultSyncStore.setServerPassword(sync.password);

    await navigateTo(localePath("/dashboard"));
  } catch (e: any) {
    sync.error = e.message || t("auth.login.errors.failed");
    turnstileToken.value = "";
    turnstileRef.value?.reset();
  } finally {
    sync.loading = false;
  }
}

async function handleMarketplaceLogin() {
  if (!turnstileToken.value) {
    marketplace.error = t("auth.login.errors.captchaRequired");
    return;
  }

  marketplace.loading = true;
  marketplace.error = "";

  try {
    await marketplaceStore.signIn(
      marketplace.email,
      marketplace.password,
      turnstileToken.value
    );
    await navigateTo(localePath("/developer"));
  } catch (e: any) {
    marketplace.error = e.message || t("auth.login.errors.failed");
    turnstileRef.value?.reset();
  } finally {
    marketplace.loading = false;
  }
}
</script>

<template>
  <Card class="w-full max-w-md">
    <CardHeader class="text-center">
      <CardTitle class="text-2xl">{{ t("auth.login.title") }}</CardTitle>
      <CardDescription>
        {{ t("auth.login.subtitle") }}
      </CardDescription>
    </CardHeader>

    <CardContent>
      <Tabs v-model="activeTab" class="w-full">
          <TabsList class="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="sync" class="flex items-center gap-2">
              <RefreshCw class="h-4 w-4" />
              {{ t("auth.login.tabs.sync") }}
            </TabsTrigger>
            <TabsTrigger value="marketplace" class="flex items-center gap-2">
              <Store class="h-4 w-4" />
              {{ t("auth.login.tabs.marketplace") }}
            </TabsTrigger>
          </TabsList>

          <!-- Vault Sync Tab -->
          <TabsContent value="sync">
          <p class="text-sm text-muted-foreground mb-4">
            {{ t("auth.login.syncDescription") }}
          </p>
          <form @submit.prevent="handleSyncLogin" class="space-y-4">
            <div class="space-y-2">
              <Label for="sync-email">{{ t("auth.login.email") }}</Label>
              <Input
                id="sync-email"
                v-model="sync.email"
                type="email"
                :placeholder="t('auth.login.emailPlaceholder')"
                required
                :disabled="sync.loading"
              />
            </div>
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <Label for="sync-password">{{ t("auth.login.password") }}</Label>
                <NuxtLinkLocale
                  to="/auth/forgot-password"
                  class="text-xs text-muted-foreground hover:text-primary hover:underline"
                >
                  {{ t("auth.login.forgotPassword") }}
                </NuxtLinkLocale>
              </div>
              <Input
                id="sync-password"
                v-model="sync.password"
                type="password"
                :placeholder="t('auth.login.passwordPlaceholder')"
                required
                :disabled="sync.loading"
              />
            </div>

            <p v-if="sync.error" class="text-sm text-destructive">
              {{ sync.error }}
            </p>

            <Button
              type="submit"
              class="w-full"
              :disabled="sync.loading || !turnstileToken"
            >
              <Loader2 v-if="sync.loading" class="w-4 h-4 mr-2 animate-spin" />
              {{ t("auth.login.submit") }}
            </Button>
          </form>

          <div class="mt-6 text-center text-sm text-muted-foreground">
            {{ t("auth.login.noAccount") }}
            <NuxtLinkLocale
              to="/auth/register"
              class="text-primary hover:underline"
            >
              {{ t("auth.login.signUp") }}
            </NuxtLinkLocale>
          </div>
        </TabsContent>

        <!-- Marketplace Tab -->
        <TabsContent value="marketplace">
          <p class="text-sm text-muted-foreground mb-4">
            {{ t("auth.login.marketplaceDescription") }}
          </p>
          <form @submit.prevent="handleMarketplaceLogin" class="space-y-4">
            <div class="space-y-2">
              <Label for="marketplace-email">{{ t("auth.login.email") }}</Label>
              <Input
                id="marketplace-email"
                v-model="marketplace.email"
                type="email"
                :placeholder="t('auth.login.emailPlaceholder')"
                required
                :disabled="marketplace.loading"
              />
            </div>
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <Label for="marketplace-password">{{
                  t("auth.login.password")
                }}</Label>
                <NuxtLinkLocale
                  to="/auth/forgot-password"
                  class="text-xs text-muted-foreground hover:text-primary hover:underline"
                >
                  {{ t("auth.login.forgotPassword") }}
                </NuxtLinkLocale>
              </div>
              <Input
                id="marketplace-password"
                v-model="marketplace.password"
                type="password"
                :placeholder="t('auth.login.passwordPlaceholder')"
                required
                :disabled="marketplace.loading"
              />
            </div>

            <p v-if="marketplace.error" class="text-sm text-destructive">
              {{ marketplace.error }}
            </p>

            <Button
              type="submit"
              class="w-full"
              :disabled="marketplace.loading || !turnstileToken"
            >
              <Loader2
                v-if="marketplace.loading"
                class="w-4 h-4 mr-2 animate-spin"
              />
              {{ t("auth.login.submit") }}
            </Button>
          </form>

          <div class="mt-6 text-center text-sm text-muted-foreground">
            {{ t("auth.login.noAccount") }}
            <NuxtLinkLocale
              to="/auth/register?tab=marketplace"
              class="text-primary hover:underline"
            >
              {{ t("auth.login.signUp") }}
            </NuxtLinkLocale>
          </div>
          </TabsContent>
        </Tabs>

        <!-- Single Turnstile widget shared by both forms -->
      <ClientOnly>
        <div class="mt-4 flex justify-center">
          <NuxtTurnstile
            ref="turnstileRef"
            v-model="turnstileToken"
          />
        </div>
      </ClientOnly>
    </CardContent>
  </Card>
</template>

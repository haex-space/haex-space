<script setup lang="ts">
import { Loader2, CheckCircle, XCircle } from "lucide-vue-next";
import { useMarketplaceStore } from "~/stores/marketplace";

definePageMeta({
  layout: "auth",
});

const { t } = useI18n();
const marketplaceStore = useMarketplaceStore();

useSeoMeta({
  title: t("auth.resetPassword.title") + " - haex.space",
  description: t("auth.resetPassword.subtitle"),
});

const password = ref("");
const confirmPassword = ref("");
const loading = ref(false);
const error = ref("");
const success = ref(false);
const initializing = ref(true);
const hasSessionError = ref(false);

onMounted(async () => {
  await marketplaceStore.init();
  const supabase = marketplaceStore.client;

  if (!supabase) {
    hasSessionError.value = true;
    error.value = t("auth.resetPassword.errors.noSession");
    initializing.value = false;
    return;
  }

  // Supabase sends recovery tokens in the URL hash
  // Format: #access_token=...&refresh_token=...&type=recovery
  const hash = window.location.hash;
  if (hash && hash.includes("type=recovery")) {
    const params = new URLSearchParams(hash.substring(1));
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");

    if (accessToken && refreshToken) {
      try {
        const { error: setSessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (setSessionError) {
          throw setSessionError;
        }
      } catch (e: any) {
        hasSessionError.value = true;
        error.value = e.message || t("auth.resetPassword.errors.invalidToken");
      }
    }
  }

  const { data: { session } } = await supabase.auth.getSession();
  if (!session && !hasSessionError.value) {
    hasSessionError.value = true;
    error.value = t("auth.resetPassword.errors.noSession");
  }

  initializing.value = false;
});

const passwordsMatch = computed(() => password.value === confirmPassword.value);
const passwordValid = computed(() => password.value.length >= 8);

async function handleSubmit() {
  if (!passwordsMatch.value) {
    error.value = t("auth.resetPassword.errors.passwordMismatch");
    return;
  }
  if (!passwordValid.value) {
    error.value = t("auth.resetPassword.errors.passwordTooShort");
    return;
  }

  loading.value = true;
  error.value = "";

  try {
    const supabase = marketplaceStore.client;
    if (!supabase) {
      throw new Error(t("auth.resetPassword.errors.failed"));
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: password.value,
    });

    if (updateError) {
      throw updateError;
    }

    success.value = true;
    await supabase.auth.signOut();
  } catch (e: any) {
    error.value = e.message || t("auth.resetPassword.errors.failed");
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <Card class="w-full max-w-md">
    <CardHeader class="text-center">
      <CardTitle class="text-2xl">{{ t("auth.resetPassword.title") }}</CardTitle>
      <CardDescription>
        {{ t("auth.resetPassword.subtitle") }}
      </CardDescription>
    </CardHeader>

    <CardContent>
      <div v-if="initializing" class="flex justify-center py-8">
        <Loader2 class="w-8 h-8 animate-spin text-primary" />
      </div>

      <div v-else-if="hasSessionError" class="text-center space-y-4">
        <div class="mx-auto w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
          <XCircle class="w-6 h-6 text-destructive" />
        </div>
        <p class="text-sm text-muted-foreground">
          {{ error || t("auth.resetPassword.errors.invalidToken") }}
        </p>
        <NuxtLinkLocale to="/auth/forgot-password">
          <Button variant="outline" class="w-full">
            {{ t("auth.resetPassword.requestNewLink") }}
          </Button>
        </NuxtLinkLocale>
      </div>

      <div v-else-if="success" class="text-center space-y-4">
        <div class="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <CheckCircle class="w-6 h-6 text-primary" />
        </div>
        <p class="text-sm text-muted-foreground">
          {{ t("auth.resetPassword.successMessage") }}
        </p>
        <NuxtLinkLocale to="/auth/login">
          <Button class="w-full">
            {{ t("auth.resetPassword.goToLogin") }}
          </Button>
        </NuxtLinkLocale>
      </div>

      <form v-else class="space-y-4" @submit.prevent="handleSubmit">
        <div class="space-y-2">
          <Label for="password">{{ t("auth.resetPassword.password") }}</Label>
          <Input
            id="password"
            v-model="password"
            type="password"
            :placeholder="t('auth.resetPassword.passwordPlaceholder')"
            required
            :disabled="loading"
          />
          <p v-if="password && !passwordValid" class="text-xs text-muted-foreground">
            {{ t("auth.resetPassword.passwordHint") }}
          </p>
        </div>

        <div class="space-y-2">
          <Label for="confirm-password">{{ t("auth.resetPassword.confirmPassword") }}</Label>
          <Input
            id="confirm-password"
            v-model="confirmPassword"
            type="password"
            :placeholder="t('auth.resetPassword.confirmPasswordPlaceholder')"
            required
            :disabled="loading"
          />
          <p v-if="confirmPassword && !passwordsMatch" class="text-xs text-destructive">
            {{ t("auth.resetPassword.errors.passwordMismatch") }}
          </p>
        </div>

        <p v-if="error" class="text-sm text-destructive">
          {{ error }}
        </p>

        <Button
          type="submit"
          class="w-full"
          :disabled="loading || !passwordValid || !passwordsMatch"
        >
          <Loader2 v-if="loading" class="w-4 h-4 mr-2 animate-spin" />
          {{ t("auth.resetPassword.submit") }}
        </Button>
      </form>
    </CardContent>
  </Card>
</template>

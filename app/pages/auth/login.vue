<script setup lang="ts">
import { Loader2 } from "lucide-vue-next";
import { useMarketplaceStore } from "~/stores/marketplace";

definePageMeta({
  layout: "auth",
});

const { t } = useI18n();
const localePath = useLocalePath();
const marketplaceStore = useMarketplaceStore();

useSeoMeta({
  title: "Login - haex.space",
  description: "Sign in to your haex.space marketplace account.",
});

const form = reactive({
  email: "",
  password: "",
  loading: false,
  error: "",
});

const turnstileToken = ref<string>("");
const turnstileRef = ref();

async function handleLogin() {
  if (!turnstileToken.value) {
    form.error = t("auth.login.errors.captchaRequired");
    return;
  }

  form.loading = true;
  form.error = "";

  try {
    await marketplaceStore.signIn(form.email, form.password, turnstileToken.value);
    await navigateTo(localePath("/developer"));
  } catch (e: any) {
    form.error = e.message || t("auth.login.errors.failed");
    turnstileRef.value?.reset();
  } finally {
    form.loading = false;
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
      <p class="text-sm text-muted-foreground mb-4">
        {{ t("auth.login.marketplaceDescription") }}
      </p>
      <form class="space-y-4" @submit.prevent="handleLogin">
        <div class="space-y-2">
          <Label for="email">{{ t("auth.login.email") }}</Label>
          <Input
            id="email"
            v-model="form.email"
            type="email"
            :placeholder="t('auth.login.emailPlaceholder')"
            required
            :disabled="form.loading"
          />
        </div>
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <Label for="password">{{ t("auth.login.password") }}</Label>
            <NuxtLinkLocale
              to="/auth/forgot-password"
              class="text-xs text-muted-foreground hover:text-primary hover:underline"
            >
              {{ t("auth.login.forgotPassword") }}
            </NuxtLinkLocale>
          </div>
          <Input
            id="password"
            v-model="form.password"
            type="password"
            :placeholder="t('auth.login.passwordPlaceholder')"
            required
            :disabled="form.loading"
          />
        </div>

        <p v-if="form.error" class="text-sm text-destructive">
          {{ form.error }}
        </p>

        <Button
          type="submit"
          class="w-full"
          :disabled="form.loading || !turnstileToken"
        >
          <Loader2 v-if="form.loading" class="w-4 h-4 mr-2 animate-spin" />
          {{ t("auth.login.submit") }}
        </Button>
      </form>

      <div class="mt-6 text-center text-sm text-muted-foreground">
        {{ t("auth.login.noAccount") }}
        <NuxtLinkLocale to="/auth/register" class="text-primary hover:underline">
          {{ t("auth.login.signUp") }}
        </NuxtLinkLocale>
      </div>

      <ClientOnly>
        <div class="mt-4 flex justify-center">
          <NuxtTurnstile ref="turnstileRef" v-model="turnstileToken" />
        </div>
      </ClientOnly>
    </CardContent>
  </Card>
</template>

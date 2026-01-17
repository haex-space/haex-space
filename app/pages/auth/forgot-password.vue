<script setup lang="ts">
import { Loader2, ArrowLeft, Mail } from "lucide-vue-next";

definePageMeta({
  layout: "auth",
});

const { t } = useI18n();
const route = useRoute();

// Get tab from query param (sync or marketplace)
const tab = computed(() => route.query.tab as string || "sync");

useSeoMeta({
  title: t("auth.forgotPassword.title") + " - haex.space",
  description: t("auth.forgotPassword.subtitle"),
});

const email = ref("");
const loading = ref(false);
const error = ref("");
const success = ref(false);

const supabase = useSupabaseClient();

// Build the back to login link with tab param
const loginLink = computed(() => {
  return tab.value === "marketplace" ? "/auth/login?tab=marketplace" : "/auth/login";
});

async function handleSubmit() {
  loading.value = true;
  error.value = "";

  try {
    // Include tab in redirect URL so reset-password knows where to redirect after
    const redirectUrl = tab.value === "marketplace"
      ? `${window.location.origin}/auth/reset-password?tab=marketplace`
      : `${window.location.origin}/auth/reset-password`;

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email.value,
      {
        redirectTo: redirectUrl,
      }
    );

    if (resetError) {
      throw resetError;
    }

    success.value = true;
  } catch (e: any) {
    error.value = e.message || t("auth.forgotPassword.errors.failed");
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <Card class="w-full max-w-md">
    <CardHeader class="text-center">
      <CardTitle class="text-2xl">{{ t("auth.forgotPassword.title") }}</CardTitle>
      <CardDescription>
        {{ t("auth.forgotPassword.subtitle") }}
      </CardDescription>
    </CardHeader>

    <CardContent>
      <!-- Success State -->
      <div v-if="success" class="text-center space-y-4">
        <div class="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <Mail class="w-6 h-6 text-primary" />
        </div>
        <p class="text-sm text-muted-foreground">
          {{ t("auth.forgotPassword.successMessage") }}
        </p>
        <NuxtLinkLocale :to="loginLink">
          <Button variant="outline" class="w-full">
            <ArrowLeft class="w-4 h-4 mr-2" />
            {{ t("auth.forgotPassword.backToLogin") }}
          </Button>
        </NuxtLinkLocale>
      </div>

      <!-- Form State -->
      <form v-else @submit.prevent="handleSubmit" class="space-y-4">
        <div class="space-y-2">
          <Label for="email">{{ t("auth.forgotPassword.email") }}</Label>
          <Input
            id="email"
            v-model="email"
            type="email"
            :placeholder="t('auth.forgotPassword.emailPlaceholder')"
            required
            :disabled="loading"
          />
        </div>

        <p v-if="error" class="text-sm text-destructive">
          {{ error }}
        </p>

        <Button type="submit" class="w-full" :disabled="loading">
          <Loader2 v-if="loading" class="w-4 h-4 mr-2 animate-spin" />
          {{ t("auth.forgotPassword.submit") }}
        </Button>

        <div class="text-center text-sm text-muted-foreground">
          <NuxtLinkLocale :to="loginLink" class="text-primary hover:underline">
            <ArrowLeft class="w-3 h-3 inline mr-1" />
            {{ t("auth.forgotPassword.backToLogin") }}
          </NuxtLinkLocale>
        </div>
      </form>
    </CardContent>
  </Card>
</template>

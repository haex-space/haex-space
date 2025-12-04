<script setup lang="ts">
import { Loader2 } from 'lucide-vue-next'
import { useMarketplaceStore } from '~/stores/marketplace'

definePageMeta({
  layout: 'auth',
})

const { t } = useI18n()
const localePath = useLocalePath()
const store = useMarketplaceStore()

useSeoMeta({
  title: 'Developer Login - haex.space',
  description: 'Sign in to your developer account to publish extensions.',
})

const email = ref('')
const password = ref('')
const isLoading = ref(false)
const error = ref('')

// Redirect if already logged in
watch(() => store.isAuthenticated, (isAuth) => {
  if (isAuth) {
    navigateTo(localePath('/developer'))
  }
}, { immediate: true })

async function handleLogin() {
  isLoading.value = true
  error.value = ''

  try {
    await store.signIn(email.value, password.value)
    await navigateTo(localePath('/developer'))
  } catch (e: any) {
    error.value = e.message || t('developer.auth.login.errors.failed')
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <Card class="w-full max-w-md">
    <CardHeader class="text-center">
      <CardTitle class="text-2xl">{{ t('developer.auth.login.title') }}</CardTitle>
      <CardDescription>
        {{ t('developer.auth.login.subtitle') }}
      </CardDescription>
    </CardHeader>
    <CardContent>
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div class="space-y-2">
          <Label for="email">{{ t('developer.auth.login.email') }}</Label>
          <Input
            id="email"
            v-model="email"
            type="email"
            :placeholder="t('developer.auth.login.emailPlaceholder')"
            required
            :disabled="isLoading"
          />
        </div>
        <div class="space-y-2">
          <Label for="password">{{ t('developer.auth.login.password') }}</Label>
          <Input
            id="password"
            v-model="password"
            type="password"
            :placeholder="t('developer.auth.login.passwordPlaceholder')"
            required
            :disabled="isLoading"
          />
        </div>

        <p v-if="error" class="text-sm text-destructive">
          {{ error }}
        </p>

        <Button type="submit" class="w-full" :disabled="isLoading">
          <Loader2 v-if="isLoading" class="w-4 h-4 mr-2 animate-spin" />
          {{ t('developer.auth.login.submit') }}
        </Button>
      </form>

      <div class="mt-6 text-center text-sm text-muted-foreground">
        {{ t('developer.auth.login.noAccount') }}
        <NuxtLinkLocale to="/developer/auth/register" class="text-primary hover:underline">
          {{ t('developer.auth.login.signUp') }}
        </NuxtLinkLocale>
      </div>
    </CardContent>
  </Card>
</template>

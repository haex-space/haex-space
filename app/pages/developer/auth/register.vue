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
  title: 'Create Developer Account - haex.space',
  description: 'Create a developer account to publish extensions on the haex marketplace.',
})

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const isLoading = ref(false)
const error = ref('')

onMounted(() => {
  store.init()
})

// Redirect if already logged in
watch(() => store.isAuthenticated, (isAuth) => {
  if (isAuth) {
    navigateTo(localePath('/developer'))
  }
}, { immediate: true })

async function handleRegister() {
  isLoading.value = true
  error.value = ''

  if (password.value !== confirmPassword.value) {
    error.value = t('developer.auth.register.errors.passwordMismatch')
    isLoading.value = false
    return
  }

  if (password.value.length < 8) {
    error.value = t('developer.auth.register.errors.passwordTooShort')
    isLoading.value = false
    return
  }

  try {
    await store.signUp(email.value, password.value)
    await navigateTo(localePath('/developer/auth/check-email'))
  } catch (e: any) {
    error.value = e.message || t('developer.auth.register.errors.failed')
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <Card class="w-full max-w-md">
    <CardHeader class="text-center">
      <CardTitle class="text-2xl">{{ t('developer.auth.register.title') }}</CardTitle>
      <CardDescription>
        {{ t('developer.auth.register.subtitle') }}
      </CardDescription>
    </CardHeader>
    <CardContent>
      <form @submit.prevent="handleRegister" class="space-y-4">
        <div class="space-y-2">
          <Label for="email">{{ t('developer.auth.register.email') }}</Label>
          <Input
            id="email"
            v-model="email"
            type="email"
            :placeholder="t('developer.auth.register.emailPlaceholder')"
            required
            :disabled="isLoading"
          />
        </div>
        <div class="space-y-2">
          <Label for="password">{{ t('developer.auth.register.password') }}</Label>
          <Input
            id="password"
            v-model="password"
            type="password"
            :placeholder="t('developer.auth.register.passwordPlaceholder')"
            required
            :disabled="isLoading"
          />
        </div>
        <div class="space-y-2">
          <Label for="confirmPassword">{{ t('developer.auth.register.confirmPassword') }}</Label>
          <Input
            id="confirmPassword"
            v-model="confirmPassword"
            type="password"
            :placeholder="t('developer.auth.register.confirmPasswordPlaceholder')"
            required
            :disabled="isLoading"
          />
        </div>

        <p v-if="error" class="text-sm text-destructive">
          {{ error }}
        </p>

        <Button type="submit" class="w-full" :disabled="isLoading">
          <Loader2 v-if="isLoading" class="w-4 h-4 mr-2 animate-spin" />
          {{ t('developer.auth.register.submit') }}
        </Button>
      </form>

      <div class="mt-6 text-center text-sm text-muted-foreground">
        {{ t('developer.auth.register.hasAccount') }}
        <NuxtLinkLocale to="/developer/auth/login" class="text-primary hover:underline">
          {{ t('developer.auth.register.signIn') }}
        </NuxtLinkLocale>
      </div>
    </CardContent>
  </Card>
</template>

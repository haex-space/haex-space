<script setup lang="ts">
import { Loader2, Eye, EyeOff } from 'lucide-vue-next'
import { useMarketplaceStore } from '~/stores/marketplace'

definePageMeta({
  layout: 'auth',
})

const { t } = useI18n()
const localePath = useLocalePath()
const marketplaceStore = useMarketplaceStore()

useSeoMeta({
  title: 'Create Account - haex.space',
  description: 'Create your haex.space marketplace account to publish extensions.',
})

const form = reactive({
  email: '',
  password: '',
  confirmPassword: '',
  loading: false,
  error: '',
  showPassword: false,
  showConfirmPassword: false,
})

const turnstileToken = ref<string>('')
const turnstileRef = ref()

async function handleRegister() {
  if (!turnstileToken.value) {
    form.error = t('auth.register.errors.captchaRequired')
    return
  }

  if (form.password !== form.confirmPassword) {
    form.error = t('auth.register.errors.passwordMismatch')
    return
  }

  if (form.password.length < 8) {
    form.error = t('auth.register.errors.passwordTooShort')
    return
  }

  form.loading = true
  form.error = ''

  try {
    await marketplaceStore.signUp(form.email, form.password, turnstileToken.value)
    await navigateTo(localePath('/auth/check-email'))
  } catch (e: any) {
    form.error = e.message || t('auth.register.errors.failed')
    turnstileRef.value?.reset()
  } finally {
    form.loading = false
  }
}
</script>

<template>
  <Card class="w-full max-w-md">
    <CardHeader class="text-center">
      <CardTitle class="text-2xl">{{ t('auth.register.title') }}</CardTitle>
      <CardDescription>
        {{ t('auth.register.subtitle') }}
      </CardDescription>
    </CardHeader>
    <CardContent>
      <p class="text-sm text-muted-foreground mb-4">
        {{ t('auth.register.marketplaceDescription') }}
      </p>
      <form class="space-y-4" @submit.prevent="handleRegister">
        <div class="space-y-2">
          <Label for="email">{{ t('auth.register.email') }}</Label>
          <Input
            id="email"
            v-model="form.email"
            type="email"
            :placeholder="t('auth.register.emailPlaceholder')"
            required
            :disabled="form.loading"
          />
        </div>
        <div class="space-y-2">
          <Label for="password">{{ t('auth.register.password') }}</Label>
          <div class="relative">
            <Input
              id="password"
              v-model="form.password"
              :type="form.showPassword ? 'text' : 'password'"
              :placeholder="t('auth.register.passwordPlaceholder')"
              required
              :disabled="form.loading"
              class="pr-10"
            />
            <button
              type="button"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              @click="form.showPassword = !form.showPassword"
            >
              <Eye v-if="!form.showPassword" class="w-4 h-4" />
              <EyeOff v-else class="w-4 h-4" />
            </button>
          </div>
        </div>
        <div class="space-y-2">
          <Label for="confirmPassword">{{ t('auth.register.confirmPassword') }}</Label>
          <div class="relative">
            <Input
              id="confirmPassword"
              v-model="form.confirmPassword"
              :type="form.showConfirmPassword ? 'text' : 'password'"
              :placeholder="t('auth.register.confirmPasswordPlaceholder')"
              required
              :disabled="form.loading"
              class="pr-10"
            />
            <button
              type="button"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              @click="form.showConfirmPassword = !form.showConfirmPassword"
            >
              <Eye v-if="!form.showConfirmPassword" class="w-4 h-4" />
              <EyeOff v-else class="w-4 h-4" />
            </button>
          </div>
        </div>

        <p v-if="form.error" class="text-sm text-destructive">
          {{ form.error }}
        </p>

        <Button type="submit" class="w-full" :disabled="form.loading || !turnstileToken">
          <Loader2 v-if="form.loading" class="w-4 h-4 mr-2 animate-spin" />
          {{ t('auth.register.submit') }}
        </Button>
      </form>

      <div class="mt-6 text-center text-sm text-muted-foreground">
        {{ t('auth.register.hasAccount') }}
        <NuxtLinkLocale to="/auth/login" class="text-primary hover:underline">
          {{ t('auth.register.signIn') }}
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

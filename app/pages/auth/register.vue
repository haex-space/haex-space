<script setup lang="ts">
import { Loader2, Eye, EyeOff } from 'lucide-vue-next'

definePageMeta({
  layout: 'auth',
})

const { t } = useI18n()

useSeoMeta({
  title: 'Create Account - haex.space',
  description: 'Create your haex.space account to start syncing securely.',
})

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const isLoading = ref(false)
const error = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)

const supabase = useSupabaseClient()

async function handleRegister() {
  if (password.value !== confirmPassword.value) {
    error.value = t('auth.register.errors.passwordMismatch')
    return
  }

  if (password.value.length < 8) {
    error.value = t('auth.register.errors.passwordTooShort')
    return
  }

  isLoading.value = true
  error.value = ''

  try {
    const { error: signUpError } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/confirm`,
      },
    })

    if (signUpError) {
      throw signUpError
    }

    await navigateTo('/auth/check-email')
  } catch (e: any) {
    error.value = e.message || t('auth.register.errors.failed')
  } finally {
    isLoading.value = false
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
          <form @submit.prevent="handleRegister" class="space-y-4">
            <div class="space-y-2">
              <Label for="email">{{ t('auth.register.email') }}</Label>
              <Input
                id="email"
                v-model="email"
                type="email"
                :placeholder="t('auth.register.emailPlaceholder')"
                required
                :disabled="isLoading"
              />
            </div>
            <div class="space-y-2">
              <Label for="password">{{ t('auth.register.password') }}</Label>
              <div class="relative">
                <Input
                  id="password"
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  :placeholder="t('auth.register.passwordPlaceholder')"
                  required
                  :disabled="isLoading"
                  class="pr-10"
                />
                <button
                  type="button"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  @click="showPassword = !showPassword"
                >
                  <Eye v-if="!showPassword" class="w-4 h-4" />
                  <EyeOff v-else class="w-4 h-4" />
                </button>
              </div>
            </div>
            <div class="space-y-2">
              <Label for="confirmPassword">{{ t('auth.register.confirmPassword') }}</Label>
              <div class="relative">
                <Input
                  id="confirmPassword"
                  v-model="confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  :placeholder="t('auth.register.confirmPasswordPlaceholder')"
                  required
                  :disabled="isLoading"
                  class="pr-10"
                />
                <button
                  type="button"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  @click="showConfirmPassword = !showConfirmPassword"
                >
                  <Eye v-if="!showConfirmPassword" class="w-4 h-4" />
                  <EyeOff v-else class="w-4 h-4" />
                </button>
              </div>
            </div>

            <p v-if="error" class="text-sm text-destructive">
              {{ error }}
            </p>

            <Button type="submit" class="w-full" :disabled="isLoading">
              <Loader2 v-if="isLoading" class="w-4 h-4 mr-2 animate-spin" />
              {{ t('auth.register.submit') }}
            </Button>
          </form>

          <div class="mt-6 text-center text-sm text-muted-foreground">
            {{ t('auth.register.hasAccount') }}
            <NuxtLink to="/auth/login" class="text-primary hover:underline">
              {{ t('auth.register.signIn') }}
            </NuxtLink>
          </div>
        </CardContent>
  </Card>
</template>

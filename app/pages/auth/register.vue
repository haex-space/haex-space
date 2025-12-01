<script setup lang="ts">
import { Loader2 } from 'lucide-vue-next'

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

async function handleRegister() {
  if (password.value !== confirmPassword.value) {
    error.value = t('auth.register.errors.passwordMismatch')
    return
  }

  isLoading.value = true
  error.value = ''

  try {
    // TODO: Implement Supabase Auth
    console.log('Register:', email.value, password.value)
    await navigateTo('/')
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
              <Input
                id="password"
                v-model="password"
                type="password"
                :placeholder="t('auth.register.passwordPlaceholder')"
                required
                :disabled="isLoading"
              />
            </div>
            <div class="space-y-2">
              <Label for="confirmPassword">{{ t('auth.register.confirmPassword') }}</Label>
              <Input
                id="confirmPassword"
                v-model="confirmPassword"
                type="password"
                :placeholder="t('auth.register.confirmPasswordPlaceholder')"
                required
                :disabled="isLoading"
              />
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

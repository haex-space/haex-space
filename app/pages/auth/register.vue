<script setup lang="ts">
import { Loader2 } from 'lucide-vue-next'

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
  <div class="min-h-screen flex flex-col">
    <!-- Simple Header -->
    <header class="border-b border-border">
      <nav class="container mx-auto px-4 h-16 flex items-center">
        <NuxtLink to="/" class="text-xl font-bold">
          haex.space
        </NuxtLink>
      </nav>
    </header>

    <!-- Registration Form -->
    <main class="flex-1 flex items-center justify-center p-4">
      <ShadcnCard class="w-full max-w-md">
        <ShadcnCardHeader class="text-center">
          <ShadcnCardTitle class="text-2xl">{{ t('auth.register.title') }}</ShadcnCardTitle>
          <ShadcnCardDescription>
            {{ t('auth.register.subtitle') }}
          </ShadcnCardDescription>
        </ShadcnCardHeader>
        <ShadcnCardContent>
          <form @submit.prevent="handleRegister" class="space-y-4">
            <div class="space-y-2">
              <ShadcnLabel for="email">{{ t('auth.register.email') }}</ShadcnLabel>
              <ShadcnInput
                id="email"
                v-model="email"
                type="email"
                :placeholder="t('auth.register.emailPlaceholder')"
                required
                :disabled="isLoading"
              />
            </div>
            <div class="space-y-2">
              <ShadcnLabel for="password">{{ t('auth.register.password') }}</ShadcnLabel>
              <UiInputPassword
                id="password"
                v-model="password"
                :placeholder="t('auth.register.passwordPlaceholder')"
                required
                :disabled="isLoading"
              />
            </div>
            <div class="space-y-2">
              <ShadcnLabel for="confirmPassword">{{ t('auth.register.confirmPassword') }}</ShadcnLabel>
              <UiInputPassword
                id="confirmPassword"
                v-model="confirmPassword"
                :placeholder="t('auth.register.confirmPasswordPlaceholder')"
                required
                :disabled="isLoading"
              />
            </div>

            <p v-if="error" class="text-sm text-destructive">
              {{ error }}
            </p>

            <ShadcnButton type="submit" class="w-full" :disabled="isLoading">
              <Loader2 v-if="isLoading" class="w-4 h-4 mr-2 animate-spin" />
              {{ t('auth.register.submit') }}
            </ShadcnButton>
          </form>

          <div class="mt-6 text-center text-sm text-muted-foreground">
            {{ t('auth.register.hasAccount') }}
            <NuxtLink to="/auth/login" class="text-primary hover:underline">
              {{ t('auth.register.signIn') }}
            </NuxtLink>
          </div>
        </ShadcnCardContent>
      </ShadcnCard>
    </main>
  </div>
</template>
